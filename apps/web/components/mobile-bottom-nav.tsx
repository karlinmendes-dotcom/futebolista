"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Flame, House, Newspaper, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Início", icon: House },
  { href: "/tabelas", label: "Tabelas", icon: Table2 },
  { href: "/rodada", label: "Rodada", icon: CalendarDays, badge: true },
  { href: "/noticias", label: "Notícias", icon: Newspaper }
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Navegação principal"
      className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-all",
                active
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-primary" />
              )}
              <span
                className={cn(
                  "relative grid size-9 place-items-center rounded-xl transition-all",
                  active
                    ? "bg-primary/15 text-primary shadow-sm shadow-primary/20"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" />
                {/* Live badge for Rodada */}
                {item.badge && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-3">
                    <span className="live-dot absolute inline-flex size-full rounded-full bg-red-500" />
                    <span className="relative inline-flex size-3 rounded-full bg-red-500" />
                  </span>
                )}
              </span>
              <span className={cn(active && "font-semibold")}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
