"use client";

import { useEffect, useState } from "react";
import type { Standings, Table } from "campeonato-brasileiro-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StandingsTable } from "@/components/standings-table";

interface StandingsExplorerProps {
  serie: string;
  initialStandings: Standings;
  groups: Table[];
}

export function StandingsExplorer({
  serie,
  initialStandings,
  groups
}: StandingsExplorerProps) {
  const [standings, setStandings] = useState<Standings>(initialStandings);
  const [group, setGroup] = useState<string | undefined>(() =>
    groups.length > 0 ? String(groups[0].id ?? groups[0].name ?? "") : undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const grouped = groups.length > 0;

  useEffect(() => {
    setStandings(initialStandings);
    setError(null);
    setLoading(false);
  }, [serie, initialStandings]);

  async function load(groupId: string | undefined) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ serie });
      if (groupId) {
        params.set("group", groupId);
      }
      const response = await fetch(`/api/standings?${params.toString()}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Não foi possível carregar a tabela.");
      }
      setStandings(data);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Erro inesperado ao carregar a tabela."
      );
    } finally {
      setLoading(false);
    }
  }

  function changeGroup(value: string | null) {
    const next = value ?? undefined;
    setGroup(next);
    void load(next);
  }

  return (
    <div className="space-y-4">
      {grouped && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Grupo:</span>
          <Select value={group} onValueChange={changeGroup}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {groups.map((item) => (
                <SelectItem
                  key={String(item.id ?? item.name)}
                  value={String(item.id ?? item.name)}
                >
                  {item.name ?? item.id ?? "Grupo"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <StandingsTable
          entries={standings.tables[0]?.entries ?? []}
          legends={standings.legends}
          tableName={standings.tables[0]?.name}
          roundLabel={standings.tables[0]?.round?.label}
          serie={serie}
        />
      )}
    </div>
  );
}
