import { useState } from "react";
import { Pressable, View } from "react-native";

import { BubblesGame } from "@/components/games/BubblesGame";
import { OrderGame } from "@/components/games/OrderGame";
import { PairsGame } from "@/components/games/PairsGame";
import { Icon, IconName } from "@/components/ui/Icon";
import { PremiumBadge, PremiumLock } from "@/components/ui/Premium";
import { Screen, ScreenHeader } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { t } from "@/i18n";
import { closeModal } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { useTheme } from "@/theme/ThemeProvider";

type GameId = "bulles" | "paires" | "ordre";

// Le premier jeu est gratuit, les autres sont Premium
const games: { id: GameId; icon: IconName; free: boolean }[] = [
  { id: "bulles", icon: "circle", free: true },
  { id: "paires", icon: "copy", free: false },
  { id: "ordre", icon: "hash", free: false },
];

export default function MiniJeux() {
  const { colors } = useTheme();
  const { data } = useStore();
  const [game, setGame] = useState<GameId>("bulles");
  const current = games.find((g) => g.id === game)!;
  const unlocked = current.free || data.premium;

  return (
    <Screen>
      <ScreenHeader title={t.miniJeux.titre} onClose={closeModal} />
      <Text tone="texteSecondaire" className="text-sm">
        {t.miniJeux.texte}
      </Text>

      <View className="flex-row gap-2">
        {games.map((g) => {
          const selected = g.id === game;
          return (
            <Pressable
              key={g.id}
              onPress={() => setGame(g.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              className="min-h-20 flex-1 items-center justify-center gap-1.5 rounded-3xl p-2 active:opacity-80"
              style={{ borderWidth: selected ? 1.5 : 1, borderColor: selected ? colors.accent : colors.bordure, backgroundColor: colors.carte[1] }}
            >
              <Icon name={g.icon} size={20} tone={selected ? "accentClair" : "texteSecondaire"} />
              <Text weight="semi" tone={selected ? "texte" : "texteSecondaire"} className="text-center text-xs">
                {t.miniJeux[g.id].nom}
              </Text>
              {g.free ? (
                <Text tone="accent" weight="semi" style={{ fontSize: 10 }}>
                  {t.miniJeux.gratuit}
                </Text>
              ) : (
                !data.premium && <PremiumBadge />
              )}
            </Pressable>
          );
        })}
      </View>

      <Text tone="texteSecondaire" className="text-center text-sm">
        {t.miniJeux[game].texte}
      </Text>

      {!unlocked ? (
        <PremiumLock title={t.miniJeux[game].nom} text={t.premium.avantages[2]} />
      ) : game === "bulles" ? (
        <BubblesGame />
      ) : game === "paires" ? (
        <PairsGame />
      ) : (
        <OrderGame />
      )}
    </Screen>
  );
}
