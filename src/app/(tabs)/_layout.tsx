import { router, Tabs } from "expo-router";
import { useEffect } from "react";

import { TabBar } from "@/components/TabBar";
import { useStore } from "@/lib/store";
import { useTheme } from "@/theme/ThemeProvider";

export default function TabsLayout() {
  const { colors } = useTheme();
  const { paywallPending, clearPaywall } = useStore();

  // Juste après l'onboarding, on présente Premium une fois
  useEffect(() => {
    if (paywallPending) {
      clearPaywall();
      router.push("/premium");
    }
  }, [paywallPending, clearPaywall]);

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.fond } }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="progres" />
      <Tabs.Screen name="trophees" />
      <Tabs.Screen name="coach" />
    </Tabs>
  );
}
