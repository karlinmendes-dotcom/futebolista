import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "syncBrasileirao",
  { seconds: 900 }, // every 15 minutes
  internal.sync.syncAll
);

// Football news automation, scheduled at fixed times (UTC) with a
// rotating category: morning news, afternoon trends, evening controversy.
// (09:00 UTC = 06:00 Brasília · 15:00 UTC = 12:00 · 21:00 UTC = 18:00)
crons.daily(
  "newsMorning",
  { hourUTC: 9 },
  internal.news.generateNews,
  { category: "noticia" }
);

crons.daily(
  "newsAfternoon",
  { hourUTC: 15 },
  internal.news.generateNews,
  { category: "tendencia" }
);

crons.daily(
  "newsEvening",
  { hourUTC: 21 },
  internal.news.generateNews,
  { category: "polemica" }
);

export default crons;
