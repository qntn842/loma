import type { CarouselItem } from "@/components/BadgeCarousel";
import { timeMilestones } from "@/config/milestones";
import { duration, t } from "@/i18n";
import { bestStreak, currentStreak } from "./calc";
import type { AppData } from "./types";

/** Les 8 médailles de temps avec leur état (débloqué / prochain / verrouillé), selon la meilleure série */
export function milestoneItems(data: AppData, now: number): CarouselItem[] {
  const best = bestStreak(data, now);
  const firstLocked = timeMilestones.findIndex((m) => best < m.ms);
  return timeMilestones.map((m, i) => ({
    id: m.id,
    valeur: t.badges[m.id].valeur,
    unite: t.badges[m.id].unite,
    libelle: t.badges[m.id].libelle,
    metal: m.metal,
    etat: best >= m.ms ? "debloque" : i === firstLocked ? "prochain" : "verrouille",
  }));
}

/** Progression en direct vers une médaille de temps : « 21 h 58 min » sur « 24 h », ou objectif atteint */
export function milestoneProgress(data: AppData, now: number, index: number) {
  const m = timeMilestones[index];
  const goal = t.trophees.etapesNoms[m.id];
  if (bestStreak(data, now) >= m.ms) return { value: 1, left: t.aujourdhui.objectifAtteint, right: goal };
  const streak = currentStreak(data, now);
  return { value: streak / m.ms, left: duration(streak), right: goal };
}
