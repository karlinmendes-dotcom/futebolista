import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Snapshot tables for the portal.
 *
 * A cron periodically syncs the Brasileirão library output (standings and
 * rounds for each series) into these tables. Queries read the latest
 * snapshot, so the site never depends on the upstream source per request.
 */
export default defineSchema({
  standings: defineTable({
    serie: v.string(),
    payload: v.any(),
    syncedAt: v.number()
  }).index("by_serie", ["serie"]),
  rounds: defineTable({
    serie: v.string(),
    payload: v.any(),
    syncedAt: v.number()
  }).index("by_serie", ["serie"]),
  news: defineTable({
    title: v.string(),
    body: v.string(),
    category: v.string(),
    source: v.string(),
    sourceUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    publishedAt: v.optional(v.string())
  })
});
