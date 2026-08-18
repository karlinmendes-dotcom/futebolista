import Link from "next/link";
import { Trophy, Shield, Star, Flame, Globe, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Competition {
  name: string;
  shortName: string;
  href: string;
  icon: typeof Trophy;
  accent: string;
}

const COMPETITIONS: Competition[] = [
  {
    name: "Brasileirão Série A",
    shortName: "Série A",
    href: "/tabelas/a",
    icon: Crown,
    accent: "border-accent/50 bg-accent/10 text-accent"
  },
  {
    name: "Brasileirão Série B",
    shortName: "Série B",
    href: "/tabelas/b",
    icon: Shield,
    accent: "border-sky-500/50 bg-sky-500/10 text-sky-400"
  },
  {
    name: "Brasileirão Série C",
    shortName: "Série C",
    href: "/tabelas/c",
    icon: Flame,
    accent: "border-amber-500/50 bg-amber-500/10 text-amber-400"
  },
  {
    name: "Brasileirão Série D",
    shortName: "Série D",
    href: "/tabelas/d",
    icon: Globe,
    accent: "border-primary/50 bg-primary/10 text-primary"
  },
  {
    name: "Copa Libertadores",
    shortName: "Libertadores",
    href: "/tabelas/a",
    icon: Star,
    accent: "border-purple-500/50 bg-purple-500/10 text-purple-400"
  },
  {
    name: "Rodada Atual",
    shortName: "Rodada",
    href: "/rodada",
    icon: Trophy,
    accent: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
  }
];

/**
 * Horizontal scrolling competition tabs — inspired by modern sports apps.
 * Each tab shows a competition with its own accent color and icon.
 */
export function CompetitionTabs({ active }: { active?: string }) {
  return (
    <div className="pill-rail -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {COMPETITIONS.map((comp) => {
        const Icon = comp.icon;
        const isActive = active === comp.href;
        return (
          <Link
            key={comp.href}
            href={comp.href}
            className={cn(
              "tab-glow inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium sm:shrink",
              isActive
                ? comp.accent
                : "border-border/70 bg-card/60 text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
            )}
          >
            <Icon className="size-4" />
            <span>{comp.shortName}</span>
          </Link>
        );
      })}
    </div>
  );
}
