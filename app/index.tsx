import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  useEffect(() => {
    checkUser();
    // resetOnboarding()
  }, []);
  const resetOnboarding = async () => {
    await AsyncStorage.removeItem("hasSeenOnboarding");
    router.replace("/onboarding");
  };
  const checkUser = async () => {
    const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

    // 🔥 Replace this with real auth later (Firebase / Supabase / JWT)
    const isAuthenticated = false;

    // 1. If user is logged in → go home
    if (isAuthenticated) {
      router.replace("/(tabs)/home");
      return;
    }

    // 2. If user has NOT seen onboarding → show onboarding
    if (!hasSeenOnboarding) {
      router.replace("/onboarding");
      return;
    }

    // 3. If onboarding is done but NOT logged in → go auth
    router.replace("/(auth)/register");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}
