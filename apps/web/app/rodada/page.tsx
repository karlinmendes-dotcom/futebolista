import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import type { Rounds } from "campeonato-brasileiro-api";
import { MatchList } from "@/components/match-list";
import { fetchRounds } from "@/lib/brasileirao-convex";
import { SERIE_CODES, serieMeta } from "@/lib/brasileirao";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rodada atual"
};

export default async function RodadaPage() {
  const sections = await Promise.all(
    SERIE_CODES.map(async (code) => {
      const meta = serieMeta(code);
      try {
        const rounds = await fetchRounds(code);
        return { code, meta, rounds, error: null as string | null };
      } catch (error) {
        return {
          code,
          meta,
          rounds: null as Rounds | null,
          error: error instanceof Error ? error.message : "Erro"
        };
      }
    })
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <CalendarDays className="size-6 text-primary" />
        <h1 className="font-heading text-3xl font-bold">Rodada atual</h1>
      </div>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Os jogos da rodada em andamento nas quatro séries do Brasileirão.
      </p>

      <div className="mt-10 space-y-12">
        {sections.map(({ code, meta, rounds, error }) => (
          <section key={code}>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-heading text-xl font-bold">
                {meta?.shortName ?? `Série ${code.toUpperCase()}`}
              </h2>
              <span className="text-sm text-muted-foreground">
                {rounds?.rounds[0]?.label ?? ""}
              </span>
            </div>
            {rounds ? (
              <MatchList rounds={rounds} serie={code} />
            ) : (
              <p className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
                Não foi possível carregar os jogos agora
                {error ? ` (${error})` : ""}.
              </p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
