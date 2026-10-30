import { View } from "react-native";

import { t } from "@/i18n";
import { ChipsEditor } from "../ChipsEditor";

/** Raisons d'arrêter : suggestions + raisons personnalisées, sans limite */
export function ReasonsForm({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const suggestions = t.onboarding.raisons.suggestions;
  const options = [...suggestions, ...value.filter((r) => !suggestions.includes(r))];
  return (
    <View>
      <ChipsEditor
        options={options}
        selected={value}
        onToggle={(r) => onChange(value.includes(r) ? value.filter((x) => x !== r) : [...value, r])}
        onAdd={(r) => !value.includes(r) && onChange([...value, r])}
        placeholder={t.onboarding.raisons.autre}
      />
    </View>
  );
}
