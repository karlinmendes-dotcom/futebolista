import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const upsertStandings = internalMutation({
  args: { serie: v.string(), payload: v.any() },
  handler: async (ctx, { serie, payload }) => {
    await ctx.db.insert("standings", { serie, payload, syncedAt: Date.now() });
  }
});

export const upsertRounds = internalMutation({
  args: { serie: v.string(), payload: v.any() },
  handler: async (ctx, { serie, payload }) => {
    await ctx.db.insert("rounds", { serie, payload, syncedAt: Date.now() });
  }
});
