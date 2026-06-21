import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

    const isAuthenticated = false;

    if (isAuthenticated) {
      router.replace("/(tabs)/home");
      return;
    }

    if (hasSeenOnboarding) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/onboarding");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}