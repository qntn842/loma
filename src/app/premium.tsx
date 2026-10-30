import { useState } from "react";
import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Badge } from "@/components/Badge";
import { Check } from "@/components/onboarding/ProductPicker";
import { Appear } from "@/components/ui/Appear";
import { Button } from "@/components/ui/Button";
import { Glass } from "@/components/ui/Glass";
import { Icon } from "@/components/ui/Icon";
import { Screen, ScreenHeader } from "@/components/ui/Screen";
import { Label, Text } from "@/components/ui/Text";
import { premiumPrices } from "@/config/premium";
import { useLayout } from "@/hooks/useLayout";
import { money, t } from "@/i18n";
import { hoursToEarn, monthlyCost } from "@/lib/calc";
import { closeModal } from "@/lib/nav";
import { useProfile } from "@/lib/store";

type Plan = "annuel" | "mensuel" | "vie";
const tp = t.premium;

export default function Premium() {
  const { scale } = useLayout();
  const profile = useProfile();
  const [plan, setPlan] = useState<Plan>("annuel");
  const [soon, setSoon] = useState(false);

  const hours = hoursToEarn(premiumPrices.mensuel, profile);

  const plans: { id: Plan; price: string; period: string; sub?: string }[] = [
    {
      id: "annuel",
      price: money(premiumPrices.annuel),
      period: tp.formules.parAn,
      sub: tp.formules.parMois(money(premiumPrices.annuel / 12)),
    },
    { id: "mensuel", price: money(premiumPrices.mensuel), period: tp.formules.parMoisCourt },
    { id: "vie", price: money(premiumPrices.vie), period: "", sub: tp.formules.uneFois },
  ];

  return (
    <Screen>
      <ScreenHeader onClose={closeModal} />

      {/* Badge doré */}
      <View className="items-center">
        <Badge icone="star" couleur="or" taille={150 * scale} />
      </View>

      <Appear>
        <View className="items-center gap-3">
          <Text weight="bold" className="text-center text-3xl leading-9">
            {tp.titre}
          </Text>
          <Text tone="texteSecondaire" className="text-center text-base leading-6">
            {tp.texte(money(monthlyCost(profile), true), hours)}
          </Text>
        </View>
      </Appear>

      <Appear index={1}>
        <Glass className="gap-3">
          {tp.avantages.map((a) => (
            <View key={a} className="flex-row items-start gap-3">
              <View className="mt-0.5">
                <Icon name="check" size={18} tone="accentClair" strokeWidth={2.2} />
              </View>
              <Text weight="medium" className="flex-1 text-sm leading-5">
                {a}
              </Text>
            </View>
          ))}
        </Glass>
      </Appear>

      <Appear index={2}>
        <View className="gap-3 pt-2">
          {plans.map((p) => {
            const selected = plan === p.id;
            return (
              <View key={p.id}>
                <Glass highlighted={p.id === "annuel"} onPress={() => setPlan(p.id)} padding={18} accessibilityLabel={tp.formules[p.id]}>
                  <View className="flex-row items-center gap-3">
                    <Check checked={selected} />
                    <View className="flex-1">
                      <Text weight="semi" className="text-base">
                        {tp.formules[p.id]}
                      </Text>
                      {p.sub && (
                        <Text tone="texteSecondaire" className="text-xs">
                          {p.sub}
                        </Text>
                      )}
                    </View>
                    <Text weight="semi" className="text-lg">
                      {p.price}
                      <Text tone="texteSecondaire" className="text-sm">
                        {p.period ? ` ${p.period}` : ""}
                      </Text>
                    </Text>
                  </View>
                </Glass>
                {p.id === "annuel" && (
                  <View className="absolute -top-3 right-5 rounded-full bg-accent px-3 py-1">
                    <Text weight="semi" tone="texteSurAccent" style={{ fontSize: 11 }}>
                      {tp.formules.plusRentable}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </Appear>

      {soon && (
        <Animated.View entering={FadeInDown}>
          <Glass className="gap-1">
            <Label tone="premium">{tp.bientot}</Label>
            <Text tone="texteSecondaire" className="text-sm leading-5">
              {tp.bientotTexte}
            </Text>
          </Glass>
        </Animated.View>
      )}

      <View className="gap-2">
        <Button label={soon ? tp.bientot : tp.passer} icon="star" onPress={() => setSoon(true)} />
        <Button label={tp.gratuit} variant="ghost" onPress={closeModal} />
        <Text tone="texteSecondaire" className="text-center text-xs">
          {tp.mention}
        </Text>
      </View>
    </Screen>
  );
}
