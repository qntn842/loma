import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { GlowingInsignia } from "@/components/BadgeCarousel";
import { TIERS } from "@/components/Insignia";
import { Appear } from "@/components/ui/Appear";
import { Glass } from "@/components/ui/Glass";
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PageTitle, Screen, SectionTitle } from "@/components/ui/Screen";
import { Label, Text } from "@/components/ui/Text";
import { StatusId, statuses, timeMilestones } from "@/config/milestones";
import { missions } from "@/config/missions";
import { useLayout } from "@/hooks/useLayout";
import { useNow } from "@/hooks/useNow";
import { duration, durationWords, t } from "@/i18n";
import { milestoneItems } from "@/lib/badges";
import { bestStreak, currentStatus, currentStreak } from "@/lib/calc";
import { missionsDoneCount, missionStats } from "@/lib/missions";
import { useStore } from "@/lib/store";

const tt = t.trophees;

/**
 * Taille de dessin d'un insigne dans la grille. L'insigne a beaucoup de marge transparente, on le dessine
 * 1,3 × plus grand que sa case. Ceux qui ont des ailes sont réduits juste assez pour que le bout des ailes
 * reste dans la case : le même petit espace entre tous les insignes.
 */
function insigniaSize(level: number, cell: number) {
  const t = level / (TIERS.length - 1);
  const r = (112 + 78 * t) * (1.55 - 0.35 * t); // rayon du corps, comme dans Insignia.tsx (dessin de 1000 px)
  const wingReach = TIERS[level].wings > 0 ? (1.98 * r) / 1000 : 0; // bout de l'aile, depuis le centre
  return cell * (wingReach ? Math.min(1.3, 0.49 / wingReach) : 1.3);
}

export default function Trophees() {
  const now = useNow(60_000);
  const { data } = useStore();
  const { contentWidth: width } = useLayout();

  // Les badges se basent sur la meilleure série : un écart ne les retire jamais
  const best = bestStreak(data, now);
  const { status, next, progress } = currentStatus(best);
  // Niveau touché dans la carte de statut (par défaut : le prochain)
  const [selected, setSelected] = useState<StatusId | null>(null);
  const shown = statuses.find((s) => s.id === (selected ?? next?.id ?? status.id)) ?? status;
  const items = milestoneItems(data, now);
  const cell = (width - 40 - 24) / 3;
  const missionsDone = missionsDoneCount(missionStats(data, now));

  return (
    <Screen withTabBar>
      <PageTitle title={tt.titre} />

      {/* Statut, en haut de la page */}
      <Appear>
        <Glass className="gap-4">
          <View className="flex-row items-center gap-4">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-pastille">
              <Icon name="zap" size={22} tone="textePastille" />
            </View>
            <View className="flex-1 gap-0.5">
              <Label>{tt.statut}</Label>
              <Text weight="bold" className="text-2xl">
                {tt.statuts[status.id]}
              </Text>
            </View>
          </View>
          {/* Recrue › Survivant › Guerrier › Champion › Maître › Légende : toucher un niveau change la phrase sous la barre */}
          <View className="flex-row flex-wrap items-center gap-1">
            {statuses.map((s, i) => (
              <View key={s.id} className="flex-row items-center gap-1">
                {i > 0 && <Icon name="chevron-right" size={12} tone="texteSecondaire" />}
                <Pressable onPress={() => setSelected(s.id)} hitSlop={{ top: 14, bottom: 14, left: 4, right: 4 }} accessibilityRole="button">
                  <Text weight={s.id === status.id ? "bold" : "medium"} tone={best >= s.ms ? "accentClair" : "texteSecondaire"} className="text-xs">
                    {tt.statuts[s.id]}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
          {next && <ProgressBar progress={progress} />}
          {/* Le niveau touché (par défaut, le suivant) : dans combien de temps on l'atteint */}
          <Text tone="texteSecondaire" className="text-xs">
            {best >= shown.ms
              ? shown.id === status.id && !next
                ? tt.max
                : tt.niveauAtteint(tt.statuts[shown.id])
              : tt.niveauDans(tt.statuts[shown.id], duration(shown.ms - currentStreak(data, now)))}
          </Text>
        </Glass>
      </Appear>

      {/* Grille de tous les badges */}
      <SectionTitle>{tt.tousLesBadges}</SectionTitle>
      {/* Lignes de 3, la dernière ligne (2 insignes) centrée */}
      <View className="flex-row flex-wrap justify-center gap-x-3 gap-y-5">
        {timeMilestones.map((m, i) => {
          const item = items[i];
          const unlocked = item.etat === "debloque";
          return (
            <View key={m.id} style={{ width: cell }} className="items-center gap-1">
              {/* Dessiné plus grand que la case (marge transparente autour de l'insigne), sans agrandir la grille */}
              <View style={{ height: cell, alignItems: "center", justifyContent: "center" }}>
                <GlowingInsignia level={i} size={Math.round(insigniaSize(i, cell))} locked={!unlocked} glowSize={cell} />
              </View>
              <Text weight="semi" className="text-center text-xs">
                {tt.etapesNoms[m.id]}
              </Text>
              <Text tone={unlocked ? "accentClair" : "texteSecondaire"} className="text-center" style={{ fontSize: 11 }}>
                {unlocked ? `${tt.metaux[m.metal]} ✓` : tt.dans(durationWords(m.ms - currentStreak(data, now)))}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Défis : ouvre la liste des missions à accomplir */}
      <SectionTitle>{t.aujourdhui.defi}</SectionTitle>
      <Glass className="flex-row items-center gap-4" onPress={() => router.push("/missions")} accessibilityLabel={tt.defi}>
        <View className="h-11 w-11 items-center justify-center rounded-full bg-pastille">
          <Icon name="target" size={20} tone="textePastille" />
        </View>
        <View className="flex-1 gap-1.5">
          <Text weight="semi">{tt.defi}</Text>
          <ProgressBar progress={missionsDone / missions.length} />
          <Text tone="texteSecondaire" className="text-xs">
            {tt.defiTexte(missionsDone, missions.length)}
          </Text>
        </View>
        <Icon name="chevron-right" size={18} tone="texteSecondaire" />
      </Glass>
    </Screen>
  );
}
