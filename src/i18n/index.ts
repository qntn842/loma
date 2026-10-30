import { fr } from "./fr";

export const t = fr;

/** 1234.5 → "1 234,50 €" (décimales seulement si utiles quand `compact`) */
export function money(value: number, compact = false): string {
  const v = Math.round(value * 100) / 100;
  const digits = compact && Number.isInteger(v) ? 0 : 2;
  const [int, dec] = Math.abs(v).toFixed(digits).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${v < 0 ? "−" : ""}${grouped}${dec ? "," + dec : ""} €`;
}

/** 0.4567 → "0,5" */
export function decimal(value: number, digits = 1): string {
  return value.toFixed(digits).replace(".", ",");
}

/** Nombre entier avec espaces : 12345 → "12 345" */
export function int(value: number): string {
  return Math.floor(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/** Durée lisible courte : "3 j 4 h", "5 h 12 min", "12 min" */
export function duration(ms: number): string {
  const d = Math.floor(ms / DAY);
  const h = Math.floor((ms % DAY) / HOUR);
  const m = Math.floor((ms % HOUR) / MIN);
  if (d > 0) return h > 0 ? `${d} j ${h} h` : `${d} j`;
  if (h > 0) return m > 0 ? `${h} h ${m} min` : `${h} h`;
  return `${Math.max(1, m)} min`;
}

/** "samedi 24 octobre" */
export function longDate(date: Date): string {
  const s = date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** "24/10 · 14:05" */
export function shortDateTime(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => n.toString().padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)} · ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** Durée en toutes lettres, arrondie : "5 jours", "3 heures", "12 minutes" */
export function durationWords(ms: number): string {
  const d = Math.floor(ms / DAY);
  if (d >= 1) return `${d} ${d > 1 ? "jours" : "jour"}`;
  const h = Math.floor(ms / HOUR);
  if (h >= 1) return `${h} ${h > 1 ? "heures" : "heure"}`;
  const m = Math.max(1, Math.ceil(ms / MIN));
  return `${m} ${m > 1 ? "minutes" : "minute"}`;
}
