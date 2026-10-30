import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";

type Props = {
  children?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  /** Contour couleur accent (élément choisi, formule mise en avant) */
  highlighted?: boolean;
  /** "accent" = carte pleine couleur accent */
  variant?: "verre" | "accent";
  radius?: number;
  padding?: number;
  accessibilityLabel?: string;
};

/**
 * Carte en « verre » : dégradé teinté à 160°, contour très fin et trait de lumière en haut.
 * (Équivalent d'une div avec background: linear-gradient + border + inset shadow en CSS.)
 */
export function Glass({
  children,
  className = "",
  style,
  onPress,
  highlighted,
  variant = "verre",
  radius = 26,
  padding = 20,
  accessibilityLabel,
}: Props) {
  const { colors } = useTheme();
  const gradient = variant === "accent" ? ([colors.accent, colors.accent] as const) : colors.carte;
  const borderColor = highlighted ? colors.accent : variant === "accent" ? colors.accent : colors.bordure;

  const content = (
    <View style={[{ borderRadius: radius, borderWidth: highlighted ? 1.5 : 1, borderColor, overflow: "hidden" }, style]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0.33, y: 0 }}
        end={{ x: 0.67, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {/* Reflet : trait de lumière en haut de la carte */}
      <LinearGradient
        colors={["transparent", colors.reflet, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ position: "absolute", top: 0, left: 16, right: 16, height: 1 }}
      />
      <View className={className} style={{ padding }}>
        {children}
      </View>
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} className="active:opacity-80">
      {content}
    </Pressable>
  );
}

/** Trait fin horizontal (séparateur) */
export function Hairline({ className = "" }: { className?: string }) {
  const { colors } = useTheme();
  return <View className={className} style={{ height: 1, backgroundColor: colors.bordure }} />;
}
