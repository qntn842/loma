import { MINUTES_PER_CIGARETTE, Mission, missions } from "@/config/missions";
import { avoidedCount, bestStreak, DAY, netSavings } from "./calc";
import type { AppData } from "./types";

export type MissionStats = {
  jours: number;
  cigarettes: number;
  argent: number;
  heures: number;
  envies: number;
  notes: number;
  sos: number;
};

/** Les compteurs dont dépendent les missions. Les jours suivent la meilleure série : un écart ne les retire pas. */
export function missionStats(data: AppData, now: number): MissionStats {
  const cigarettes = avoidedCount(data, now);
  return {
    jours: Math.floor(bestStreak(data, now) / DAY),
    cigarettes,
    argent: netSavings(data, now),
    heures: (cigarettes * MINUTES_PER_CIGARETTE) / 60,
    envies: data.cravings.length,
    notes: data.journal.length,
    sos: data.sosOpens,
  };
}

export function missionValue(m: Mission, s: MissionStats): number {
  if (m.family === "temps") return s.heures;
  if (m.family === "journal") return m.counts === "sos" ? s.sos : s.notes;
  return s[m.family];
}

export const missionProgress = (m: Mission, s: MissionStats) => Math.min(1, missionValue(m, s) / m.goal);
export const missionDone = (m: Mission, s: MissionStats) => missionValue(m, s) >= m.goal;

export const missionsDoneCount = (s: MissionStats) => missions.filter((m) => missionDone(m, s)).length;

/** La mission pas encore réussie la plus avancée (étiquette « Prochaine ») */
export function nextMission(s: MissionStats): Mission | null {
  let best: Mission | null = null;
  for (const m of missions) {
    if (missionDone(m, s)) continue;
    if (!best || missionProgress(m, s) > missionProgress(best, s)) best = m;
  }
  return best;
}
