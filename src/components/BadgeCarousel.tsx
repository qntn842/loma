import { BlurView } from "expo-blur";
import { ComponentRef, useRef } from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { useLayout } from "@/hooks/useLayout";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

import { alpha } from "@/theme/color";
import { useTheme } from "@/theme/ThemeProvider";
import type { Metal } from "@/theme/palettes";
import type { BadgeState } from "./Badge";
import Insignia from "./Insignia";
import { Icon } from "./ui/Icon";
import { ProgressBar } from "./ui/ProgressBar";
import { Text } from "./ui/Text";

/** Agrandissement de l'insigne par rapport à sa place dans le carrousel */
const INSIGNIA_ZOOM = 1.4;

export type CarouselItem = { id: string; valeur: string; unite: string; libelle: string; etat: BadgeState; metal: Metal };

type Props = {
  items: CarouselItem[];
  index: number;
  onIndexChange: (i: number) => void;
  onPressCenter?: (i: number) => void;
  /** Taille du badge central (sur un écran de 390 px, adaptée ensuite à la largeur) */
  size?: number;
  height?: number;
  /** Progression vers la médaille du centre : barre (0 → 1) + texte à gauche et à droite */
  progress?: { value: number; left: string; right: string };
};

/**
 * Carrousel d'insignes : celle du centre est grande, avec sa lueur et sa barre de progression.
 * Les voisins sont plus petits, flous et transparents. On glisse pour naviguer.
 */
export function BadgeCarousel({ items, index, onIndexChange, onPressCenter, size: baseSize = 220, height: baseHeight = 290, progress }: Props) {
  const { contentWidth: width, scale } = useLayout();
  const size = Math.round(baseSize * scale);
  const height = Math.round(baseHeight * scale);
  const itemWidth = size * 0.85;
  const sidePadding = (width - itemWidth) / 2;
  const scrollX = useSharedValue(index * itemWidth);
  const ref = useRef<ComponentRef<typeof Animated.ScrollView>>(null);

  // La médaille du centre change dès qu'on glisse (pas seulement quand le défilement s'arrête)
  const centered = useSharedValue(index);
  const last = items.length - 1;
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
    const i = Math.max(0, Math.min(last, Math.round(e.contentOffset.x / itemWidth)));
    if (i !== centered.value) {
      centered.value = i;
      scheduleOnRN(onIndexChange, i);
    }
  });

  const goTo = (i: number) => ref.current?.scrollTo({ x: i * itemWidth, animated: true });

  return (
    <View style={{ height, marginHorizontal: -20 }}>
      {/* Barre de progression vers la médaille du centre (temps sans fumer / objectif) */}
      {progress && (
        <View pointerEvents="none" style={{ position: "absolute", bottom: 6, left: 0, right: 0, alignItems: "center" }}>
          <View style={{ width: size * 0.9, gap: 6 }}>
            <ProgressBar progress={progress.value} />
            <View className="flex-row justify-between">
              <Text weight="semi" tone="accentClair" className="text-xs">
                {progress.left}
              </Text>
              <Text weight="semi" tone="texteSecondaire" className="text-xs">
                {progress.right}
              </Text>
            </View>
          </View>
        </View>
      )}

      <Animated.ScrollView
        ref={ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: sidePadding, alignItems: "center" }}
        onLayout={() => ref.current?.scrollTo({ x: index * itemWidth, animated: false })}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
          onIndexChange(Math.max(0, Math.min(items.length - 1, i)));
        }}
      >
        {items.map((item, i) => (
          <CarouselSlot
            key={item.id}
            i={i}
            scrollX={scrollX}
            itemWidth={itemWidth}
            height={height}
            onPress={() => (i === index ? onPressCenter?.(i) : goTo(i))}
          >
            {/* L'insigne a beaucoup de marge transparente : on le dessine plus grand que sa place */}
            <GlowingInsignia level={i} size={Math.round(size * INSIGNIA_ZOOM)} locked={item.etat !== "debloque"} glowSize={height} />
          </CarouselSlot>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

function CarouselSlot({
  i,
  scrollX,
  itemWidth,
  height,
  onPress,
  children,
}: {
  i: number;
  scrollX: SharedValue<number>;
  itemWidth: number;
  height: number;
  onPress: () => void;
  children: React.ReactNode;
}) {
  const tint = useTheme().name === "sombre" ? "dark" : "light";
  const range = [(i - 1) * itemWidth, i * itemWidth, (i + 1) * itemWidth];

  const slotStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, range, [0.45, 1, 0.45], Extrapolation.CLAMP),
    transform: [
      { scale: interpolate(scrollX.value, range, [0.6, 1, 0.6], Extrapolation.CLAMP) },
      { translateY: interpolate(scrollX.value, range, [10, -14, 10], Extrapolation.CLAMP) },
    ],
  }));
  // Flou des voisins (seulement sur iPhone, le flou Android est trop coûteux)
  const blurStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, range, [1, 0, 1], Extrapolation.CLAMP),
  }));

  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={{ width: itemWidth, height, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={slotStyle}>
        {children}
        {Platform.OS === "ios" && (
          <Animated.View pointerEvents="none" style={[{ position: "absolute", top: -10, left: -10, right: -10, bottom: -10 }, blurStyle]}>
            <BlurView intensity={14} tint={tint} style={{ flex: 1 }} />
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

/**
 * Insigne avec une lueur ronde derrière. La lueur intégrée à l'insigne déborde de son dessin
 * et se retrouve coupée en carré : on la remplace par un halo qui s'efface avant les bords.
 */
export function GlowingInsignia({ level, size, locked, glowSize = size }: { level: number; size: number; locked: boolean; glowSize?: number }) {
  const { colors } = useTheme();
  const id = `halo${level}`;
  const lockSize = Math.max(22, Math.round(size * 0.13));
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      {!locked && (
        <Svg width={glowSize} height={glowSize} style={{ position: "absolute" }} pointerEvents="none">
          <Defs>
            <RadialGradient id={id} cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={colors.accent} stopOpacity={0.3 + (0.25 * level) / 7} />
              <Stop offset="0.55" stopColor={colors.accent} stopOpacity={0.08 + (0.08 * level) / 7} />
              <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={glowSize / 2} cy={glowSize / 2} r={glowSize / 2} fill={`url(#${id})`} />
        </Svg>
      )}
      {/* position relative : sur le web, sinon le halo (absolu) passerait devant l'insigne */}
      {/* Toujours en couleur ; pas encore débloqué = un peu estompé, avec un cadenas */}
      <View style={{ position: "relative", opacity: locked ? 0.7 : 1 }}>
        <Insignia level={level} size={size} glow={false} />
      </View>
      {locked && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: size * 0.68,
            width: lockSize,
            height: lockSize,
            borderRadius: lockSize / 2,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: alpha(colors.fond, 0.85),
            borderWidth: 1,
            borderColor: alpha(colors.texte, 0.35),
          }}
        >
          <Icon name="lock" size={Math.round(lockSize * 0.5)} />
        </View>
      )}
    </View>
  );
}

/** Points de pagination : le point actif est allongé, en couleur accent */
export function Dots({ count, active }: { count: number; active: number }) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center justify-center gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            width: i === active ? 18 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: i === active ? colors.accent : colors.bordure,
          }}
        />
      ))}
    </View>
  );
}
