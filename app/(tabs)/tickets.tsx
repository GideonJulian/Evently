import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Share,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Loader from "@/src/components/Loader";
// ── Types ──
type TicketStatus = "Confirmed" | "Active" | "Expired";

type Ticket = {
  id: string;
  ticketId: string;
  title: string;
  date: string;
  status: TicketStatus;
  image: any; // require() result
};

// ── Dummy data — replace with your API call ──
const DUMMY_TICKETS: Ticket[] = [
  {
    id: "1",
    ticketId: "#EVT-9981-X2J",
    title: "Midnight Echoes Live",
    date: "Sat, Oct 24 • 8:00 PM",
    status: "Confirmed",
    image: require("../../assets/images/event2.jpg"),
  },
  {
    id: "2",
    ticketId: "#EVT-4421-B7K",
    title: "Global Tech Summit 2024",
    date: "Nov 12 - 14 • 9:00 AM",
    status: "Active",
    image: require("../../assets/images/event1.jpg"),
  },
];

export default function TicketsScreen() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  // ────────────────────────────────────────────
  // Replace this body with your real API call:
  //
  // const { data, error } = await supabase
  //   .from("tickets")
  //   .select("*")
  //   .eq("user_id", currentUserId);
  // if (!error) setTickets(data);
  // ────────────────────────────────────────────
  const loadTickets = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600)); // simulate network
      setTickets(DUMMY_TICKETS);
    } catch (err) {
      console.log("Error loading tickets:", err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (ticket: Ticket) => {
    try {
      await Share.share({
        message: `My ticket for ${ticket.title} — ${ticket.ticketId}`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const statusColor = (status: TicketStatus) => {
    switch (status) {
      case "Confirmed":
        return { bg: "#D1FAE5", text: "#065F46" };
      case "Active":
        return { bg: "#DBEAFE", text: "#1D4ED8" };
      case "Expired":
        return { bg: "#F3F4F6", text: "#6B7280" };
    }
  };

  if (loading) {
    return (
  <Loader message="Loading Tickets..."/>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tickets</Text>
      </View>

      {tickets.length === 0 ? (
        // ── Empty State ──
        <View style={styles.emptyWrapper}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBe2G8-852RgFccJkbUQFYh2ikEIXEKqrdB9zfx5qICLh0J6DMmHP_zd-RbGYw8uEFXYW_UVZ7f9iZym9RgItWN1rFk0KdfWM-353sa2vxb6d7xY8oc7SpJr7WB7-OJkU8T8Z8Ot3UgquzButSXsRqcHv8XmVVY7JcJLxWJTkImXIUFsmdqQhrQSkE6CEcnzTxWHnJMQjxeWQnRoTEoo6yFNMtW0aRr2B61xDF5OWJENvPrW-0LPBj4",
            }}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>Tickets Not Found</Text>
          <Text style={styles.emptySubtitle}>
            You haven't purchased any tickets yet. Explore events and book your
            next unforgettable experience.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={styles.emptyBtnText}>Explore Events</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        // ── Tickets List ──
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        >
          <Text style={styles.subTitle}>
            Manage your upcoming and past event entries.
          </Text>

          {tickets.map((ticket) => {
            const colors = statusColor(ticket.status);
            return (
              <View key={ticket.id} style={styles.ticketCard}>
                {/* Image + info — tappable, goes to ticket details */}
                {/* Image + info — tappable, goes to ticket details */}
                <TouchableOpacity
                  style={styles.ticketTop}
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: "/ticket/[id]",
                      params: { id: ticket.id },
                    })
                  }
                >
                  <Image
                    source={ticket.image}
                    style={styles.ticketImage}
                    resizeMode="cover"
                  />
                  <View style={styles.ticketInfo}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: colors.bg },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: colors.text }]}>
                        {ticket.status}
                      </Text>
                    </View>
                    <Text style={styles.ticketTitle} numberOfLines={2}>
                      {ticket.title}
                    </Text>
                    <View style={styles.dateRow}>
                      <MaterialIcons name="event" size={14} color="#6B7280" />
                      <Text style={styles.dateText}>{ticket.date}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={styles.dashedDivider} />

                <View style={styles.actionRow}>
                  <View style={styles.actionLeft}>
                    <TouchableOpacity style={styles.actionBtn}>
                      <MaterialIcons
                        name="download"
                        size={18}
                        color="#2563EB"
                      />
                      <Text style={styles.actionBtnPrimary}>Download</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleShare(ticket)}
                    >
                      <MaterialIcons name="share" size={18} color="#6B7280" />
                      <Text style={styles.actionBtnSecondary}>Share</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.qrBtn}
                          onPress={() =>
                    router.push({
                      pathname: "/ticket/[id]",
                      params: { id: ticket.id },
                    })
                  }
                  >
                    <Text style={styles.qrBtnText}>View QR Code</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {/* ── Explore more nudge ── */}
          <View style={styles.exploreNudge}>
            <MaterialIcons
              name="confirmation-number"
              size={40}
              color="#BFDBFE"
            />
            <Text style={styles.exploreNudgeTitle}>
              Looking for more events?
            </Text>
            <TouchableOpacity
              style={styles.exploreLink}
              onPress={() => router.push("/(tabs)/home")}
            >
              <Text style={styles.exploreLinkText}>Explore all events</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F7FA" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { color: "#888", fontSize: 15 },

  // ── Header ──
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#F8F7FA",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  subTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    lineHeight: 20,
  },

  // ── Empty state ──
  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  emptyImage: {
    width: 220,
    height: 220,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  emptyBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  // ── Ticket card ──
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketTop: {
    flexDirection: "row",
  },
  ticketImage: {
    width: 110,
    height: 110,
  },
  ticketInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    gap: 6,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 20,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
  },

  // ── Dashed divider ──
  dashedDivider: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    borderStyle: "dashed",
    marginHorizontal: 0,
  },

  // ── Action row ──
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FAFAFA",
  },
  actionLeft: {
    flexDirection: "row",
    gap: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnPrimary: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },
  actionBtnSecondary: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  qrBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  qrBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  // ── Explore nudge ──
  exploreNudge: {
    marginTop: 8,
    padding: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
    borderRadius: 16,
    alignItems: "center",
    opacity: 0.7,
  },
  exploreNudgeTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 10,
  },
  exploreLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  exploreLinkText: {
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 14,
  },
});
