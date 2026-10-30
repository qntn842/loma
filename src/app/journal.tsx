import { router } from "expo-router";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { ChipsEditor } from "@/components/ChipsEditor";
import { Appear } from "@/components/ui/Appear";
import { Button } from "@/components/ui/Button";
import { Glass, Hairline } from "@/components/ui/Glass";
import { Icon, IconName } from "@/components/ui/Icon";
import { PremiumBadge } from "@/components/ui/Premium";
import { Screen, ScreenHeader, SectionTitle } from "@/components/ui/Screen";
import { Label, Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";
import { deleteRecording, VoicePlayer, VoiceRecorder } from "@/components/Voice";
import { FREE_NOTE_LENGTH } from "@/config/premium";
import { useNow } from "@/hooks/useNow";
import { shortDateTime, t } from "@/i18n";
import { weekRecap } from "@/lib/recap";
import { closeModal } from "@/lib/nav";
import { useStore } from "@/lib/store";
import type { Mood } from "@/lib/types";
import { useTheme } from "@/theme/ThemeProvider";

const tj = t.journal;

const moodIcons: Record<Mood, IconName> = { bien: "smile", cava: "meh", tendu: "zap", dur: "frown" };

export default function Journal() {
  const { data, addJournal, removeJournal, setTriggers } = useStore();
  const { colors, name } = useTheme();
  const now = useNow(60_000);

  const [mood, setMood] = useState<Mood | null>(null);
  const [triggers, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [voiceUri, setVoiceUri] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!mood) return;
    addJournal({ mood, triggers, note: note.trim() || undefined, voiceUri: voiceUri ?? undefined });
    setMood(null);
    setSelected([]);
    setNote("");
    setVoiceUri(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const recap = weekRecap(data, now);
  // Lignes du récap : la première est gratuite, les autres sont Premium
  const recapLines: { icon: IconName; text: string }[] = recap.isEmpty
    ? []
    : [
        recap.topTrigger
          ? { icon: "flag", text: tj.habitude.declencheur(recap.topTrigger) }
          : { icon: "shield", text: tj.habitude.envies(recap.cravings, recap.cravingsBefore) },
        ...(recap.riskMoment ? [{ icon: "clock" as IconName, text: tj.habitude.moment(tj.moments[recap.riskMoment]) }] : []),
        ...(recap.topMood ? [{ icon: moodIcons[recap.topMood], text: tj.habitude.humeur(tj.humeurs[recap.topMood]) }] : []),
        ...(recap.topTrigger ? [{ icon: "shield" as IconName, text: tj.habitude.envies(recap.cravings, recap.cravingsBefore) }] : []),
        { icon: "refresh", text: tj.habitude.ecarts(recap.relapses) },
      ];

  return (
    <Screen>
      <ScreenHeader title={tj.titre} onClose={closeModal} icon="arrow-left" />

      {/* Saisie rapide */}
      <Appear>
        <Glass className="gap-5">
          <View className="gap-3">
            <Label>{tj.saisie}</Label>
            <View className="flex-row gap-2">
              {(Object.keys(moodIcons) as Mood[]).map((m) => {
                const selected = mood === m;
                return (
                  <Pressable
                    key={m}
                    onPress={() => setMood(m)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    className={`min-h-16 flex-1 items-center justify-center gap-1 rounded-3xl py-2.5 active:opacity-80 ${selected ? "bg-pastille" : ""}`}
                    style={selected ? undefined : { borderWidth: 1, borderColor: colors.bordure }}
                  >
                    <Icon name={moodIcons[m]} size={20} tone={selected ? "textePastille" : "texte"} />
                    <Text weight="medium" tone={selected ? "textePastille" : "texte"} className="text-xs">
                      {tj.humeurs[m]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="gap-3">
            <Label>{tj.declencheurs}</Label>
            <ChipsEditor
              options={data.triggers}
              selected={triggers}
              onToggle={(x) => setSelected(triggers.includes(x) ? triggers.filter((y) => y !== x) : [...triggers, x])}
              onAdd={(x) => {
                if (!data.triggers.includes(x)) setTriggers([...data.triggers, x]);
                if (!triggers.includes(x)) setSelected([...triggers, x]);
              }}
              placeholder={tj.nouveauDeclencheur}
            />
          </View>

          <TextField
            label={tj.note}
            value={note}
            onChangeText={setNote}
            placeholder={tj.notePlaceholder}
            multiline
            maxLength={data.premium ? undefined : FREE_NOTE_LENGTH}
            help={data.premium ? undefined : tj.noteLimite(FREE_NOTE_LENGTH)}
          />

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Label>{tj.vocal}</Label>
              {!data.premium && <PremiumBadge />}
            </View>
            {data.premium ? (
              <VoiceRecorder uri={voiceUri} onChange={setVoiceUri} />
            ) : (
              <Button label={t.commun.debloquer} variant="secondary" small icon="mic" onPress={() => router.push("/premium")} />
            )}
          </View>

          <Button label={tj.enregistrer} icon="check" disabled={!mood} onPress={save} />
          {saved && (
            <Animated.View entering={FadeIn}>
              <Text weight="semi" tone="accentClair" className="text-center">
                {tj.enregistre}
              </Text>
            </Animated.View>
          )}
        </Glass>
      </Appear>

      {/* Récap de la semaine : 1 habitude gratuite, le reste flouté avec un cadenas discret */}
      <SectionTitle>{tj.recap}</SectionTitle>
      <Appear index={1}>
        <Glass className="gap-3">
          {recap.isEmpty ? (
            <Text tone="texteSecondaire" className="text-sm leading-5">
              {tj.recapVide}
            </Text>
          ) : (
            <>
              <RecapLine {...recapLines[0]} />
              {data.premium ? (
                recapLines.slice(1).map((l) => <RecapLine key={l.text} {...l} />)
              ) : (
                <Pressable onPress={() => router.push("/premium")} accessibilityRole="button" accessibilityLabel={tj.recapPremium}>
                  <View className="gap-3" style={{ opacity: Platform.OS === "ios" ? 1 : 0.25 }}>
                    {recapLines.slice(1).map((l) => (
                      <RecapLine key={l.text} {...l} />
                    ))}
                  </View>
                  {Platform.OS === "ios" && (
                    <BlurView intensity={18} tint={name === "sombre" ? "dark" : "light"} style={{ position: "absolute", top: -4, left: -4, right: -4, bottom: -4 }} />
                  )}
                  <View className="absolute inset-0 flex-row items-center justify-center gap-2">
                    <Icon name="lock" size={14} tone="texteSecondaire" />
                    <Text weight="semi" tone="texteSecondaire" className="text-sm">
                      {tj.recapPremium}
                    </Text>
                    <PremiumBadge />
                  </View>
                </Pressable>
              )}
            </>
          )}
        </Glass>
      </Appear>

      {/* Historique */}
      <SectionTitle>{tj.historique}</SectionTitle>
      {data.journal.length === 0 ? (
        <Text tone="texteSecondaire" className="text-sm">
          {tj.vide}
        </Text>
      ) : (
        <Glass padding={0}>
          {data.journal.slice(0, 30).map((e, i) => (
            <View key={e.id}>
              {i > 0 && <Hairline className="mx-5" />}
              <View className="gap-2 px-5 py-4">
                <View className="flex-row items-center gap-3">
                  <Icon name={moodIcons[e.mood]} size={18} tone="accentClair" />
                  <Text weight="semi" className="flex-1">
                    {tj.humeurs[e.mood]}
                  </Text>
                  <Text tone="texteSecondaire" className="text-xs">
                    {shortDateTime(e.date)}
                  </Text>
                  <Pressable
                    onPress={() => {
                      deleteRecording(e.voiceUri);
                      removeJournal(e.id);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={tj.supprimer}
                    className="h-11 w-11 items-center justify-center active:opacity-60"
                  >
                    <Icon name="trash" size={16} tone="texteSecondaire" />
                  </Pressable>
                </View>
                {e.triggers.length > 0 && (
                  <View className="flex-row flex-wrap gap-1.5">
                    {e.triggers.map((x) => (
                      <View key={x} className="rounded-full px-2.5 py-1" style={{ borderWidth: 1, borderColor: colors.bordure }}>
                        <Text tone="texteSecondaire" className="text-xs">
                          {x}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                {e.note && <Text className="text-sm leading-5">{e.note}</Text>}
                {e.voiceUri && <VoicePlayer uri={e.voiceUri} />}
              </View>
            </View>
          ))}
        </Glass>
      )}
    </Screen>
  );
}

function RecapLine({ icon, text }: { icon: IconName; text: string }) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-9 w-9 items-center justify-center rounded-full" style={{ borderWidth: 1, borderColor: colors.bordure }}>
        <Icon name={icon} size={16} tone="accentClair" />
      </View>
      <Text weight="medium" className="flex-1 text-sm leading-5">
        {text}
      </Text>
    </View>
  );
}
