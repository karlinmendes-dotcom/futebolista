import { Newspaper } from "lucide-react";

interface NewsTickerProps {
  items: string[];
}

/**
 * Thin horizontal news ticker. Content is duplicated so the CSS marquee
 * loop is seamless; pauses on hover and respects reduced-motion.
 */
export function NewsTicker({ items }: NewsTickerProps) {
  const content = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-border/70 bg-card/50">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />

      <div className="animate-marquee flex w-max items-center gap-10 py-2.5 pl-4">
        {content.map((item, index) => (
          <span
            key={index}
            aria-hidden={index >= items.length}
            className="flex items-center gap-2 whitespace-nowrap text-xs font-medium text-muted-foreground sm:text-sm"
          >
            <Newspaper className="size-3.5 shrink-0 text-primary" />
            <span className="text-foreground/90">{item}</span>
            <span className="ml-6 text-accent">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
