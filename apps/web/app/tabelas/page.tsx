import type { Metadata } from "next";
import { SeriesCards } from "@/components/series-cards";

export const metadata: Metadata = {
  title: "Tabelas"
};

export default function TabelasPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-heading text-3xl font-bold">Tabelas</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Classificação de todas as divisões do Campeonato Brasileiro, atualizada
        a cada rodada.
      </p>
      <div className="mt-8">
        <SeriesCards />
      </div>
    </main>
  );
}
