// Petits outils de calcul sur les couleurs du thème (transparence, mélange).

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** "#34D399" → "52 211 153" (format attendu par les variables Tailwind) */
export function rgbTriplet(hex: string): string {
  return toRgb(hex).join(" ");
}

/** Couleur avec transparence : alpha("#34D399", 0.2) */
export function alpha(hex: string, a: number): string {
  const [r, g, b] = toRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Mélange deux couleurs : t = 0 → from, t = 1 → to */
export function mix(from: string, to: string, t: number): string {
  const a = toRgb(from);
  const b = toRgb(to);
  const k = Math.max(0, Math.min(1, t));
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * k));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
