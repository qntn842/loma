import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import type { BottomTabBarProps } from "expo-router/tabs";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

import { t } from "@/i18n";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { MAX_CONTENT_WIDTH } from "@/hooks/useLayout";
import { useTheme } from "@/theme/ThemeProvider";
import { Icon, IconName } from "./ui/Icon";
import { Text } from "./ui/Text";

const tabs: Record<string, { label: string; icon: IconName }> = {
  index: { label: t.onglets.aujourdhui, icon: "circle-dot" },
  progres: { label: t.onglets.progres, icon: "chart" },
  coach: { label: t.onglets.coach, icon: "message" },
  trophees: { label: t.onglets.trophees, icon: "trophy" },
};

const SOS_SIZE = 62;

/** Barre du bas sans fond : icônes posées sur l'écran, gros bouton SOS rose au centre */
export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const bottom = Math.max(insets.bottom, 10);
  const keyboard = useKeyboardVisible();
  // Sur le chat, le dégradé est plus court pour ne pas recouvrir la zone de saisie
  const onChat = state.routes[state.index]?.name === "coach";

  const renderTab = (index: number) => {
    const route = state.routes[index];
    if (!route) return null;
    const tab = tabs[route.name];
    const focused = state.index === index;
    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={tab.label}
        onPress={() => !focused && navigateToTab(route.key)}
        className="min-h-12 flex-1 items-center justify-center gap-1 active:opacity-70"
      >
        <Icon name={tab.icon} size={21} tone={focused ? "texte" : "texteSecondaire"} />
        <Text weight={focused ? "semi" : "medium"} tone={focused ? "texte" : "texteSecondaire"} numberOfLines={1} style={{ fontSize: 10 }}>
          {tab.label}
        </Text>
      </Pressable>
    );
  };

  // Clavier ouvert : la barre se cache pour laisser la place au champ de saisie
  if (keyboard) return null;

  const halo = SOS_SIZE * 2;
  const button = SOS_SIZE + 8; // 62 px + contour couleur du fond

  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
      {/* Dégradé vers le fond : le contenu ne touche jamais la barre */}
      <LinearGradient
        pointerEvents="none"
        colors={["transparent", colors.fond, colors.fond]}
        locations={[0, 0.55, 1]}
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: (onChat ? 56 : 120) + bottom }}
      />
      <View className="flex-row items-end px-2" style={{ paddingBottom: bottom, width: "100%", maxWidth: MAX_CONTENT_WIDTH, alignSelf: "center" }}>
        {renderTab(0)}
        {renderTab(1)}
        <View className="w-20 items-center" style={{ height: 52 }}>
          {/* Halo rose derrière le bouton */}
          <View
            pointerEvents="none"
            style={{ position: "absolute", top: -button / 2 - 4 + button / 2 - halo / 2, width: halo, height: halo }}
          >
            <Svg width={halo} height={halo}>
              <Defs>
                <RadialGradient id="haloSos" cx="50%" cy="50%" r="50%">
                  <Stop offset="0.4" stopColor={colors.haloSos} stopOpacity={1} />
                  <Stop offset="1" stopColor={colors.haloSos} stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx={halo / 2} cy={halo / 2} r={halo / 2} fill="url(#haloSos)" />
            </Svg>
          </View>
          <Pressable
            onPress={() => router.push("/sos")}
            accessibilityRole="button"
            accessibilityLabel={t.onglets.sos}
            className="items-center justify-center rounded-full bg-sos active:opacity-80"
            style={{ marginTop: -button / 2 - 4, width: button, height: button, borderWidth: 4, borderColor: colors.fond }}
          >
            <Text weight="bold" tone="texteSurSos" className="text-base">
              {t.onglets.sos}
            </Text>
          </Pressable>
        </View>
        {renderTab(2)}
        {renderTab(3)}
      </View>
    </View>
  );
}
