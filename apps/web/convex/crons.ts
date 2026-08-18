import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "syncBrasileirao",
  { seconds: 900 }, // every 15 minutes
  internal.sync.syncAll
);

// Generates one fresh football news article per hour (RSS + Groq AI).
crons.interval(
  "generateFootballNews",
  { hours: 1 },
  internal.news.generateNews
);

export default crons;
