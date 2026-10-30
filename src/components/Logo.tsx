import { Image, View } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

import { alpha } from "@/theme/color";
import { useTheme } from "@/theme/ThemeProvider";

/** Logo de l'app « Loma » : icône carrée aux coins arrondis, contour vert fin et halo vert derrière */
export function Logo({ size }: { size: number }) {
  const { colors } = useTheme();
  const halo = size * 1.8;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {/* Halo vert rond derrière le carré */}
      <Svg width={halo} height={halo} style={{ position: "absolute" }} pointerEvents="none">
        <Defs>
          <RadialGradient id="logoHalo" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={colors.accent} stopOpacity={0.45} />
            <Stop offset="0.5" stopColor={colors.accent} stopOpacity={0.15} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect width={halo} height={halo} fill="url(#logoHalo)" />
      </Svg>
      <View
        style={{
          position: "relative",
          width: size,
          height: size,
          borderRadius: size * 0.22,
          overflow: "hidden",
          borderWidth: 1.5,
          borderColor: alpha(colors.accent, 0.5),
        }}
      >
        <Image source={require("../../assets/images/logo-loma.png")} style={{ width: "100%", height: "100%" }} accessibilityLabel="Loma" />
      </View>
    </View>
  );
}
