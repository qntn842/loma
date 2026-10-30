import { ReactNode } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";

/** Apparition douce d'une carte (glisse vers le haut en fondu). `index` décale chaque carte. */
export function Appear({ children, index = 0 }: { children: ReactNode; index?: number }) {
  return <Animated.View entering={FadeInDown.delay(index * 70).duration(400)}>{children}</Animated.View>;
}
