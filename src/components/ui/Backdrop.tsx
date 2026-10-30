import { useWindowDimensions, View } from "react-native";
import Svg, { Defs, Ellipse, RadialGradient, Stop } from "react-native-svg";

import { useTheme } from "@/theme/ThemeProvider";

/** Fond de l'écran avec UNE lueur douce qui part du haut (verte, ou rose pour le SOS) */
export function Backdrop({ tone = "accent" }: { tone?: "accent" | "sos" }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const glow = tone === "sos" ? colors.lueurSos : colors.lueurFond;
  const height = 460;

  return (
    <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.fond }}>
      {glow !== "transparent" && (
        <Svg width={width} height={height}>
          <Defs>
            <RadialGradient id="lueur" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={glow} stopOpacity={1} />
              <Stop offset="1" stopColor={glow} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={width / 2} cy={0} rx={width * 0.9} ry={height} fill="url(#lueur)" />
        </Svg>
      )}
    </View>
  );
}
