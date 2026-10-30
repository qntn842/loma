import { DAY } from "./calc";
import type { AppData, Mood } from "./types";

export type Moment = "matin" | "midi" | "aprem" | "soir" | "nuit";

function momentOf(ts: number): Moment {
  const h = new Date(ts).getHours();
  if (h >= 5 && h < 11) return "matin";
  if (h >= 11 && h < 14) return "midi";
  if (h >= 14 && h < 18) return "aprem";
  if (h >= 18 && h < 23) return "soir";
  return "nuit";
}

function mostFrequent<T>(list: T[]): T | null {
  const counts = new Map<T, number>();
  list.forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1));
  let best: T | null = null;
  let max = 0;
  counts.forEach((n, x) => {
    if (n > max) {
      max = n;
      best = x;
    }
  });
  return best;
}

/** Récap des 7 derniers jours, calculé à partir du journal, des envies et des écarts */
export function weekRecap(data: AppData, now: number) {
  const weekAgo = now - 7 * DAY;
  const twoWeeksAgo = now - 14 * DAY;
  const entries = data.journal.filter((e) => e.date >= weekAgo);
  const relapses = data.relapses.filter((r) => r.date >= weekAgo);
  const cravings = data.cravings.filter((c) => c.date >= weekAgo);

  const triggers = [...entries.flatMap((e) => e.triggers), ...relapses.flatMap((r) => r.causes)];

  // Moments à risque : envies, écarts et moments où l'humeur était tendue ou dure
  const riskTimes = [
    ...cravings.map((c) => c.date),
    ...relapses.map((r) => r.date),
    ...entries.filter((e) => e.mood === "tendu" || e.mood === "dur").map((e) => e.date),
  ];

  return {
    topTrigger: mostFrequent(triggers),
    riskMoment: mostFrequent(riskTimes.map(momentOf)),
    topMood: mostFrequent<Mood>(entries.map((e) => e.mood)),
    cravings: cravings.length,
    cravingsBefore: data.cravings.filter((c) => c.date >= twoWeeksAgo && c.date < weekAgo).length,
    relapses: relapses.length,
    isEmpty: entries.length === 0 && cravings.length === 0 && relapses.length === 0,
  };
}
