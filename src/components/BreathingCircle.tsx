import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { t } from "@/i18n";
import { alpha } from "@/theme/color";
import { useTheme } from "@/theme/ThemeProvider";
import { Icon } from "./ui/Icon";
import { Text } from "./ui/Text";

// Inspire 4 s, retiens 4 s, expire 6 s
const phases = [
  { id: "inspire", seconds: 4, scale: 1 },
  { id: "retiens", seconds: 4, scale: 1 },
  { id: "expire", seconds: 6, scale: 0.55 },
] as const;

const SIZE = 220;

/** Cercle de respiration animé */
export function BreathingCircle() {
  const { colors } = useTheme();
  // Phase en cours et secondes restantes, avancées une fois par seconde
  const [{ index, left }, setState] = useState({ index: 0, left: phases[0].seconds as number });
  const scale = useSharedValue(0.55);

  const phase = phases[index];

  useEffect(() => {
    const tick = setInterval(
      () =>
        setState((s) => {
          if (s.left > 1) return { ...s, left: s.left - 1 };
          const next = (s.index + 1) % phases.length;
          return { index: next, left: phases[next].seconds };
        }),
      1000,
    );
    return () => clearInterval(tick);
  }, []);

  // Le cercle grandit ou rétrécit pendant toute la durée de la phase
  useEffect(() => {
    scale.value = withTiming(phase.scale, { duration: phase.seconds * 1000, easing: Easing.inOut(Easing.quad) });
  }, [phase, scale]);

  const circle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={{ width: SIZE, height: SIZE }} className="items-center justify-center self-center">
      <View
        style={{ position: "absolute", width: SIZE, height: SIZE, borderRadius: SIZE / 2, borderWidth: 2, borderColor: colors.bordure }}
      />
      <Animated.View
        style={[
          { position: "absolute", width: SIZE, height: SIZE, borderRadius: SIZE / 2, backgroundColor: alpha(colors.accent, 0.25) },
          circle,
        ]}
      />
      <Animated.View
        style={[
          { position: "absolute", width: SIZE * 0.7, height: SIZE * 0.7, borderRadius: SIZE, backgroundColor: colors.accent },
          circle,
        ]}
      />
      <Text weight="semi" tone="texteSurAccent" className="text-2xl">
        {t.sos.phases[phase.id]}
      </Text>
      <Text weight="medium" tone="texteSurAccent" className="text-base">
        {left}
      </Text>
    </View>
  );
}

/** Cercle au repos : la respiration ne démarre qu'après un appui */
export function BreathingStart({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t.sos.demarrer}
      style={{ width: SIZE, height: SIZE }}
      className="items-center justify-center self-center active:opacity-80"
    >
      <View
        style={{ position: "absolute", width: SIZE, height: SIZE, borderRadius: SIZE / 2, borderWidth: 2, borderColor: colors.bordure }}
      />
      <View
        style={{ position: "absolute", width: SIZE * 0.8, height: SIZE * 0.8, borderRadius: SIZE, backgroundColor: alpha(colors.accent, 0.25) }}
      />
      <View
        style={{ position: "absolute", width: SIZE * 0.6, height: SIZE * 0.6, borderRadius: SIZE, backgroundColor: colors.accent }}
      />
      <Icon name="play" size={22} tone="texteSurAccent" />
      <Text weight="semi" tone="texteSurAccent" className="text-xl">
        {t.sos.demarrer}
      </Text>
      <Text weight="medium" tone="texteSurAccent" className="text-xs opacity-80">
        {t.sos.respirer}
      </Text>
    </Pressable>
  );
}
