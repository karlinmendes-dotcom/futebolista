import Link from "next/link";
import {
  CalendarDays,
  LayoutGrid,
  Newspaper,
  Trophy
} from "lucide-react";

const PILLS = [
  { href: "/tabelas/a", label: "Série A", icon: Trophy },
  { href: "/tabelas/b", label: "Série B", icon: Trophy },
  { href: "/tabelas/c", label: "Série C", icon: Trophy },
  { href: "/tabelas/d", label: "Série D", icon: Trophy },
  { href: "/rodada", label: "Rodada atual", icon: CalendarDays },
  { href: "/noticias", label: "Notícias", icon: Newspaper },
  { href: "/tabelas", label: "Todas as tabelas", icon: LayoutGrid }
];

export function CategoryPills() {
  return (
    <div className="pill-rail -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {PILLS.map((pill) => {
        const Icon = pill.icon;
        return (
          <Link
            key={pill.href}
            href={pill.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary sm:shrink"
          >
            <Icon className="size-4 text-primary" />
            {pill.label}
          </Link>
        );
      })}
    </div>
  );
}
