/**
 * Type declarations for the `campeonato-brasileiro-api` package (plain CommonJS).
 * Describes the subset of the API the portal consumes.
 */
declare module "campeonato-brasileiro-api" {
  export type SerieCode = "a" | "b" | "c" | "d";

  export interface Serie {
    code: SerieCode;
    slug: string;
    name: string;
    grouped: boolean;
    url: string;
  }

  export interface Team {
    id: number | null;
    name: string | null;
    shortName: string | null;
    badge: string | null;
  }

  export interface Legend {
    id: number | null;
    name: string | null;
    color: string | null;
  }

  export interface RoundMeta {
    number: number | null;
    total: number | null;
    label: string | null;
  }

  export interface TableEntry {
    position: number | null;
    team: Team;
    points: number | null;
    matches: number | null;
    wins: number | null;
    draws: number | null;
    losses: number | null;
    goalsFor: number | null;
    goalsAgainst: number | null;
    goalDifference: number | null;
    efficiency: number | null;
    movement: number | null;
    recentForm: (string | null)[];
    legend: Legend | null;
  }

  export interface Table {
    id: string | number | null;
    name: string | null;
    round: RoundMeta;
    entries: TableEntry[];
  }

  export interface Competition {
    code: SerieCode;
    slug: string;
    name: string | null;
    season: number | null;
    sport: string;
    grouped: boolean;
    phase: {
      slug: string | null;
      disclaimer: string | null;
      description: string | null;
      typeId: string | null;
      grouped: boolean;
    };
    edition: {
      name: string | null;
      location: string | null;
      startsAt: string | null;
      endsAt: string | null;
      regulation: string | null;
    };
    source: {
      provider: string;
      url: string;
      resourceId: string | null;
      tUUID: string | null;
    };
  }

  export interface Score {
    home: number | null;
    away: number | null;
    penalties: { home: number | null; away: number | null } | null;
  }

  export interface Match {
    id: number | null;
    groupId: number | null;
    groupName: string | null;
    round: number | null;
    totalRounds: number | null;
    dateTime: string | null;
    date: string | null;
    time: string | null;
    started: boolean;
    status: "scheduled" | "live" | "finished";
    statusCode: string | null;
    venue: string | null;
    homeTeam: Team;
    awayTeam: Team;
    score: Score;
    coverage: { label: string | null; url: string | null; statusCode: string | null } | null;
  }

  export interface RoundGroup {
    id: string | number | null;
    groupId: string | number | null;
    groupName: string | null;
    number: number | null;
    total: number | null;
    label: string | null;
    matches: Match[];
  }

  export interface Standings {
    competition: Competition;
    grouped: boolean;
    legends: Legend[];
    tables: Table[];
  }

  export interface Rounds {
    competition: Competition;
    grouped: boolean;
    rounds: RoundGroup[];
  }

  export interface BrasileiraoOptions {
    url?: string;
    html?: string;
    fetch?: typeof fetch;
    headers?: Record<string, string>;
    signal?: AbortSignal;
    group?: string | number;
    number?: number;
  }

  export interface TeamMatch {
    id: number | null;
    groupId: number | null;
    groupName: string | null;
    round: number | null;
    totalRounds: number | null;
    dateTime: string | null;
    date: string | null;
    time: string | null;
    started: boolean;
    status: "scheduled" | "live" | "finished";
    statusCode: string | null;
    finished: boolean;
    live: boolean;
    scheduled: boolean;
    venue: string | null;
    side: "home" | "away";
    team: Team;
    opponent: Team;
    score: {
      team: number | null;
      opponent: number | null;
      home: number | null;
      away: number | null;
      penalties: { home: number | null; away: number | null } | null;
    };
    outcome: "win" | "loss" | "draw" | null;
    scoreState: "winning" | "losing" | "drawing" | null;
    won: boolean;
    lost: boolean;
    drew: boolean;
    coverage: { label: string | null; url: string | null; statusCode: string | null } | null;
  }

  export interface TeamSnapshot {
    competition: Competition;
    grouped: boolean;
    team: Team;
    matchedBy: string | null;
    standing: TableEntry | null;
    groups: { id: number | null; name: string | null; position: number | null }[];
    currentRound: {
      rounds: {
        id: string | number | null;
        groupId: string | number | null;
        groupName: string | null;
        number: number | null;
        total: number | null;
        label: string | null;
        matches: number;
      }[];
      numbers: number[];
    };
    matches: TeamMatch[];
    automation: { supportedConditions: string[] };
  }

  export function listSeries(): Serie[];
  export function getStandings(serie: string, options?: BrasileiraoOptions): Promise<Standings>;
  export function getGroups(serie: string, options?: BrasileiraoOptions): Promise<Table[]>;
  export function getRounds(serie: string, options?: BrasileiraoOptions): Promise<Rounds>;
  export function getCompetition(serie: string, options?: BrasileiraoOptions): Promise<Competition>;
  export function getTeamSnapshot(
    serie: string,
    team: string,
    options?: BrasileiraoOptions
  ): Promise<TeamSnapshot>;
  export const SUPPORTED_SERIES: Serie[];

  const api: {
    listSeries: typeof listSeries;
    getStandings: typeof getStandings;
    getGroups: typeof getGroups;
    getRounds: typeof getRounds;
    getCompetition: typeof getCompetition;
    getTeamSnapshot: typeof getTeamSnapshot;
    SUPPORTED_SERIES: Serie[];
  };
  export default api;
}
