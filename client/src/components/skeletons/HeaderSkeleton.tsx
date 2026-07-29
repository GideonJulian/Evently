// src/components/skeletons/HeaderSkeleton.tsx
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

export default function HeaderSkeleton({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: "#E0E0E0", opacity },
        style,
      ]}
    />
  );
}