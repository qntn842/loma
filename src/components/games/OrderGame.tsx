import { useState } from "react";
import { Pressable, View } from "react-native";

import { decimal, t } from "@/i18n";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "../ui/Button";
import { Text } from "../ui/Text";

const COUNT = 16;
const seconds = () => Date.now() / 1000;
const newGrid = () => Array.from({ length: COUNT }, (_, i) => i + 1).sort(() => Math.random() - 0.5);

/** Touche les nombres de 1 à 16 dans l'ordre, le plus vite possible */
export function OrderGame() {
  const { colors } = useTheme();
  const [grid, setGrid] = useState(newGrid);
  const [nextNumber, setNextNumber] = useState(1);
  const [start, setStart] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);

  const press = (n: number) => {
    if (n !== nextNumber) return;
    const at = seconds();
    if (n === 1) setStart(at);
    if (n === COUNT) setTime(at - (start ?? at));
    setNextNumber(n + 1);
  };

  return (
    <View className="gap-4">
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {grid.map((n) => {
          const done = n < nextNumber;
          return (
            <Pressable
              key={n}
              onPress={() => press(n)}
              accessibilityRole="button"
              accessibilityLabel={String(n)}
              className={`aspect-square w-[23%] items-center justify-center rounded-3xl active:opacity-80 ${done ? "bg-pastille" : ""}`}
              style={done ? undefined : { borderWidth: 1, borderColor: colors.bordure, backgroundColor: colors.carte[1] }}
            >
              <Text weight="semi" tone={done ? "textePastille" : "texte"} className="text-2xl">
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {time !== null && (
        <View className="gap-3">
          <Text weight="semi" tone="accentClair" className="text-center text-xl">
            {t.miniJeux.ordre.fini(decimal(time))}
          </Text>
          <Button
            label={t.miniJeux.rejouer}
            variant="secondary"
            icon="refresh"
            onPress={() => {
              setGrid(newGrid());
              setNextNumber(1);
              setStart(null);
              setTime(null);
            }}
          />
        </View>
      )}
    </View>
  );
}
