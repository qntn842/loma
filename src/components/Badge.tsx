import { useEffect, useId } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Stop } from "react-native-svg";

import { badgeColors } from "@/theme/palettes";
import { useTheme } from "@/theme/ThemeProvider";
import { Icon, IconName } from "./ui/Icon";
import { fontFamily } from "./ui/Text";

export type BadgeState = "debloque" | "verrouille" | "prochain";

type Props = {
  valeur?: string;
  libelle?: string;
  etat?: BadgeState;
  /** Largeur en pixels (la hauteur suit : viewBox 200 × 210) */
  taille?: number;
  couleur?: "menthe" | "or";
  /** Icône au centre à la place du chiffre */
  icone?: IconName;
  /** Flottaison + lueur qui respire (désactiver dans les grilles) */
  anime?: boolean;
};

const CX = 100;
const CY = 105;

/** Sommets d'un hexagone pointe en haut */
function vertices(r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + 60 * i) * Math.PI) / 180;
    return [CX + r * Math.cos(a), CY + r * Math.sin(a)] as const;
  });
}

/** Hexagone aux coins arrondis (chemin SVG) */
function roundedHexagon(r: number, corner: number) {
  const pts = vertices(r);
  let d = "";
  pts.forEach((p, i) => {
    const prev = pts[(i + 5) % 6];
    const next = pts[(i + 1) % 6];
    const toward = (q: readonly [number, number]) => {
      const dx = q[0] - p[0];
      const dy = q[1] - p[1];
      const len = Math.hypot(dx, dy);
      return `${p[0] + (dx / len) * corner} ${p[1] + (dy / len) * corner}`;
    };
    d += `${i === 0 ? "M" : "L"}${toward(prev)} Q${p[0]} ${p[1]} ${toward(next)} `;
  });
  return d + "Z";
}

/** Petite étincelle à 4 branches */
function sparkle(x: number, y: number, s: number) {
  return `M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s}Z`;
}

const OUTER = roundedHexagon(88, 16);
const INNER = roundedHexagon(78, 13);
const FACETS = vertices(78).map((p, i, all) => {
  const q = all[(i + 1) % 6];
  return `M${CX} ${CY} L${p[0]} ${p[1]} L${q[0]} ${q[1]}Z`;
});
// Facettes alternées claires / sombres (effet pierre taillée)
const FACET_STYLE = [
  { color: badgeColors.blanc, opacity: 0.2 },
  { color: badgeColors.sombre, opacity: 0.06 },
  { color: badgeColors.sombre, opacity: 0.16 },
  { color: badgeColors.blanc, opacity: 0.03 },
  { color: badgeColors.sombre, opacity: 0.1 },
  { color: badgeColors.blanc, opacity: 0.12 },
];

/**
 * Badge de palier : hexagone en verre taillé, lumineux quand il est débloqué.
 * Toutes les couches sont dessinées en SVG (comme une illustration vectorielle sur le web).
 */
export function Badge({ valeur, libelle, etat = "debloque", taille = 200, couleur = "menthe", icone, anime = true }: Props) {
  const { name } = useTheme();
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const unlocked = etat === "debloque";
  const palette = unlocked ? badgeColors[couleur] : badgeColors.verrouille;
  const scale = taille / 200;
  const height = taille * 1.05;

  // Flottaison lente (8 px, 5 s) et lueur qui respire
  const float = useSharedValue(0);
  useEffect(() => {
    if (unlocked && anime) {
      float.value = withRepeat(withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) }), -1, true);
    }
  }, [unlocked, anime, float]);
  const floatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -8 * float.value * scale }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: 0.65 + 0.35 * float.value }));

  const glowSize = taille * 1.5;
  const textColor = unlocked ? badgeColors.chiffre : badgeColors.chiffreVerrouille;

  return (
    <View style={{ width: taille, height, alignItems: "center", justifyContent: "center" }}>
      {/* Lueur verte autour (en clair : ombre grise douce) */}
      {unlocked && (
        <Animated.View
          pointerEvents="none"
          style={[{ position: "absolute", width: glowSize, height: glowSize, left: (taille - glowSize) / 2, top: (height - glowSize) / 2 }, glowStyle]}
        >
          <Svg width={glowSize} height={glowSize}>
            <Defs>
              <RadialGradient id={`${id}glow`} cx="50%" cy="50%" r="50%">
                <Stop offset="0.35" stopColor={name === "sombre" ? palette.lueur : badgeColors.sombre} stopOpacity={name === "sombre" ? 1 : 0.12} />
                <Stop offset="1" stopColor={name === "sombre" ? palette.lueur : badgeColors.sombre} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={glowSize / 2} cy={glowSize / 2} r={glowSize / 2} fill={`url(#${id}glow)`} />
          </Svg>
        </Animated.View>
      )}

      <Animated.View style={[{ width: taille, height }, floatStyle]}>
        <Svg width={taille} height={height} viewBox="0 0 200 210">
          <Defs>
            <LinearGradient id={`${id}bord`} x1="0.15" y1="0" x2="0.85" y2="1">
              {palette.bord.map((c, i) => (
                <Stop key={c} offset={i / (palette.bord.length - 1)} stopColor={c} />
              ))}
            </LinearGradient>
            <RadialGradient id={`${id}centre`} cx="30%" cy="22%" r="95%">
              {palette.centre.map((c, i) => (
                <Stop key={c} offset={i / (palette.centre.length - 1)} stopColor={c} />
              ))}
            </RadialGradient>
            <RadialGradient id={`${id}cyan`} cx="22%" cy="18%" r="60%">
              <Stop offset="0" stopColor={badgeColors.irise.cyan} stopOpacity={0.55} />
              <Stop offset="1" stopColor={badgeColors.irise.cyan} stopOpacity={0} />
            </RadialGradient>
            <LinearGradient id={`${id}violet`} x1="0" y1="0.4" x2="0" y2="1">
              <Stop offset="0" stopColor={badgeColors.irise.violet} stopOpacity={0} />
              <Stop offset="1" stopColor={badgeColors.irise.violet} stopOpacity={0.35} />
            </LinearGradient>
            <RadialGradient id={`${id}rose`} cx="88%" cy="85%" r="45%">
              <Stop offset="0" stopColor={badgeColors.irise.rose} stopOpacity={0.3} />
              <Stop offset="1" stopColor={badgeColors.irise.rose} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient id={`${id}reflet`} cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={badgeColors.blanc} stopOpacity={0.42} />
              <Stop offset="1" stopColor={badgeColors.blanc} stopOpacity={0} />
            </RadialGradient>
          </Defs>

          {/* 1. Bord */}
          <Path d={OUTER} fill={`url(#${id}bord)`} />
          {/* 2. Centre */}
          <Path d={INNER} fill={`url(#${id}centre)`} />
          {/* 3. Voile irisé */}
          {unlocked && (
            <G>
              <Path d={INNER} fill={`url(#${id}cyan)`} />
              <Path d={INNER} fill={`url(#${id}violet)`} />
              <Path d={INNER} fill={`url(#${id}rose)`} />
            </G>
          )}
          {/* 4. Facettes */}
          {FACETS.map((d, i) => (
            <Path key={i} d={d} fill={FACET_STYLE[i].color} fillOpacity={FACET_STYLE[i].opacity * (unlocked ? 1 : 0.6)} />
          ))}
          {/* 5. Disque central */}
          <Circle cx={CX} cy={CY} r={45} fill={badgeColors.disque} stroke={badgeColors.disqueContour} strokeWidth={1.5} />
          {/* 6. Reflet + étincelles */}
          {unlocked && (
            <G>
              <Ellipse cx={70} cy={56} rx={30} ry={13} fill={`url(#${id}reflet)`} transform="rotate(-32 70 56)" />
              <Path d={sparkle(152, 50, 9)} fill={badgeColors.blanc} fillOpacity={0.9} />
              <Path d={sparkle(52, 160, 6)} fill={badgeColors.blanc} fillOpacity={0.75} />
            </G>
          )}
        </Svg>

        {/* Chiffre et libellé, posés sur le disque central */}
        <View
          pointerEvents="none"
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}
        >
          {icone ? (
            <Icon name={icone} size={40 * scale} color={textColor} strokeWidth={2} />
          ) : (
            <Animated.Text
              style={{ fontFamily: fontFamily("black"), fontSize: 44 * scale, lineHeight: 50 * scale, color: textColor }}
            >
              {valeur}
            </Animated.Text>
          )}
          {!unlocked ? (
            <View style={{ marginTop: 2 * scale }}>
              <Icon name="lock" size={Math.max(10, 13 * scale)} color={textColor} strokeWidth={2} />
            </View>
          ) : (
            libelle && (
              <Animated.Text
                style={{
                  fontFamily: fontFamily("bold"),
                  fontSize: Math.max(7, 9 * scale),
                  letterSpacing: 1.4 * scale,
                  color: textColor,
                  opacity: 0.85,
                  textTransform: "uppercase",
                }}
              >
                {libelle}
              </Animated.Text>
            )
          )}
        </View>
      </Animated.View>
    </View>
  );
}
