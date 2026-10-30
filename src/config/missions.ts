// Missions (objectifs) : 50 paliers en 6 familles. Les titres et sous-titres sont dans src/i18n/fr.ts (missions).

export type MissionFamily = "jours" | "cigarettes" | "argent" | "temps" | "envies" | "journal";

export type Mission = {
  id: string;
  family: MissionFamily;
  /** jours | cigarettes | euros | heures | envies | notes ou SOS */
  goal: number;
  /** Famille « journal » : ce qu'on compte */
  counts?: "notes" | "sos";
};

/** Ordre d'affichage des familles */
export const missionFamilies: MissionFamily[] = ["jours", "cigarettes", "argent", "temps", "envies", "journal"];

/** Minutes passées par cigarette, pour le « temps récupéré » (estimation) */
export const MINUTES_PER_CIGARETTE = 5;

const list = (family: MissionFamily, prefix: string, goals: number[]): Mission[] =>
  goals.map((goal) => ({ id: `${prefix}${goal}`, family, goal }));

export const missions: Mission[] = [
  ...list("jours", "j", [1, 2, 3, 5, 7, 10, 14, 21, 30, 45, 60, 90, 180, 365]),
  ...list("cigarettes", "c", [5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000]),
  ...list("argent", "e", [10, 25, 50, 100, 200, 300, 500, 1000, 2000, 5000]),
  ...list("temps", "t", [1, 5, 12, 24, 50, 100]),
  ...list("envies", "v", [1, 5, 10, 25, 50, 100]),
  { id: "n1", family: "journal", goal: 1, counts: "notes" },
  { id: "n7", family: "journal", goal: 7, counts: "notes" },
  { id: "s1", family: "journal", goal: 1, counts: "sos" },
  { id: "s5", family: "journal", goal: 5, counts: "sos" },
];
