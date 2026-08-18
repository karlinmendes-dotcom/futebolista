"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateBr } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/lib/brasileirao-convex";

const CATEGORY_LABELS: Record<string, string> = {
  noticia: "Notícias",
  tendencia: "Tendências",
  polemica: "Polêmicas",
  resumo: "Resumos"
};

const CATEGORY_ORDER = ["noticia", "tendencia", "polemica", "resumo"];

export function NewsGrid({ articles }: { articles: NewsArticle[] }) {
  const [filter, setFilter] = useState<string>("all");

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: articles.length };
    for (const article of articles) {
      const key = article.category ?? "noticia";
      base[key] = (base[key] ?? 0) + 1;
    }
    return base;
  }, [articles]);

  const visible = useMemo(
    () =>
      filter === "all"
        ? articles
        : articles.filter((article) => (article.category ?? "noticia") === filter),
    [articles, filter]
  );

  const tabs = [
    { id: "all", label: "Todas" },
    ...CATEGORY_ORDER.filter(
      (id) => (counts[id] ?? 0) > 0
    ).map((id) => ({ id, label: CATEGORY_LABELS[id] ?? id }))
  ];

  return (
    <div>
      <div className="pill-rail -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            aria-pressed={filter === tab.id}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter === tab.id
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border/70 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {tab.label}
            <span className="text-xs tabular-nums opacity-70">
              {counts[tab.id] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((article) => (
          <article
            key={article._id}
            className="group flex flex-col rounded-2xl border border-border/70 bg-card/60 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
          >
            <div className="mb-3 flex items-start gap-3">
              {article.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.imageUrl}
                  alt=""
                  loading="lazy"
                  className="size-16 shrink-0 rounded-lg object-cover ring-1 ring-foreground/10 sm:size-20"
                />
              ) : (
                <span className="grid size-16 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary sm:size-20">
                  <Newspaper className="size-6" />
                </span>
              )}
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px] text-primary">
                    {CATEGORY_LABELS[article.category ?? "noticia"] ??
                      "Notícia"}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {article.source}
                  </span>
                </div>
                <h3 className="line-clamp-2 font-heading text-base font-semibold uppercase leading-tight tracking-wide sm:text-lg">
                  {article.title}
                </h3>
              </div>
            </div>
            <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
              {article.body}
            </p>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground">
                {article.publishedAt
                  ? formatDateBr(article.publishedAt)
                  : ""}
              </span>
              {article.sourceUrl && (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:underline underline-offset-2"
                >
                  Ler na fonte
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
