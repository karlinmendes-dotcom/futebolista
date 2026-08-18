import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const insertNews = internalMutation({
  args: {
    title: v.string(),
    body: v.string(),
    category: v.string(),
    source: v.string(),
    sourceUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    publishedAt: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("news", args);
  }
});
