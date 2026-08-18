import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Trophy } from "lucide-react";
import type { TableEntry, TeamMatch, TeamSnapshot } from "campeonato-brasileiro-api";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  fetchTeamSnapshot,
  formatDateBr,
  SERIE_CODES,
  serieMeta
} from "@/lib/brasileirao";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Time"
};

const FORM_STYLES: Record<string, string> = {
  W: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  D: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  L: "bg-red-500/15 text-red-600 dark:text-red-400"
};

export default async function TeamPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ serie?: string | string[] }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const rawSerie = sp.serie;
  const preferred =
    typeof rawSerie === "string" &&
    (SERIE_CODES as readonly string[]).includes(rawSerie)
      ? rawSerie
      : "a";

  const orderedSeries = [
    preferred,
    ...SERIE_CODES.filter((code) => code !== preferred)
  ];

  let found: { serie: string; snapshot: TeamSnapshot } | null = null;

  for (const code of orderedSeries) {
    try {
      const snapshot = await fetchTeamSnapshot(code, slug);
      if (snapshot.team?.name) {
        found = { serie: code, snapshot };
        break;
      }
    } catch {
      // Team not found (or series unavailable) — try the next series.
    }
  }

  if (!found) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <Link
          href="/tabelas"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Voltar para as tabelas
        </Link>
        <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
          <Trophy className="mx-auto size-10 text-muted-foreground" />
          <h1 className="mt-4 font-heading text-2xl font-bold">
            Time não encontrado
          </h1>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Não achamos nenhum clube chamado &quot;{slug}&quot; nas séries
            atuais do Brasileirão. Confira a grafia ou navegue pelas tabelas.
          </p>
          <Link
            href="/tabelas"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-2"
          >
            Ver tabelas <ArrowLeft className="size-4 rotate-180" />
          </Link>
        </div>
      </main>
    );
  }

  const { serie, snapshot } = found;
  const meta = serieMeta(serie);
  const standing = snapshot.standing;
  const matches = snapshot.matches;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href={`/tabelas/${serie}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar para {meta?.shortName ?? "tabelas"}
      </Link>

      {/* Team header */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {snapshot.team.badge ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={snapshot.team.badge}
            alt=""
            className="size-14 rounded-lg bg-card object-contain p-1 ring-1 ring-foreground/10"
          />
        ) : (
          <div className="grid size-14 place-items-center rounded-lg bg-card ring-1 ring-foreground/10">
            <Trophy className="size-6 text-muted-foreground" />
          </div>
        )}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-3xl font-bold">
              {snapshot.team.name}
            </h1>
            <Badge variant="secondary">
              {meta?.shortName ?? `Série ${serie.toUpperCase()}`}
            </Badge>
            {snapshot.team.shortName && (
              <Badge variant="outline">{snapshot.team.shortName}</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {snapshot.competition.name}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Classificação</CardTitle>
            <CardDescription>
              Posição e números na {meta?.shortName ?? "série"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {standing ? (
              <StandingStats standing={standing} />
            ) : (
              <p className="text-sm text-muted-foreground">
                O time não aparece na classificação atual desta série.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jogos na rodada</CardTitle>
            <CardDescription>
              Rodada {snapshot.currentRound.numbers.join(", ") || "atual"} ·{" "}
              {matches.length} jogo{matches.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {matches.length > 0 ? (
              matches.map((match) => (
                <TeamMatchRow key={match.id ?? `${match.opponent.name}-${match.side}`} match={match} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum jogo na rodada atual desta série.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function StandingStats({ standing }: { standing: TableEntry }) {
  const stats = [
    { label: "Posição", value: standing.position ?? "-" },
    { label: "Pontos", value: standing.points ?? "-" },
    { label: "Jogos", value: standing.matches ?? "-" },
    { label: "Vitórias", value: standing.wins ?? "-" },
    { label: "Empates", value: standing.draws ?? "-" },
    { label: "Derrotas", value: standing.losses ?? "-" },
    { label: "Gols pró", value: standing.goalsFor ?? "-" },
    { label: "Gols contra", value: standing.goalsAgainst ?? "-" },
    { label: "Saldo", value: standing.goalDifference ?? "-" },
    { label: "Aproveitamento", value: `${standing.efficiency ?? "-"}%` }
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-lg font-bold tabular-nums">{stat.value}</p>
          </div>
        ))}
      </div>

      {standing.legend?.name && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="size-2.5 rounded-full"
            style={{ background: standing.legend.color ?? "#d9d9d9" }}
          />
          {standing.legend.name}
        </p>
      )}

      {standing.recentForm.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-muted-foreground">Forma recente</p>
          <div className="flex gap-1">
            {standing.recentForm.map((result, index) => (
              <span
                key={`${result ?? "form"}-${index}`}
                className={cn(
                  "grid size-6 place-items-center rounded text-[11px] font-bold",
                  FORM_STYLES[result ?? ""] ?? "bg-muted text-muted-foreground"
                )}
              >
                {result ?? "-"}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TeamMatchRow({ match }: { match: TeamMatch }) {
  const outcomeLabel =
    match.outcome === "win"
      ? "Vitória"
      : match.outcome === "loss"
        ? "Derrota"
        : match.outcome === "draw"
          ? "Empate"
          : null;

  const outcomeClass =
    match.outcome === "win"
      ? "text-emerald-600 dark:text-emerald-400"
      : match.outcome === "loss"
        ? "text-red-600 dark:text-red-400"
        : match.outcome === "draw"
          ? "text-yellow-600 dark:text-yellow-400"
          : "";

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {formatDateBr(match.date)}
          {match.time ? ` · ${match.time}` : ""}
        </span>
        <span>
          {match.status === "live"
            ? "AO VIVO"
            : match.status === "finished"
              ? "Encerrado"
              : "Agendado"}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <span className="w-8 shrink-0 text-xs font-medium text-muted-foreground">
          {match.side === "home" ? "Casa" : "Fora"}
        </span>
        {match.opponent.badge ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={match.opponent.badge}
            alt=""
            className="size-5 shrink-0 object-contain"
          />
        ) : null}
        <span className="flex-1 truncate font-medium">
          {match.opponent.name ?? "—"}
        </span>
        <span className={cn("font-semibold tabular-nums", outcomeClass)}>
          {match.status === "scheduled"
            ? "–"
            : `${match.score.team ?? 0}–${match.score.opponent ?? 0}`}
        </span>
        {outcomeLabel && (
          <span
            className={cn(
              "hidden rounded-full px-2 py-0.5 text-xs font-semibold sm:inline-flex",
              match.outcome === "win"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : match.outcome === "loss"
                  ? "bg-red-500/15 text-red-600 dark:text-red-400"
                  : "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
            )}
          >
            {outcomeLabel}
          </span>
        )}
      </div>
      {match.venue && (
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" /> {match.venue}
        </p>
      )}
    </div>
  );
}
