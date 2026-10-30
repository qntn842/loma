import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { BadgeCarousel, Dots } from "@/components/BadgeCarousel";
import { ShareBadge } from "@/components/ShareBadge";
import { formatTime } from "@/components/onboarding/QuitDateButton";
import { Appear } from "@/components/ui/Appear";
import { Glass, Hairline } from "@/components/ui/Glass";
import { Icon, IconName } from "@/components/ui/Icon";
import { PremiumStar, StatusPill } from "@/components/ui/Premium";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { Screen } from "@/components/ui/Screen";
import { fontFamily, Label, Text } from "@/components/ui/Text";
import { timeMilestones } from "@/config/milestones";
import { missions } from "@/config/missions";
import { useLayout } from "@/hooks/useLayout";
import { useNow } from "@/hooks/useNow";
import { duration, durationWords, int, longDate, money, t } from "@/i18n";
import { milestoneItems, milestoneProgress } from "@/lib/badges";
import {
  avoidedCount,
  bestStreak,
  currentStatus,
  currentStreak,
  DAY,
  HOUR,
  MIN,
  milestoneReachedAt,
  netSavings,
} from "@/lib/calc";
import { missionsDoneCount, missionStats } from "@/lib/missions";
import { dayKey, useProfile, useStore } from "@/lib/store";
import type { AppData } from "@/lib/types";
import { useTheme } from "@/theme/ThemeProvider";

const ta = t.aujourdhui;

export default function Today() {
  const now = useNow(1000);
  const { scale } = useLayout();
  const { data } = useStore();
  const profile = useProfile();

  const items = milestoneItems(data, now);
  const lastUnlocked = items.map((x) => x.etat).lastIndexOf("debloque");
  const [index, setIndex] = useState(Math.max(0, lastUnlocked));

  const notStarted = profile.quitDate > now;
  const streak = currentStreak(data, now);
  const status = currentStatus(bestStreak(data, now)).status;
  const saved = netSavings(data, now);
  const avoided = avoidedCount(data, now);
  // Taille des chiffres du bandeau, adaptée à la largeur de l'écran
  const statSize = Math.round(22 * scale);

  return (
    <View className="flex-1">
      <Screen withTabBar className="gap-5">
        {/* En-tête */}
        {/* Salut à gauche, statut au centre de l'écran, profil à droite (les deux côtés ont la même largeur) */}
        <View className="flex-row items-center gap-2">
          <View className="flex-1 gap-0.5">
            <Text weight="medium" tone="texteSecondaire" className="text-sm">
              {longDate(new Date(now))}
            </Text>
            {/* Prénom en doré pour les membres Premium */}
            <Text
              weight="bold"
              className="text-xl"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {ta.salut}
              {profile.firstName ? (
                <>
                  {", "}
                  <Text
                    weight="bold"
                    tone={data.premium ? "premiumTexte" : "texte"}
                  >
                    {profile.firstName}
                  </Text>
                </>
              ) : null}
            </Text>
          </View>
          {/* Ouvre Trophées, où l'on voit tous les statuts et la barre vers le suivant */}
          <StatusPill
            label={t.trophees.statuts[status.id]}
            onPress={() => router.navigate("/trophees")}
            accessibilityLabel={ta.voirStatuts(t.trophees.statuts[status.id])}
          />
          <View
            className="flex-1 flex-row items-center"
            style={{ justifyContent: "flex-end", gap: 8 }}
          >
            <ShareBadge data={data} now={now} index={index} />
            <ProfileButton
              initial={profile.firstName.charAt(0).toUpperCase()}
              premium={data.premium}
            />
          </View>
        </View>

        {/* Carrousel de badges (flouté avec un compte à rebours si l'arrêt n'a pas encore commencé) */}
        <View>
          <View
            className="gap-3"
            pointerEvents={notStarted ? "none" : "auto"}
            style={{
              opacity: notStarted && Platform.OS === "android" ? 0.2 : 1,
            }}
          >
            <BadgeCarousel
              items={items}
              index={index}
              onIndexChange={setIndex}
              onPressCenter={() => router.navigate("/trophees")}
              progress={milestoneProgress(data, now, index)}
            />
            <BadgeCaption data={data} now={now} index={index} />
            <Dots count={items.length} active={index} />
          </View>
          {notStarted && (
            <StartCountdown quitDate={profile.quitDate} now={now} />
          )}
        </View>

        {/* Bandeau de 3 statistiques */}
        <View>
          <Hairline />
          <View className="flex-row py-4">
            <Stat label={ta.sansFumer} flex={1.3}>
              <StreakValue ms={streak} size={statSize} />
            </Stat>
            <Separator />
            <Stat label={ta.economise}>
              {/* Les économies avancent en direct, au centime près */}
              <RollingNumber
                value={saved}
                format={(v) => money(v)}
                weight="semi"
                tone="accentClair"
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{ fontSize: statSize, lineHeight: statSize * 1.3 }}
              />
            </Stat>
            <Separator />
            <Stat label={ta.evitees}>
              <Text
                weight="semi"
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{ fontSize: statSize, lineHeight: statSize * 1.3 }}
              >
                {int(avoided)}
              </Text>
            </Stat>
          </View>
          <Hairline />
        </View>

        {/* Infos du jour */}
        <View className="gap-1">
          <Text weight="bold" className="text-xl">
            {ta.infos}
          </Text>
          <Text tone="texteSecondaire" className="text-sm">
            {ta.infosSousTitre}
          </Text>
        </View>
        <InfoCards saved={saved} missionsDone={missionsDoneCount(missionStats(data, now))} />
      </Screen>
    </View>
  );
}

/** Temps sans fumer : « 12 j 04 h 23 min », les unités en plus petit. Défile à chaque minute. */
function StreakValue({ ms, size }: { ms: number; size: number }) {
  const { colors } = useTheme();
  const d = Math.floor(ms / DAY);
  const h = Math.floor((ms % DAY) / HOUR);
  const m = Math.floor((ms % HOUR) / MIN);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const parts: [string, string][] = [
    ...(d > 0 ? [[String(d), t.unites.j] as [string, string]] : []),
    [d > 0 ? pad(h) : String(h), t.unites.h],
    [pad(m), t.unites.min],
  ];
  const unit = {
    fontFamily: fontFamily("medium"),
    fontSize: size * 0.55,
    color: colors.texteSecondaire,
  };

  return (
    <View
      style={{
        height: size * 1.3,
        overflow: "hidden",
        justifyContent: "center",
        alignSelf: "stretch",
      }}
    >
      <Animated.Text
        key={`${d}-${h}-${m}`}
        entering={FadeInDown.duration(350)}
        style={{
          fontFamily: fontFamily("semi"),
          fontSize: size,
          lineHeight: size * 1.3,
          color: colors.texte,
          textAlign: "center",
        }}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {parts.map(([value, label], i) => (
          <Animated.Text key={label}>
            {i > 0 ? " " : ""}
            {value}
            <Animated.Text style={unit}>{` ${label}`}</Animated.Text>
          </Animated.Text>
        ))}
      </Animated.Text>
    </View>
  );
}

/** Par-dessus le carrousel flouté : « Tu commences dans 14 h 32 min » + la date choisie */
function StartCountdown({ quitDate, now }: { quitDate: number; now: number }) {
  const { name } = useTheme();
  return (
    <Animated.View
      entering={FadeIn}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingHorizontal: 24,
      }}
    >
      {/* Flou sur iPhone et web, d'un bord à l'autre de l'écran comme le carrousel ; sur Android (flou trop coûteux) le carrousel est seulement estompé */}
      {Platform.OS !== "android" && (
        <BlurView
          intensity={40}
          tint={name === "sombre" ? "dark" : "light"}
          style={{
            position: "absolute",
            top: -8,
            left: -20,
            right: -20,
            bottom: -8,
          }}
        />
      )}
      <Label center>{ta.commenceDans}</Label>
      <Text
        weight="semi"
        className="text-center text-4xl"
        style={{ lineHeight: 44 }}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {duration(quitDate - now)}
      </Text>
      <Text
        tone="texteSecondaire"
        weight="medium"
        className="text-center text-sm"
      >
        {ta.commenceLe(longDate(new Date(quitDate)), formatTime(quitDate))}
      </Text>
    </Animated.View>
  );
}

function Stat({
  label,
  flex = 1,
  children,
}: {
  label: string;
  flex?: number;
  children: React.ReactNode;
}) {
  return (
    <View className="items-center gap-1 px-1" style={{ flex }}>
      {/* Place pour 2 lignes : les chiffres restent alignés même si un libellé passe à la ligne */}
      <View style={{ minHeight: 30, justifyContent: "center" }}>
        <Label center>{label}</Label>
      </View>
      {children}
    </View>
  );
}

function Separator() {
  const { colors } = useTheme();
  return (
    <View
      style={{ width: 1, backgroundColor: colors.bordure, marginVertical: 2 }}
    />
  );
}

/** Rond Profil avec l'initiale ; contour doré et petite étoile pour les membres Premium */
function ProfileButton({
  initial,
  premium,
}: {
  initial: string;
  premium: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => router.push("/profil")}
      accessibilityRole="button"
      accessibilityLabel={t.profil.titre}
      className="h-11 w-11 items-center justify-center rounded-full active:opacity-70"
      style={{
        borderWidth: premium ? 1.5 : 1,
        borderColor: premium ? colors.premium : colors.bordure,
        backgroundColor: colors.rondProfil,
      }}
    >
      {initial ? (
        <Text weight="semi" tone="texteSurRondProfil" className="text-base">
          {initial}
        </Text>
      ) : (
        <Icon name="user" size={18} tone="texteSurRondProfil" />
      )}
      {premium && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: colors.fond,
          }}
        >
          <PremiumStar size={16} />
        </View>
      )}
    </Pressable>
  );
}

/** Titre et sous-titre du badge affiché au centre du carrousel */
function BadgeCaption({
  data,
  now,
  index,
}: {
  data: AppData;
  now: number;
  index: number;
}) {
  const m = timeMilestones[index];
  const name = t.trophees.etapesNoms[m.id];
  const reachedAt = milestoneReachedAt(data, m.ms, now);
  const next = timeMilestones[index + 1];

  let subtitle: string;
  if (reachedAt !== null) {
    const unlocked =
      dayKey(new Date(reachedAt)) === dayKey(new Date(now))
        ? ta.debloqueAujourdhui
        : ta.debloqueIlYa(durationWords(now - reachedAt));
    subtitle = next
      ? `${unlocked} · ${ta.prochain(t.trophees.etapesNoms[next.id])}`
      : unlocked;
  } else {
    subtitle = ta.dans(duration(m.ms - currentStreak(data, now)));
  }

  return (
    <Animated.View
      key={m.id}
      entering={FadeIn.duration(300)}
      style={{ alignItems: "center", gap: 4 }}
    >
      <Text weight="bold" className="text-center text-xl" numberOfLines={1}>
        {ta.badgeTitre(name)}
      </Text>
      <Text tone="texteSecondaire" className="text-center text-sm">
        {subtitle}
      </Text>
    </Animated.View>
  );
}

/** Cartes de verre à faire glisser sur le côté (la suivante dépasse à droite) */
function InfoCards({ saved, missionsDone }: { saved: number; missionsDone: number }) {
  const { contentWidth } = useLayout();
  const profile = useProfile();
  // Grille 2 × 2 : tout est visible d'un coup, sans glisser (comme un grid-cols-2 gap-3)
  const cardWidth = (contentWidth - 40 - 12) / 2;
  const goalPct = profile.goal.amount > 0 ? saved / profile.goal.amount : 0;

  return (
    <View className="flex-row flex-wrap gap-3">
      <InfoCard width={cardWidth} index={0} icon="wallet" label={ta.economise}>
        <Text
          weight="semi"
          tone="accentClair"
          style={{ fontSize: 24, lineHeight: 30 }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {money(saved)}
        </Text>
        <Text tone="texteSecondaire" className="text-xs leading-4">
          {ta.garde}
        </Text>
      </InfoCard>

      {/* Défis : ouvre la liste des missions */}
      <InfoCard width={cardWidth} index={1} icon="target" label={ta.defi} onPress={() => router.push("/missions")}>
        <Text weight="semi" className="text-base">
          {t.trophees.defi}
        </Text>
        <Text tone="texteSecondaire" className="text-xs leading-4">
          {ta.defiTexte(missionsDone, missions.length)}
        </Text>
      </InfoCard>

      {profile.goal.name ? (
        <InfoCard width={cardWidth} index={2} icon="gift" label={ta.objectif}>
          <Text weight="semi" className="text-sm" numberOfLines={1}>
            {profile.goal.name}
          </Text>
          <ProgressBar progress={goalPct} />
          <Text tone="texteSecondaire" className="text-xs leading-4">
            {money(Math.min(saved, profile.goal.amount), true)} /{" "}
            {money(profile.goal.amount, true)}
            {"\n"}
            {ta.objectifPct(Math.min(100, Math.floor(goalPct * 100)))}
          </Text>
        </InfoCard>
      ) : (
        // Pas d'objectif choisi (il est facultatif) : la carte propose d'en ajouter un
        <InfoCard
          width={cardWidth}
          index={2}
          icon="gift"
          label={ta.objectif}
          onPress={() => router.push("/modifier/objectif")}
        >
          <Text weight="semi" className="text-sm">
            {ta.sansObjectif}
          </Text>
          <Text tone="texteSecondaire" className="text-xs leading-4">
            {ta.sansObjectifTexte}
          </Text>
        </InfoCard>
      )}

      <InfoCard
        width={cardWidth}
        index={3}
        icon="book-open"
        label={ta.journal}
        onPress={() => router.push("/journal")}
      >
        <Text tone="texteSecondaire" className="flex-1 text-xs leading-4">
          {ta.journalTexte}
        </Text>
        <View className="h-9 w-9 items-center justify-center self-end rounded-full bg-pastille">
          <Icon name="arrow-right" size={16} tone="textePastille" />
        </View>
      </InfoCard>
    </View>
  );
}

function InfoCard({
  width,
  index,
  icon,
  label,
  onPress,
  children,
}: {
  width: number;
  index: number;
  icon: IconName;
  label: string;
  onPress?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Appear index={index}>
      <Glass
        onPress={onPress}
        accessibilityLabel={onPress ? label : undefined}
        style={{ width, minHeight: 136 }}
        padding={14}
        radius={22}
        className="gap-2"
      >
        <View className="flex-row items-center gap-1.5">
          <Icon name={icon} size={13} tone="texteSecondaire" />
          <View className="flex-1">
            <Label>{label}</Label>
          </View>
        </View>
        {children}
      </Glass>
    </Appear>
  );
}
