import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useTheme } from "@/theme/ThemeProvider";

type Props = {
  progress: number; // 0 → 1
  variant?: "accent" | "premium";
  className?: string;
};

/** Barre de progression fine */
export function ProgressBar({ progress, variant = "accent", className = "" }: Props) {
  const { colors } = useTheme();
  const width = useSharedValue(0);
  const p = Math.max(0, Math.min(1, progress || 0));

  useEffect(() => {
    width.value = withTiming(p, { duration: 700 });
  }, [p, width]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${width.value * 100}%` }));

  return (
    <View className={`h-1.5 overflow-hidden rounded-full ${className}`} style={{ backgroundColor: colors.bordure }}>
      <Animated.View
        style={[
          { height: "100%", borderRadius: 999, backgroundColor: variant === "premium" ? colors.premium : colors.accent },
          fillStyle,
        ]}
      />
    </View>
  );
}
