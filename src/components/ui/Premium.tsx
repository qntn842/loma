import { router } from "expo-router";
import { Pressable, View } from "react-native";

import { t } from "@/i18n";
import { Button } from "./Button";
import { Glass } from "./Glass";
import { Icon } from "./Icon";
import { Text } from "./Text";

/** Petit badge doré « Premium » */
export function PremiumBadge() {
  return (
    <View className="flex-row items-center gap-1 self-start rounded-full bg-premium px-2.5 py-1">
      <Icon name="star" size={11} tone="texteSurPremium" />
      <Text weight="semi" tone="texteSurPremium" style={{ fontSize: 11 }}>
        {t.premium.badge}
      </Text>
    </View>
  );
}

/** Petite étoile dorée dans un rond : signe discret des membres Premium */
export function PremiumStar({ size = 18 }: { size?: number }) {
  return (
    <View className="items-center justify-center rounded-full bg-premium" style={{ width: size, height: size }}>
      <Icon name="star" size={Math.round(size * 0.55)} tone="texteSurPremium" strokeWidth={2.2} />
    </View>
  );
}

/** Encart sobre qui remplace une fonction Premium */
export function PremiumLock({ title, text }: { title: string; text?: string }) {
  return (
    <Glass className="gap-3">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 flex-row items-center gap-2">
          <Icon name="lock" size={16} tone="texteSecondaire" />
          <Text weight="semi" className="flex-1 text-base">
            {title}
          </Text>
        </View>
        <PremiumBadge />
      </View>
      {text && (
        <Text tone="texteSecondaire" className="text-sm leading-5">
          {text}
        </Text>
      )}
      <Button label={t.commun.debloquer} variant="secondary" small onPress={() => router.push("/premium")} />
    </Glass>
  );
}

/** Pastille de statut avec un petit éclair (ex. « Survivant »), toujours menthe */
export function StatusPill({ label, onPress, accessibilityLabel }: { label: string; onPress?: () => void; accessibilityLabel?: string }) {
  const tone = "textePastille";
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      hitSlop={4}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={accessibilityLabel}
      className={`h-9 flex-row items-center gap-1.5 rounded-full px-3.5 active:opacity-70 bg-pastille`}
    >
      <Icon name="zap" size={13} tone={tone} strokeWidth={2.2} />
      <Text weight="semi" tone={tone} className="text-sm">
        {label}
      </Text>
    </Pressable>
  );
}
