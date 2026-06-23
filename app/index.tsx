import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    // await AsyncStorage.removeItem("hasSeenOnboarding");
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const isLoggedIn = !!session;

      // 1. FIRST TIME USER
      if (!hasSeenOnboarding) {
        router.replace("/onboarding");
        return;
      }

      // 2. LOGGED IN USER
      if (isLoggedIn) {
        router.replace("/(tabs)/home");
        return;
      }

      // 3. ONBOARDED BUT NOT LOGGED IN
      router.replace("/(auth)/login");
    } catch (err) {
      console.log("Init error:", err);
      router.replace("/onboarding");
    } finally {
      setLoading(false);
    }
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
