import { query } from "./_generated/server";
import { v } from "convex/values";

export const latestStandings = query({
  args: { serie: v.string() },
  handler: async (ctx, { serie }) => {
    const latest = await ctx.db
      .query("standings")
      .withIndex("by_serie", (q) => q.eq("serie", serie))
      .order("desc")
      .first();

    return latest?.payload ?? null;
  }
});

export const latestRounds = query({
  args: { serie: v.string() },
  handler: async (ctx, { serie }) => {
    const latest = await ctx.db
      .query("rounds")
      .withIndex("by_serie", (q) => q.eq("serie", serie))
      .order("desc")
      .first();

    return latest?.payload ?? null;
  }
});

export const latestNews = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return ctx.db.query("news").order("desc").take(limit ?? 12);
  }
});
