import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    async function prepare() {
      if (!loaded) return;

      await new Promise((resolve) => setTimeout(resolve, 300));

      await SplashScreen.hideAsync();
    }

    prepare();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
