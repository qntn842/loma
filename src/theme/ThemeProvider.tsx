import AsyncStorage from "@react-native-async-storage/async-storage";
import { vars } from "nativewind";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme, View } from "react-native";

import { Palette, palettes, ThemeName } from "./palettes";
import { rgbTriplet } from "./color";

export type ThemeSetting = "sombre" | "clair" | "auto";

type ThemeContextValue = {
  name: ThemeName;
  colors: Palette;
  setting: ThemeSetting;
  setSetting: (s: ThemeSetting) => void;
};

const STORAGE_KEY = "reglage-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Les couleurs pleines deviennent des variables lues par les classes Tailwind (text-accent, bg-sos…).
// Les couleurs transparentes (verre, bordures, lueurs) passent par les composants (Glass, Pill…).
function toVars(p: Palette) {
  return vars({
    "--fond": rgbTriplet(p.fond),
    "--texte": rgbTriplet(p.texte),
    "--texte-secondaire": rgbTriplet(p.texteSecondaire),
    "--accent": rgbTriplet(p.accent),
    "--accent-clair": rgbTriplet(p.accentClair),
    "--pastille": rgbTriplet(p.pastille),
    "--texte-pastille": rgbTriplet(p.textePastille),
    "--texte-sur-accent": rgbTriplet(p.texteSurAccent),
    "--sos": rgbTriplet(p.sos),
    "--texte-sur-sos": rgbTriplet(p.texteSurSos),
    "--premium": rgbTriplet(p.premium),
    "--texte-sur-premium": rgbTriplet(p.texteSurPremium),
  });
}

const themeVars = { sombre: toVars(palettes.sombre), clair: toVars(palettes.clair) };

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  // Sombre par défaut tant que le réglage n'est pas lu
  const [setting, setSettingState] = useState<ThemeSetting>("sombre");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === "sombre" || v === "clair" || v === "auto") setSettingState(v);
    });
  }, []);

  const setSetting = (s: ThemeSetting) => {
    setSettingState(s);
    AsyncStorage.setItem(STORAGE_KEY, s);
  };

  const name: ThemeName = setting === "auto" ? (system === "light" ? "clair" : "sombre") : setting;

  const value = useMemo(() => ({ name, colors: palettes[name], setting, setSetting }), [name, setting]);

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1, backgroundColor: palettes[name].fond }, themeVars[name]]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme doit être utilisé dans <ThemeProvider>");
  return ctx;
}
