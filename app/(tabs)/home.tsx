import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/src/lib/supabase";
import { router } from "expo-router";

const categories = ["All Events", "Music", "Art", "Tech", "Food", "Sport"];
const featuredEvents = [
  {
    id: "1",
    title: "Summer Soundwave 2024",
    category: "Music",
    location: "Los Angeles, CA",
    date: "JUN 12",
    image: require("../../assets/images/event1.jpg"),
  },
  {
    id: "2",
    title: "Modernism Reimagined",
    category: "Art",
    location: "San Francisco, CA",
    date: "JUN 15",
    image: require("../../assets/images/event4.jpg"),
  },
];
const upcomingEvents = [
  {
    id: "1",
    title: "Neon Nights: Tech House",
    category: "Music",
    location: "The Warehouse, LA",
    time: "JUN 18 • 8:00 PM",
    image: require("../../assets/images/event2.jpg"),
  },
  {
    id: "2",
    title: "Global Tech Summit 2024",
    category: "Tech",
    location: "Convention Center",
    time: "JUN 20 • 10:00 AM",
    image: require("../../assets/images/event3.jpg"),
  },
];
const nearby = [
  {
    id: "1",
    title: "Gourmet Street Food",
    category: "Food",
    distance: "0.8 miles away",
    image: require("../../assets/images/event4.jpg"),
  },
  {
    id: "2",
    title: "Jazz in the Park",
    category: "Music",
    distance: "1.2 miles away",
    image: require("../../assets/images/event5.jpg"),
  },
];

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [userName, setUserName] = useState("User");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFeatured = featuredEvents.filter((event) => {
    const matchesCategory =
      activeCategory === "All Events" || event.category === activeCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredUpcoming = upcomingEvents.filter((event) => {
    const matchesCategory =
      activeCategory === "All Events" || event.category === activeCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredNearby = nearby.filter((event) => {
    const matchesCategory =
      activeCategory === "All Events" || event.category === activeCategory;
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      }
    };
    getUser();
  }, []);

  return (
    <View style={styles.container}>

      {/* ── FIXED HEADER ── */}
      <View style={styles.header}>
        {/* Greeting */}
        <View style={styles.greetingWrapper}>
          <Text style={styles.greeting}>Hello, {userName}! 👋</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Search events, artists..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            returnKeyType="search"
          />
          <Ionicons name="search" size={20} color="#888" style={{ marginRight: 10 }} />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chips}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setActiveCategory(item)}
              style={[styles.chip, activeCategory === item && styles.activeChip]}
            >
              <Text style={{ color: activeCategory === item ? "#fff" : "#333", fontWeight: "600" }}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── SCROLLABLE CONTENT ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Featured */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured</Text>
        </View>

        <FlatList
          data={filteredFeatured}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          scrollEnabled={true}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: "/event/[id]", params: { id: item.id } })}
            >
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.dateTag}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>{item.date}</Text>
              </View>
              <View style={{ padding: 10 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.location}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Upcoming */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
        </View>

        {filteredUpcoming.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.listItem}
            onPress={() => router.push({ pathname: "/event/[id]", params: { id: item.id } })}
          >
            <Image source={item.image} style={styles.listImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.time}>{item.time}</Text>
              <Text style={styles.listTitle}>{item.title}</Text>
              <Text style={styles.listSub}>{item.location}</Text>
            </View>
            <MaterialIcons name="favorite-border" size={20} color="#888" />
          </TouchableOpacity>
        ))}

        {/* Nearby */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby</Text>
        </View>

        <View style={styles.grid}>
          {filteredNearby.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridCard}
              onPress={() => router.push({ pathname: "/event/[id]", params: { id: item.id } })}
            >
              <Image source={item.image} style={styles.gridImage} />
              <Text style={styles.gridTitle}>{item.title}</Text>
              <Text style={styles.gridSub}>{item.distance}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FA",
  },

  // ── Fixed Header ──
  header: {
    backgroundColor: "#F8F7FA",
    paddingTop: 50,       // safe area / status bar offset
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    // Shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    // Shadow (Android)
    elevation: 2,
    zIndex: 100,
  },
  greetingWrapper: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#39364F",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    paddingVertical: 0,
  },
  chips: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 10,
  },
  activeChip: {
    backgroundColor: "#2563EB",
  },

  // ── Sections ──
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  // ── Featured Cards ──
  card: {
    width: 250,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardImage: {
    width: "100%",
    height: 140,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
  },
  cardSub: {
    color: "#666",
    marginTop: 2,
  },
  dateTag: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#0008",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  // ── Upcoming List ──
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  time: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 12,
  },
  listTitle: {
    fontWeight: "700",
  },
  listSub: {
    color: "#666",
  },

  // ── Nearby Grid ──
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  gridCard: {
    width: "48%",
    marginBottom: 12,
  },
  gridImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
  },
  gridTitle: {
    fontWeight: "700",
    marginTop: 6,
  },
  gridSub: {
    color: "#666",
    fontSize: 12,
  },

  // ── FAB ──
  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#2563EB",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});