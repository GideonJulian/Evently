import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { View, Text, Image, StyleSheet, Animated, Easing } from "react-native";
import { supabase } from "../src/lib/supabase";
import { useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
export default function Splash() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    init();

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 120,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ).start();
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
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="confirmation-number" size={60} color="#fff" />

          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX: shimmerAnim }, { rotate: "25deg" }],
              },
            ]}
          />
        </View>
        <Text style={styles.title}>Evently</Text>
        <Text style={styles.subtitle}> Discover Amazing Events </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",

    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,

    elevation: 8,
  },
  content: {
    alignItems: "center",
  },

  shimmer: {
    position: "absolute",
    width: 40,
    height: 200,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  title: {
    marginTop: 24,
    fontSize: 36,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textAlign: "center",
  },

  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});
