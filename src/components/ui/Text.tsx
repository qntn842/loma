import { Text as RNText, TextProps } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import type { Palette } from "@/theme/palettes";

// Sur mobile, chaque graisse de police est un fichier différent :
// on choisit la police avec `weight` au lieu de font-bold.
// Style : gros chiffres en 600 (semi), titres en 700 (bold).
const fonts = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semi: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  black: "PlusJakartaSans_800ExtraBold",
} as const;

export type Weight = keyof typeof fonts;
/** Rôles de couleur « pleins » du thème */
export type Tone = { [K in keyof Palette]: Palette[K] extends string ? K : never }[keyof Palette];

export const fontFamily = (w: Weight) => fonts[w];

type Props = TextProps & {
  weight?: Weight;
  /** Rôle de couleur du thème (texte par défaut) */
  tone?: Tone;
  className?: string;
};

/** À utiliser à la place de <Text> de React Native (comme un <p> stylé par défaut). */
export function Text({ weight = "regular", tone = "texte", style, ...rest }: Props) {
  const { colors } = useTheme();
  return <RNText {...rest} style={[{ fontFamily: fonts[weight], color: colors[tone] }, style]} />;
}

/** Petit libellé gris en majuscules (11 px, lettres espacées) */
export function Label({ children, tone = "texteSecondaire", className = "", center }: { children: React.ReactNode; tone?: Tone; className?: string; center?: boolean }) {
  return (
    <Text
      weight="semi"
      tone={tone}
      className={className}
      style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", textAlign: center ? "center" : undefined }}
    >
      {children}
    </Text>
  );
}
