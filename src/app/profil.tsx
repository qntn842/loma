import { router } from "expo-router";
import { Alert, Linking, Platform, Pressable, Switch, View } from "react-native";

import { Appear } from "@/components/ui/Appear";
import { Button } from "@/components/ui/Button";
import { Glass, Hairline } from "@/components/ui/Glass";
import { Icon, IconName } from "@/components/ui/Icon";
import { Screen, ScreenHeader, SectionTitle } from "@/components/ui/Screen";
import { Segmented } from "@/components/ui/Segmented";
import { Text } from "@/components/ui/Text";
import { premiumPrices } from "@/config/premium";
import { money, t } from "@/i18n";
import { dailyCost, hoursToEarn } from "@/lib/calc";
import { exportData } from "@/lib/exportData";
import { closeModal } from "@/lib/nav";
import { useProfile, useStore } from "@/lib/store";
import { useSession } from "@/lib/supabase";
import { ThemeSetting, useTheme } from "@/theme/ThemeProvider";

const tp = t.profil;

export default function Profil() {
  const profile = useProfile();
  const { data, setNotifications, setPremium, reset } = useStore();
  const { setting, setSetting, colors } = useTheme();
  const { session } = useSession();

  const switchColors = { trackColor: { false: colors.bordure, true: colors.accent }, thumbColor: colors.texte };

  return (
    <Screen>
      <ScreenHeader title={tp.titre} onClose={closeModal} icon="arrow-left" />

      {/* Carte Premium (accent) */}
      <Appear>
        {data.premium ? (
          // Membre Premium : carte au contour doré
          <Glass className="flex-row items-center gap-4" style={{ borderColor: colors.premium, borderWidth: 1.5 }}>
            <View className="h-11 w-11 items-center justify-center rounded-full bg-premium">
              <Icon name="star" size={20} tone="texteSurPremium" />
            </View>
            <View className="flex-1 gap-0.5">
              <Text weight="bold" tone="premiumTexte" className="text-base">
                {tp.premiumActif}
              </Text>
              <Text tone="texteSecondaire" className="text-sm">
                {tp.premiumActifTexte}
              </Text>
            </View>
          </Glass>
        ) : (
          <Glass variant="accent" className="flex-row items-center gap-4" onPress={() => router.push("/premium")} accessibilityLabel={tp.premiumTitre}>
            <View className="h-11 w-11 items-center justify-center rounded-full bg-premium">
              <Icon name="star" size={20} tone="texteSurPremium" />
            </View>
            <View className="flex-1 gap-0.5">
              <Text weight="bold" tone="texteSurAccent" className="text-base">
                {tp.premiumTitre}
              </Text>
              <Text tone="texteSurAccent" className="text-sm opacity-80">
                {tp.premiumTexte(hoursToEarn(premiumPrices.mensuel, profile))}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} tone="texteSurAccent" />
          </Glass>
        )}
      </Appear>

      {/* Compte facultatif */}
      <Appear index={1}>
        <Glass padding={0}>
          <Row
            icon="user"
            label={session ? t.compte.connecte : tp.connexion}
            value={session?.user.email ?? tp.connexionTexte}
            onPress={() => router.push("/compte")}
          />
        </Glass>
      </Appear>

      {/* Moi */}
      <SectionTitle>{tp.moi}</SectionTitle>
      <Appear index={1}>
        <Glass padding={0}>
          <Row icon="user" label={tp.prenom} value={profile.firstName} onPress={() => router.push("/modifier/prenom")} />
          <Hairline className="mx-5" />
          <Row
            icon="heart"
            label={tp.raisons}
            value={profile.reasons.length ? profile.reasons.join(", ") : tp.raisonsVide}
            onPress={() => router.push("/modifier/raisons")}
          />
          <Hairline className="mx-5" />
          <Row
            icon="gift"
            label={tp.objectif}
            value={profile.goal.name ? `${profile.goal.name} · ${money(profile.goal.amount, true)}` : t.onboarding.raisons.aucunObjectif}
            onPress={() => router.push("/modifier/objectif")}
          />
          <Hairline className="mx-5" />
          <Row
            icon="chart"
            label={tp.conso}
            value={`${profile.products.map((p) => t.produits[p]).join(", ")} · ${money(dailyCost(profile))} / ${t.unites.j}`}
            onPress={() => router.push("/modifier/conso")}
          />
        </Glass>
      </Appear>

      {/* Réglages */}
      <SectionTitle>{tp.reglages}</SectionTitle>
      <Appear index={2}>
        <Glass className="gap-4">
          <View className="gap-3">
            <Text weight="semi">{tp.theme}</Text>
            <Segmented<ThemeSetting>
              value={setting}
              onChange={setSetting}
              options={[
                { value: "sombre", label: tp.themes.sombre, icon: "moon" },
                { value: "clair", label: tp.themes.clair, icon: "sun" },
                { value: "auto", label: tp.themes.auto, icon: "smartphone" },
              ]}
            />
          </View>
          <Hairline />
          <View className="flex-row items-center gap-3">
            <Icon name="bell" size={18} tone="texteSecondaire" />
            <View className="flex-1 gap-0.5">
              <Text weight="semi">{tp.notifications}</Text>
              <Text tone="texteSecondaire" className="text-xs">
                {tp.notificationsTexte}
              </Text>
            </View>
            <Switch value={data.notifications} onValueChange={setNotifications} {...switchColors} />
          </View>
        </Glass>
      </Appear>
      <Appear index={3}>
        <Glass padding={0}>
          <Row icon="download" label={tp.exporter} value={tp.exporterTexte} onPress={() => exportData(data)} />
        </Glass>
      </Appear>

      {/* Mention */}
      <Appear index={4}>
        <Glass className="gap-3">
          <Text tone="texteSecondaire" className="text-sm leading-5">
            {tp.mention}
          </Text>
          <Button label={tp.appeler} icon="phone" variant="secondary" small onPress={() => Linking.openURL("tel:3989")} />
        </Glass>
      </Appear>

      {/* Outils de test : visibles seulement pendant le développement (Expo Go), jamais dans l'app publiée */}
      {__DEV__ && (
        <Glass className="gap-4">
          <Text weight="semi" tone="texteSecondaire" className="text-xs uppercase">
            {tp.dev}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text weight="medium">{tp.devPremium}</Text>
            <Switch value={data.premium} onValueChange={setPremium} {...switchColors} />
          </View>
          <Button
            label={tp.devReset}
            variant="secondary"
            small
            icon="trash"
            onPress={() => {
              // Sur le web, Alert.alert n'affiche rien : on passe par la boîte de confirmation du navigateur
              if (Platform.OS === "web") {
                if (window.confirm(tp.devResetConfirm)) reset();
                return;
              }
              Alert.alert(tp.devReset, tp.devResetConfirm, [
                { text: t.commun.annuler, style: "cancel" },
                { text: tp.devReset, style: "destructive", onPress: reset },
              ]);
            }}
          />
        </Glass>
      )}
    </Screen>
  );
}

type RowProps = { icon: IconName; label: string; value: string; onPress?: () => void; disabled?: boolean };

function Row({ icon, label, value, onPress, disabled }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      className={`min-h-16 flex-row items-center gap-4 px-5 py-4 ${disabled ? "opacity-50" : "active:opacity-70"}`}
    >
      <Icon name={icon} size={18} tone="accentClair" />
      <View className="flex-1 gap-0.5">
        <Text weight="semi" className="text-sm">
          {label}
        </Text>
        <Text tone="texteSecondaire" numberOfLines={1} className="text-xs">
          {value}
        </Text>
      </View>
      {disabled ? (
        <Text tone="texteSecondaire" className="text-xs">
          {t.commun.bientot}
        </Text>
      ) : (
        <Icon name="chevron-right" size={18} tone="texteSecondaire" />
      )}
    </Pressable>
  );
}
