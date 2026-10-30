// Tous les calculs d'argent et de temps. Basés uniquement sur les vraies données de l'utilisateur.
import { statuses, timeMilestones } from "@/config/milestones";
import { CIGARETTES_PER_PACK } from "@/config/products";
import type { AppData, Profile } from "./types";

export const MIN = 60_000;
export const HOUR = 60 * MIN;
export const DAY = 24 * HOUR;
export const DAYS_PER_MONTH = 365 / 12;

/** Coût par jour, en euros, de tous les produits choisis */
export function dailyCost(p: Pick<Profile, "products" | "consumption">): number {
  const c = p.consumption;
  let total = 0;
  for (const prod of p.products) {
    if (prod === "cigarettes") total += c.cigarettes.perDay * (c.cigarettes.packPrice / CIGARETTES_PER_PACK);
    if (prod === "roule") total += c.roule.perDay * (c.roule.pouchPrice / Math.max(1, c.roule.perPouch));
  }
  return total;
}

export const monthlyCost = (p: Pick<Profile, "products" | "consumption">) => dailyCost(p) * DAYS_PER_MONTH;
export const yearlyCost = (p: Pick<Profile, "products" | "consumption">) => dailyCost(p) * 365;

/** Heures sans fumer nécessaires pour rembourser un prix */
export function hoursToEarn(price: number, p: Pick<Profile, "products" | "consumption">): number {
  const perHour = dailyCost(p) / 24;
  if (perHour <= 0) return 0;
  return Math.max(1, Math.ceil(price / perHour));
}

/** Cigarettes fumées par jour (paquet et roulées additionnées) */
export function cigarettesPerDay(p: Pick<Profile, "products" | "consumption">): number {
  const c = p.consumption;
  return (p.products.includes("cigarettes") ? c.cigarettes.perDay : 0) + (p.products.includes("roule") ? c.roule.perDay : 0);
}

export type RelapseUnitId = "cigarette" | "roulee";

/** Unité d'un écart (« J'ai craqué ») et son vrai prix */
export function relapseUnit(p: Profile): { id: RelapseUnitId; cost: number; avoidedPerUnit: number } {
  const c = p.consumption;
  if (p.products.includes("cigarettes"))
    return { id: "cigarette", cost: c.cigarettes.packPrice / CIGARETTES_PER_PACK, avoidedPerUnit: 1 };
  return { id: "roulee", cost: c.roule.pouchPrice / Math.max(1, c.roule.perPouch), avoidedPerUnit: 1 };
}

/** Début de la série en cours : date d'arrêt ou dernier écart */
export function streakStart(data: AppData): number {
  const quit = data.profile?.quitDate ?? Date.now();
  return data.relapses.reduce((max, r) => Math.max(max, r.date), quit);
}

export function currentStreak(data: AppData, now: number): number {
  return Math.max(0, now - streakStart(data));
}

/** Meilleure série jamais faite (elle n'est jamais perdue) */
export function bestStreak(data: AppData, now: number): number {
  const quit = data.profile?.quitDate ?? now;
  const points = [quit, ...data.relapses.map((r) => r.date).sort((a, b) => a - b), now];
  let best = 0;
  for (let i = 1; i < points.length; i++) best = Math.max(best, points[i] - points[i - 1]);
  return best;
}

/** Argent net économisé depuis l'arrêt : écarts déduits, jamais remis à zéro */
export function netSavings(data: AppData, now: number): number {
  if (!data.profile) return 0;
  const gross = (dailyCost(data.profile) * Math.max(0, now - data.profile.quitDate)) / DAY;
  const lost = data.relapses.reduce((s, r) => s + r.cost, 0);
  return Math.max(0, gross - lost);
}

export function avoidedCount(data: AppData, now: number): number {
  if (!data.profile) return 0;
  const perDay = cigarettesPerDay(data.profile);
  const gross = (perDay * Math.max(0, now - data.profile.quitDate)) / DAY;
  const lost = data.relapses.reduce((s, r) => s + r.avoidedLost, 0);
  return Math.max(0, Math.floor(gross - lost));
}

/** Prochaine étape de temps et progression vers elle (0 → 1) */
export function nextMilestone(streakMs: number) {
  const next = timeMilestones.find((m) => m.ms > streakMs);
  if (!next) return null;
  const idx = timeMilestones.indexOf(next);
  const prevMs = idx > 0 ? timeMilestones[idx - 1].ms : 0;
  return { id: next.id, ms: next.ms, progress: (streakMs - prevMs) / (next.ms - prevMs) };
}

export function currentStatus(bestMs: number) {
  let idx = 0;
  statuses.forEach((s, i) => {
    if (bestMs >= s.ms) idx = i;
  });
  const next = statuses[idx + 1] ?? null;
  const progress = next ? (bestMs - statuses[idx].ms) / (next.ms - statuses[idx].ms) : 1;
  return { status: statuses[idx], next, progress };
}

/** Date à laquelle une étape de temps a été atteinte pour la première fois (null si pas encore) */
export function milestoneReachedAt(data: AppData, ms: number, now: number): number | null {
  const quit = data.profile?.quitDate ?? now;
  const points = [quit, ...data.relapses.map((r) => r.date).sort((a, b) => a - b), now];
  for (let i = 1; i < points.length; i++) {
    if (points[i] - points[i - 1] >= ms) return points[i - 1] + ms;
  }
  return null;
}

/**
 * Bilan d'une journée [from, to[ pour le calendrier de Progrès (to = minuit suivant, une journée peut durer 23 ou 25 h au changement d'heure) :
 * argent net et cigarettes évitées, écarts du jour déduits (peut être négatif si on a plus fumé que d'habitude).
 * null si la journée est avant l'arrêt ou dans le futur.
 */
export function dayResult(data: AppData, from: number, to: number, now: number) {
  if (!data.profile) return null;
  const start = Math.max(from, data.profile.quitDate);
  const end = Math.min(to, now);
  const relapses = data.relapses.filter((r) => r.date >= from && r.date < to);
  if (end <= start && relapses.length === 0) return null;
  const share = Math.max(0, end - start) / DAY;
  return {
    money: dailyCost(data.profile) * share - relapses.reduce((s, r) => s + r.cost, 0),
    avoided: cigarettesPerDay(data.profile) * share - relapses.reduce((s, r) => s + r.avoidedLost, 0),
    relapse: relapses.length > 0,
  };
}
