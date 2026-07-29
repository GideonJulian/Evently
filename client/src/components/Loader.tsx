import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type LoaderProps = {
  message?: string;
  fullScreen?: boolean;
  size?: "small" | "large";
};

export default function Loader({
  message = "Loading...",
  fullScreen = true,
  size = "large",
}: LoaderProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.6)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const boxSize = size === "large" ? 64 : 44;
  const iconSize = size === "large" ? 28 : 20;

  useEffect(() => {
    // Spinning ring
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.6,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Bouncing dots, staggered
    const animateDot = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -6,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(450 - delay),
        ])
      ).start();

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const content = (
    <View style={styles.content}>
      {/* Spinner with icon center */}
      <View style={[styles.spinnerWrapper, { width: boxSize, height: boxSize }]}>
        <Animated.View
          style={[
            styles.ring,
            {
              width: boxSize,
              height: boxSize,
              borderRadius: boxSize / 2,
              transform: [{ rotate: spin }],
            },
          ]}
        />
        <Animated.View style={{ opacity: pulse, transform: [{ scale: pulse }] }}>
          <MaterialIcons name="confirmation-number" size={iconSize} color="#2563EB" />
        </Animated.View>
      </View>

      {/* Message + bouncing dots */}
      {message ? (
        <View style={styles.messageRow}>
          <Text style={styles.messageText}>{message}</Text>
          <View style={styles.dotsRow}>
            <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
          </View>
        </View>
      ) : null}
    </View>
  );

  if (!fullScreen) return content;

  return <View style={styles.fullScreen}>{content}</View>;
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F7FA",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  ring: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "#DBEAFE",
    borderTopColor: "#2563EB",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 3,
    marginLeft: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2563EB",
  },
});