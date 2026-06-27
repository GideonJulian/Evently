import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const ALL_EVENTS = [
  {
    id: "1",
    title: "Summer Soundwave 2024",
    category: "Music",
    location: "Los Angeles, CA",
    date: "JUN 12",
    time: "JUN 12 • 7:00 PM",
    distance: "2.1 miles away",
    image: require("../assets/images/event1.jpg"),
  },
  {
    id: "2",
    title: "Modernism Reimagined",
    category: "Art",
    location: "San Francisco, CA",
    date: "JUN 15",
    time: "JUN 15 • 11:00 AM",
    distance: "3.4 miles away",
    image: require("../assets/images/event4.jpg"),
  },
  {
    id: "3",
    title: "Neon Nights: Tech House",
    category: "Music",
    location: "The Warehouse, LA",
    date: "JUN 18",
    time: "JUN 18 • 8:00 PM",
    distance: "0.9 miles away",
    image: require("../assets/images/event2.jpg"),
  },
  {
    id: "4",
    title: "Global Tech Summit 2024",
    category: "Tech",
    location: "Convention Center",
    date: "JUN 20",
    time: "JUN 20 • 10:00 AM",
    distance: "1.5 miles away",
    image: require("../assets/images/event3.jpg"),
  },
  {
    id: "5",
    title: "Gourmet Street Food",
    category: "Food",
    location: "Downtown Plaza",
    date: "JUN 22",
    time: "JUN 22 • 12:00 PM",
    distance: "0.8 miles away",
    image: require("../assets/images/event4.jpg"),
  },
  {
    id: "6",
    title: "Jazz in the Park",
    category: "Music",
    location: "Central Park",
    date: "JUN 25",
    time: "JUN 25 • 5:00 PM",
    distance: "1.2 miles away",
    image: require("../assets/images/event5.jpg"),
  },
];

const categories = ["All", "Music", "Art", "Tech", "Food", "Sport"];

export default function SearchResultsScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<typeof ALL_EVENTS>([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = ALL_EVENTS.filter((event) => {
        return (
          !q ||
          event.title.toLowerCase().includes(q.toLowerCase()) ||
          event.location.toLowerCase().includes(q.toLowerCase()) ||
          event.category.toLowerCase().includes(q.toLowerCase())
        );
      });
      setResults(filtered);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [q]);

  const filtered = results.filter(
    (e) => activeCategory === "All" || e.category === activeCategory,
  );

  return (
    <View style={styles.container}>
      {/* ── Fixed Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#39364F" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.searchBox}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Ionicons
              name="search"
              size={18}
              color="#888"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.searchText} numberOfLines={1}>
              {q || "Search events, artists..."}
            </Text>
            {q ? (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close-circle" size={18} color="#aaa" />
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>
        </View>

        {!loading && (
          <Text style={styles.resultCount}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for{" "}
            <Text style={styles.resultQuery}>"{q}"</Text>
          </Text>
        )}

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
              style={[
                styles.chip,
                activeCategory === item && styles.activeChip,
              ]}
            >
              <Text
                style={{
                  color: activeCategory === item ? "#fff" : "#333",
                  fontWeight: "600",
                  fontSize: 13,
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Body ── */}
      {loading ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState query={q} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        >
  
          {filtered.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: "/event/[id]",
                  params: { id: item.id },
                })
              }
            >
              {/* Full-width image */}
              <Image source={item.image} style={styles.cardImage} />

              {/* Date badge over image */}
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>{item.date}</Text>
              </View>

              {/* Favourite button over image */}
              <TouchableOpacity style={styles.favBtn}>
                <MaterialIcons name="favorite-border" size={18} color="#fff" />
              </TouchableOpacity>

              {/* Card body */}
              <View style={styles.cardBody}>
                {/* Top row: title + category badge */}
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {item.category}
                    </Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Bottom row: time left | location right */}
                <View style={styles.metaGrid}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color="#2563EB" />
                    <Text style={styles.metaLabel}>Time</Text>
                    <Text style={styles.metaValue} numberOfLines={1}>
                      {item.time}
                    </Text>
                  </View>

                  <View style={styles.metaSeparator} />

                  <View style={styles.metaItem}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color="#2563EB"
                    />
                    <Text style={styles.metaLabel}>Location</Text>
                    <Text style={styles.metaValue} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>

                  <View style={styles.metaSeparator} />

                  <View style={styles.metaItem}>
                    <Ionicons
                      name="navigate-outline"
                      size={14}
                      color="#2563EB"
                    />
                    <Text style={styles.metaLabel}>Distance</Text>
                    <Text style={styles.metaValue} numberOfLines={1}>
                      {item.distance}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <View style={styles.emptyWrapper}>
      <Ionicons name="search-outline" size={64} color="#ddd" />
      <Text style={styles.emptyTitle}>No results found</Text>
      <Text style={styles.emptySubtitle}>
        We couldn't find anything for{" "}
        <Text style={{ fontWeight: "700", color: "#39364F" }}>"{query}"</Text>.
        {"\n"}
        Try a different keyword or category.
      </Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={() => router.back()}>
        <Text style={styles.emptyBtnText}>Try another search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F7FA" },

  // ── Header ──
  header: {
    backgroundColor: "#F8F7FA",
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 100,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  searchText: { flex: 1, fontSize: 15, color: "#333" },
  resultCount: {
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: 13,
    color: "#888",
  },
  resultQuery: { color: "#39364F", fontWeight: "700" },
  chips: { paddingHorizontal: 16, marginBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 10,
  },
  activeChip: { backgroundColor: "#2563EB" },

  // ── Loading ──
  loadingWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { color: "#888", fontSize: 15 },

  // ── Event Card ──
  // ── Replace these styles in your StyleSheet ──

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 180,
  },
  dateBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dateBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  favBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#0005",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    padding: 14,
  },

  // Title row: title on left, category badge on right
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#39364F",
    lineHeight: 22,
  },
  categoryBadge: {
    backgroundColor: "#EFF6FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    flexShrink: 0,
  },
  categoryBadgeText: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 12,
  },

  // Three-column meta grid
  metaGrid: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  metaItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  metaSeparator: {
    width: 1,
    height: 36,
    backgroundColor: "#F0F0F0",
    alignSelf: "center",
  },
  metaLabel: {
    fontSize: 10,
    color: "#aaa",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  metaValue: {
    fontSize: 12,
    color: "#39364F",
    fontWeight: "600",
    textAlign: "center",
  },
  // ── Empty state ──
  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#39364F" },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
  },
  emptyBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
