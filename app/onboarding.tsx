import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");

/* -------------------- SLIDES -------------------- */

export const slides = [
  {
    id: 1,
    title: "Discover Amazing Events",
    description: "Find concerts, workshops and local meetups near you.",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
  },

  // ✅ CUSTOM SECOND SLIDE
  {
    id: 2,
    type: "custom",
    title: "Fast & Secure Booking",
    description: "Reserve your spot in seconds with secure checkout.",
  },

  {
    id: 3,
    title: "Digital Entry",
    description: "Use your QR code ticket for quick and easy event access.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac",
  },
];

/* -------------------- MAIN SCREEN -------------------- */

export default function OnboardingScreen() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(auth)/login" as any);
  };

  const handleNext = () => {
    if (currentIndex === slides.length - 1) {
      completeOnboarding();
      return;
    }

    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
  };

  const handleSkip = () => { 
    completeOnboarding();
    console.log('complete')
  }
  const compeleteOnboarding = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    router.replace("/(auth)/login");
  };
  /* -------------------- CUSTOM SLIDE UI -------------------- */

  const renderHtmlSlide = () => {
    return (
      <View style={styles.htmlWrapper}>
        {/* Background glow */}
        <View style={styles.glow} />

        {/* MAIN CONTAINER */}
        <View style={styles.visualSection}>
          {/* Ticket Card */}
          <View style={styles.ticketCard}>
            <View style={styles.ticketTop}>
              <View>
                <Text style={styles.admit}>ADMIT ONE</Text>
                <Text style={styles.eventTitle}>Midnight Jazz Festival</Text>
              </View>

              <View style={styles.ticketIconBox}>
                <MaterialIcons
                  name="confirmation-number"
                  size={22}
                  color="#fff"
                />
              </View>
            </View>

            <View style={styles.ticketRow}>
              <View style={styles.ticketCol}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>Oct 24, 2024</Text>
              </View>

              <View style={styles.ticketColRight}>
                <Text style={styles.label}>Seat</Text>
                <Text style={styles.value}>Row B, 12</Text>
              </View>
            </View>

            <View style={styles.dashedLine} />
          </View>

          {/* Payment Card */}
          <View style={styles.paymentCard}>
            <View style={styles.checkCircle}>
              <MaterialIcons name="check-circle" size={20} color="#fff" />
            </View>

            <View>
              <Text style={styles.paymentTitle}>Payment Sent</Text>
              <Text style={styles.paymentSub}>$89.00 USD</Text>
            </View>
          </View>

          {/* Security badge */}
          <View style={styles.securityBadge}>
            <MaterialIcons name="security" size={16} color="#6C63FF" />
            <Text style={styles.secureText}>Secure</Text>
          </View>
        </View>

        {/* TEXT SECTION */}
        <View style={styles.textSection}>
          <Text style={styles.title}>Fast & Secure Booking</Text>

          <Text style={styles.desc}>
            Reserve your spot in seconds with our streamlined checkout. Your
            tickets are always safe in your digital wallet.
          </Text>
        </View>
      </View>
    );
  };

  /* -------------------- RENDER -------------------- */

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity
          disabled={currentIndex === 0}
          onPress={() => {
            if (currentIndex > 0) {
              flatListRef.current?.scrollToIndex({
                index: currentIndex - 1,
              });
            }
          }}
        >
          <Text
            style={[
              styles.backText,
              currentIndex === 0 && {
                opacity: 0,
              },
            ]}
          >
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View> */}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {item.type === "custom" ? (
              renderHtmlSlide()
            ) : (
              <>
                <View style={styles.imageContainer}>
                  <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.image}
                    imageStyle={{
                      borderRadius: 28,
                    }}
                  />
                </View>

                <View style={styles.content}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </>
            )}
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? "Get Started" : "Continue"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  htmlWrapper: {
    width,
    marginTop: 20,
    alignItems: "center",
  },
  visualSection: {
    height: 400,
    width,
    alignItems: "center",
    position: "relative",
  },
  ticketTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  admit: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#6B7280",
    fontWeight: "600",
  },

  eventTitle: {
    fontSize: 18,
    fontWeight: "800",
  },

  ticketIconBox: {
    backgroundColor: "#6C63FF",
    padding: 8,
    borderRadius: 10,
  },

  ticketRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  ticketCol: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: "#E5E7EB",
    paddingRight: 10,
  },

  ticketColRight: {
    flex: 1,
    paddingLeft: 10,
  },

  label: {
    fontSize: 12,
    color: "#6B7280",
  },

  value: {
    fontWeight: "700",
    marginTop: 4,
  },

  dashedLine: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 10,
  },

  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  skip: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6C63FF",
  },

  slide: {
    width,
    alignItems: "center",
  },

  imageContainer: {
    width: width - 40,
    height: height * 0.55,
    marginTop: 20,
    borderRadius: 28,
    overflow: "hidden",
  },

  image: {
    flex: 1,
  },

  content: {
    marginTop: 30,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  securityBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    elevation: 2,
  },

  secureText: {
    fontSize: 12,
  },

  textSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },

  desc: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 10,
    lineHeight: 22,
  },

  description: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: "center",
    color: "#6B7280",
    marginTop: 14,
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
    borderRadius: 18,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  /* ---------------- CUSTOM SLIDE ---------------- */

  customWrapper: {
    width,
    alignItems: "center",
    justifyContent: "center",
  },

  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(108,99,255,0.1)",
    top: 80,
  },

  ticketCard: {
    width: width - 50,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    elevation: 6,
    marginTop: 20,
  },

  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  smallLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  ticketTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#6C63FF20",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 18,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  column: {
    flex: 1,
  },

  boldText: {
    fontWeight: "700",
    marginTop: 4,
  },

  dashed: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },

  barcode: {
    height: 40,
    backgroundColor: "#00000010",
    borderRadius: 6,
  },

  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 14,
    width: width - 70,
  },

  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  paymentTitle: {
    fontWeight: "700",
  },

  paymentSub: {
    color: "#6B7280",
  },

  badge: {
    marginTop: 10,
    padding: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
  },
});
