// Étapes générales après l'arrêt (OMS, Tabac Info Service, NHS, CDC). Les textes sont dans src/i18n/fr.ts (clé "sante").
// `ms` = moment où l'étape est atteinte ; pour une fourchette (« 5 à 15 ans »), c'est le début.
const MIN = 60_000;
const H = 60 * MIN;
const D = 24 * H;
const Y = 365 * D;

export const healthSteps = [
  { id: "20min", ms: 20 * MIN },
  { id: "12h", ms: 12 * H },
  { id: "48h", ms: 48 * H },
  { id: "72h", ms: 72 * H },
  { id: "2sem", ms: 14 * D },
  { id: "4sem", ms: 28 * D },
  { id: "1mois", ms: 30 * D },
  { id: "3mois", ms: 91 * D },
  { id: "6mois", ms: 182 * D },
  { id: "9mois", ms: 273 * D },
  { id: "1an", ms: Y },
  { id: "2ans", ms: 2 * Y },
  { id: "5ans", ms: 5 * Y },
  { id: "5ansAvc", ms: 5 * Y + D },
  { id: "15ans", ms: 15 * Y },
];
