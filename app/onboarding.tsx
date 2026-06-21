import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { slides } from "../components/onboarding/OnboardingSlide";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Save onboarding completion
  const completeOnboarding = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");

    router.replace("/(tabs)/home");
  };

  // Move to next slide
  const handleNext = () => {
    if (currentIndex === slides.length - 1) {
      completeOnboarding();
      return;
    }

    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <View />

        <TouchableOpacity onPress={completeOnboarding}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );

          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />

            <Text style={styles.title}>
              {item.title}
            </Text>

            <Text style={styles.description}>
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Dots */}

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index &&
                styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Button */}

      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1
            ? "Get Started"
            : "Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 60,
  },

  skip: {
    color: "#6C63FF",
    fontSize: 16,
    fontWeight: "600",
  },

  slide: {
    width,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  image: {
    width: width - 40,
    height: 420,
    borderRadius: 24,
    marginTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 30,
    color: "#111827",
  },

  description: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
    color: "#6B7280",
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 4,
  },

  activeDot: {
    width: 24,
    backgroundColor: "#6C63FF",
  },

  button: {
    height: 56,
    marginHorizontal: 20,
    marginBottom: 40,
    backgroundColor: "#6C63FF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});