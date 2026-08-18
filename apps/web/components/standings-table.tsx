import Link from "next/link";
import type { Legend, TableEntry } from "campeonato-brasileiro-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { teamSlug } from "@/lib/team";

const FORM_STYLES: Record<string, string> = {
  W: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  D: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  L: "bg-red-500/15 text-red-600 dark:text-red-400"
};

interface StandingsTableProps {
  entries: TableEntry[];
  legends?: Legend[];
  tableName?: string | null;
  roundLabel?: string | null;
  compact?: boolean;
  serie?: string;
}

export function StandingsTable({
  entries,
  legends = [],
  tableName,
  roundLabel,
  compact = false,
  serie
}: StandingsTableProps) {
  return (
    <div className="space-y-4">
      {(tableName || roundLabel) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium">{tableName ?? "Classificação"}</p>
          {roundLabel && (
            <p className="text-sm text-muted-foreground">{roundLabel}</p>
          )}
        </div>
      )}

      {legends.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          {legends.map((legend) => (
            <span
              key={legend.id ?? legend.name ?? legend.color}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span
                className="size-2.5 rounded-full"
                style={{ background: legend.color ?? "#d9d9d9" }}
              />
              {legend.name}
            </span>
          ))}
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-center">PTS</TableHead>
            <TableHead className="text-center">J</TableHead>
            <TableHead className="text-center">V</TableHead>
            <TableHead className="text-center">E</TableHead>
            <TableHead className="text-center">D</TableHead>
            {!compact && (
              <>
                <TableHead className="text-center">GP</TableHead>
                <TableHead className="text-center">GC</TableHead>
              </>
            )}
            <TableHead className="text-center">SG</TableHead>
            {!compact && <TableHead className="text-center">%</TableHead>}
            <TableHead className="text-center">Forma</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.team.id ?? entry.team.name ?? "team"}>
              <TableCell>
                <span className="flex items-center gap-2 font-semibold">
                  <span
                    className="h-4 w-1 shrink-0 rounded-full"
                    style={{
                      background: entry.legend?.color ?? "transparent"
                    }}
                  />
                  {entry.position ?? "-"}
                </span>
              </TableCell>
              <TableCell>
                <span className="flex items-center gap-2.5">
                  {entry.team.badge ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entry.team.badge}
                      alt=""
                      className="size-5 shrink-0 object-contain"
                    />
                  ) : null}
                  <span className="flex flex-col leading-tight">
                    <span className="font-medium">
                      {serie && entry.team.name ? (
                        <Link
                          href={`/time/${teamSlug(entry.team.name)}?serie=${serie}`}
                          className="transition-colors hover:text-primary hover:underline underline-offset-2"
                        >
                          {entry.team.name}
                        </Link>
                      ) : (
                        entry.team.name ?? "-"
                      )}
                    </span>
                    {entry.team.shortName && (
                      <span className="text-xs text-muted-foreground">
                        {entry.team.shortName}
                      </span>
                    )}
                  </span>
                </span>
              </TableCell>
              <TableCell className="text-center font-semibold">
                {entry.points ?? "-"}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {entry.matches ?? "-"}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {entry.wins ?? "-"}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {entry.draws ?? "-"}
              </TableCell>
              <TableCell className="text-center text-muted-foreground">
                {entry.losses ?? "-"}
              </TableCell>
              {!compact && (
                <>
                  <TableCell className="text-center text-muted-foreground">
                    {entry.goalsFor ?? "-"}
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {entry.goalsAgainst ?? "-"}
                  </TableCell>
                </>
              )}
              <TableCell className="text-center text-muted-foreground">
                {entry.goalDifference ?? "-"}
              </TableCell>
              {!compact && (
                <TableCell className="text-center text-muted-foreground">
                  {entry.efficiency ?? "-"}%
                </TableCell>
              )}
              <TableCell className="text-right">
                <span className="flex items-center justify-end gap-1">
                  {(entry.recentForm ?? []).map((result, index) => (
                    <span
                      key={`${result ?? "form"}-${index}`}
                      className={cn(
                        "grid size-5 place-items-center rounded text-[10px] font-bold",
                        FORM_STYLES[result ?? ""] ??
                          "bg-muted text-muted-foreground"
                      )}
                    >
                      {result ?? "-"}
                    </span>
                  ))}
                  {(!entry.recentForm || entry.recentForm.length === 0) && (
                    <span className="text-muted-foreground">-</span>
                  )}
                </span>
              </TableCell>
            </TableRow>
          ))}
          {entries.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={compact ? 9 : 12}
                className="py-8 text-center text-muted-foreground"
              >
                Nenhum dado disponível no momento.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
