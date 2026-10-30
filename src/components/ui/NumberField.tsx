import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { useTheme } from "@/theme/ThemeProvider";
import { Icon } from "./Icon";
import { fontFamily, Label, Text } from "./Text";

type Props = {
  label: string;
  /** Cache l'étiquette au-dessus (elle reste lue par le lecteur d'écran) */
  hideLabel?: boolean;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  /** Nombre à virgule (prix) */
  decimal?: boolean;
  suffix?: string;
};

/** Champ nombre avec boutons − / + (le clavier reste possible pour taper la valeur) */
export function NumberField({ label, hideLabel, value, onChange, step = 1, min = 0, max = 9999, decimal, suffix }: Props) {
  const { colors } = useTheme();
  const toText = (v: number) => (decimal ? v.toFixed(2).replace(".", ",").replace(/,00$/, "") : String(v));
  // Texte en cours de frappe ; le reste du temps on affiche la valeur
  const [draft, setDraft] = useState<string | null>(null);

  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const bump = (dir: 1 | -1) => onChange(clamp(Math.round((value + dir * step) * 100) / 100));

  const commit = (s: string) => {
    setDraft(s);
    const v = parseFloat(s.replace(",", "."));
    if (!isNaN(v)) onChange(clamp(v));
  };

  return (
    <View className="gap-2">
      {!hideLabel && <Label>{label}</Label>}
      <View className="flex-row items-center gap-3">
        <StepButton icon="minus" onPress={() => bump(-1)} label={`Moins ${label}`} />
        <View
          className="h-14 flex-1 flex-row items-center justify-center rounded-full px-3"
          style={{ borderWidth: 1, borderColor: colors.bordure }}
        >
          <TextInput
            value={draft ?? toText(value)}
            onChangeText={commit}
            onBlur={() => setDraft(null)}
            keyboardType={decimal ? "decimal-pad" : "number-pad"}
            selectTextOnFocus
            accessibilityLabel={label}
            style={{ fontFamily: fontFamily("semi"), fontSize: 22, color: colors.texte, textAlign: "center", minWidth: 60 }}
          />
          {suffix && (
            <Text weight="medium" tone="texteSecondaire" className="text-lg">
              {suffix}
            </Text>
          )}
        </View>
        <StepButton icon="plus" onPress={() => bump(1)} label={`Plus ${label}`} />
      </View>
    </View>
  );
}

function StepButton({ icon, onPress, label }: { icon: "minus" | "plus"; onPress: () => void; label: string }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="h-14 w-14 items-center justify-center rounded-full active:opacity-70"
      style={{ borderWidth: 1, borderColor: colors.bordure, backgroundColor: colors.carte[1] }}
    >
      <Icon name={icon} size={20} />
    </Pressable>
  );
}
