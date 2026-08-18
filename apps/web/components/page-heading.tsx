import type { ReactNode } from "react";

interface PageHeadingProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function PageHeading({ title, description, icon }: PageHeadingProps) {
  return (
    <div>
      <div className="kickline mb-3 h-1 w-10 rounded-full" />
      <div className="flex items-center gap-3">
        {icon ? (
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            {icon}
          </span>
        ) : null}
        <h1 className="font-heading text-3xl font-semibold uppercase tracking-wide sm:text-4xl">
          {title}
        </h1>
      </div>
      {description ? (
        <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
