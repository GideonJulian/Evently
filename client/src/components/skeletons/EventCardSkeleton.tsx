import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

function SkeletonBox({
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

// ── Featured card skeleton ──
export default function EventCardSkeleton() {
  return (
    <View style={{ marginRight: 12, marginTop: 4, marginBottom: 8 }}>
      <SkeletonBox width={250} height={140} borderRadius={12} />
      <SkeletonBox width={180} height={14} borderRadius={6} style={{ marginTop: 10 }} />
      <SkeletonBox width={120} height={12} borderRadius={6} style={{ marginTop: 6 }} />
    </View>
  );
}

// ── Upcoming row skeleton ──
export function UpcomingRowSkeleton() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 10,
        borderRadius: 12,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#eee",
      }}
    >
      <SkeletonBox width={60} height={60} borderRadius={10} />
      <View style={{ marginLeft: 12, flex: 1, gap: 6 }}>
        <SkeletonBox width={80} height={11} borderRadius={4} />
        <SkeletonBox width={160} height={14} borderRadius={4} />
        <SkeletonBox width={110} height={11} borderRadius={4} />
      </View>
    </View>
  );
}

// ── Nearby tile skeleton ──
export function NearbyTileSkeleton() {
  return (
    <View style={{ width: "48%", marginBottom: 12 }}>
      <SkeletonBox width="100%" height={100} borderRadius={12} />
      <SkeletonBox width="80%" height={13} borderRadius={4} style={{ marginTop: 8 }} />
      <SkeletonBox width="55%" height={11} borderRadius={4} style={{ marginTop: 5 }} />
    </View>
  );
}