import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  Radio,
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
import { NewsTicker } from "@/components/news-ticker";
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

  const tickerItems = [
    ...(leader
      ? [
          `⚽ ${leader.team.name} lidera a Série A com ${leader.points} pontos`
        ]
      : []),
    `📅 ${table?.round?.label ?? "Rodada atual"} em andamento no Brasileirão`,
    "🇧🇷 Séries A, B, C e D em um só lugar",
    "🔥 Sem apostas — só futebol de verdade",
    "📊 Forma recente, legendas e aproveitamento",
    "🏆 Da elite ao futebol nacional de acesso",
    "🌎 Futebol mundial: em breve no Futebolista"
  ];

  const serieASection = (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="kickline mb-2 h-1 w-10 rounded-full" />
          <h2 className="font-heading text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
            Série A agora
          </h2>
          <p className="text-sm text-muted-foreground">
            Os cinco primeiros da classificação geral
          </p>
        </div>
        <Link href="/tabelas/a" className={buttonVariants({ variant: "ghost" })}>
          Tabela completa <ArrowRight />
        </Link>
      </div>
      {serieA ? (
        <Card className="transition-colors hover:border-primary/40">
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
  );

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="pitch-lines pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_-10%,color-mix(in_oklch,var(--primary)_26%,transparent),transparent_60%),radial-gradient(ellipse_50%_45%_at_0%_110%,color-mix(in_oklch,var(--accent)_14%,transparent),transparent_55%)]" />
        <div className="pointer-events-none absolute -top-24 right-[-10%] hidden size-[26rem] rounded-full bg-primary/10 blur-3xl lg:block" />

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24">
          <Badge
            variant="outline"
            className="animate-fade-up mb-5 gap-1.5 border-primary/40 text-primary"
          >
            <Sparkles className="size-3" />
            Brasileirão {serieA?.competition.season ?? ""} · Séries A–D
          </Badge>

          <h1 className="animate-fade-up-delay-1 max-w-3xl font-heading text-5xl font-bold uppercase leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            O futebol brasileiro em{" "}
            <span className="text-gradient">um só lugar</span>
          </h1>

          <p className="animate-fade-up-delay-2 mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Tabelas, rodadas e estatísticas das Séries A, B, C e D —
            atualizadas rodada a rodada, sem apostas e sem enrolação.
          </p>

          <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap items-center gap-3">
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

          {/* Leader spotlight */}
          {leader && (
            <div className="animate-fade-up-delay-3 mt-10 inline-flex w-full max-w-md flex-col gap-3 rounded-2xl border border-primary/25 bg-card/70 p-5 backdrop-blur-md sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                {leader.team.badge ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={leader.team.badge}
                    alt=""
                    className="size-12 shrink-0 object-contain"
                  />
                ) : (
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                    <Trophy className="size-6" />
                  </span>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Líder · {table?.round?.label ?? "Rodada atual"}
                  </p>
                  <p className="font-heading text-2xl font-semibold uppercase leading-none">
                    {leader.team.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:ml-auto">
                <div className="text-center">
                  <p className="font-heading text-2xl font-bold tabular-nums text-accent">
                    {leader.points}
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Pontos
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-2xl font-bold tabular-nums">
                    {leader.position}
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Posição
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ SÉRIE A AGORA ============ */}
      {serieASection}

      {/* ============ BANNER DE NOTÍCIAS (marquee) ============ */}
      <NewsTicker items={tickerItems} />

      {/* ============ TODAS AS SÉRIES ============ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6">
          <div className="kickline mb-2 h-1 w-10 rounded-full" />
          <h2 className="font-heading text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
            Todas as séries
          </h2>
          <p className="text-sm text-muted-foreground">
            Da elite ao futebol nacional de acesso
          </p>
        </div>
        <SeriesCards />
      </section>

      {/* ============ POR QUE FUTEBOLISTA ============ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6">
          <div className="kickline mb-2 h-1 w-10 rounded-full" />
          <h2 className="font-heading text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
            Feito para quem ama futebol
          </h2>
          <p className="text-sm text-muted-foreground">
            Informação de verdade, do jeito que torcedor merece
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="group transition-all hover:-translate-y-0.5 hover:border-primary/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary transition-transform group-hover:scale-110">
                  <ShieldCheck className="size-4" />
                </span>
                Sem apostas
              </CardTitle>
              <CardDescription>
                Informação e estatística primeiro. Nada de casas de aposta no
                nosso portal.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="group transition-all hover:-translate-y-0.5 hover:border-primary/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-lg bg-accent/15 text-accent transition-transform group-hover:scale-110">
                  <Trophy className="size-4" />
                </span>
                Do A ao D
              </CardTitle>
              <CardDescription>
                Tabelas, legendas e forma recente das quatro divisões do
                Brasileirão.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="group transition-all hover:-translate-y-0.5 hover:border-primary/40 sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary transition-transform group-hover:scale-110">
                  <Globe2 className="size-4" />
                </span>
                Futebol mundial em breve
              </CardTitle>
              <CardDescription>
                Em breve: ligas internacionais, jogos ao vivo e estatísticas
                avançadas.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/15 via-transparent to-accent/10">
          <div className="pitch-lines pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative flex flex-col items-start gap-6 p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-destructive/15 px-3 py-1 text-xs font-semibold text-red-400">
                <Radio className="size-3.5" />
                <span className="live-dot size-1.5 rounded-full bg-red-500" />
                Futebol ao vivo
              </div>
              <h2 className="font-heading text-3xl font-bold uppercase leading-tight sm:text-4xl">
                Bora pra rodada?
              </h2>
              <p className="mt-2 max-w-lg text-muted-foreground">
                Confira os jogos da rodada atual em todas as séries — quem joga,
                onde e o placar em tempo real.
              </p>
            </div>
            <Link href="/rodada" className={buttonVariants({ size: "lg" })}>
              Ver jogos da rodada <ArrowRight />
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
