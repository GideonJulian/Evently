import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RECENT_KEY = "recent_searches";

const trendingSearches = [
  "tech events",
  "lagos free events",
  "lagos",
  "music concerts",
  "stage plays",
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<TextInput>(null);

  // Auto-focus input when screen opens
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  // Load recent searches from storage
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_KEY);
        if (stored) setRecentSearches(JSON.parse(stored));
      } catch (_) {}
    };
    load();
  }, []);

  const saveSearch = async (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 8);
    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const removeRecent = async (term: string) => {
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const clearAllRecent = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_KEY);
  };

  const handleSearch = async (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    await saveSearch(trimmed);
    // Navigate to results — adjust route to match your app
    router.push({ pathname: "/search-results", params: { q: trimmed } });
  };

  const handleTrendingPress = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0EFEB" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={26} color="#222" />
        </TouchableOpacity>
      </View>

      {/* ── Search Input ── */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#555" style={{ marginRight: 10 }} />
        <TextInput
          ref={inputRef}
          value={query}
          onChangeText={setQuery}
          placeholder="Search events..."
          placeholderTextColor="#aaa"
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={() => handleSearch(query)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons name="close-circle" size={20} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Recent ── */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>Recent</Text>
              <TouchableOpacity onPress={clearAllRecent}>
                <Text style={styles.clearAll}>Clear all</Text>
              </TouchableOpacity>
            </View>

            {recentSearches.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.row}
                onPress={() => handleTrendingPress(item)}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name="time-outline" size={22} color="#555" style={styles.rowIcon} />
                  <Text style={styles.rowText}>{item}</Text>
                </View>
                <TouchableOpacity onPress={() => removeRecent(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle-outline" size={22} color="#555" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Trending ── */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>Trending</Text>
          </View>

          {trendingSearches.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.row}
              onPress={() => handleTrendingPress(item)}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="search-outline" size={22} color="#555" style={styles.rowIcon} />
                <Text style={styles.rowText}>{item}</Text>
              </View>
              <Ionicons name="trending-up" size={20} color="#222" />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F0EFEB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#222",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    paddingVertical: 0,
  },

  section: {
    marginBottom: 8,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clearAll: {
    fontSize: 13,
    color: "#2563EB",
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowIcon: {
    marginRight: 16,
  },
  rowText: {
    fontSize: 16,
    color: "#111",
    flex: 1,
  },
});