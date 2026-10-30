import { useState } from "react";
import { Pressable, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Glass } from "@/components/ui/Glass";
import { Icon } from "@/components/ui/Icon";
import { Screen, ScreenHeader } from "@/components/ui/Screen";
import { Label, Text } from "@/components/ui/Text";
import { useNow } from "@/hooks/useNow";
import { duration, money, t } from "@/i18n";
import { bestStreak, netSavings, relapseUnit } from "@/lib/calc";
import { closeModal } from "@/lib/nav";
import { useProfile, useStore } from "@/lib/store";
import { useTheme } from "@/theme/ThemeProvider";

const tc = t.craque;

// Ton doux : pas de couleur d'alerte, uniquement le vert et le verre
export default function Craque() {
  const profile = useProfile();
  const { data, addRelapse } = useStore();
  const now = useNow(60_000);
  const [count, setCount] = useState(1);
  const [causes, setCauses] = useState<string[]>([]);

  const unit = relapseUnit(profile);
  const unitTexts = t.uniteEcart[unit.id];

  const toggle = (c: string) => setCauses(causes.includes(c) ? causes.filter((x) => x !== c) : [...causes, c]);

  return (
    <Screen>
      <ScreenHeader onClose={closeModal} />
      <View className="gap-2">
        <Text weight="bold" className="text-3xl leading-9">
          {tc.titre}
        </Text>
        <Text tone="texteSecondaire" className="text-base leading-6">
          {tc.texte}
        </Text>
      </View>

      <View className="flex-row gap-3">
        <Glass className="flex-1 gap-1" style={{ flex: 1 }}>
          <Label>{tc.meilleureSerie}</Label>
          <Text weight="semi" className="text-2xl">
            {duration(bestStreak(data, now))}
          </Text>
        </Glass>
        <Glass className="flex-1 gap-1" style={{ flex: 1 }}>
          <Label>{tc.argentGarde}</Label>
          <Text weight="semi" tone="accentClair" className="text-2xl">
            {money(netSavings(data, now))}
          </Text>
        </Glass>
      </View>

      <Glass className="gap-4">
        <Label>{tc.combien(unitTexts.nom)}</Label>
        <View className="flex-row items-center justify-center gap-6">
          <Round icon="minus" onPress={() => setCount(Math.max(1, count - 1))} label="Moins" />
          <Text weight="semi" className="w-20 text-center" style={{ fontSize: 48 }}>
            {count}
          </Text>
          <Round icon="plus" onPress={() => setCount(Math.min(99, count + 1))} label="Plus" />
        </View>
        <Text tone="texteSecondaire" className="text-center text-xs">
          − {money(count * unit.cost)}
        </Text>
      </Glass>

      <Glass className="gap-3">
        <Label>{tc.causes}</Label>
        <View className="flex-row flex-wrap gap-2">
          {tc.causesListe.map((c) => (
            <Chip key={c} label={c} selected={causes.includes(c)} onPress={() => toggle(c)} />
          ))}
        </View>
      </Glass>

      <Button
        label={tc.repartir}
        icon="refresh"
        onPress={() => {
          addRelapse(count, causes);
          closeModal();
        }}
      />
    </Screen>
  );
}

function Round({ icon, onPress, label }: { icon: "minus" | "plus"; onPress: () => void; label: string }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="h-14 w-14 items-center justify-center rounded-full active:opacity-70"
      style={{ borderWidth: 1, borderColor: colors.bordure }}
    >
      <Icon name={icon} size={22} />
    </Pressable>
  );
}
