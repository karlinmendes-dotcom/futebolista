"use client";

import { useMemo, useState } from "react";
import type { Rounds } from "campeonato-brasileiro-api";
import { MatchList } from "@/components/match-list";
import { cn } from "@/lib/utils";

type SerieSection = {
  code: string;
  shortName: string;
  label: string;
  rounds: Rounds | null;
};

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "live", label: "Ao Vivo" },
  { id: "scheduled", label: "Agendados" },
  { id: "finished", label: "Encerrados" }
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export function RodadaView({ sections }: { sections: SerieSection[] }) {
  const [filter, setFilter] = useState<FilterId>("all");

  const counts = useMemo(() => {
    const base: Record<FilterId, number> = {
      all: 0,
      live: 0,
      scheduled: 0,
      finished: 0
    };
    for (const section of sections) {
      if (!section.rounds) continue;
      for (const round of section.rounds.rounds) {
        for (const match of round.matches) {
          base[match.status] += 1;
        }
      }
    }
    base.all = base.live + base.scheduled + base.finished;
    return base;
  }, [sections]);

  const visibleSections = useMemo(() => {
    if (filter === "all") return sections;
    return sections.map((section) => {
      if (!section.rounds) return section;
      return {
        ...section,
        rounds: {
          ...section.rounds,
          rounds: section.rounds.rounds.map((round) => ({
            ...round,
            matches: round.matches.filter((match) => match.status === filter)
          }))
        }
      };
    });
  }, [sections, filter]);

  return (
    <div>
      <div className="pill-rail -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter === item.id
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border/70 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {item.label}
            <span className="text-xs tabular-nums opacity-70">{counts[item.id]}</span>
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {visibleSections.map(({ code, shortName, label, rounds }) => (
          <section key={code}>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-heading text-xl font-semibold uppercase tracking-wide">
                {shortName}
              </h2>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            {rounds ? (
              <MatchList rounds={rounds} serie={code} />
            ) : (
              <p className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                Não foi possível carregar os jogos agora.
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
