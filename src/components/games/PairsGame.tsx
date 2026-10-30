import { useState } from "react";
import { Pressable, View } from "react-native";

import { t } from "@/i18n";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "../ui/Button";
import { Icon, IconName } from "../ui/Icon";
import { Text } from "../ui/Text";

const icons: IconName[] = ["sun", "heart", "music", "coffee", "star", "umbrella"];

const shuffle = <T,>(list: T[]) => [...list].sort(() => Math.random() - 0.5);
const newDeck = () => shuffle([...icons, ...icons]).map((icon, i) => ({ id: i, icon }));

/** Memory : retrouve les paires d'icônes */
export function PairsGame() {
  const { colors } = useTheme();
  const [deck, setDeck] = useState(newDeck);
  const [open, setOpen] = useState<number[]>([]);
  const [found, setFound] = useState<IconName[]>([]);
  const [moves, setMoves] = useState(0);

  const flip = (i: number) => {
    if (open.length >= 2 || open.includes(i) || found.includes(deck[i].icon)) return;
    if (open.length === 0) {
      setOpen([i]);
      return;
    }
    // Deuxième carte : on garde si elles vont ensemble, sinon on les recache
    setMoves((m) => m + 1);
    if (deck[open[0]].icon === deck[i].icon) {
      setFound([...found, deck[i].icon]);
      setOpen([]);
    } else {
      setOpen([open[0], i]);
      setTimeout(() => setOpen([]), 700);
    }
  };

  const done = found.length === icons.length;

  return (
    <View className="gap-4">
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {deck.map((card, i) => {
          const visible = open.includes(i) || found.includes(card.icon);
          return (
            <Pressable
              key={card.id}
              onPress={() => flip(i)}
              accessibilityRole="button"
              className={`aspect-square w-[23%] items-center justify-center rounded-3xl active:opacity-80 ${visible ? "bg-pastille" : ""}`}
              style={visible ? undefined : { borderWidth: 1, borderColor: colors.bordure, backgroundColor: colors.carte[1] }}
            >
              {visible && <Icon name={card.icon} size={26} tone="textePastille" />}
            </Pressable>
          );
        })}
      </View>
      {done && (
        <View className="gap-3">
          <Text weight="semi" tone="accentClair" className="text-center text-xl">
            {t.miniJeux.paires.fini(moves)}
          </Text>
          <Button
            label={t.miniJeux.rejouer}
            variant="secondary"
            icon="refresh"
            onPress={() => {
              setDeck(newDeck());
              setFound([]);
              setOpen([]);
              setMoves(0);
            }}
          />
        </View>
      )}
    </View>
  );
}
