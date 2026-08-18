import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { Rounds } from "campeonato-brasileiro-api";
import { formatDateBr } from "@/lib/format";
import { teamSlug } from "@/lib/team";
import { cn } from "@/lib/utils";

interface MatchListProps {
  rounds: Rounds;
  serie: string;
}

export function MatchList({ rounds, serie }: MatchListProps) {
  return (
    <div className="space-y-4">
      {rounds.rounds.map((round) => (
        <section
          key={String(round.id ?? round.number ?? "round")}
          className="space-y-3"
        >
          {round.groupName && (
            <h3 className="text-sm font-medium text-muted-foreground">
              {round.groupName} · {round.label}
            </h3>
          )}
          <div className="grid gap-3">
            {round.matches.map((match) => (
              <MatchCard
                key={match.id ?? `${match.homeTeam.name}-${match.awayTeam.name}`}
                match={match}
                serie={serie}
              />
            ))}
            {round.matches.length === 0 && (
              <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
                Nenhum jogo disponível para esta rodada.
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

function MatchCard({
  match,
  serie
}: {
  match: Rounds["rounds"][number]["matches"][number];
  serie: string;
}) {
  return (
    <article className="group rounded-2xl border border-border/70 bg-card/60 p-4 transition-all hover:border-primary/40 hover:bg-card">
      {/* Header: date/time + status */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5 text-primary" />
          {formatDateBr(match.date)}
          {match.time ? ` · ${match.time}` : ""}
        </span>
        <StatusPill status={match.status} />
      </div>

      {/* Teams */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right">
          <span className="truncate text-sm font-semibold sm:text-base">
            {match.homeTeam.name ? (
              <Link
                href={`/time/${teamSlug(match.homeTeam.name)}?serie=${serie}`}
                className="transition-colors hover:text-primary hover:underline underline-offset-2"
              >
                {match.homeTeam.name}
              </Link>
            ) : (
              "—"
            )}
          </span>
          {match.homeTeam.badge ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={match.homeTeam.badge}
              alt=""
              className="size-6 shrink-0 object-contain sm:size-7"
            />
          ) : null}
        </div>

        <span
          className={cn(
            "w-16 shrink-0 rounded-lg bg-muted/60 px-1 py-1 text-center text-sm font-bold tabular-nums sm:text-base",
            match.status === "finished" && "text-emerald-500",
            match.status === "live" && "text-red-400"
          )}
        >
          {match.status === "scheduled" ? "–" : `${match.score.home ?? 0}–${match.score.away ?? 0}`}
        </span>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          {match.awayTeam.badge ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={match.awayTeam.badge}
              alt=""
              className="size-6 shrink-0 object-contain sm:size-7"
            />
          ) : null}
          <span className="truncate text-sm font-semibold sm:text-base">
            {match.awayTeam.name ? (
              <Link
                href={`/time/${teamSlug(match.awayTeam.name)}?serie=${serie}`}
                className="transition-colors hover:text-primary hover:underline underline-offset-2"
              >
                {match.awayTeam.name}
              </Link>
            ) : (
              "—"
            )}
          </span>
        </div>
      </div>

      {/* Venue */}
      {match.venue ? (
        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5" /> {match.venue}
        </p>
      ) : null}
    </article>
  );
}

function StatusPill({ status }: { status: "scheduled" | "live" | "finished" }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-400">
        <span className="live-dot size-1.5 rounded-full bg-red-500" />
        AO VIVO
      </span>
    );
  }

  if (status === "finished") {
    return (
      <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
        Encerrado
      </span>
    );
  }

  return (
    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
      Agendado
    </span>
  );
}
