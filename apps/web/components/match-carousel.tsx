"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { Rounds } from "campeonato-brasileiro-api";
import { formatDateBr } from "@/lib/format";
import { teamSlug } from "@/lib/team";
import { cn } from "@/lib/utils";

interface MatchCarouselProps {
  rounds: Rounds;
  serie: string;
}

/**
 * Horizontal scrolling carousel of match spotlight cards — inspired by
 * modern sports apps. Shows featured matches with large badges and scores.
 */
export function MatchCarousel({ rounds, serie }: MatchCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const allMatches = rounds.rounds.flatMap((r) => r.matches);
  // Show first 8 matches as featured
  const featured = allMatches.slice(0, 8);

  if (featured.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative">
      {/* Scroll buttons */}
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute -left-3 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-border/70 bg-background/90 backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-primary/10 sm:-left-5"
        aria-label="Anterior"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute -right-3 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-border/70 bg-background/90 backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-primary/10 sm:-right-5"
        aria-label="Próximo"
      >
        <ChevronRight className="size-4" />
      </button>

      {/* Gradient fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-6 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-6 bg-gradient-to-l from-background to-transparent" />

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="pill-rail flex gap-3 overflow-x-auto pb-2"
      >
        {featured.map((match) => (
          <MatchSpotlightCard
            key={match.id ?? `${match.homeTeam.name}-${match.awayTeam.name}`}
            match={match}
            serie={serie}
          />
        ))}
      </div>
    </div>
  );
}

function MatchSpotlightCard({
  match,
  serie
}: {
  match: Rounds["rounds"][number]["matches"][number];
  serie: string;
}) {
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";

  return (
    <article className="group match-card-glow w-[240px] shrink-0 rounded-2xl border border-border/70 bg-card/70 p-4 sm:w-[260px]">
      {/* Status header */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          {formatDateBr(match.date)}
          {match.time ? ` · ${match.time}` : ""}
        </span>
        {isLive && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-400">
            <span className="live-dot size-1.5 rounded-full bg-red-500" />
            AO VIVO
          </span>
        )}
        {isFinished && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
            ENCERRADO
          </span>
        )}
        {!isLive && !isFinished && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            AGENDADO
          </span>
        )}
      </div>

      {/* Teams + Score */}
      <div className="space-y-2.5">
        {/* Home */}
        <div className="flex items-center gap-3">
          {match.homeTeam.badge ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={match.homeTeam.badge}
              alt=""
              className="size-8 shrink-0 object-contain"
            />
          ) : (
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
              ?
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
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
          {match.status !== "scheduled" && (
            <span
              className={cn(
                "font-heading text-lg font-bold tabular-nums",
                isLive && "text-red-400",
                isFinished && "text-emerald-500"
              )}
            >
              {match.score.home ?? 0}
            </span>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center gap-3">
          {match.awayTeam.badge ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={match.awayTeam.badge}
              alt=""
              className="size-8 shrink-0 object-contain"
            />
          ) : (
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
              ?
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
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
          {match.status !== "scheduled" && (
            <span
              className={cn(
                "font-heading text-lg font-bold tabular-nums",
                isLive && "text-red-400",
                isFinished && "text-emerald-500"
              )}
            >
              {match.score.away ?? 0}
            </span>
          )}
        </div>
      </div>

      {/* Venue */}
      {match.venue && (
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <MapPin className="size-3" />
          <span className="truncate">{match.venue}</span>
        </p>
      )}
    </article>
  );
}
