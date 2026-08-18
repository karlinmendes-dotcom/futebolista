"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Rounds } from "campeonato-brasileiro-api";
import { formatDateBr } from "@/lib/format";
import { teamSlug } from "@/lib/team";
import { cn } from "@/lib/utils";

interface LiveMatchesSectionProps {
  rounds: Rounds;
  serie: string;
}

/**
 * Prominent "Ao Vivo" section showing live and upcoming matches
 * in a visual card grid — inspired by modern sports apps.
 */
export function LiveMatchesSection({ rounds, serie }: LiveMatchesSectionProps) {
  const allMatches = rounds.rounds.flatMap((r) => r.matches);
  const live = allMatches.filter((m) => m.status === "live");
  const upcoming = allMatches.filter((m) => m.status === "scheduled").slice(0, 4);
  const recent = allMatches.filter((m) => m.status === "finished").slice(0, 4);

  const hasContent = live.length > 0 || upcoming.length > 0 || recent.length > 0;
  if (!hasContent) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="kickline mb-2 h-1 w-10 rounded-full" />
          <h2 className="font-heading text-2xl font-semibold uppercase tracking-wide sm:text-3xl">
            {live.length > 0 ? "Jogos ao vivo" : "Destaques da rodada"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {live.length > 0
              ? `${live.length} jogo${live.length > 1 ? "s" : ""} acontecendo agora`
              : "Próximos e últimos jogos da rodada atual"}
          </p>
        </div>
        <Link href="/rodada" className={buttonVariants({ variant: "ghost" })}>
          Ver todos <ArrowRight />
        </Link>
      </div>

      {/* Live matches (if any) */}
      {live.length > 0 && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {live.map((match) => (
            <LiveCard
              key={match.id ?? `${match.homeTeam.name}-${match.awayTeam.name}`}
              match={match}
              serie={serie}
            />
          ))}
        </div>
      )}

      {/* Upcoming + Recent in a grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[...upcoming, ...recent].slice(0, 4).map((match) => (
          <CompactCard
            key={match.id ?? `${match.homeTeam.name}-${match.awayTeam.name}`}
            match={match}
            serie={serie}
          />
        ))}
      </div>
    </section>
  );
}

function LiveCard({
  match,
  serie
}: {
  match: Rounds["rounds"][number]["matches"][number];
  serie: string;
}) {
  return (
    <Card className="relative overflow-hidden border-red-500/30 bg-gradient-to-br from-red-500/10 via-card to-card">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.08),transparent_60%)]" />
      <CardContent className="relative p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-bold text-red-400">
            <Zap className="size-3" />
            <span className="live-dot size-1.5 rounded-full bg-red-500" />
            AO VIVO
          </span>
          <span className="text-[11px] text-muted-foreground">
            {formatDateBr(match.date)}
            {match.time ? ` · ${match.time}` : ""}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {match.homeTeam.badge ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.homeTeam.badge} alt="" className="size-9 shrink-0 object-contain" />
            ) : null}
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">
              {match.homeTeam.name ?? "—"}
            </span>
            <span className="font-heading text-xl font-bold tabular-nums text-red-400">
              {match.score.home ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {match.awayTeam.badge ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={match.awayTeam.badge} alt="" className="size-9 shrink-0 object-contain" />
            ) : null}
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">
              {match.awayTeam.name ?? "—"}
            </span>
            <span className="font-heading text-xl font-bold tabular-nums text-red-400">
              {match.score.away ?? 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompactCard({
  match,
  serie
}: {
  match: Rounds["rounds"][number]["matches"][number];
  serie: string;
}) {
  const isFinished = match.status === "finished";

  return (
    <article className="group rounded-xl border border-border/70 bg-card/60 p-3.5 transition-all hover:border-primary/40 hover:bg-card">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          {formatDateBr(match.date)}
          {match.time ? ` · ${match.time}` : ""}
        </span>
        <StatusDot status={match.status} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {match.homeTeam.badge ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.homeTeam.badge} alt="" className="size-5 shrink-0 object-contain" />
          ) : null}
          <span className="min-w-0 flex-1 truncate text-xs font-medium">
            {match.homeTeam.name ? (
              <Link
                href={`/time/${teamSlug(match.homeTeam.name)}?serie=${serie}`}
                className="hover:text-primary hover:underline underline-offset-2"
              >
                {match.homeTeam.name}
              </Link>
            ) : "—"}
          </span>
          {match.status !== "scheduled" && (
            <span className={cn("text-xs font-bold tabular-nums", isFinished ? "text-emerald-500" : "text-foreground")}>
              {match.score.home ?? 0}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {match.awayTeam.badge ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={match.awayTeam.badge} alt="" className="size-5 shrink-0 object-contain" />
          ) : null}
          <span className="min-w-0 flex-1 truncate text-xs font-medium">
            {match.awayTeam.name ? (
              <Link
                href={`/time/${teamSlug(match.awayTeam.name)}?serie=${serie}`}
                className="hover:text-primary hover:underline underline-offset-2"
              >
                {match.awayTeam.name}
              </Link>
            ) : "—"}
          </span>
          {match.status !== "scheduled" && (
            <span className={cn("text-xs font-bold tabular-nums", isFinished ? "text-emerald-500" : "text-foreground")}>
              {match.score.away ?? 0}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function StatusDot({ status }: { status: "scheduled" | "live" | "finished" }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400">
        <span className="live-dot size-1.5 rounded-full bg-red-500" />
        AO VIVO
      </span>
    );
  }
  if (status === "finished") {
    return (
      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
        FIM
      </span>
    );
  }
  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
      {status === "scheduled" ? "HOJE" : ""}
    </span>
  );
}
