import { useRef } from "react";
import { View } from "react-native";

import { t } from "@/i18n";
import { formatDay, formatTime, mergePick, QuitDateButton, QuitDatePickerProps } from "./QuitDateButton";

const tq = t.onboarding.arret;
const pad = (n: number) => n.toString().padStart(2, "0");

/**
 * Version navigateur : le sélecteur natif n'existe pas sur le web,
 * on ouvre donc les champs <input type="date"> et <input type="time"> cachés du navigateur.
 */
export function QuitDatePicker({ value, onChange }: QuitDatePickerProps) {
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const d = new Date(value);

  const open = (input: HTMLInputElement | null) => {
    if (!input) return;
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  };

  return (
    <View className="flex-row gap-3">
      <QuitDateButton icon="calendar" label={tq.date} value={formatDay(value)} onPress={() => open(dateRef.current)} />
      <QuitDateButton icon="clock" label={tq.heure} value={formatTime(value)} onPress={() => open(timeRef.current)} />
      <input
        ref={dateRef}
        type="date"
        style={hidden}
        value={`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`}
        onChange={(e) => {
          const [y, m, day] = e.target.value.split("-").map(Number);
          if (y) onChange(mergePick(value, new Date(y, m - 1, day), "date"));
        }}
      />
      <input
        ref={timeRef}
        type="time"
        style={hidden}
        value={`${pad(d.getHours())}:${pad(d.getMinutes())}`}
        onChange={(e) => {
          const [h, min] = e.target.value.split(":").map(Number);
          if (!Number.isNaN(h)) onChange(mergePick(value, new Date(2000, 0, 1, h, min), "time"));
        }}
      />
    </View>
  );
}

// Invisible mais présent dans la page, pour que showPicker() fonctionne
const hidden = { position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none", bottom: 0, left: 0 } as const;
