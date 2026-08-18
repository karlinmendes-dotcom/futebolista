import type { Metadata } from "next";
import { Table2 } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { SeriesCards } from "@/components/series-cards";

export const metadata: Metadata = {
  title: "Tabelas"
};

export default function TabelasPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageHeading
        title="Tabelas"
        icon={<Table2 className="size-5" />}
        description="Classificação de todas as divisões do Campeonato Brasileiro, atualizada a cada rodada."
      />
      <div className="mt-10">
        <SeriesCards />
      </div>
    </main>
  );
}
