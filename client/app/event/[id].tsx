// app/event/[id].tsx

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}

        <View style={styles.hero}>
          <Image
            source={require("../../assets/images/event1.jpg")}
            style={styles.heroImage}
          />

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={15} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.favoriteBtn}>
            <MaterialIcons name="favorite-border" size={15} color="black" />
          </TouchableOpacity>
        </View>

        {/* Content */}

        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>LIVE EVENT</Text>
          </View>

          <Text style={styles.title}>Summer Jazz Night</Text>

          {/* Organizer */}

          <View style={styles.organizer}>
            <Image
              source={require("../../assets/images/organizerAvatar.jpg")}
              style={styles.avatar}
            />

            <View>
              <Text style={styles.organizedBy}>Organized by</Text>

              <Text style={styles.organizerName}>Blue Note Productions</Text>
            </View>
          </View>

          {/* Cards */}

          <View style={styles.card}>
            <View
              style={{
                backgroundColor: "#b6bff3",
                padding: 10,
                borderRadius: 10,
                marginRight: 12,
              }}
            >
              <MaterialIcons name="event" size={24} color="#494747" />
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.cardLabel}>Date & Time</Text>

              <Text style={styles.cardValue}>Aug 24, 2026 • 7:00 PM</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View
              style={{
                backgroundColor: "#b6bff3",
                padding: 10,
                borderRadius: 10,
                marginRight: 12,
              }}
            >
              <MaterialIcons name="map" size={24} color="#494747" />
            </View>

            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.cardLabel}>Location</Text>

              <Text style={styles.cardValue}>Central Park Amphitheater</Text>
            </View>
          </View>

          {/* Description */}

          <Text style={styles.sectionTitle}>About Event</Text>

          <Text style={styles.description}>
            Experience an unforgettable evening under the stars with world-class
            jazz musicians.
          </Text>

          {/* Tags */}

          <View style={styles.tags}>
            <Text style={styles.tag}>#JazzFestival</Text>

            <Text style={styles.tag}>#OutdoorMusic</Text>

            <Text style={styles.tag}>#SummerVibes</Text>
          </View>

          {/* Map Placeholder */}

          <Text style={styles.sectionTitle}>Location Map</Text>

          <View style={styles.map}>
            <Text>Map Integration Here</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Purchase Bar */}

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>

          <Text style={styles.price}>₦15,000</Text>
        </View>

        <TouchableOpacity style={styles.buyBtn}>
          <Text style={styles.buyText}>
            Get Ticket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  hero: {
    height: 350,
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
  },

  favoriteBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
  },

  content: {
    padding: 20,
    marginTop: -30,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  badge: {
    backgroundColor: "#22c55e",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 40,
  },

  badgeText: {
    color: "#000",
    fontWeight: "400",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 12,
  },

  organizer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  organizedBy: {
    color: "#64748B",
  },

  organizerName: {
    color: "#2563EB",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  cardLabel: {
    color: "#64748B",
  },

  cardValue: {
    marginTop: 4,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
  },

  description: {
    lineHeight: 24,
    color: "#475569",
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },

  tag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  map: {
    height: 180,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  priceLabel: {
    color: "#64748B",
  },

  price: {
    fontSize: 24,
    fontWeight: "700",
  },

  buyBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 30,
    borderRadius: 14,
    justifyContent: "center",
  },

  buyText: {
    color: "#fff",
    fontWeight: "600",
  },
});
