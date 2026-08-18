import Link from "next/link";
import {
  ArrowRight,
  Crown,
  Flame,
  MapPinned,
  Medal
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { SERIES, type SerieCode } from "@/lib/brasileirao";
import { cn } from "@/lib/utils";

const SERIE_ICONS: Record<SerieCode, typeof Crown> = {
  a: Crown, // a elite
  b: Medal, // a briga pelo acesso
  c: Flame, // a revelação
  d: MapPinned // o futebol regional
};

const SERIE_ACCENTS: Record<SerieCode, { chip: string; ring: string; glow: string }> = {
  a: {
    chip: "bg-accent/15 text-accent",
    ring: "hover:border-accent/50",
    glow: "from-accent/20 via-transparent to-transparent"
  },
  b: {
    chip: "bg-sky-500/15 text-sky-400",
    ring: "hover:border-sky-500/50",
    glow: "from-sky-500/20 via-transparent to-transparent"
  },
  c: {
    chip: "bg-amber-500/15 text-amber-400",
    ring: "hover:border-amber-500/50",
    glow: "from-amber-500/20 via-transparent to-transparent"
  },
  d: {
    chip: "bg-primary/15 text-primary",
    ring: "hover:border-primary/50",
    glow: "from-primary/20 via-transparent to-transparent"
  }
};

export function SeriesCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(Object.keys(SERIES) as SerieCode[]).map((code) => {
        const serie = SERIES[code];
        const accent = SERIE_ACCENTS[code];
        return (
          <Link key={code} href={`/tabelas/${code}`} className="group">
            <Card
              className={cn(
                "relative h-full overflow-hidden transition-all hover:-translate-y-0.5",
                accent.ring
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                  accent.glow
                )}
              />
              <CardHeader className="relative">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "grid size-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3",
                      accent.chip
                    )}
                  >
                    {(() => {
                      const Icon = SERIE_ICONS[code];
                      return <Icon className="size-5" />;
                    })()}
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <CardTitle className="mt-3 font-heading text-2xl font-semibold uppercase tracking-wide">
                  {serie.shortName}
                </CardTitle>
                <CardDescription>{serie.description}</CardDescription>
              </CardHeader>
              <CardContent className="relative text-xs text-muted-foreground">
                {serie.grouped
                  ? "Competição agrupada por regiões"
                  : "Pontos corridos"}{" "}
                · Série {serie.code.toUpperCase()}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
