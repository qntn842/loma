import { router } from "expo-router";
import { ComponentRef, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Backdrop } from "@/components/ui/Backdrop";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { PremiumLock } from "@/components/ui/Premium";
import { PageTitle, Screen } from "@/components/ui/Screen";
import { fontFamily, Text } from "@/components/ui/Text";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { MAX_CONTENT_WIDTH } from "@/hooks/useLayout";
import { t } from "@/i18n";
import { coachReply, firstMessages, Message } from "@/lib/coach";
import { useProfile, useStore } from "@/lib/store";
import { useTheme } from "@/theme/ThemeProvider";

const tc = t.coach;

/** Hauteur de la barre d'onglets + du bouton SOS qui dépasse, au-dessus de la zone de saisie */
const TAB_BAR_HEIGHT = 100;

/** Onglet Coach : un chat pour parler de ses envies, demander de l'aide ou poser une question */
export default function Coach() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardVisible();
  const profile = useProfile();
  const { data } = useStore();
  const [messages, setMessages] = useState<Message[]>(() => firstMessages(profile));
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);

  if (!data.premium) {
    return (
      <Screen withTabBar>
        <PageTitle title={tc.titre} subtitle={tc.sousTitre} />
        <PremiumLock title={t.journal.coach} text={t.journal.coachTexte} />
        <Button label={t.premium.passer} onPress={() => router.push("/premium")} />
      </Screen>
    );
  }

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;
    setMessages((m) => [...m, { from: "moi", text: clean }]);
    setDraft("");
    setTyping(true);
    // Petit délai pour que la réponse paraisse naturelle
    setTimeout(() => {
      setMessages((m) => [...m, coachReply(clean, profile, data)]);
      setTyping(false);
    }, 700);
  };

  const bottom = keyboard ? 10 : TAB_BAR_HEIGHT + Math.max(insets.bottom, 10);

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Backdrop />
      <View className="flex-1 self-center" style={{ width: "100%", maxWidth: MAX_CONTENT_WIDTH, paddingTop: insets.top + 12 }}>
        <View className="gap-1 px-5 pb-3">
          <PageTitle title={tc.titre} subtitle={tc.sousTitre} />
        </View>

        <ScrollView
          ref={scroll}
          className="flex-1"
          contentContainerClassName="gap-3 px-5 pb-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((m, i) => (
            <Animated.View
              key={i}
              entering={FadeInDown.delay(i < 3 ? i * 250 : 0)}
              style={{ alignSelf: m.from === "coach" ? "flex-start" : "flex-end", maxWidth: "85%", gap: 8 }}
            >
              <View
                className={`rounded-3xl px-4 py-3 ${m.from === "coach" ? "rounded-tl-md" : "rounded-tr-md bg-pastille"}`}
                style={m.from === "coach" ? { borderWidth: 1, borderColor: colors.bordure, backgroundColor: colors.carte[0] } : undefined}
              >
                <Text tone={m.from === "coach" ? "texte" : "textePastille"} weight="medium" className="text-sm leading-5">
                  {m.text}
                </Text>
              </View>
              {m.sos && <Button label={tc.ouvrirSos} variant="sos" small icon="life-buoy" onPress={() => router.push("/sos")} />}
            </Animated.View>
          ))}

          {typing && (
            <Animated.View entering={FadeIn}>
              <Text tone="texteSecondaire" className="text-xs">
                {tc.ecrit}
              </Text>
            </Animated.View>
          )}

          {/* Sujets proposés tant que la conversation vient de commencer */}
          {messages.length <= 3 && (
            <View className="flex-row flex-wrap gap-2 pt-1">
              {tc.suggestions.map((s) => (
                <Chip key={s} label={s} onPress={() => send(s)} />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Zone de saisie, au-dessus de la barre d'onglets */}
        <View className="gap-2 px-5 pt-2" style={{ paddingBottom: bottom }}>
          <View className="flex-row items-end gap-2">
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={tc.placeholder}
              placeholderTextColor={colors.texteSecondaire}
              multiline
              maxLength={500}
              className="flex-1 rounded-3xl px-5 py-3"
              style={{
                minHeight: 48,
                maxHeight: 120,
                fontFamily: fontFamily("medium"),
                fontSize: 16,
                color: colors.texte,
                borderWidth: 1,
                borderColor: colors.bordure,
                backgroundColor: colors.carte[1],
              }}
            />
            <Pressable
              onPress={() => send(draft)}
              disabled={!draft.trim() || typing}
              accessibilityRole="button"
              accessibilityLabel={tc.envoyer}
              className="h-12 w-12 items-center justify-center rounded-full bg-accent active:opacity-80"
              style={{ opacity: draft.trim() && !typing ? 1 : 0.4 }}
            >
              <Icon name="arrow-right" size={20} tone="texteSurAccent" />
            </Pressable>
          </View>
          {!keyboard && (
            <Text tone="texteSecondaire" className="text-center" style={{ fontSize: 11 }}>
              {tc.mention}
            </Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
