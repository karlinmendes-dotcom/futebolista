export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-semibold text-foreground">
          Futebolista ⚽ — o futebol em um só lugar
        </p>
        <p>Sem apostas. Só futebol de verdade.</p>
        <p>Dados: Globo Esporte (ge.globo.com) · Projeto educacional</p>
      </div>
    </footer>
  );
}
