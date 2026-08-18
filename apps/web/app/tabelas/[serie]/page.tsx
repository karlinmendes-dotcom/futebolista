import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Standings, Table } from "campeonato-brasileiro-api";
import { StandingsExplorer } from "@/components/standings-explorer";
import { fetchGroups, fetchStandings } from "@/lib/brasileirao-convex";
import { SERIE_CODES, serieMeta } from "@/lib/brasileirao";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tabela"
};

export default async function SerieTabelaPage({
  params
}: {
  params: Promise<{ serie: string }>;
}) {
  const { serie } = await params;

  if (!(SERIE_CODES as readonly string[]).includes(serie)) {
    notFound();
  }

  const meta = serieMeta(serie);
  if (!meta) {
    notFound();
  }

  let standings: Standings;
  let groups: Table[] = [];

  try {
    [standings, groups] = await Promise.all([
      fetchStandings(serie),
      fetchGroups(serie)
    ]);
  } catch {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="font-heading text-3xl font-bold">{meta.shortName}</h1>
        <div className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Não foi possível carregar os dados agora. Tente novamente em
          instantes.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold">{meta.shortName}</h1>
      <p className="mt-2 text-muted-foreground">{meta.name}</p>
      <div className="mt-8">
        <StandingsExplorer
          key={serie}
          serie={serie}
          initialStandings={standings}
          groups={groups}
        />
      </div>
    </main>
  );
}
