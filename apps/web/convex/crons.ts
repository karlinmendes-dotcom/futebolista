import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "syncBrasileirao",
  { seconds: 900 }, // every 15 minutes
  internal.sync.syncAll
);

export default crons;
