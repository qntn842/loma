import type { Metal } from "@/theme/palettes";

const H = 3_600_000;
const D = 24 * H;

/** Étapes sans fumer (trophées + barre du compteur). La médaille change de matière avec le temps. */
export const timeMilestones = [
  { id: "24h", ms: 1 * D, metal: "bronze" },
  { id: "3j", ms: 3 * D, metal: "bronze" },
  { id: "1sem", ms: 7 * D, metal: "argent" },
  { id: "2sem", ms: 14 * D, metal: "argent" },
  { id: "1mois", ms: 30 * D, metal: "or" },
  { id: "3mois", ms: 91 * D, metal: "or" },
  { id: "6mois", ms: 182 * D, metal: "platine" },
  { id: "1an", ms: 365 * D, metal: "diamant" },
] as const satisfies readonly { id: string; ms: number; metal: Metal }[];

/** Statuts, débloqués selon la meilleure série */
export const statuses = [
  { id: "recrue", ms: 0 },
  { id: "survivant", ms: 1 * D },
  { id: "guerrier", ms: 7 * D },
  { id: "champion", ms: 30 * D },
  { id: "maitre", ms: 180 * D },
  { id: "legende", ms: 365 * D },
] as const;

export type StatusId = (typeof statuses)[number]["id"];
