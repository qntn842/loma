import React from 'react';
import Svg, {
  Defs, LinearGradient, RadialGradient, Stop, Path, Circle, Polygon, G, Text as SvgText,
} from 'react-native-svg';

/* ------------------------------------------------------------------ */
/*  Insigne de palier — style « verre sombre + métal »                 */
/*  Usage : <Insignia level={4} size={180} />                          */
/*          <Insignia level={6} size={180} locked />                   */
/* ------------------------------------------------------------------ */

export type Shape = 'circle' | 'octagon' | 'shield' | 'crest' | 'kite';
type MatKey = 'bronze' | 'silver' | 'gold' | 'diamond';

export type Tier = {
  num: string;       // texte gros au centre
  unit: string;      // petit texte sous le nombre
  shape: Shape;
  mat: MatKey;
  gloss: number;     // 0..1 (0.45 = mat, 1 = poli miroir)
  chevrons: number;
  stars: number;
  wings: number;
  laurel: number;
  crown: boolean;
};

// Les 8 paliers. Pour en retirer un, supprime sa ligne (l'index `level` suit l'ordre de ce tableau).
export const TIERS: Tier[] = [
  { num: '1', unit: 'JOUR',     shape: 'circle',  mat: 'bronze',  gloss: 0.45, chevrons: 0, stars: 0, wings: 0, laurel: 0, crown: false },
  { num: '3', unit: 'JOURS',    shape: 'octagon', mat: 'bronze',  gloss: 0.8,  chevrons: 0, stars: 0, wings: 0, laurel: 0, crown: false },
  { num: '1', unit: 'SEMAINE',  shape: 'shield',  mat: 'silver',  gloss: 0.6,  chevrons: 1, stars: 0, wings: 0, laurel: 0, crown: false },
  { num: '2', unit: 'SEMAINES', shape: 'crest',   mat: 'silver',  gloss: 1,    chevrons: 2, stars: 0, wings: 4, laurel: 0, crown: false },
  { num: '1', unit: 'MOIS',     shape: 'crest',   mat: 'gold',    gloss: 0.9,  chevrons: 2, stars: 1, wings: 5, laurel: 0, crown: false },
  { num: '3', unit: 'MOIS',     shape: 'crest',   mat: 'gold',    gloss: 1,    chevrons: 3, stars: 3, wings: 6, laurel: 9, crown: false },
  { num: '6', unit: 'MOIS',     shape: 'kite',    mat: 'diamond', gloss: 1,    chevrons: 3, stars: 3, wings: 6, laurel: 9, crown: false },
  { num: '1', unit: 'AN',       shape: 'kite',    mat: 'diamond', gloss: 1,    chevrons: 4, stars: 4, wings: 7, laurel: 9, crown: true  },
];

const MATS: Record<MatKey, string[]> = {
  bronze:  ['#3b1d0c', '#7a4623', '#c98046', '#f0b983', '#9c5c2b', '#4a2410'],
  silver:  ['#3a4250', '#7b8594', '#e9eef5', '#ffffff', '#aab4c2', '#3f4756'],
  gold:    ['#5e3d05', '#b8860b', '#ffd95a', '#fff6bd', '#d4a017', '#6b4707'],
  diamond: ['#5aa9d6', '#a5e3ff', '#ffffff', '#d9f4ff', '#9fc4ff', '#5b7fd0'],
};
const LOCKED = ['#1b2434', '#2b3750', '#46556f', '#5b6b87', '#34415a', '#1e2738'];
const OFFS = [0, 0.14, 0.34, 0.5, 0.78, 1];

/* ---------- petits outils couleur / géométrie ---------- */
const toRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (v: number[]) => '#' + v.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');
const mix = (a: string, b: string, t: number) => {
  const A = toRgb(a), B = toRgb(b);
  return hex(A.map((x, i) => x + (B[i] - x) * t));
};
const rad = (d: number) => (d * Math.PI) / 180;

const shapePath = (sh: Shape, r: number, cx: number, cy: number) => {
  const P = (x: number, y: number) => `${(cx + x * r).toFixed(1)},${(cy + y * r).toFixed(1)}`;
  switch (sh) {
    case 'circle':
      return `M${cx - r},${cy} A${r},${r} 0 1 1 ${cx + r},${cy} A${r},${r} 0 1 1 ${cx - r},${cy}Z`;
    case 'octagon': {
      const pts = Array.from({ length: 8 }, (_, i) => P(Math.cos(rad(22.5 + 45 * i)), Math.sin(rad(22.5 + 45 * i))));
      return 'M' + pts.join(' L') + 'Z';
    }
    case 'shield':
      return `M${P(0, -1)} C${P(0.35, -0.85)} ${P(0.7, -0.85)} ${P(0.85, -0.8)} L${P(0.85, 0.1)} C${P(0.85, 0.65)} ${P(0.4, 0.9)} ${P(0, 1.05)} C${P(-0.4, 0.9)} ${P(-0.85, 0.65)} ${P(-0.85, 0.1)} L${P(-0.85, -0.8)} C${P(-0.7, -0.85)} ${P(-0.35, -0.85)} ${P(0, -1)}Z`;
    case 'crest':
      return `M${P(-0.85, -0.8)} L${P(-0.45, -1)} L${P(0, -0.84)} L${P(0.45, -1)} L${P(0.85, -0.8)} L${P(0.85, 0.1)} C${P(0.85, 0.65)} ${P(0.4, 0.9)} ${P(0, 1.08)} C${P(-0.4, 0.9)} ${P(-0.85, 0.65)} ${P(-0.85, 0.1)}Z`;
    case 'kite':
      return 'M' + [[0, -1.12], [0.92, -0.38], [0.78, 0.45], [0, 1.1], [-0.78, 0.45], [-0.92, -0.38]].map(([x, y]) => P(x, y)).join(' L') + 'Z';
  }
};

// Feuille / plume : forme d'amande tournée de `ang` degrés autour de (x, y)
const leafD = (x: number, y: number, L: number, ang: number, w = 0.34) => {
  const c = Math.cos(rad(ang)), s = Math.sin(rad(ang));
  const p = (lx: number, ly: number) => `${(x + lx * c - ly * s).toFixed(1)},${(y + lx * s + ly * c).toFixed(1)}`;
  return `M${p(0, 0)} C${p(L * 0.3, -L * w)} ${p(L * 0.8, -L * w * 0.85)} ${p(L, 0)} C${p(L * 0.8, L * w * 0.85)} ${p(L * 0.3, L * w)} ${p(0, 0)}Z`;
};

const starPts = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 === 0 ? r : r * 0.45;
    return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

const sparkD = (x: number, y: number, s: number) =>
  `M${x},${y - s} Q${x},${y} ${x + s},${y} Q${x},${y} ${x},${y + s} Q${x},${y} ${x - s},${y} Q${x},${y} ${x},${y - s}Z`;

// petit générateur pseudo-aléatoire stable (mêmes étincelles à chaque rendu)
const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/* ---------- composant ---------- */
type Props = { level: number; size?: number; locked?: boolean; glow?: boolean };

export default function Insignia({ level, size = 200, locked = false, glow = true }: Props) {
  const lv = Math.max(0, Math.min(TIERS.length - 1, level));
  const T = TIERS[lv];
  const t = lv / (TIERS.length - 1);
  const dia = T.mat === 'diamond' && !locked;
  const id = `ins${lv}${locked ? 'L' : ''}`;

  const cx = 500, cy = 525;
  const r = (112 + 78 * t) * (1.55 - 0.35 * t);

  const base = locked ? LOCKED : MATS[T.mat];
  const mid = base[2];
  const st = !locked && T.gloss < 1 ? base.map((c) => mix(c, mid, 1 - T.gloss)) : base;
  const op = dia ? 0.8 : 1;
  const fld = st.map((c) => (dia ? mix(c, '#1b2a5a', 0.55) : mix(c, '#000000', 0.55)));

  const lg = (name: string, stops: string[], o = 1) => (
    <LinearGradient id={`${id}${name}`} x1="0" y1="0" x2="1" y2="1">
      {stops.map((c, i) => <Stop key={i} offset={OFFS[i]} stopColor={c} stopOpacity={o} />)}
    </LinearGradient>
  );
  const MET = `url(#${id}met)`, METR = `url(#${id}metr)`, FLD = `url(#${id}fld)`;
  const LEAF = dia ? `url(#${id}crys)` : MET;

  const outer = shapePath(T.shape, r, cx, cy);
  const inner = shapePath(T.shape, r * 0.84, cx, cy);
  const inner2 = shapePath(T.shape, r * 0.76, cx, cy);

  /* ailes */
  const wings = (sgn: 1 | -1) => {
    const out: React.ReactNode[] = [];
    const rows = T.wings >= 7 ? [{ sc: 1, da: 0 }, { sc: 0.66, da: 10 }] : [{ sc: 1, da: 0 }];
    rows.forEach((row, ri) => {
      const n = ri === 0 ? T.wings : T.wings - 1;
      for (let q = 0; q < n; q++) {
        const f = q / Math.max(1, n - 1);
        const ang = 8 - f * (60 - row.da);
        const L = r * (1.25 - 0.45 * f) * row.sc;
        const px = cx + sgn * r * 0.74, py = cy - r * 0.1 - f * r * 0.05 + ri * r * 0.18;
        out.push(
          <Path key={`w${sgn}${ri}${q}`} d={leafD(px, py, L, sgn > 0 ? -ang : 180 + ang, 0.2)}
            fill={MET} stroke="rgba(255,255,255,0.45)" strokeWidth={1} />,
        );
      }
    });
    return out;
  };

  /* laurier */
  const laurel = (sgn: 1 | -1) => {
    const out: React.ReactNode[] = [];
    const rx = r, ry = r * 1.04;
    for (let u = 0; u < T.laurel; u++) {
      const f = u / (T.laurel - 1);
      const a = rad(sgn > 0 ? 100 - f * 115 : 80 + f * 115);
      const px = cx + rx * Math.cos(a), py = cy + ry * Math.sin(a);
      const dx = sgn > 0 ? rx * Math.sin(a) : -rx * Math.sin(a);
      const dy = sgn > 0 ? -ry * Math.cos(a) : ry * Math.cos(a);
      const tg = (Math.atan2(dy, dx) * 180) / Math.PI;
      const L = r * 0.46 * (1 - 0.2 * f);
      out.push(
        <Path key={`la${sgn}${u}`} d={leafD(px, py, L, tg - 32 * sgn, 0.36)} fill={MET} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />,
        <Path key={`lb${sgn}${u}`} d={leafD(px, py, L * 0.85, tg + 32 * sgn, 0.36)} fill={MET} stroke="rgba(255,255,255,0.4)" strokeWidth={1} />,
      );
    }
    return out;
  };

  /* étoiles */
  const starAngles = ({ 1: [-90], 3: [-90, -62, -118], 4: [-70, -110, -45, -135] } as Record<number, number[]>)[T.stars] ?? [];
  const starR = T.crown ? r * 1.62 : r * (T.stars === 1 ? 1.3 : 1.42);

  /* étincelles */
  const rnd = rng(lv * 5 + 1);
  const sparks = locked ? [] : Array.from({ length: 4 + lv * 2 }, () => ({
    x: cx + (rnd() * 3.2 - 1.6) * r, y: cy + (rnd() * 2.8 - 1.5) * r, s: 5 + rnd() * 7, o: 0.5 + rnd() * 0.45,
  }));
  const shards = dia ? Array.from({ length: 5 + (T.crown ? 5 : 0) }, () => ({
    x: cx + (rnd() * 3.4 - 1.7) * r, y: cy + (rnd() * 2.8 - 1.6) * r, s: 6 + rnd() * 8,
  })) : [];

  const er = r * 0.46, ey = cy - r * 0.12;       // disque central
  const numSize = er * (T.num.length > 1 ? 0.95 : 1.1);
  const unitSize = er * (T.unit.length >= 7 ? 0.2 : T.unit.length > 4 ? 0.26 : 0.3);
  const textFill = locked ? '#7b8aa5' : '#F1F5F9';
  const unitFill = locked ? '#5b6b87' : dia ? '#A5E3FF' : T.mat === 'gold' ? '#FFE27A' : T.mat === 'silver' ? '#E9EEF5' : '#F0B983';

  return (
    <Svg width={size} height={size} viewBox="0 0 1000 1000">
      <Defs>
        {lg('met', st, op)}
        <LinearGradient id={`${id}metr`} x1="0" y1="0" x2="1" y2="1">
          {[...st].reverse().map((c, i) => <Stop key={i} offset={OFFS[i]} stopColor={c} stopOpacity={op} />)}
        </LinearGradient>
        {lg('fld', fld)}
        <RadialGradient id={`${id}glow`} cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#34D399" stopOpacity={0.3 + 0.25 * t} />
          <Stop offset="0.55" stopColor="#14A38B" stopOpacity={0.1 + 0.1 * t} />
          <Stop offset="1" stopColor="#34D399" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id={`${id}crys`} cx="0.3" cy="0.3" r="1">
          <Stop offset="0" stopColor="#FFFFFF" /><Stop offset="0.4" stopColor="#A5E3FF" />
          <Stop offset="0.8" stopColor="#8B9BFF" /><Stop offset="1" stopColor="#C084FC" />
        </RadialGradient>
        <LinearGradient id={`${id}irid`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#67E8F9" stopOpacity={0.5} />
          <Stop offset="0.5" stopColor="#A78BFA" stopOpacity={0.25} />
          <Stop offset="1" stopColor="#F9A8D4" stopOpacity={0.45} />
        </LinearGradient>
        <RadialGradient id={`${id}ray`} cx={cx} cy={cy} r={460} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
          <Stop offset="0.55" stopColor="#FFFFFF" stopOpacity={0.6} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id={`${id}shine`} x1="0" y1="0" x2="0.6" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.55} />
          <Stop offset="0.45" stopColor="#FFFFFF" stopOpacity={0} />
        </LinearGradient>
      </Defs>

      {/* lueur douce derrière */}
      {glow && !locked && <Circle cx={cx} cy={cy} r={330 + 240 * t} fill={`url(#${id}glow)`} />}

      {/* rayons (dernier palier) */}
      {T.crown && !locked && [-80, -60, -40, -20, 0, 20, 40, 60, 80].map((a) => {
        const ra = rad(a - 90), nx = -Math.sin(ra) * 18, ny = Math.cos(ra) * 18;
        // Rayons plus courts que le dessin et qui s'estompent vers le bout : pas de coupure nette au bord
        const x2 = cx + 460 * Math.cos(ra), y2 = cy + 460 * Math.sin(ra);
        return <Polygon key={a} points={`${cx + nx * 0.2},${cy + ny * 0.2} ${x2 + nx},${y2 + ny} ${x2 - nx},${y2 - ny} ${cx - nx * 0.2},${cy - ny * 0.2}`} fill={`url(#${id}ray)`} opacity={0.16} />;
      })}

      {T.wings > 0 && <G>{wings(1)}{wings(-1)}</G>}
      {T.laurel > 0 && <G>{laurel(1)}{laurel(-1)}</G>}

      {/* corps de l'insigne */}
      <Path d={outer} fill={MET} stroke="rgba(255,255,255,0.65)" strokeWidth={2.5} strokeLinejoin="round" />
      <Path d={outer} fill={`url(#${id}shine)`} />
      <Path d={inner} fill={METR} stroke="rgba(0,0,0,0.4)" strokeWidth={2} strokeLinejoin="round" />
      <Path d={inner2} fill={FLD} stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} strokeLinejoin="round" />
      {dia && <Path d={outer} fill={`url(#${id}irid)`} opacity={0.7} />}

      {/* rivets (rond et octogone) */}
      {(T.shape === 'circle' || T.shape === 'octagon') && [30, 90, 150, 210, 270, 330].map((a) => (
        <Circle key={a} cx={cx + r * 0.92 * Math.cos(rad(a))} cy={cy + r * 0.92 * Math.sin(rad(a))} r={r * 0.035} fill={METR} stroke="rgba(0,0,0,0.4)" strokeWidth={1} />
      ))}

      {/* disque central + TEXTE DU PALIER */}
      <Circle cx={cx} cy={ey} r={er} fill="#04141A" stroke={MET} strokeWidth={r * 0.05} />
      <Circle cx={cx} cy={ey} r={er * 0.88} fill="#0A2A2A" opacity={0.8} />
      <Circle cx={cx} cy={ey + er * 0.1} r={er * 0.8} fill="#34D399" opacity={locked ? 0 : 0.13} />
      <SvgText x={cx} y={ey + numSize * 0.2} fontSize={numSize} fontWeight="800" fill={textFill} textAnchor="middle" fontFamily="PlusJakartaSans_800ExtraBold">
        {T.num}
      </SvgText>
      <SvgText x={cx} y={ey + er * 0.66} fontSize={unitSize} fontWeight="700" letterSpacing={unitSize * 0.12} fill={unitFill} textAnchor="middle" fontFamily="PlusJakartaSans_700Bold">
        {T.unit}
      </SvgText>

      {/* chevrons de grade */}
      {Array.from({ length: T.chevrons }, (_, c) => {
        const y = cy + r * 0.5 + c * r * 0.16;
        const d = `M${cx - r * 0.42},${y} L${cx},${y + r * 0.2} L${cx + r * 0.42},${y}`;
        return (
          <G key={c}>
            <Path d={d} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={r * 0.1} strokeLinecap="round" strokeLinejoin="round" />
            <Path d={d} fill="none" stroke={MET} strokeWidth={r * 0.07} strokeLinecap="round" strokeLinejoin="round" />
          </G>
        );
      })}

      {/* étoiles */}
      {starAngles.map((a) => (
        <Polygon key={a} points={starPts(cx + starR * Math.cos(rad(a)), cy + starR * Math.sin(rad(a)) * 0.95 + r * 0.05, r * 0.11 + 4)}
          fill={dia ? `url(#${id}crys)` : MET} stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
      ))}

      {/* couronne (1 an) */}
      {T.crown && (() => {
        const y0 = cy - r;
        const d = `M${cx - r * 0.42},${y0} L${cx - r * 0.5},${y0 - r * 0.38} L${cx - r * 0.24},${y0 - r * 0.2} L${cx},${y0 - r * 0.5} L${cx + r * 0.24},${y0 - r * 0.2} L${cx + r * 0.5},${y0 - r * 0.38} L${cx + r * 0.42},${y0}Z`;
        return (
          <G>
            <Path d={d} fill={`url(#${id}crys)`} stroke="rgba(255,255,255,0.85)" strokeWidth={2} />
            {[[0, -0.5], [-0.5, -0.38], [0.5, -0.38]].map(([gx, gy], i) => (
              <Circle key={i} cx={cx + gx * r} cy={y0 + gy * r} r={r * 0.05} fill="#34D399" stroke="#FFFFFF" strokeWidth={1} />
            ))}
          </G>
        );
      })()}

      {/* étincelles et éclats */}
      {sparks.map((s, i) => <Path key={`s${i}`} d={sparkD(s.x, s.y, s.s)} fill="#FFFFFF" opacity={s.o} />)}
      {shards.map((s, i) => (
        <Polygon key={`d${i}`} points={`${s.x},${s.y - s.s} ${s.x + s.s * 0.7},${s.y} ${s.x},${s.y + s.s * 1.2} ${s.x - s.s * 0.7},${s.y}`}
          fill={`url(#${id}crys)`} opacity={0.85} stroke="rgba(255,255,255,0.7)" strokeWidth={1} />
      ))}
    </Svg>
  );
}
