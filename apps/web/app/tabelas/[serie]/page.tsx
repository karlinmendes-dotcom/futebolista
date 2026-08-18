import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Standings, Table } from "campeonato-brasileiro-api";
import { PageHeading } from "@/components/page-heading";
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
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <PageHeading title={meta.shortName} description={meta.name} />
        <div className="mt-8 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Não foi possível carregar os dados agora. Tente novamente em
          instantes.
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeading title={meta.shortName} description={meta.name} />
      <div className="mt-10">
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
