import { View } from "react-native";

import { Glass } from "../ui/Glass";
import { Icon, IconName } from "../ui/Icon";
import { Label, Text } from "../ui/Text";

export type PickerMode = "date" | "time";

export type QuitDatePickerProps = { value: number; onChange: (v: number) => void };

/** "27 octobre 2026" */
export const formatDay = (ts: number) =>
  new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/** "14:05" */
export const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

/** Remplace le jour (mode "date") ou l'heure (mode "time") de `value` par celui choisi (passé ou futur) */
export function mergePick(value: number, picked: Date, mode: PickerMode): number {
  const d = new Date(value);
  if (mode === "date") d.setFullYear(picked.getFullYear(), picked.getMonth(), picked.getDate());
  else d.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
  return d.getTime();
}

type Props = { icon: IconName; label: string; value: string; active?: boolean; onPress: () => void };

/** Carte de verre cliquable : petit libellé gris + valeur choisie */
export function QuitDateButton({ icon, label, value, active, onPress }: Props) {
  return (
    <View className="flex-1">
      <Glass onPress={onPress} highlighted={active} padding={16} accessibilityLabel={label}>
        <View className="gap-3">
          <Icon name={icon} size={22} tone="accent" />
          <Label>{label}</Label>
          <Text weight="semi" className="text-base" numberOfLines={1} adjustsFontSizeToFit>
            {value}
          </Text>
        </View>
      </Glass>
    </View>
  );
}
