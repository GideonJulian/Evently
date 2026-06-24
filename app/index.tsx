import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { View, Text, Image, StyleSheet } from "react-native";
import { supabase } from "../src/lib/supabase";
export default function Splash() {
  useEffect(() => {
    init();
  }, []);
  const init = async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const isLoggedIn = !!session;
      if (!hasSeenOnboarding) {
        router.replace("/onboarding");
        return;
      }
      if (isLoggedIn) {
        router.replace("/(tabs)/home");
        return;
      }
      router.replace("/(auth)/login");
    } catch (err) {
      console.log("Init error:", err);
      router.replace("/onboarding");
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/screen.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Evently</Text>
      <Text style={styles.subtitle}> Discover Amazing Events </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#2563EB",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 150, height: 150, resizeMode: "contain" },
  title: { color: "#fff", fontSize: 32, fontWeight: "700", marginTop: 20 },
  subtitle: { color: "#fff", marginTop: 8, fontSize: 16 },
});
