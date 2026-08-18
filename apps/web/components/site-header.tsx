"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Início" },
  { href: "/tabelas", label: "Tabelas" },
  { href: "/rodada", label: "Rodada" },
  { href: "/noticias", label: "Notícias" }
];

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-base font-bold tracking-tight"
        >
          <span className="animate-logo-glow relative grid size-9 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <Trophy className="size-4" />
          </span>
          <span className="font-heading text-lg font-semibold uppercase tracking-wide">
            <span className="shimmer-text">Futebolista</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                isActive(item.href)
                  ? "bg-primary/12 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
