import path from "node:path";
import { readFileSync } from "node:fs";
import api from "campeonato-brasileiro-api";
import type {
  Rounds,
  Serie,
  Standings,
  Table,
  TeamSnapshot
} from "campeonato-brasileiro-api";

export const SERIE_CODES = ["a", "b", "c", "d"] as const;
export type SerieCode = (typeof SERIE_CODES)[number];

export interface SerieMeta extends Serie {
  shortName: string;
  description: string;
}

export const SERIES: Record<SerieCode, SerieMeta> = {
  a: {
    code: "a",
    slug: "brasileirao-serie-a",
    name: "Campeonato Brasileiro Série A",
    shortName: "Série A",
    description: "A elite do futebol brasileiro: 20 clubes, pontos corridos, Libertadores e zona de rebaixamento.",
    grouped: false,
    url: "https://ge.globo.com/futebol/brasileirao-serie-a/"
  },
  b: {
    code: "b",
    slug: "brasileirao-serie-b",
    name: "Campeonato Brasileiro Série B",
    shortName: "Série B",
    description: "A briga pelo acesso: os melhores da segunda divisão sobem para a elite.",
    grouped: false,
    url: "https://ge.globo.com/futebol/brasileirao-serie-b/"
  },
  c: {
    code: "c",
    slug: "brasileirao-serie-c",
    name: "Campeonato Brasileiro Série C",
    shortName: "Série C",
    description: "A terceira divisão nacional, com o G8 garantindo vaga na Série B.",
    grouped: false,
    url: "https://ge.globo.com/futebol/brasileirao-serie-c/"
  },
  d: {
    code: "d",
    slug: "brasileirao-serie-d",
    name: "Campeonato Brasileiro Série D",
    shortName: "Série D",
    description: "A porta de entrada do futebol nacional: 64 clubes em grupos regionais.",
    grouped: true,
    url: "https://ge.globo.com/futebol/brasileirao-serie-d/"
  }
};

export function serieMeta(code: string): SerieMeta | null {
  return SERIES[code as SerieCode] ?? null;
}

// When the portal runs from apps/web, the repo fixtures live two levels up.
const FIXTURES_DIR = path.join(process.cwd(), "..", "..", "test", "fixtures");

function fixtureHtml(serie: string): string {
  return readFileSync(path.join(FIXTURES_DIR, `serie-${serie}.html`), "utf8");
}

/**
 * Fetches the standings for a series.
 * Tries the live source first and falls back to the local fixture HTML,
 * so the portal keeps working offline or when the source is unreachable.
 */
export async function fetchStandings(serie: string, group?: string | number): Promise<Standings> {
  try {
    return await api.getStandings(serie, group == null ? {} : { group });
  } catch (liveError) {
    try {
      return await api.getStandings(serie, {
        html: fixtureHtml(serie),
        ...(group == null ? {} : { group })
      });
    } catch {
      throw liveError;
    }
  }
}

export async function fetchGroups(serie: string): Promise<Table[]> {
  try {
    return await api.getGroups(serie);
  } catch {
    try {
      return await api.getGroups(serie, { html: fixtureHtml(serie) });
    } catch {
      return [];
    }
  }
}

export async function fetchRounds(serie: string): Promise<Rounds> {
  try {
    return await api.getRounds(serie);
  } catch {
    return api.getRounds(serie, { html: fixtureHtml(serie) });
  }
}

export async function fetchTeamSnapshot(
  serie: string,
  team: string
): Promise<TeamSnapshot> {
  try {
    return await api.getTeamSnapshot(serie, team);
  } catch (liveError) {
    try {
      return await api.getTeamSnapshot(serie, team, {
        html: fixtureHtml(serie)
      });
    } catch {
      throw liveError;
    }
  }
}

export function formatDateBr(iso: string | null): string {
  if (!iso) return "";
  const [year, month, day] = iso.slice(0, 10).split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}`;
}

export function formatDateLong(iso: string | null): string {
  if (!iso) return "";
  const [year, month, day] = iso.slice(0, 10).split("-");
  if (!year || !month || !day) return iso;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
}
