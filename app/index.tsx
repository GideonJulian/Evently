import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../src/lib/supabase";
import { AuthService } from "@/src/services/auth.service";

export default function Splash() {
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(20)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslate = useRef(new Animated.Value(15)).current;

  const footerOpacity = useRef(new Animated.Value(0)).current;

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimations();
    // clearstorage()
    init();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),

      Animated.sequence([
        Animated.delay(300),
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),

          Animated.timing(titleTranslate, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
        ]),
      ]),

      Animated.sequence([
        Animated.delay(700),
        Animated.parallel([
          Animated.timing(subtitleOpacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),

          Animated.timing(subtitleTranslate, {
            toValue: 0,
            duration: 700,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
        ]),
      ]),

      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(progress, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -8,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(logoFloat, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const clearstorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared successfully.");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  const init = async () => {
    await new Promise((resolve) => setTimeout(resolve, 4000));

    try {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const isLoggedIn = !!session;

      // ── Not seen onboarding yet — always show it first ──
      if (!hasSeenOnboarding) {
        router.replace("/onboarding");
        return;
      }

      // ── Not logged in — send to login ──
      if (!isLoggedIn) {
        router.replace("/(auth)/login");
        return;
      }

      // ── Logged in — check role and route accordingly ──
      const role = await AuthService.getCurrentUserRole();
      console.log("USER ROLE >>>", role);

    if (role?.trim().toLowerCase() === "admin") {
  router.replace("/admin/(tabs)/dashboard");
  return;
}

      // Default fallback — treat any non-admin role (or null/error) as a regular user
      router.replace("/(tabs)/home");
    } catch (err) {
      console.log(err);
      router.replace("/onboarding");
    }
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              transform: [{ scale: logoScale }, { translateY: logoFloat }],
            },
          ]}
        >
          <MaterialIcons name="confirmation-number" size={50} color="#fff" />
        </Animated.View>

        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslate }],
            },
          ]}
        >
          Evently
        </Animated.Text>

        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslate }],
            },
          ]}
        >
          Discover your next experience.
        </Animated.Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressWidth,
              },
            ]}
          />
        </View>
      </View>

      <Animated.View
        style={[
          styles.footer,
          {
            opacity: footerOpacity,
          },
        ]}
      >
        <Text style={styles.footerText}>PREMIUM EVENT MARKETPLACE</Text>
      </Animated.View>
    </View>
  );
}

const PRIMARY = "#2563EB";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  content: {
    alignItems: "center",
  },

  logoWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: PRIMARY,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 5,
    marginBottom: 18,
  },

  title: {
    fontSize: 40,
    fontWeight: "800",
    color: PRIMARY,
    letterSpacing: -1,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },

  progressContainer: {
    position: "absolute",
    bottom: 95,
    width: 120,
  },

  progressBackground: {
    height: 3,
    borderRadius: 5,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },

  progressFill: {
    height: 3,
    borderRadius: 5,
    backgroundColor: PRIMARY,
  },

  footer: {
    position: "absolute",
    bottom: 50,
  },

  footerText: {
    fontSize: 11,
    color: "#9CA3AF",
    letterSpacing: 2.5,
    fontWeight: "600",
  },
});