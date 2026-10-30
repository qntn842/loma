import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, View } from "react-native";

import { alpha } from "@/theme/color";
import { useTheme } from "@/theme/ThemeProvider";
import { Icon, IconName } from "./Icon";
import { Text, Tone } from "./Text";

type Variant = "primary" | "secondary" | "doux" | "ghost" | "sos" | "premium";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  small?: boolean;
  className?: string;
};

/** Bouton en pilule. "primary" = pastille menthe avec une lueur verte douce dessous. */
export function Button({ label, onPress, variant = "primary", icon, disabled, loading, small, className = "" }: Props) {
  const { colors } = useTheme();
  const height = small ? 44 : 54;

  const textTone: Tone =
    variant === "primary" ? "boutonTexte" : variant === "sos" ? "texteSurSos" : variant === "premium" ? "texteSurPremium" : variant === "ghost" ? "texteSecondaire" : "texte";

  const background =
    variant === "primary" ? (
      <LinearGradient
        colors={colors.bouton}
        locations={colors.bouton.length === 3 ? [0, 0.6, 1] : undefined}
        start={{ x: 0, y: 0.41 }}
        end={{ x: 1, y: 0.59 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
    ) : variant === "doux" ? (
      <LinearGradient
        colors={colors.boutonDoux}
        start={{ x: 0, y: 0.41 }}
        end={{ x: 1, y: 0.59 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
    ) : variant === "secondary" ? (
      <LinearGradient
        colors={colors.carte}
        start={{ x: 0.33, y: 0 }}
        end={{ x: 0.67, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
    ) : null;

  const solid = variant === "sos" ? colors.sos : variant === "premium" ? colors.premium : "transparent";
  const border =
    variant === "primary" ? colors.boutonBordure : variant === "secondary" ? colors.bordure : variant === "doux" ? colors.boutonBordure : "transparent";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`${disabled ? "opacity-40" : "active:opacity-80"} ${className}`}
      style={variant === "primary" && !disabled ? { borderRadius: 999, boxShadow: `0 8px 24px ${alpha(colors.accent, 0.35)}` } : undefined}
    >
      <View
        style={{
          height,
          borderRadius: 999,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: border,
          backgroundColor: solid,
          paddingHorizontal: small ? 18 : 24,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {background}
        {loading ? (
          <ActivityIndicator color={colors[textTone]} />
        ) : (
          <View className="flex-row items-center gap-2">
            {icon && <Icon name={icon} size={small ? 16 : 18} tone={textTone} />}
            <Text weight="semi" tone={textTone} style={{ fontSize: small ? 14 : 16 }}>
              {label}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
