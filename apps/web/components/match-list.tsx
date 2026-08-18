import Link from "next/link";
import type { Rounds } from "campeonato-brasileiro-api";
import { formatDateBr } from "@/lib/brasileirao";
import { teamSlug } from "@/lib/team";

interface MatchListProps {
  rounds: Rounds;
  serie: string;
}

export function MatchList({ rounds, serie }: MatchListProps) {
  return (
    <div className="space-y-6">
      {rounds.rounds.map((round) => (
        <section
          key={String(round.id ?? round.number ?? "round")}
          className="space-y-2"
        >
          {round.groupName && (
            <h3 className="text-sm font-medium text-muted-foreground">
              {round.groupName} · {round.label}
            </h3>
          )}
          <div className="divide-y divide-border overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            {round.matches.map((match) => (
              <div
                key={match.id ?? `${match.homeTeam.name}-${match.awayTeam.name}`}
                className="px-4 py-3"
              >
                {/* Mobile: date + status row */}
                <div className="mb-2 flex items-center justify-between sm:hidden">
                  <span className="text-xs text-muted-foreground">
                    {formatDateBr(match.date)}
                    {match.time ? ` · ${match.time}` : ""}
                  </span>
                  <StatusPill status={match.status} />
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Desktop: date column */}
                  <div className="hidden w-14 shrink-0 text-xs text-muted-foreground sm:block">
                    <p>{formatDateBr(match.date)}</p>
                    <p>{match.time ?? ""}</p>
                  </div>

                  <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right">
                    <span className="truncate text-sm font-medium">
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
                        className="size-5 shrink-0 object-contain"
                      />
                    ) : null}
                  </div>

                  <span className="w-16 shrink-0 text-center text-sm font-semibold tabular-nums">
                    {match.status === "scheduled"
                      ? "–"
                      : `${match.score.home ?? 0}–${match.score.away ?? 0}`}
                  </span>

                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    {match.awayTeam.badge ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={match.awayTeam.badge}
                        alt=""
                        className="size-5 shrink-0 object-contain"
                      />
                    ) : null}
                    <span className="truncate text-sm font-medium">
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

                  {/* Desktop: status pill */}
                  <div className="hidden shrink-0 sm:block">
                    <StatusPill status={match.status} />
                  </div>
                </div>
              </div>
            ))}
            {round.matches.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                Nenhum jogo disponível para esta rodada.
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: "scheduled" | "live" | "finished" }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">
        <span className="live-dot size-1.5 rounded-full bg-red-500" />
        AO VIVO
      </span>
    );
  }

  if (status === "finished") {
    return (
      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
        Encerrado
      </span>
    );
  }

  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      Agendado
    </span>
  );
}
