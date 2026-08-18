import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import type { Rounds } from "campeonato-brasileiro-api";
import { PageHeading } from "@/components/page-heading";
import { RodadaView } from "@/components/rodada-view";
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
        return {
          code,
          shortName: meta?.shortName ?? `Série ${code.toUpperCase()}`,
          label: rounds?.rounds[0]?.label ?? "",
          rounds
        };
      } catch {
        return {
          code,
          shortName: meta?.shortName ?? `Série ${code.toUpperCase()}`,
          label: "",
          rounds: null as Rounds | null
        };
      }
    })
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeading
        title="Rodada atual"
        icon={<CalendarDays className="size-5" />}
        description="Os jogos da rodada em andamento nas quatro séries do Brasileirão."
      />

      <div className="mt-10">
        <RodadaView sections={sections} />
      </div>
    </main>
  );
}
