"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Football news automation.
 *
 * Each run picks one fresh headline from a worldwide football RSS source
 * and rewrites it into a ~200-word PT-BR piece using the Groq AI API,
 * then stores it in the `news` table with a category, source credit and
 * a small thumbnail when the feed provides one. The cron in
 * convex/crons.ts schedules runs at fixed times with a category each.
 */

const SOURCES = [
  { name: "Globo Esporte", url: "https://globoesporte.globo.com/rss/futebol/" },
  { name: "BBC Sport", url: "http://feeds.bbci.co.uk/sport/football/rss.xml" },
  { name: "The Guardian", url: "https://www.theguardian.com/football/rss" },
  { name: "ESPN Soccer", url: "https://www.espn.com/espn/rss/soccer/news" }
];

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-120b";

const CATEGORIES: Record<
  string,
  { label: string; prompt: string }
> = {
  noticia: {
    label: "Notícia",
    prompt:
      "Escreva uma notícia de futebol em português do Brasil com cerca de 200 palavras, factual, clara e sem sensacionalismo."
  },
  tendencia: {
    label: "Tendência",
    prompt:
      "Escreva um texto sobre tendências do futebol em português do Brasil com cerca de 180 palavras, conectando a manchete a assuntos atuais do mercado da bola: jovens talentos, táticas, números e movimentações de clubes. Seja factual e específico apenas sobre o que o resumo traz."
  },
  polemica: {
    label: "Polêmica",
    prompt:
      "Escreva um texto em português do Brasil com cerca de 180 palavras analisando a polêmica ou a controvérsia ligada à manchete (arbitragem, VAR, dirigentes, calendário, negociações, torcida). Apresente os dois lados de forma equilibrada e factual, sem inventar detalhes."
  },
  resumo: {
    label: "Resumo",
    prompt:
      "Escreva um resumo do que aconteceu em português do Brasil com cerca de 150 palavras, em tom de balanço: os pontos principais da manchete, o que isso significa para o campeonato/clube e o que observar em seguida."
  }
};

const BASE_SYSTEM =
  "Você é um jornalista esportivo brasileiro experiente. " +
  "Nunca mencione apostas, odds ou casas de apostas. " +
  "Escreva APENAS com base na manchete e no resumo fornecidos: não invente nomes de jogadores, placares, datas, estádios ou outros fatos que não estejam no resumo; se faltarem detalhes, escreva de forma geral e objetiva. " +
  "Estruture em 2 a 3 parágrafos curtos. " +
  "Termine com a frase: 'A notícia completa está disponível na fonte original.'";

interface RssItem {
  title: string;
  description: string;
  link: string | null;
  imageUrl: string | null;
  pubDate: string | null;
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRss(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const read = (tag: string) =>
      block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? "";

    const imageUrl =
      block.match(/<media:content[^>]*url="([^"]+)"/)?.[1] ??
      block.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] ??
      block.match(/<enclosure[^>]*url="([^"]+)"/)?.[1] ??
      block.match(/<img[^>]+src="([^"]+)"/)?.[1] ??
      null;

    items.push({
      title: stripHtml(read("title")),
      description: stripHtml(read("description")).slice(0, 400),
      link: read("link").trim() || null,
      imageUrl,
      pubDate: read("pubDate").trim() || null
    });
  }
  return items;
}

export const generateNews = internalAction({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, { category }) => {
    const categoryKey = category && CATEGORIES[category] ? category : "noticia";
    const config = CATEGORIES[categoryKey];

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn(
        "[news] GROQ_API_KEY não configurada no deployment — pulando geração."
      );
      return;
    }

    let existing = new Set<string>();
    try {
      const previous = await ctx.runQuery(internal.news_queries.recentTitles, {
        limit: 60
      });
      existing = new Set(previous ?? []);
    } catch (error) {
      console.error("[news] falha ao listar notícias existentes:", error);
    }

    for (const source of SOURCES) {
      try {
        const response = await fetch(source.url, {
          headers: { "user-agent": "Futebolista/1.0 (+https://futebolista.vercel.app)" },
          signal: AbortSignal.timeout(15000)
        });
        if (!response.ok) continue;
        const xml = await response.text();
        const items = parseRss(xml).filter((item) => item.title.length > 8);

        for (const item of items.slice(0, 6)) {
          if (existing.has(item.title.toLowerCase())) continue;

          const article = await generateArticle(apiKey, {
            categoryPrompt: config.prompt,
            title: item.title,
            description: item.description,
            link: item.link
          });
          if (!article) continue;

          await ctx.runMutation(internal.news_mutations.insertNews, {
            title: item.title.slice(0, 160),
            body: article,
            category: categoryKey,
            source: source.name,
            sourceUrl: item.link ?? undefined,
            imageUrl: item.imageUrl ?? undefined,
            publishedAt: item.pubDate ?? undefined
          });
          console.log(
            `[news] publicado (${config.label}): ${item.title} (fonte: ${source.name})`
          );
          return;
        }
      } catch (error) {
        console.error(
          `[news] fonte ${source.name} falhou:`,
          error instanceof Error ? error.message : error
        );
      }
    }

    console.warn("[news] nenhuma notícia nova encontrada neste ciclo.");
  }
});

async function generateArticle(
  apiKey: string,
  item: {
    categoryPrompt: string;
    title: string;
    description: string;
    link: string | null;
  }
): Promise<string | null> {
  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.7,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `${BASE_SYSTEM} ${item.categoryPrompt}`
          },
          {
            role: "user",
            content: [
              `Manchete: ${item.title}`,
              `Resumo: ${item.description || "sem resumo disponível"}`,
              `Link da fonte: ${item.link ?? "sem link"}`,
              "",
              "Escreva o texto agora."
            ].join("\n")
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(
        `[news] Groq respondeu ${response.status}: ${error.slice(0, 200)}`
      );
      return null;
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content ?? null;
    if (!raw) return null;
    // Strip any reasoning/thinking block some models emit.
    const cleaned = raw
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/<\/?think>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned || null;
  } catch (error) {
    console.error(
      "[news] erro ao chamar a Groq:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
