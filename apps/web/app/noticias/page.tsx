import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Newspaper,
  Trophy
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/page-heading";
import { fetchStandings } from "@/lib/brasileirao-convex";
import { SERIE_CODES, serieMeta } from "@/lib/brasileirao";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notícias",
  description:
    "Tudo o que está acontecendo no futebol brasileiro: líderes, rodadas e guias das Séries A, B, C e D."
};

const GUIDES = [
  {
    title: "O que é o Brasileirão?",
    text: "O Campeonato Brasileiro é disputado em quatro divisões anuais. A Série A é a elite, com 20 clubes em pontos corridos: todos jogam contra todos em turno e returno.",
    href: "/tabelas/a",
    cta: "Ver Série A"
  },
  {
    title: "Como funciona a Série D",
    text: "A porta de entrada do futebol nacional: 64 clubes divididos em grupos regionais na primeira fase, com os melhores avançando até a final.",
    href: "/tabelas/d",
    cta: "Ver Série D"
  },
  {
    title: "Legendas: Libertadores e Z4",
    text: "Na Série A, o topo da tabela garante vaga na Libertadores e na Sul-Americana; os quatro últimos caem para a Série B. As legendas coloridas mostram cada faixa.",
    href: "/tabelas/a",
    cta: "Entender as faixas"
  },
  {
    title: "Forma recente: como ler",
    text: "As letras V, E e D mostram os últimos cinco jogos: Vitória, Empate e Derrota. Uma sequência quente costuma dizer muito antes do próximo confronto.",
    href: "/tabelas",
    cta: "Ver tabelas"
  }
];

export default async function NoticiasPage() {
  const seriesData = await Promise.all(
    SERIE_CODES.map(async (code) => {
      const meta = serieMeta(code);
      try {
        const standings = await fetchStandings(code);
        const entry = standings.tables[0]?.entries[0];
        return {
          code,
          meta,
          leader: entry ?? null,
          roundLabel: standings.tables[0]?.round?.label ?? null
        };
      } catch {
        return { code, meta, leader: null, roundLabel: null };
      }
    })
  );

  const serieA = seriesData.find((item) => item.code === "a");
  const mainLeader = serieA?.leader;

  const highlights = seriesData.filter((item) => item.leader);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeading
        title="Notícias"
        icon={<Newspaper className="size-5" />}
        description="Tudo o que está acontecendo no futebol brasileiro — atualizado rodada a rodada."
      />

      {/* Destaque */}
      {mainLeader && serieA?.meta && (
        <section className="mt-10">
          <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/15 via-transparent to-accent/10">
            <div className="pitch-lines pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <Badge className="mb-3 border-primary/40 bg-primary/10 text-primary">
                  Destaque · {serieA.roundLabel ?? "Rodada atual"}
                </Badge>
                <h2 className="font-heading text-2xl font-semibold uppercase leading-tight tracking-wide sm:text-3xl">
                  {mainLeader.team.name} segue na ponta da{" "}
                  {serieA.meta.shortName}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  O líder soma {mainLeader.points} pontos em{" "}
                  {mainLeader.matches} jogos, com {mainLeader.wins} vitórias e
                  saldo de {mainLeader.goalDifference}. A disputa pela
                  liderança segue aberta rodada após rodada.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                {mainLeader.team.badge ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mainLeader.team.badge}
                    alt=""
                    className="size-16 object-contain sm:size-20"
                  />
                ) : (
                  <span className="grid size-16 place-items-center rounded-2xl bg-primary/15 text-primary sm:size-20">
                    <Trophy className="size-8" />
                  </span>
                )}
                <div>
                  <p className="font-heading text-4xl font-bold tabular-nums text-accent sm:text-5xl">
                    {mainLeader.points}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    pontos
                  </p>
                </div>
              </div>
            </div>
            <div className="relative border-t border-border/70 px-6 py-4 sm:px-8">
              <Link
                href="/tabelas/a"
                className={buttonVariants({ size: "sm", variant: "ghost" })}
              >
                Ver tabela completa da Série A <ArrowRight />
              </Link>
            </div>
          </Card>
        </section>
      )}

      {/* Últimas do Brasileirão */}
      <section className="mt-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="kickline mb-2 h-1 w-10 rounded-full" />
            <h2 className="font-heading text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
              Últimas do Brasileirão
            </h2>
            <p className="text-sm text-muted-foreground">
              O que está acontecendo em cada divisão, direto da fonte
            </p>
          </div>
          <Link href="/rodada" className={buttonVariants({ variant: "ghost" })}>
            <CalendarDays /> Rodada atual <ArrowRight />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.length > 0 ? (
            highlights.map(({ code, meta, leader, roundLabel }) => (
              <Card
                key={code}
                className="group transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-primary">
                      {meta?.shortName ?? `Série ${code.toUpperCase()}`}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {roundLabel ?? ""}
                    </span>
                  </div>
                  <CardTitle className="flex items-center gap-3 font-heading text-xl font-semibold uppercase leading-tight tracking-wide">
                    {leader?.team.badge ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={leader.team.badge}
                        alt=""
                        className="size-8 shrink-0 object-contain"
                      />
                    ) : null}
                    <span className="min-w-0 truncate">
                      {leader?.team.name ?? "Líder"}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {leader?.team.name} lidera com {leader?.points} pontos e{" "}
                    {leader?.wins} vitórias em {leader?.matches} jogos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/tabelas/${code}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:underline underline-offset-2"
                  >
                    Ver tabela completa
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Não foi possível carregar as notícias agora. Tente novamente em
                instantes.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Guia do torcedor */}
      <section className="mt-12">
        <div className="mb-6">
          <div className="kickline mb-2 h-1 w-10 rounded-full" />
          <h2 className="font-heading text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
            Guia do torcedor
          </h2>
          <p className="text-sm text-muted-foreground">
            Entenda como funciona o futebol brasileiro
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDES.map((guide) => (
            <Card
              key={guide.title}
              className="group flex flex-col transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              <CardHeader>
                <span className="mb-2 grid size-9 place-items-center rounded-lg bg-primary/15 text-primary transition-transform group-hover:scale-110">
                  <BookOpen className="size-4" />
                </span>
                <CardTitle className="font-heading text-lg font-semibold uppercase leading-tight tracking-wide">
                  {guide.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {guide.text}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Link
                  href={guide.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:underline underline-offset-2"
                >
                  {guide.cta}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
