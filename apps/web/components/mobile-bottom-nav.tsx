"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, House, Newspaper, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Início", icon: House },
  { href: "/tabelas", label: "Tabelas", icon: Table2 },
  { href: "/rodada", label: "Rodada", icon: CalendarDays },
  { href: "/noticias", label: "Notícias", icon: Newspaper }
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Navegação principal"
      className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/90 backdrop-blur-xl md:hidden"
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
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full transition-colors",
                  active && "bg-primary/15"
                )}
              >
                <Icon className="size-5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
