import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";

import { Badge } from "@/components/Badge";
import { BreathingCircle, BreathingStart } from "@/components/BreathingCircle";
import { GlowingInsignia } from "@/components/BadgeCarousel";
import { Button } from "@/components/ui/Button";
import { Glass, Hairline } from "@/components/ui/Glass";
import { Icon } from "@/components/ui/Icon";
import { Screen, ScreenHeader } from "@/components/ui/Screen";
import { Label, Text } from "@/components/ui/Text";
import { VoicePlayer } from "@/components/Voice";
import { useLayout } from "@/hooks/useLayout";
import { decimal, money, t } from "@/i18n";
import { milestoneItems } from "@/lib/badges";
import { relapseUnit } from "@/lib/calc";
import { closeModal } from "@/lib/nav";
import { useProfile, useStore } from "@/lib/store";

const ts = t.sos;
const DURATION = 5 * 60;

export default function Sos() {
  const profile = useProfile();
  const { data, addCraving, addSosOpen } = useStore();
  const [secondsLeft, setSecondsLeft] = useState(DURATION);
  const [idea, setIdea] = useState(() =>
    Math.floor(Math.random() * ts.idees.length),
  );
  const [showMessage, setShowMessage] = useState(false);
  // Victoire : niveau de l'insigne à afficher (-1 = aucun palier de temps encore débloqué), null tant qu'on n'a pas gagné
  const [won, setWon] = useState<number | null>(null);
  // La respiration et le minuteur attendent un appui sur « Démarrer »
  const [started, setStarted] = useState(false);

  // Minuteur de 5:00, lancé avec la respiration
  useEffect(() => {
    if (!started) return;
    const id = setInterval(
      () => setSecondsLeft((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [started]);

  // Compte une ouverture du SOS (missions « réflexe SOS »), une seule fois même si l'effet est rejoué en développement
  const counted = useRef(false);
  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    addSosOpen();
  }, [addSosOpen]);

  // Une nouvelle idée toutes les 8 secondes
  useEffect(() => {
    const id = setInterval(
      () => setIdea((i) => (i + 1) % ts.idees.length),
      8000,
    );
    return () => clearInterval(id);
  }, []);

  if (won !== null) return <Victory count={data.cravings.length} level={won} />;

  const unit = relapseUnit(profile);
  const pct =
    profile.goal.amount > 0 ? (unit.cost / profile.goal.amount) * 100 : 0;
  const mm = Math.floor(secondsLeft / 60);
  const ss = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <Screen glow="sos">
      <ScreenHeader onClose={closeModal} />
      <View className="items-center gap-1">
        <Text weight="bold" className="text-center text-3xl">
          {ts.titre}
        </Text>
        <Text tone="texteSecondaire" className="text-center text-base">
          {ts.texte}
        </Text>
      </View>

      <View className="py-2">
        {started ? (
          <BreathingCircle />
        ) : (
          <BreathingStart onPress={() => setStarted(true)} />
        )}
      </View>

      <Text
        weight="semi"
        tone="texteSecondaire"
        className="text-center text-2xl"
        accessibilityLabel={`${mm}:${ss}`}
      >
        {mm}:{ss}
      </Text>

      {/* Ferme le SOS et ouvre l'onglet Coach */}
      <Button
        label={ts.parlerCoach}
        icon="message"
        variant="doux"
        onPress={() => {
          closeModal();
          router.navigate("/coach");
        }}
      />
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button
            label={ts.monMessage}
            icon="heart"
            variant="doux"
            onPress={() => setShowMessage(!showMessage)}
          />
        </View>
        <View className="flex-1">
          <Button
            label={ts.miniJeu}
            icon="hash"
            variant="doux"
            onPress={() => router.push("/mini-jeux")}
          />
        </View>
      </View>

      {showMessage && (
        <Animated.View entering={FadeInDown}>
          <Glass className="gap-3">
            {profile.voiceUri && <VoicePlayer uri={profile.voiceUri} />}
            {profile.reasons.length > 0 ? (
              <View className="gap-2">
                <Label>{ts.tesRaisons}</Label>
                <View className="flex-row flex-wrap gap-2">
                  {profile.reasons.map((r) => (
                    <View
                      key={r}
                      className="rounded-full bg-pastille px-3 py-1.5"
                    >
                      <Text
                        weight="semi"
                        tone="textePastille"
                        className="text-sm"
                      >
                        {r}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              !profile.voiceUri && (
                <Text tone="texteSecondaire">{ts.pasDeMessage}</Text>
              )
            )}
          </Glass>
        </Animated.View>
      )}

      <Glass className="gap-3">
        <View className="flex-row items-center gap-2">
          <Icon name="zap" size={14} tone="texteSecondaire" />
          <Label>{ts.aFaire}</Label>
        </View>
        <Animated.View key={idea} entering={FadeIn.duration(500)}>
          <Text weight="semi" className="text-lg leading-6">
            {ts.idees[idea]}
          </Text>
        </Animated.View>
        <Hairline />
        <View className="gap-0.5">
          <Text weight="medium" className="text-sm">
            {ts.cout(t.uniteEcart[unit.id].un, money(unit.cost))}
          </Text>
          {profile.goal.name ? (
            <Text tone="texteSecondaire" className="text-sm">
              {ts.pctObjectif(decimal(pct, pct < 1 ? 2 : 1), profile.goal.name)}
            </Text>
          ) : null}
        </View>
      </Glass>

      <Button
        label={ts.passee}
        icon="check"
        onPress={() => {
          addCraving();
          // Insigne du dernier palier de temps débloqué (aucun avant 24 h : badge des envies résistées)
          setWon(
            milestoneItems(data, Date.now())
              .map((x) => x.etat)
              .lastIndexOf("debloque"),
          );
        }}
      />
      <Pressable
        onPress={() => router.replace("/craque")}
        accessibilityRole="link"
        className="min-h-11 items-center justify-center active:opacity-60"
      >
        <Text
          weight="medium"
          tone="texteSecondaire"
          className="text-sm underline"
        >
          {ts.craque}
        </Text>
      </Pressable>
    </Screen>
  );
}

/** Écran de victoire : l'insigne du dernier palier débloqué apparaît */
function Victory({ count, level }: { count: number; level: number }) {
  const v = ts.victoire;
  const { scale } = useLayout();
  return (
    <Screen fixed className="items-center justify-center gap-6">
      <Animated.View entering={ZoomIn.springify().damping(12)}>
        {level >= 0 ? (
          <GlowingInsignia
            level={level}
            size={Math.round(300 * scale)}
            locked={false}
            glowSize={Math.round(260 * scale)}
          />
        ) : (
          <Badge
            valeur={String(count)}
            libelle={v.libelle(count)}
            taille={200 * scale}
          />
        )}
      </Animated.View>
      <Animated.View
        entering={FadeInDown.delay(300)}
        style={{ alignItems: "center", gap: 8 }}
      >
        <Text weight="bold" className="text-center text-3xl">
          {v.titre}
        </Text>
        <Text
          tone="texteSecondaire"
          className="px-4 text-center text-base leading-6"
        >
          {v.texte}
        </Text>
        <View className="mt-2 rounded-full bg-pastille px-4 py-2">
          <Text weight="semi" tone="textePastille">
            {v.compteur(count)}
          </Text>
        </View>
      </Animated.View>
      <Animated.View
        entering={FadeInDown.delay(500)}
        style={{ alignSelf: "stretch" }}
      >
        <Button label={v.bouton} onPress={closeModal} />
      </Animated.View>
    </Screen>
  );
}
