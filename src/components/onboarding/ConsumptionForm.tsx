import { View } from "react-native";

import type { Consumption, ProductId } from "@/config/products";
import { money, t } from "@/i18n";
import { dailyCost } from "@/lib/calc";
import { Glass } from "../ui/Glass";
import { Icon } from "../ui/Icon";
import { NumberField } from "../ui/NumberField";
import { Text } from "../ui/Text";

type Props = {
  products: ProductId[];
  value: Consumption;
  onChange: (v: Consumption) => void;
};

const tc = t.onboarding.conso;

/** Consommation par jour et prix, adaptés à chaque produit choisi */
export function ConsumptionForm({ products, value, onChange }: Props) {
  // Met à jour un seul champ d'un produit
  const set = <P extends ProductId>(p: P, field: keyof Consumption[P], v: number) =>
    onChange({ ...value, [p]: { ...value[p], [field]: v } });

  const cost = dailyCost({ products, consumption: value });

  return (
    <View className="gap-4">
      {products.includes("cigarettes") && (
        <Glass className="gap-4">
          <Text weight="bold" className="text-lg">{t.produits.cigarettes}</Text>
          <NumberField label={tc.cigarettesParJour} value={value.cigarettes.perDay} onChange={(v) => set("cigarettes", "perDay", v)} min={1} max={100} />
          <NumberField label={tc.prixPaquet} value={value.cigarettes.packPrice} onChange={(v) => set("cigarettes", "packPrice", v)} step={0.5} decimal suffix="€" max={100} />
        </Glass>
      )}
      {products.includes("roule") && (
        <Glass className="gap-4">
          <Text weight="bold" className="text-lg">{t.produits.roule}</Text>
          <NumberField label={tc.rouleParJour} value={value.roule.perDay} onChange={(v) => set("roule", "perDay", v)} min={1} max={100} />
          <NumberField label={tc.prixBlague} value={value.roule.pouchPrice} onChange={(v) => set("roule", "pouchPrice", v)} step={0.5} decimal suffix="€" max={200} />
          <NumberField label={tc.cigarettesParBlague} value={value.roule.perPouch} onChange={(v) => set("roule", "perPouch", v)} step={5} min={5} max={500} />
        </Glass>
      )}
      <View className="flex-row items-center gap-2 self-center rounded-full bg-pastille px-4 py-2">
        <Icon name="trending-up" size={16} tone="textePastille" />
        <Text weight="semi" tone="textePastille">
          {tc.parJour(money(cost))}
        </Text>
      </View>
    </View>
  );
}
