import * as Sharing from "expo-sharing";
import { ComponentRef, useRef } from "react";
import { Platform, Pressable, Share, View } from "react-native";
import { captureRef } from "react-native-view-shot";

import { timeMilestones } from "@/config/milestones";
import { durationWords, money, t } from "@/i18n";
import { bestStreak, currentStreak, netSavings } from "@/lib/calc";
import type { AppData } from "@/lib/types";
import { alpha } from "@/theme/color";
import { useTheme } from "@/theme/ThemeProvider";
import { GlowingInsignia } from "./BadgeCarousel";
import { Icon } from "./ui/Icon";
import { Text } from "./ui/Text";

const ta = t.aujourdhui;
const CARD = 360;

/**
 * Bouton rond « partager » à côté du rond Profil (partage l'insigne affiché dans le carrousel). Il fabrique une image (insigne + temps sans fumer + argent)
 * à partir d'une carte dessinée hors de l'écran, puis ouvre le menu de partage du téléphone (comme navigator.share).
 * Dans le navigateur, la capture d'image n'est pas disponible : on partage un texte.
 */
export function ShareBadge({
  data,
  now,
  index,
}: {
  data: AppData;
  now: number;
  index: number;
}) {
  const { colors } = useTheme();
  const card = useRef<ComponentRef<typeof View>>(null);

  const m = timeMilestones[index];
  const name = t.trophees.etapesNoms[m.id];
  const unlocked = bestStreak(data, now) >= m.ms;
  const title = unlocked ? ta.badgeTitre(name) : ta.partageEnRoute(name);
  const line = ta.partageLigne(
    durationWords(currentStreak(data, now)),
    money(netSavings(data, now)),
  );

  const share = async () => {
    const message = ta.partageMessage(title, line);
    try {
      if (
        Platform.OS !== "web" &&
        card.current &&
        (await Sharing.isAvailableAsync())
      ) {
        const uri = await captureRef(card, {
          format: "png",
          quality: 1,
          result: "tmpfile",
        });
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: ta.partager,
          UTI: "public.png",
        });
      } else {
        await Share.share({ message });
      }
    } catch {
      // Partage annulé ou indisponible : rien à faire
    }
  };

  return (
    <>
      {/* Bouton rond, même taille que le rond Profil */}
      <Pressable
        onPress={share}
        accessibilityRole="button"
        accessibilityLabel={ta.partager}
        className="h-11 w-11 items-center justify-center rounded-full active:opacity-70"
        style={{
          backgroundColor: alpha(colors.texte, 0.06),
          borderWidth: 1,
          borderColor: colors.bordure,
        }}
      >
        <Icon name="share" size={18} />
      </Pressable>

      {/* Carte à partager, dessinée hors de l'écran (jamais visible) */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", left: -10000, top: 0 }}
      >
        <View
          ref={card}
          collapsable={false}
          style={{
            width: CARD,
            height: CARD,
            backgroundColor: colors.fond,
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: 24,
          }}
        >
          <GlowingInsignia
            level={index}
            size={230}
            locked={!unlocked}
            glowSize={240}
          />
          <Text
            weight="bold"
            className="text-center text-xl"
            style={{ marginTop: -16 }}
          >
            {title}
          </Text>
          <Text tone="texteSecondaire" className="text-center text-sm">
            {line}
          </Text>
          <Text
            weight="bold"
            tone="accent"
            className="text-sm"
            style={{ marginTop: 8, letterSpacing: 1 }}
          >
            Loma
          </Text>
        </View>
      </View>
    </>
  );
}
