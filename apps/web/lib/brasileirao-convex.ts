import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import type { Rounds, Standings, Table } from "campeonato-brasileiro-api";
import {
  fetchGroups as fetchGroupsFromSource,
  fetchRounds as fetchRoundsFromSource,
  fetchStandings as fetchStandingsFromSource
} from "./brasileirao";

/**
 * Server-side data access for the portal pages.
 *
 * Strategy: read from the Convex cache first (kept fresh by the sync cron);
 * if Convex is unavailable or has no data yet, fall back to the library,
 * which tries the live source and then the offline fixtures.
 */

const CONVEX_URL =
  process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_DEPLOYMENT ?? "";

let client: ConvexClient | null = null;

/** Only talk to a remote (cloud) Convex deployment. */
function isUsableConvexUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.hostname !== "127.0.0.1" && parsed.hostname !== "localhost";
  } catch {
    return false;
  }
}

function convexClient(): ConvexClient | null {
  if (!isUsableConvexUrl(CONVEX_URL)) {
    return null;
  }
  if (!client) {
    client = new ConvexClient(CONVEX_URL);
  }
  return client;
}

async function readFromConvex<T>(query: () => Promise<unknown>): Promise<T | null> {
  const current = convexClient();
  if (!current) {
    return null;
  }
  try {
    return (await query()) as T | null;
  } catch {
    return null;
  }
}

function isStandings(value: unknown): value is Standings {
  if (!value || typeof value !== "object") return false;
  return Array.isArray((value as { tables?: unknown }).tables);
}

function isRounds(value: unknown): value is Rounds {
  if (!value || typeof value !== "object") return false;
  return Array.isArray((value as { rounds?: unknown }).rounds);
}

function normalizeKey(value: string): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Filters a cached standings payload down to one group (Série D). */
function selectGroupFromPayload(
  payload: Standings,
  group: string | number
): Standings | null {
  const wantedRaw = String(group);
  const wanted = normalizeKey(wantedRaw.replace(/^grupo/i, ""));

  const table = (payload.tables ?? []).find((entry) => {
    if (String(entry.id) === wantedRaw) return true;
    return normalizeKey(String(entry.name ?? "").replace(/^grupo/i, "")) === wanted;
  });

  if (!table) return null;
  return { ...payload, tables: [table] };
}

export async function fetchStandings(
  serie: string,
  group?: string | number
): Promise<Standings> {
  const payload = await readFromConvex<Standings>(() =>
    convexClient()!.query(api.queries.latestStandings, { serie })
  );

  if (isStandings(payload)) {
    if (group == null) {
      return payload;
    }
    const filtered = selectGroupFromPayload(payload, group);
    if (filtered) {
      return filtered;
    }
  }

  return fetchStandingsFromSource(serie, group);
}

export async function fetchGroups(serie: string): Promise<Table[]> {
  const payload = await readFromConvex<Standings>(() =>
    convexClient()!.query(api.queries.latestStandings, { serie })
  );

  if (isStandings(payload)) {
    return payload.grouped ? payload.tables : [];
  }

  return fetchGroupsFromSource(serie);
}

export async function fetchRounds(serie: string): Promise<Rounds> {
  const payload = await readFromConvex<Rounds>(() =>
    convexClient()!.query(api.queries.latestRounds, { serie })
  );

  if (isRounds(payload)) {
    return payload;
  }

  return fetchRoundsFromSource(serie);
}

export {
  fetchStandings as fetchStandingsFromLibrary,
  fetchRounds as fetchRoundsFromLibrary,
  fetchGroups as fetchGroupsFromLibrary
} from "./brasileirao";
