import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

import { ConsumptionForm } from "@/components/onboarding/ConsumptionForm";
import { GoalForm } from "@/components/onboarding/GoalForm";
import { ProductPicker } from "@/components/onboarding/ProductPicker";
import { ReasonsForm } from "@/components/onboarding/ReasonsForm";
import { Button } from "@/components/ui/Button";
import { Screen, ScreenHeader } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { t } from "@/i18n";
import { dailyCost } from "@/lib/calc";
import { closeModal } from "@/lib/nav";
import { useProfile, useStore } from "@/lib/store";

type Champ = "prenom" | "raisons" | "objectif" | "conso";

const titles: Record<Champ, string> = {
  prenom: t.profil.prenom,
  raisons: t.profil.raisons,
  objectif: t.profil.objectif,
  conso: t.profil.conso,
};

/** Modification d'une partie du profil : réutilise les formulaires de l'onboarding */
export default function Modifier() {
  const { champ } = useLocalSearchParams<{ champ: Champ }>();
  const profile = useProfile();
  const { updateProfile } = useStore();

  const [firstName, setFirstName] = useState(profile.firstName);
  const [reasons, setReasons] = useState(profile.reasons);
  const [goal, setGoal] = useState(profile.goal);
  const [products, setProducts] = useState(profile.products);
  const [consumption, setConsumption] = useState(profile.consumption);

  const valid =
    (champ === "prenom" && firstName.trim().length > 0) ||
    (champ === "raisons" && reasons.length > 0) ||
    (champ === "objectif" && goal.name.trim().length > 0 && goal.amount > 0) ||
    (champ === "conso" && products.length > 0 && dailyCost({ products, consumption }) > 0);

  const save = () => {
    if (champ === "prenom") updateProfile({ firstName: firstName.trim() });
    if (champ === "raisons") updateProfile({ reasons });
    if (champ === "objectif") updateProfile({ goal: { name: goal.name.trim(), amount: goal.amount } });
    if (champ === "conso") updateProfile({ products, consumption });
    closeModal();
  };

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen>
        <ScreenHeader title={titles[champ]} onClose={closeModal} />

        {/* Le prénom est obligatoire, comme dans l'onboarding */}
        {champ === "prenom" && (
          <TextField
            placeholder={t.onboarding.accueil.prenom}
            accessibilityLabel={t.profil.prenom}
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoComplete="given-name"
            autoFocus
            maxLength={30}
            onSubmitEditing={() => valid && save()}
          />
        )}

        {champ === "raisons" && (
          <ReasonsForm value={reasons} onChange={setReasons} />
        )}

        {champ === "objectif" && <GoalForm value={goal} onChange={setGoal} />}

        {champ === "conso" && (
          <>
            <ProductPicker value={products} onChange={setProducts} />
            <ConsumptionForm products={products} value={consumption} onChange={setConsumption} />
          </>
        )}

        <Button label={t.commun.enregistrer} icon="check" disabled={!valid} onPress={save} />
      </Screen>
    </KeyboardAvoidingView>
  );
}
