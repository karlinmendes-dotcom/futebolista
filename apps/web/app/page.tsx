import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  ShieldCheck,
  Sparkles,
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
import { StandingsTable } from "@/components/standings-table";
import { SeriesCards } from "@/components/series-cards";
import { fetchStandings } from "@/lib/brasileirao-convex";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let serieA: Awaited<ReturnType<typeof fetchStandings>> | null = null;

  try {
    serieA = await fetchStandings("a");
  } catch {
    serieA = null;
  }

  const table = serieA?.tables[0];
  const topEntries = table?.entries.slice(0, 5) ?? [];
  const leader = table?.entries[0];

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklch,var(--primary)_28%,transparent),transparent_55%),radial-gradient(ellipse_at_bottom_left,color-mix(in_oklch,var(--accent)_16%,transparent),transparent_50%)]" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <Badge variant="outline" className="mb-5 border-primary/40 text-primary">
            <Sparkles className="size-3" />
            Brasileirão {serieA?.competition.season ?? ""} · Séries A–D
          </Badge>
          <h1 className="max-w-2xl font-heading text-4xl font-bold tracking-tight text-balance sm:text-6xl">
            O futebol brasileiro em um só lugar
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Tabelas, rodadas e estatísticas das Séries A, B, C e D —
            atualizadas rodada a rodada, sem apostas e sem enrolação.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/tabelas" className={buttonVariants({ size: "lg" })}>
              Ver tabelas <ArrowRight />
            </Link>
            <Link
              href="/rodada"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <CalendarDays /> Rodada atual
            </Link>
          </div>
          {leader && (
            <p className="mt-8 text-sm text-muted-foreground">
              Líder da {table?.round?.label ?? "rodada"}:{" "}
              <span className="font-semibold text-foreground">
                {leader.team.name}
              </span>{" "}
              com {leader.points} pontos
            </p>
          )}
        </div>
      </section>

      {/* Série A preview */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold">Série A agora</h2>
            <p className="text-sm text-muted-foreground">
              Os cinco primeiros da classificação geral
            </p>
          </div>
          <Link href="/tabelas/a" className={buttonVariants({ variant: "ghost" })}>
            Tabela completa <ArrowRight />
          </Link>
        </div>
        {serieA ? (
          <Card>
            <CardContent className="pt-2">
              <StandingsTable
                entries={topEntries}
                legends={serieA.legends}
                compact
                serie="a"
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Não foi possível carregar a classificação agora. Tente novamente em
              instantes.
            </CardContent>
          </Card>
        )}
      </section>

      {/* Séries */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-bold">Todas as séries</h2>
          <p className="text-sm text-muted-foreground">
            Da elite ao futebol nacional de acesso
          </p>
        </div>
        <SeriesCards />
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" /> Sem apostas
              </CardTitle>
              <CardDescription>
                Informação e estatística primeiro. Nada de casas de aposta no
                nosso portal.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="size-4 text-primary" /> Do A ao D
              </CardTitle>
              <CardDescription>
                Tabelas, legendas e forma recente das quatro divisões do
                Brasileirão.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="size-4 text-primary" /> Futebol mundial em
                breve
              </CardTitle>
              <CardDescription>
                Em breve: ligas internacionais, jogos ao vivo e estatísticas
                avançadas.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/15 via-transparent to-accent/10">
          <CardHeader>
            <CardTitle className="text-xl">Bora pra rodada?</CardTitle>
            <CardDescription>
              Confira os jogos da rodada atual em todas as séries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/rodada" className={buttonVariants()}>
              Ver jogos da rodada <ArrowRight />
            </Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
