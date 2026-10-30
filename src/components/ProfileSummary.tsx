import { View } from "react-native";

import type { ProductId } from "@/config/products";
import { t } from "@/i18n";
import { Glass, Hairline } from "./ui/Glass";
import { Label, Text } from "./ui/Text";

type Props = { products: ProductId[]; quit: string; daily: string; goal: string };

/** Carte récap du profil en verre (fin de l'onboarding) */
export function ProfileSummary({ products, quit, daily, goal }: Props) {
  const r = t.onboarding.resultat;
  const rows = [
    { label: r.produits, value: products.map((p) => t.produits[p]).join(", ") },
    { label: r.arret, value: quit },
    { label: r.parJour, value: daily },
    { label: r.objectif, value: goal },
  ];
  return (
    <Glass className="gap-3">
      <Label>{r.recap}</Label>
      {rows.map((row, i) => (
        <View key={row.label} className="gap-3">
          {i > 0 && <Hairline />}
          <View className="flex-row items-start justify-between gap-4">
            <Text tone="texteSecondaire" className="text-sm">
              {row.label}
            </Text>
            <Text weight="semi" className="flex-1 text-right text-sm">
              {row.value}
            </Text>
          </View>
        </View>
      ))}
    </Glass>
  );
}
