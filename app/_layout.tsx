import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const prepare = async () => {
      // keep native splash for a short moment
      await new Promise((resolve) => setTimeout(resolve, 300));
      await SplashScreen.hideAsync();
    };

    prepare();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}