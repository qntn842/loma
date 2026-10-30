import { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MAX_CONTENT_WIDTH } from "@/hooks/useLayout";
import { useTheme } from "@/theme/ThemeProvider";
import { Backdrop } from "./Backdrop";
import { Icon } from "./Icon";
import { Text } from "./Text";

/** Espace laissé sous le contenu pour la barre d'onglets */
export const TAB_BAR_SPACE = 110;

type Props = {
  children: ReactNode;
  /** Écran d'onglet : laisse la place à la barre du bas */
  withTabBar?: boolean;
  /** Pas de défilement (écrans plein écran) */
  fixed?: boolean;
  /** Couleur de la lueur du haut */
  glow?: "accent" | "sos";
  className?: string;
  /** Espace en plus en bas (ex. bouton fixé au-dessus de la barre) */
  extraBottom?: number;
};

/** Conteneur d'écran : fond avec lueur, marges sûres (encoche), défilement */
export function Screen({ children, withTabBar, fixed, glow = "accent", className = "", extraBottom = 0 }: Props) {
  const insets = useSafeAreaInsets();
  // Sur tablette, le contenu reste centré avec une largeur maximale
  const padding = {
    width: "100%" as const,
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center" as const,
    paddingTop: insets.top + 12,
    paddingBottom: (withTabBar ? TAB_BAR_SPACE : 28) + insets.bottom + extraBottom,
  };
  return (
    <View className="flex-1">
      <Backdrop tone={glow} />
      {fixed ? (
        <View className={`flex-1 px-5 ${className}`} style={padding}>
          {children}
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName={`px-5 gap-4 ${className}`}
          contentContainerStyle={padding}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      )}
    </View>
  );
}

/** Bouton rond (fermer, retour) */
export function RoundButton({ icon, onPress, label }: { icon: "x" | "arrow-left"; onPress: () => void; label: string }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="h-11 w-11 items-center justify-center rounded-full active:opacity-70"
      style={{ borderWidth: 1, borderColor: colors.bordure }}
    >
      <Icon name={icon} size={20} />
    </Pressable>
  );
}

/** Titre d'écran avec bouton fermer (pour les écrans qui s'ouvrent par-dessus) */
export function ScreenHeader({ title, onClose, icon = "x" }: { title?: string; onClose: () => void; icon?: "x" | "arrow-left" }) {
  return (
    <View className="mb-1 min-h-11 flex-row items-center justify-between gap-3">
      {/* Titre au centre : une case vide de la taille du bouton équilibre l'autre côté */}
      {icon === "arrow-left" ? <RoundButton icon={icon} onPress={onClose} label="Retour" /> : <View className="w-11" />}
      <Text weight="bold" className="flex-1 text-center text-xl" numberOfLines={1}>
        {title ?? ""}
      </Text>
      {icon === "x" ? <RoundButton icon={icon} onPress={onClose} label="Fermer" /> : <View className="w-11" />}
    </View>
  );
}

/** Titre de page d'onglet (gros titre + sous-titre gris), centré */
export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="items-center gap-1">
      <Text weight="bold" className="text-center text-3xl">
        {title}
      </Text>
      {subtitle && (
        <Text tone="texteSecondaire" className="text-center text-sm">
          {subtitle}
        </Text>
      )}
    </View>
  );
}

/** Titre de section (sous-titre) : blanc, gras, comme « Infos du jour » sur l'accueil */
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <View className="mt-3">
      {/* Sous-titre bien visible, mais plus petit que le gros titre de la page (text-3xl) */}
      <Text weight="bold" className="text-xl">
        {children}
      </Text>
    </View>
  );
}
