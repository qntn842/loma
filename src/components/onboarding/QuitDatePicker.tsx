import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, View } from "react-native";

import { t } from "@/i18n";
import { useTheme } from "@/theme/ThemeProvider";
import { Button } from "../ui/Button";
import { Glass } from "../ui/Glass";
import { formatDay, formatTime, mergePick, PickerMode, QuitDateButton, QuitDatePickerProps } from "./QuitDateButton";

const tq = t.onboarding.arret;

/** Deux boutons séparés : la date, puis l'heure de la dernière cigarette (sélecteurs natifs du téléphone) */
export function QuitDatePicker({ value, onChange }: QuitDatePickerProps) {
  const { name } = useTheme();
  const [mode, setMode] = useState<PickerMode | null>(null);

  const pick = (e: DateTimePickerEvent, picked?: Date) => {
    // Android ouvre une fenêtre qui se ferme toute seule ; sur iPhone le sélecteur reste affiché
    if (Platform.OS === "android") setMode(null);
    if (e.type === "set" && picked && mode) onChange(mergePick(value, picked, mode));
  };

  return (
    <View className="gap-4">
      <View className="flex-row gap-3">
        <QuitDateButton
          icon="calendar"
          label={tq.date}
          value={formatDay(value)}
          active={mode === "date"}
          onPress={() => setMode("date")}
        />
        <QuitDateButton
          icon="clock"
          label={tq.heure}
          value={formatTime(value)}
          active={mode === "time"}
          onPress={() => setMode("time")}
        />
      </View>

      {mode && Platform.OS === "android" && (
        <DateTimePicker value={new Date(value)} mode={mode} is24Hour onChange={pick} />
      )}

      {mode && Platform.OS === "ios" && (
        <Glass className="items-center gap-3">
          <DateTimePicker
            value={new Date(value)}
            mode={mode}
            display={mode === "date" ? "inline" : "spinner"}
            locale="fr-FR"
            themeVariant={name === "sombre" ? "dark" : "light"}
            onChange={pick}
          />
          <Button label={t.commun.ok} small onPress={() => setMode(null)} />
        </Glass>
      )}
    </View>
  );
}
