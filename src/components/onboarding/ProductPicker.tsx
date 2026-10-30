import { View } from "react-native";

import { productIcons, ProductId, productIds } from "@/config/products";
import { t } from "@/i18n";
import { useTheme } from "@/theme/ThemeProvider";
import { Glass } from "../ui/Glass";
import { Icon } from "../ui/Icon";
import { Text } from "../ui/Text";

/** Choix multiple des produits à arrêter */
export function ProductPicker({ value, onChange }: { value: ProductId[]; onChange: (v: ProductId[]) => void }) {
  const toggle = (id: ProductId) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);

  return (
    <View className="gap-3">
      {productIds.map((id) => {
        const selected = value.includes(id);
        return (
          <Glass key={id} highlighted={selected} onPress={() => toggle(id)} padding={16} accessibilityLabel={t.produits[id]}>
            <View className="flex-row items-center gap-4">
              <IconBubble name={productIcons[id]} active={selected} />
              <Text weight="semi" className="flex-1 text-base">
                {t.produits[id]}
              </Text>
              <Check checked={selected} />
            </View>
          </Glass>
        );
      })}
    </View>
  );
}

function IconBubble({ name, active }: { name: (typeof productIcons)[keyof typeof productIcons]; active?: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      className={`h-11 w-11 items-center justify-center rounded-full ${active ? "bg-pastille" : ""}`}
      style={active ? undefined : { borderWidth: 1, borderColor: colors.bordure }}
    >
      <Icon name={name} size={20} tone={active ? "textePastille" : "texteSecondaire"} />
    </View>
  );
}

/** Case ronde cochée / vide */
export function Check({ checked }: { checked: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      className={`h-6 w-6 items-center justify-center rounded-full ${checked ? "bg-accent" : ""}`}
      style={checked ? undefined : { borderWidth: 1.5, borderColor: colors.bordure }}
    >
      {checked && <Icon name="check" size={14} tone="texteSurAccent" strokeWidth={2.4} />}
    </View>
  );
}
