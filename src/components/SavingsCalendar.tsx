import { useState } from "react";
import { Pressable, View } from "react-native";

import { money, t } from "@/i18n";
import { dayResult } from "@/lib/calc";
import type { AppData } from "@/lib/types";
import { alpha } from "@/theme/color";
import { useTheme } from "@/theme/ThemeProvider";
import { Icon, IconName } from "./ui/Icon";
import { Segmented } from "./ui/Segmented";
import { Text } from "./ui/Text";

const tp = t.progres;

type View_ = "argent" | "evitees";

type Cell = { day: number; inMonth: boolean; today: boolean; value: number | null };

/** Premier jour du mois (0 = janvier) à minuit */
const monthStart = (year: number, month: number) => new Date(year, month, 1).getTime();

/** Cases du mois, du lundi de la 1re semaine au dimanche de la dernière (jours des mois voisins grisés) */
function buildCells(data: AppData, year: number, month: number, view: View_, now: number): Cell[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const total = Math.ceil((lead + daysInMonth) / 7) * 7;
  const todayKey = new Date(now).toDateString();
  return Array.from({ length: total }, (_, i) => {
    const date = new Date(year, month, i - lead + 1);
    const inMonth = date.getMonth() === month;
    const next = new Date(year, month, i - lead + 2).getTime();
    const r = inMonth ? dayResult(data, date.getTime(), next, now) : null;
    const value = r ? (view === "argent" ? Math.round(r.money * 100) / 100 : Math.round(r.avoided)) : null;
    return { day: date.getDate(), inMonth, today: date.toDateString() === todayKey, value };
  });
}

/** "Octobre 2026" */
function monthTitle(year: number, month: number) {
  const s = new Date(year, month, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Calendrier du mois : argent économisé ou cigarettes évitées, jour par jour, et total du mois */
export function SavingsCalendar({ data, now }: { data: AppData; now: number }) {
  const { colors } = useTheme();
  const [view, setView] = useState<View_>("argent");
  const current = new Date(now);
  const [shown, setShown] = useState({ year: current.getFullYear(), month: current.getMonth() });

  // En arrière : jusqu'au mois qui précède la création du compte. En avant : sans limite.
  const created = new Date(data.profile?.createdAt ?? Math.min(data.profile?.quitDate ?? now, now));
  const canPrev = monthStart(shown.year, shown.month) > monthStart(created.getFullYear(), created.getMonth() - 1);
  const move = (delta: number) => {
    const d = new Date(shown.year, shown.month + delta, 1);
    setShown({ year: d.getFullYear(), month: d.getMonth() });
  };

  const cells = buildCells(data, shown.year, shown.month, view, now);
  const format = (v: number) => (view === "argent" ? money(v) : String(v));
  // Dans les petites cases : sans le symbole € (le bouton « Argent » et le total le donnent), sans centimes au-delà de 100
  const formatCell = (v: number) => (view === "argent" ? money(Math.abs(v) >= 100 ? Math.round(v) : v, true).replace(/\s€$/, "") : String(v));
  const total = cells.reduce((s, c) => s + (c.value ?? 0), 0);
  // Largeur d'une case (7 par ligne, 4 px d'écart) pour que la valeur soit la plus grande possible sans déborder
  const [gridWidth, setGridWidth] = useState(0);
  const cellWidth = (gridWidth - 6 * 4) / 7;
  const valueSize = (text: string) => Math.max(9, Math.min(20, (cellWidth - 8) / (text.length * 0.72)));

  return (
    <View className="gap-4">
      <Segmented
        options={[
          { value: "argent", label: tp.vues.argent },
          { value: "evitees", label: tp.vues.evitees },
        ]}
        value={view}
        onChange={setView}
      />

      {/* Mois affiché, avec flèches */}
      <View className="flex-row items-center justify-between">
        <NavButton icon="chevron-left" label={tp.moisPrecedent} enabled={canPrev} onPress={() => move(-1)} />
        <Text weight="bold" className="text-lg">
          {monthTitle(shown.year, shown.month)}
        </Text>
        <NavButton icon="chevron-right" label={tp.moisSuivant} enabled onPress={() => move(1)} />
      </View>

      <View className="gap-1" onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
        {/* Jours de la semaine */}
        <View className="flex-row gap-1">
          {tp.jours.map((j, i) => (
            <Text key={i} weight="semi" tone="texteSecondaire" className="flex-1 text-center" style={{ fontSize: 11 }}>
              {j}
            </Text>
          ))}
        </View>

        {/* Une ligne par semaine */}
        {Array.from({ length: cells.length / 7 }, (_, w) => (
          <View key={w} className="flex-row gap-1">
            {cells.slice(w * 7, w * 7 + 7).map((c, i) => {
              // Vert : économisé ce jour-là · rose : un écart a coûté plus que la journée · neutre : rien à afficher
              const tone = c.value === null || c.value === 0 ? null : c.value > 0 ? colors.accent : colors.sos;
              return (
                <View
                  key={i}
                  accessible={c.inMonth}
                  accessibilityLabel={c.inMonth && c.value !== null ? `${c.day} : ${format(c.value)}` : undefined}
                  className="flex-1 items-center justify-center rounded-xl"
                  style={{
                    aspectRatio: 0.82,
                    paddingHorizontal: 3,
                    borderWidth: 1,
                    borderColor: tone ? alpha(tone, 0.5) : c.inMonth ? colors.bordure : "transparent",
                    backgroundColor: tone ? alpha(tone, 0.14) : alpha(colors.texteSecondaire, c.inMonth ? 0.04 : 0.1),
                  }}
                >
                  <Text
                    weight={c.today ? "bold" : "semi"}
                    tone={c.today ? "accent" : "texteSecondaire"}
                    style={{ position: "absolute", top: 4, right: 5, fontSize: 10, opacity: c.inMonth ? 1 : 0.4 }}
                  >
                    {c.day}
                  </Text>
                  {/* Valeur du jour au centre, en gros */}
                  {c.value !== null && c.value !== 0 && gridWidth > 0 && (
                    <Text
                      weight="bold"
                      numberOfLines={1}
                      style={{ marginTop: 8, fontSize: valueSize(formatCell(c.value)), color: c.value > 0 ? colors.accentClair : colors.sos }}
                    >
                      {formatCell(c.value)}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* Résultat du mois */}
      <Text weight="semi" tone="texteSecondaire" className="text-center text-sm">
        {view === "argent" ? tp.totalArgent(money(total)) : tp.totalEvitees(total)}
      </Text>
    </View>
  );
}

function NavButton({ icon, label, enabled, onPress }: { icon: IconName; label: string; enabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!enabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="h-11 w-11 items-center justify-center rounded-full active:opacity-70"
      style={{ opacity: enabled ? 1 : 0.25 }}
    >
      <Icon name={icon} size={20} />
    </Pressable>
  );
}
