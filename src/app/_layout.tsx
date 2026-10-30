import "../../global.css";

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { StoreProvider, useStore } from "@/lib/store";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  return (
    <StoreProvider>
      <ThemeProvider>
        <RootNavigator fontsLoaded={fontsLoaded} />
      </ThemeProvider>
    </StoreProvider>
  );
}

function RootNavigator({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { ready, data } = useStore();
  const { name, colors } = useTheme();
  const loaded = fontsLoaded && ready;
  const hasProfile = !!data.profile;

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  // L'écran de démarrage reste affiché tant que la police et les données ne sont pas prêtes
  if (!loaded) return null;

  return (
    <>
      <StatusBar style={name === "sombre" ? "light" : "dark"} />
      {/* Stack = pile d'écrans. Les écrans « Protected » ne sont accessibles que si la condition est vraie :
          sans profil, l'app part toute seule sur l'onboarding (comme un middleware de redirection en Next.js). */}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.fond } }}>
        <Stack.Protected guard={hasProfile} redirectTo="/onboarding">
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="premium" options={{ presentation: "modal" }} />
          <Stack.Screen name="sos" options={{ presentation: "fullScreenModal", animation: "fade" }} />
          <Stack.Screen name="craque" options={{ presentation: "modal" }} />
          <Stack.Screen name="profil" />
          <Stack.Screen name="journal" />
          <Stack.Screen name="missions" />
          <Stack.Screen name="mini-jeux" options={{ presentation: "modal" }} />
          <Stack.Screen name="modifier/[champ]" options={{ presentation: "modal" }} />
        </Stack.Protected>
        <Stack.Protected guard={!hasProfile} redirectTo="/">
          <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
        </Stack.Protected>
        {/* Accessible avec ou sans profil (depuis Profil et depuis la page de bienvenue) */}
        <Stack.Screen name="compte" />
      </Stack>
    </>
  );
}
