import { View } from "react-native";

import { t } from "@/i18n";
import { NumberField } from "../ui/NumberField";
import { TextField } from "../ui/TextField";

type Goal = { name: string; amount: number };

/** Objectif d'épargne : un nom et un montant (facultatif : sans nom, pas d'objectif) */
export function GoalForm({ value, onChange }: { value: Goal; onChange: (v: Goal) => void }) {
  const tr = t.onboarding.raisons;
  return (
    <View className="gap-3">
      <TextField
        accessibilityLabel={tr.objectifNom}
        value={value.name}
        onChangeText={(name) => onChange({ ...value, name })}
        placeholder={tr.objectifNomExemple}
        maxLength={40}
      />
      <NumberField
        label={tr.objectifMontant}
        hideLabel
        value={value.amount}
        onChange={(amount) => onChange({ ...value, amount })}
        step={50}
        min={1}
        max={100000}
        suffix="€"
      />
    </View>
  );
}
