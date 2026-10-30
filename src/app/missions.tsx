import { useState } from "react";
import { View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

import { Appear } from "@/components/ui/Appear";
import { Glass } from "@/components/ui/Glass";
import { Icon, IconName } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Screen, ScreenHeader } from "@/components/ui/Screen";
import { Label, Text } from "@/components/ui/Text";
import {
  Mission,
  MissionFamily,
  missionFamilies,
  missions,
} from "@/config/missions";
import { useLayout } from "@/hooks/useLayout";
import { useNow } from "@/hooks/useNow";
import { t } from "@/i18n";
import {
  missionDone,
  missionProgress,
  missionsDoneCount,
  missionStats,
  nextMission,
} from "@/lib/missions";
import { closeModal } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { alpha } from "@/theme/color";
import { useTheme } from "@/theme/ThemeProvider";

const tm = t.missions;

const familyIcons: Record<MissionFamily, IconName> = {
  jours: "calendar",
  cigarettes: "wind",
  argent: "wallet",
  temps: "clock",
  envies: "shield",
  journal: "book-open",
};
const iconFor = (m: Mission): IconName =>
  m.counts === "sos" ? "life-buoy" : familyIcons[m.family];

/** Toutes les missions, rangées par famille dans des sections dépliables (grille de 2 cartes) */
export default function Missions() {
  const now = useNow(60_000);
  const { data } = useStore();
  const { contentWidth } = useLayout();
  const stats = missionStats(data, now);
  const done = missionsDoneCount(stats);
  const next = nextMission(stats);
  const cardWidth = (contentWidth - 40 - 12) / 2;
  // Sections ouvertes : au départ, celle de la prochaine mission (ou la première)
  const [open, setOpen] = useState<MissionFamily[]>(() => [
    next?.family ?? missionFamilies[0],
  ]);
  const toggle = (f: MissionFamily) =>
    setOpen((o) => (o.includes(f) ? o.filter((x) => x !== f) : [...o, f]));

  return (
    <Screen>
      <ScreenHeader title={tm.titre} onClose={closeModal} icon="arrow-left" />

      {/* Résumé : missions réussies */}
      <Appear>
        <Glass className="gap-3">
          <View className="flex-row items-center gap-4">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-pastille">
              <Icon name="target" size={22} tone="textePastille" />
            </View>
            <View className="flex-1 gap-0.5">
              <Label>{tm.reussies}</Label>
              <Text weight="semi" className="text-2xl">
                <Text weight="semi" tone="accentClair" className="text-2xl">
                  {done}
                </Text>
                {` / ${missions.length}`}
              </Text>
            </View>
          </View>
          <ProgressBar progress={done / missions.length} />
          <Text tone="texteSecondaire" className="text-xs leading-4">
            {tm.texte}
          </Text>
        </Glass>
      </Appear>

      {missionFamilies.map((family) => {
        const list = missions.filter((m) => m.family === family);
        const familyDone = list.filter((m) => missionDone(m, stats)).length;
        const isOpen = open.includes(family);
        return (
          <Animated.View
            key={family}
            layout={LinearTransition.duration(250)}
            style={{ gap: 12 }}
          >
            <FamilyHeader
              family={family}
              done={familyDone}
              total={list.length}
              open={isOpen}
              onPress={() => toggle(family)}
            />
            {isOpen && (
              <Animated.View
                entering={FadeIn.duration(250)}
                exiting={FadeOut.duration(150)}
                style={{ gap: 12 }}
              >
                <View className="flex-row flex-wrap gap-3">
                  {list.map((m) => (
                    <MissionCard
                      key={m.id}
                      mission={m}
                      width={cardWidth}
                      progress={missionProgress(m, stats)}
                      isNext={next?.id === m.id}
                    />
                  ))}
                </View>
                {family === "temps" && (
                  <Text tone="texteSecondaire" className="text-xs">
                    {tm.tempsNote}
                  </Text>
                )}
              </Animated.View>
            )}
          </Animated.View>
        );
      })}
    </Screen>
  );
}

/** En-tête d'une famille : icône, nom, « x / n », petite barre et flèche ; le toucher ouvre ou ferme la section */
function FamilyHeader({
  family,
  done,
  total,
  open,
  onPress,
}: {
  family: MissionFamily;
  done: number;
  total: number;
  open: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const complete = done === total;
  return (
    <Glass
      onPress={onPress}
      padding={16}
      radius={22}
      accessibilityLabel={`${tm.familles[family]}, ${done} / ${total}`}
      className="flex-row items-center gap-3"
    >
      <View
        className={`h-11 w-11 items-center justify-center rounded-full ${complete ? "bg-pastille" : ""}`}
        style={
          complete ? undefined : { backgroundColor: alpha(colors.texte, 0.06) }
        }
      >
        <Icon
          name={familyIcons[family]}
          size={20}
          tone={complete ? "textePastille" : "texte"}
        />
      </View>
      <View className="flex-1 gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text weight="semi" className="text-base">
            {tm.familles[family]}
          </Text>
          <Text weight="medium" tone="texteSecondaire" className="text-sm">
            <Text
              weight="semi"
              tone={done > 0 ? "accentClair" : "texteSecondaire"}
              className="text-sm"
            >
              {done}
            </Text>
            {` / ${total}`}
          </Text>
        </View>
        <ProgressBar progress={done / total} />
      </View>
      {/* Flèche vers le bas une fois ouverte */}
      <View style={{ transform: [{ rotate: open ? "90deg" : "0deg" }] }}>
        <Icon name="chevron-right" size={18} tone="texteSecondaire" />
      </View>
    </Glass>
  );
}

function MissionCard({
  mission,
  width,
  progress,
  isNext,
}: {
  mission: Mission;
  width: number;
  progress: number;
  isNext: boolean;
}) {
  const done = progress >= 1;
  return (
    <View style={{ width, opacity: done || isNext ? 1 : 0.8 }}>
      <Glass
        className="items-center gap-3"
        padding={14}
        radius={24}
        highlighted={isNext}
      >
        {/* Réussie : coche en haut à droite · prochaine : étiquette en haut à gauche */}
        {done && (
          <View className="absolute right-3 top-3 h-6 w-6 items-center justify-center rounded-full bg-accent">
            <Icon
              name="check"
              size={14}
              tone="texteSurAccent"
              strokeWidth={2.4}
            />
          </View>
        )}
        {isNext && (
          <View className="absolute left-3 top-3 rounded-full bg-pastille px-2 py-0.5">
            <Text
              weight="bold"
              tone="textePastille"
              style={{ fontSize: 10, letterSpacing: 0.6 }}
            >
              {tm.prochaine.toUpperCase()}
            </Text>
          </View>
        )}
        <View style={{ marginTop: 10 }}>
          <Medallion icon={iconFor(mission)} progress={progress} />
        </View>
        <View className="w-full items-center gap-0.5">
          <Text weight="semi" className="text-center text-sm" numberOfLines={1}>
            {tm.titres[mission.id]}
          </Text>
          <Text
            tone="texteSecondaire"
            className="text-center text-xs leading-4"
            numberOfLines={2}
          >
            {tm.sousTitre(mission.family, mission.goal, mission.counts)}
          </Text>
        </View>
      </Glass>
    </View>
  );
}

/** Médaillon rond avec l'icône de la famille et un anneau de progression autour ; lumineux une fois réussi */
function Medallion({ icon, progress }: { icon: IconName; progress: number }) {
  const { colors } = useTheme();
  const size = 76;
  const stroke = 3;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const done = progress >= 1;
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={size}
        height={size}
        style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={alpha(colors.texte, 0.08)}
          strokeWidth={stroke}
          fill="none"
        />
        {progress > 0 && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={colors.accent}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c * progress} ${c}`}
            fill="none"
          />
        )}
      </Svg>
      <View
        className={`h-14 w-14 items-center justify-center rounded-full ${done ? "bg-pastille" : ""}`}
        style={
          done
            ? { boxShadow: `0 0 18px ${alpha(colors.accent, 0.55)}` }
            : { backgroundColor: alpha(colors.texte, 0.06) }
        }
      >
        <Icon
          name={icon}
          size={24}
          tone={done ? "textePastille" : "texteSecondaire"}
        />
      </View>
    </View>
  );
}
