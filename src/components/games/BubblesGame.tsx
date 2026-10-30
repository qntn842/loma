import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

import { t } from "@/i18n";
import { alpha } from "@/theme/color";
import { useTheme } from "@/theme/ThemeProvider";
import { Text } from "../ui/Text";

type Bubble = { id: number; x: number; y: number; size: number; born: number };

const AREA_HEIGHT = 380;
const LIFETIME = 2600;

/** Éclate les bulles avant qu'elles disparaissent */
export function BubblesGame() {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!width) return;
    let id = 0;
    const timer = setInterval(() => {
      const size = 48 + Math.random() * 36;
      const now = Date.now();
      setBubbles((list) => [
        ...list.filter((b) => now - b.born < LIFETIME),
        { id: id++, size, born: now, x: Math.random() * (width - size), y: Math.random() * (AREA_HEIGHT - size) },
      ]);
    }, 650);
    return () => clearInterval(timer);
  }, [width]);

  return (
    <View className="gap-3">
      <Text weight="semi" tone="accentClair" className="text-center text-2xl">
        {t.miniJeux.bulles.score(score)}
      </Text>
      <View
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        className="overflow-hidden rounded-[26px]"
        style={{ height: AREA_HEIGHT, borderWidth: 1, borderColor: colors.bordure, backgroundColor: colors.carte[1] }}
      >
        {bubbles.map((b) => (
          <Animated.View
            key={b.id}
            entering={ZoomIn.duration(250)}
            exiting={ZoomOut.duration(150)}
            style={{ position: "absolute", left: b.x, top: b.y }}
          >
            <Pressable
              onPressIn={() => {
                setScore((s) => s + 1);
                setBubbles((list) => list.filter((x) => x.id !== b.id));
              }}
              accessibilityLabel="Bulle"
              style={{
                width: b.size,
                height: b.size,
                borderRadius: b.size / 2,
                backgroundColor: alpha(colors.accent, 0.3),
                borderWidth: 2,
                borderColor: colors.accent,
              }}
            />
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
