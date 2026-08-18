"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { SERIE_CODES, fetchRounds, fetchStandings } from "../lib/brasileirao";

/**
 * Pulls the latest standings and rounds for every series (A–D) into the
 * snapshot tables. Runs periodically via the cron in convex/crons.ts and
 * can also be triggered manually from the dashboard.
 */
export const syncAll = internalAction({
  args: {},
  handler: async (ctx) => {
    for (const code of SERIE_CODES) {
      try {
        const standings = await fetchStandings(code);
        await ctx.runMutation(internal.sync_mutations.upsertStandings, {
          serie: code,
          payload: standings
        });
      } catch (error) {
        console.error(
          `[sync] standings ${code} failed:`,
          error instanceof Error ? error.message : error
        );
      }

      try {
        const rounds = await fetchRounds(code);
        await ctx.runMutation(internal.sync_mutations.upsertRounds, {
          serie: code,
          payload: rounds
        });
      } catch (error) {
        console.error(
          `[sync] rounds ${code} failed:`,
          error instanceof Error ? error.message : error
        );
      }
    }
  }
});
