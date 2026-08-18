import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const recentTitles = internalQuery({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const docs = await ctx.db.query("news").order("desc").take(limit ?? 50);
    return docs.map((doc) => String(doc.title ?? "").toLowerCase());
  }
});
