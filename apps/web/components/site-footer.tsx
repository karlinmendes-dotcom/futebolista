import Link from "next/link";
import { Trophy } from "lucide-react";

const QUICK_LINKS = [
  { href: "/tabelas", label: "Tabelas" },
  { href: "/tabelas/a", label: "Série A" },
  { href: "/tabelas/b", label: "Série B" },
  { href: "/tabelas/c", label: "Série C" },
  { href: "/tabelas/d", label: "Série D" },
  { href: "/rodada", label: "Rodada atual" }
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                <Trophy className="size-4" />
              </span>
              <span className="font-heading text-lg font-semibold uppercase tracking-wide">
                Futebolista
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              O futebol brasileiro em um só lugar: tabelas, rodadas e
              estatísticas das Séries A, B, C e D. Sem apostas — só futebol de
              verdade.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold">Navegação</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold">Sobre os dados</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Classificação e rodada atual do Brasileirão, extraídas do Globo
              Esporte (ge.globo.com) e sincronizadas periodicamente. Projeto
              educacional, sem vínculo com casas de aposta.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Futebolista ⚽</p>
          <p>Feito com amor pelo futebol brasileiro.</p>
        </div>
      </div>
    </footer>
  );
}
