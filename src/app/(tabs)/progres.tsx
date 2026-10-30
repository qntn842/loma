import { View } from "react-native";

import { SavingsCalendar } from "@/components/SavingsCalendar";
import { Appear } from "@/components/ui/Appear";
import { Glass } from "@/components/ui/Glass";
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { PageTitle, Screen, SectionTitle } from "@/components/ui/Screen";
import { Label, Text } from "@/components/ui/Text";
import { healthSteps } from "@/config/health";
import { useLayout } from "@/hooks/useLayout";
import { useNow } from "@/hooks/useNow";
import { duration, money, t } from "@/i18n";
import { currentStreak, netSavings } from "@/lib/calc";
import { useStore } from "@/lib/store";
import { useTheme } from "@/theme/ThemeProvider";

const tp = t.progres;

export default function Progres() {
  const now = useNow(1000);
  const { data } = useStore();
  const { scale } = useLayout();

  const streak = currentStreak(data, now);
  const saved = netSavings(data, now);

  return (
    <Screen withTabBar>
      <PageTitle title={tp.titre} />

      {/* Argent + calendrier du mois (argent ou cigarettes évitées), gratuits, tout en haut */}
      <SectionTitle>{tp.argent}</SectionTitle>
      <Appear>
        <Glass className="gap-4">
          <View className="gap-1">
            <RollingNumber value={saved} format={(v) => money(v)} weight="semi" tone="accentClair" style={{ fontSize: 44 * scale, lineHeight: 52 * scale }} />
            <Text tone="texteSecondaire" className="text-xs">
              {tp.argentNet}
            </Text>
          </View>
          <SavingsCalendar data={data} now={now} />
        </Glass>
      </Appear>

      {/* Corps */}
      <SectionTitle>{tp.corps}</SectionTitle>
      <HealthTimeline streak={streak} />
      <Text tone="texteSecondaire" className="text-center text-xs">
        {tp.source}
      </Text>
    </Screen>
  );
}

/** Toutes les étapes santé, gratuites */
function HealthTimeline({ streak }: { streak: number }) {
  const { colors } = useTheme();
  const nextIndex = healthSteps.findIndex((s) => s.ms > streak);

  return (
    <View className="gap-3">
      {healthSteps.map((step, i) => {
        const reached = streak >= step.ms;
        const isNext = i === nextIndex;
        const prevMs = i > 0 ? healthSteps[i - 1].ms : 0;
        const texts = t.sante[step.id];
        return (
          <Appear key={step.id} index={Math.min(2 + i, 6)}>
            <Glass className="gap-3" highlighted={isNext}>
              <View className="flex-row items-start gap-3">
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${reached ? "bg-pastille" : ""}`}
                  style={reached ? undefined : { borderWidth: 1, borderColor: colors.bordure }}
                >
                  <Icon name={reached ? "check" : "clock"} size={15} tone={reached ? "textePastille" : "texteSecondaire"} />
                </View>
                <View className="flex-1 gap-1">
                  <Label tone={reached ? "accentClair" : "texteSecondaire"}>{texts.duree}</Label>
                  <Text tone={reached ? "texte" : "texteSecondaire"} className="text-sm leading-5">
                    {texts.texte}
                  </Text>
                </View>
              </View>
              {isNext && (
                <View className="gap-1.5">
                  <ProgressBar progress={(streak - prevMs) / (step.ms - prevMs)} />
                  <Text tone="texteSecondaire" className="text-xs">
                    {tp.dans(duration(step.ms - streak))}
                  </Text>
                </View>
              )}
            </Glass>
          </Appear>
        );
      })}
    </View>
  );
}
