import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ConsumptionForm } from "@/components/onboarding/ConsumptionForm";
import { GoalForm } from "@/components/onboarding/GoalForm";
import { ProductPicker } from "@/components/onboarding/ProductPicker";
import { formatDay, formatTime } from "@/components/onboarding/QuitDateButton";
import { QuitDatePicker } from "@/components/onboarding/QuitDatePicker";
import { ReasonsForm } from "@/components/onboarding/ReasonsForm";
import { Logo } from "@/components/Logo";
import { ProfileSummary } from "@/components/ProfileSummary";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/Badge";
import { Backdrop } from "@/components/ui/Backdrop";
import { Glass } from "@/components/ui/Glass";
import { RoundButton } from "@/components/ui/Screen";
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";
import { defaultConsumption, ProductId } from "@/config/products";
import { MAX_CONTENT_WIDTH, useLayout } from "@/hooks/useLayout";
import { money, t } from "@/i18n";
import { dailyCost, monthlyCost, yearlyCost } from "@/lib/calc";
import { useStore } from "@/lib/store";

const STEPS = 6;
const to = t.onboarding;

export default function Onboarding() {
  const { scale } = useLayout();
  const insets = useSafeAreaInsets();
  const { saveProfile } = useStore();
  // 0 = page de bienvenue, puis les 6 questions
  const [step, setStep] = useState(0);

  // Brouillon du profil, rempli écran par écran (comme un formulaire multi-étapes)
  const [firstName, setFirstName] = useState("");
  const [products, setProducts] = useState<ProductId[]>([]);
  const [consumption, setConsumption] = useState(defaultConsumption);
  // Date et heure de la dernière cigarette (maintenant par défaut)
  const [quitDate, setQuitDate] = useState(() => Date.now());
  const [reasons, setReasons] = useState<string[]>([]);
  const [goal, setGoal] = useState({ name: "", amount: 500 });

  const draft = { products, consumption };

  const canContinue =
    (step === 1 && firstName.trim().length > 0) ||
    (step === 2 && products.length > 0) ||
    (step === 3 && dailyCost(draft) > 0) ||
    step === 4 ||
    (step === 5 && reasons.length > 0) ||
    step === 6;

  const finish = () => {
    // Une fois le profil enregistré, l'app quitte toute seule l'onboarding et ouvre Premium
    saveProfile({
      firstName: firstName.trim(),
      products,
      consumption,
      reasons,
      voiceUri: null,
      goal: { name: goal.name.trim(), amount: goal.amount },
      quitDate,
    });
  };

  const next = () => (step === STEPS ? finish() : setStep(step + 1));

  if (step === 0) return <Intro onContinue={() => setStep(1)} />;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }}
    >
      <Backdrop />
      {/* En-tête : retour + barre de progression fine « x / 6 » */}
      <View className="flex-row items-center gap-3 px-5 pb-3">
        <RoundButton icon="arrow-left" onPress={() => setStep(step - 1)} label={t.commun.retour} />
        <ProgressBar progress={step / STEPS} className="flex-1" />
        <Text weight="medium" tone="texteSecondaire" className="w-12 text-right text-sm">
          {to.etape(step, STEPS)}
        </Text>
      </View>

      <ScrollView
        key={step}
        className="flex-1"
        contentContainerClassName="px-5 pb-6 pt-2 gap-5"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInRight.duration(300)} style={{ gap: step === 5 ? 14 : 20 }}>
          {step === 1 && <Welcome firstName={firstName} setFirstName={setFirstName} />}

          {step === 2 && (
            <>
              <Title title={to.produits.titre} text={to.produits.texte} />
              <ProductPicker value={products} onChange={setProducts} />
            </>
          )}

          {step === 3 && (
            <>
              <Title title={to.conso.titre} text={to.conso.texte} />
              <ConsumptionForm products={products} value={consumption} onChange={setConsumption} />
            </>
          )}

          {step === 4 && (
            <>
              <Title title={to.arret.titre} text={to.arret.texte} />
              <QuitDatePicker value={quitDate} onChange={setQuitDate} />
            </>
          )}

          {step === 5 && (
            <>
              <Title title={to.raisons.titre} text={to.raisons.texte} />
              <ReasonsForm value={reasons} onChange={setReasons} />
              <Glass className="gap-3">
                <Text weight="semi" className="text-base">
                  {to.raisons.objectif}
                </Text>
                <GoalForm value={goal} onChange={setGoal} />
              </Glass>
            </>
          )}

          {step === 6 && (
            <>
              <View className="items-center gap-2">
                <Badge icone="wallet" taille={130 * scale} />
                <Text weight="bold" className="text-center text-3xl leading-9">
                  {to.resultat.titre[0]}
                  <Text weight="bold" tone="accentClair" className="text-3xl">
                    {money(monthlyCost(draft), true)}
                  </Text>
                  {to.resultat.titre[1]}
                </Text>
                <Text weight="medium" tone="texteSecondaire" className="text-center text-lg">
                  {to.resultat.soit(money(yearlyCost(draft), true))}
                </Text>
              </View>
              <ProfileSummary
                products={products}
                quit={`${formatDay(quitDate)} · ${formatTime(quitDate)}`}
                daily={money(dailyCost(draft))}
                goal={goal.name.trim() ? `${goal.name.trim()} · ${money(goal.amount, true)}` : to.raisons.aucunObjectif}
              />
              <View className="gap-3">
                {to.resultat.coches.map((c) => (
                  <View key={c} className="flex-row items-center gap-3">
                    <View className="h-7 w-7 items-center justify-center rounded-full bg-pastille">
                      <Icon name="check" size={15} tone="textePastille" strokeWidth={2.2} />
                    </View>
                    <Text weight="medium" className="flex-1 text-sm">
                      {c}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </Animated.View>
      </ScrollView>

      <View className="px-5 pt-2">
        <Button
          label={step === 1 ? to.accueil.bouton : step === STEPS ? to.resultat.bouton : t.commun.continuer}
          onPress={next}
          disabled={!canContinue}
          icon={step === STEPS ? "arrow-right" : undefined}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

/** Page de bienvenue : logo et accroche au centre, bouton en bas */
function Intro({ onContinue }: { onContinue: () => void }) {
  const { contentWidth, height } = useLayout();
  const insets = useSafeAreaInsets();
  // Le logo suit l'écran : ni minuscule sur un petit téléphone, ni énorme sur tablette
  const logo = Math.min(contentWidth * 0.5, height * 0.26, 240);
  return (
    <View className="flex-1" style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 12 }}>
      <Backdrop />
      <View className="w-full flex-1 self-center px-5" style={{ maxWidth: MAX_CONTENT_WIDTH }}>
        <Animated.View
          entering={FadeIn.duration(500)}
          style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 28 }}
        >
          <Logo size={logo} />
          <Text weight="medium" tone="texte" className="text-center" style={{ fontSize: 17, lineHeight: 24, opacity: 0.9 }}>
            {to.intro.accroche}
          </Text>
        </Animated.View>
        <View className="gap-4">
          <Button label={t.commun.continuer} onPress={onContinue} />
          <Button label={t.compte.connexion} icon="user" variant="secondary" onPress={() => router.push("/compte")} />
        </View>
      </View>
    </View>
  );
}

function Title({ title, text }: { title: string; text?: string }) {
  return (
    <View className="gap-2">
      <Text weight="bold" className="text-3xl leading-9">
        {title}
      </Text>
      {text && (
        <Text tone="texteSecondaire" className="text-base leading-6">
          {text}
        </Text>
      )}
    </View>
  );
}

function Welcome({ firstName, setFirstName }: { firstName: string; setFirstName: (v: string) => void }) {
  const { scale } = useLayout();
  return (
    // Marge en haut : le badge flotte de haut en bas et ne doit pas être coupé
    <View className="pt-4">
      <View className="items-center">
        <Badge icone="wind" taille={170 * scale} />
      </View>
      <View style={{ marginTop: 24, gap: 12 }}>
        <Text weight="semi" style={{ fontSize: 27, lineHeight: 34 }}>
          {to.accueil.titre}
        </Text>
        <Text tone="texteSecondaire" className="text-base leading-6">
          {to.accueil.texte}
        </Text>
      </View>
      <View style={{ marginTop: 32 }}>
        <TextField
          placeholder={to.accueil.prenom}
          accessibilityLabel={to.accueil.prenom}
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="words"
          autoComplete="given-name"
          maxLength={30}
        />
      </View>
    </View>
  );
}
