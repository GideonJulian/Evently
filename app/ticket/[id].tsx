import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Loader from "@/src/components/Loader";
type TicketDetail = {
  id: string;
  title: string;
  status: "Valid" | "Used" | "Expired" | "Cancelled";
  heroImage: string;
  tier: string;
  section: string;
  seat: string;
  orderId: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  mapImage: string;
};

// ── Dummy data — replace with your real API call ──
const DUMMY_TICKET_DETAIL: TicketDetail = {
  id: "1",
  title: "Gourmet Street Food Festival",
  status: "Valid",
  heroImage:
    "https://lh3.googleusercontent.com/aida/AP1WRLsTKAcijEU_X0758EmkoI7opad7pb3mJF35c7Ru2uzvkZ23jdtRjUcrXHRXXjhoDiP6cZOjLsb2d9rlws7GBUGjxK-Gg7lYzdpuK6I-SAXCCO-27tWF4Q97ZTvRDIjefZnFYI4LIpEkFxw5b3Jvm_dmcvHhLrIXP7P94wkSpcM_eeG6MU_aKRs1RRsaC64JF4nalcp2UVkqWmYCx2nCB2_biW40gTpFkg1NO16Jnik7GhaXLkWhbBVAHQ",
  tier: "General Admission",
  section: "Main Plaza",
  seat: "Open Seating",
  orderId: "#EVT-88291",
  date: "Friday, Sep 15",
  time: "6:00 PM - 10:00 PM",
  venueName: "Sunset Pier",
  venueAddress: "San Francisco, CA 94111",
  mapImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC2_q1tjATPh75H-GIYU95EIpWGn0bmOxjyqa79kbO9MKlPXt_LF8dRFzS9Efh430LlysE8UKUgMGk5MtGuO-lex-rN1bWXXEw8EwnxbwRtcvFKkt1z8k3mTnYHSITLGjzjJ3foCG2gpPvUP8FoUnOouObtptABaGMnntMUm-lZ9DBK2dlGIGqLugJ9tI_vv3sZIfHlxnRoYNU41uA3TvqIrR_qBUF7I_DsgjXk_uio-v72yHYm0rh5",
};

// ── Random QR pattern generator (mimics the HTML's dynamic dots) ──
const generateQRPattern = (count: number) =>
  Array.from({ length: count }, () => Math.random() > 0.5);

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [qrPattern] = useState(() => generateQRPattern(100));

  useEffect(() => {
    loadTicket();
  }, [id]);

  // ────────────────────────────────────────────
  // Replace this body with your real API call:
  //
  // const { data, error } = await supabase
  //   .from("tickets")
  //   .select("*")
  //   .eq("id", id)
  //   .single();
  // if (!error) setTicket(data);
  // ────────────────────────────────────────────
  const loadTicket = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500)); // simulate network
      setTicket(DUMMY_TICKET_DETAIL);
    } catch (err) {
      console.log("Error loading ticket:", err);
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this ticket order? This action cannot be undone.",
      [
        { text: "Keep Ticket", style: "cancel" },
        {
          text: "Cancel Order",
          style: "destructive",
          onPress: () => {
            // ── Replace with your real cancel API call ──
            // await TicketService.cancelOrder(ticket.orderId);
            console.log("Order cancelled:", ticket?.orderId);
            router.back();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
     <Loader message="Loading tickets"  />
    );
  }

  if (!ticket) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Ticket not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.errorBtn}>
            <Text style={styles.errorBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket Details</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MaterialIcons name="share" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Image source={{ uri: ticket.heroImage }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.validBadge}>
              <MaterialIcons name="check-circle" size={14} color="#fff" />
              <Text style={styles.validBadgeText}>{ticket.status}</Text>
            </View>
            <Text style={styles.heroTitle}>{ticket.title}</Text>
          </View>
        </View>

        {/* ── Digital Ticket Card ── */}
        <View style={styles.ticketCardWrapper}>
          <View style={styles.ticketCard}>
            <Text style={styles.scanLabel}>SCAN AT ENTRY</Text>

            {/* QR Code */}
            <View style={styles.qrOuter}>
              <View style={styles.qrInner}>
                <View style={styles.qrGrid}>
                  {qrPattern.map((filled, i) => (
                    <View
                      key={i}
                      style={[styles.qrDot, { backgroundColor: filled ? "#2563EB" : "transparent" }]}
                    />
                  ))}
                </View>
                <View style={styles.qrCenterIcon}>
                  <MaterialIcons name="confirmation-number" size={26} color="#2563EB" />
                </View>
              </View>
            </View>

            {/* Dashed divider with notches */}
            <View style={styles.dashedDividerWrapper}>
              <View style={styles.notchLeft} />
              <View style={styles.dashedLine} />
              <View style={styles.notchRight} />
            </View>

            {/* Ticket info grid */}
            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Ticket Tier</Text>
                <Text style={styles.infoValue}>{ticket.tier}</Text>
              </View>
              <View style={[styles.infoCol, { alignItems: "flex-end" }]}>
                <Text style={styles.infoLabel}>Section</Text>
                <Text style={styles.infoValue}>{ticket.section}</Text>
              </View>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Seat</Text>
                <Text style={styles.infoValue}>{ticket.seat}</Text>
              </View>
              <View style={[styles.infoCol, { alignItems: "flex-end" }]}>
                <Text style={styles.infoLabel}>Order ID</Text>
                <Text style={styles.infoValue}>{ticket.orderId}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Event specifics ── */}
        <View style={styles.specifics}>
          <View style={styles.specRow}>
            <View style={styles.specIconBox}>
              <MaterialIcons name="calendar-today" size={20} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.specTitle}>{ticket.date}</Text>
              <Text style={styles.specSub}>{ticket.time}</Text>
            </View>
          </View>

          <View style={styles.specRow}>
            <View style={styles.specIconBox}>
              <MaterialIcons name="location-on" size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.specTitle}>{ticket.venueName}</Text>
              <Text style={styles.specSub}>{ticket.venueAddress}</Text>
            </View>
          </View>

          {/* Map snippet */}
          <TouchableOpacity style={styles.mapWrapper} activeOpacity={0.85}>
            <Image source={{ uri: ticket.mapImage }} style={styles.mapImage} />
            <View style={styles.mapOverlay} />
            <View style={styles.mapPill}>
              <MaterialIcons name="directions" size={14} color="#2563EB" />
              <Text style={styles.mapPillText}>Get Directions</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Add to Wallet ── */}
        <View style={styles.walletWrapper}>
          <TouchableOpacity style={styles.walletBtn} activeOpacity={0.9}>
            <MaterialIcons name="account-balance-wallet" size={20} color="#fff" />
            <Text style={styles.walletBtnText}>Add to Apple Wallet</Text>
          </TouchableOpacity>
        </View>

        {/* ── Secondary actions ── */}
        <View style={styles.secondaryList}>
          <TouchableOpacity style={styles.secondaryRow}>
            <View style={styles.secondaryLeft}>
              <MaterialIcons name="file-download" size={20} color="#6B7280" />
              <Text style={styles.secondaryText}>Download PDF</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#D1D5DB" />
          </TouchableOpacity>

          <View style={styles.secondaryDivider} />

       
        </View>
      </ScrollView>

      {/* ── Bottom action bar ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.printBtn}>
          <MaterialIcons name="print" size={20} color="#111827" />
          <Text style={styles.printBtnText}>Print</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelOrder}>
          <MaterialIcons name="cancel" size={20} color="#fff" />
          <Text style={styles.cancelBtnText}>Cancel Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F7FA" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { fontSize: 16, color: "#6B7280", marginBottom: 16 },
  errorBtn: { backgroundColor: "#2563EB", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  errorBtnText: { color: "#fff", fontWeight: "700" },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 7,
    backgroundColor: "rgba(248,247,250,0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },

  // ── Hero ──
  hero: { width: "100%", height: 260, position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "90%",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  heroContent: { position: "absolute", bottom: 44, left: 20, right: 20 },
  validBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 10,
  },
  validBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "800", lineHeight: 30 },

  // ── Digital ticket card ──
  ticketCardWrapper: { paddingHorizontal: 16, marginTop: -32 },
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  scanLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 20,
  },

  // QR
  qrOuter: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#EFF6FF",
    marginBottom: 20,
  },
  qrInner: {
    width: 180,
    height: 180,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  qrGrid: {
    width: 160,
    height: 160,
    flexDirection: "row",
    flexWrap: "wrap",
    opacity: 0.85,
  },
  qrDot: {
    width: 16,
    height: 16,
    margin: 0.5,
    borderRadius: 2,
  },
  qrCenterIcon: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  // Dashed divider with notches
  dashedDividerWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  notchLeft: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F8F7FA",
    marginLeft: -32,
  },
  notchRight: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F8F7FA",
    marginRight: -32,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
    marginHorizontal: 8,
  },

  // Info grid
  infoGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 16,
    rowGap: 16,
  },
  infoCol: { width: "50%" },
  infoLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  infoValue: { fontSize: 15, fontWeight: "700", color: "#111827" },

  // ── Event specifics ──
  specifics: { paddingHorizontal: 16, marginTop: 28, gap: 20 },
  specRow: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  specIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  specTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  specSub: { fontSize: 13, color: "#6B7280", marginTop: 2 },

  // Map
  mapWrapper: {
    height: 130,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 4,
    position: "relative",
  },
  mapImage: { width: "100%", height: "100%" },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(37,99,235,0.05)",
  },
  mapPill: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -70 }, { translateY: -18 }],
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  mapPillText: { fontSize: 13, fontWeight: "600", color: "#111827" },

  // ── Wallet ──
  walletWrapper: { paddingHorizontal: 16, marginTop: 28 },
  walletBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  walletBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  // ── Secondary actions ──
  secondaryList: {
    marginHorizontal: 16,
    marginTop: 28,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  secondaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  secondaryLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  secondaryText: { fontSize: 14, fontWeight: "600", color: "#111827" },
  secondaryDivider: { height: 1, backgroundColor: "#E5E7EB", marginHorizontal: 16 },

  // ── Bottom bar ──
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  printBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
  },
  printBtnText: { fontSize: 15, fontWeight: "700", color: "#111827" },
  cancelBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    backgroundColor: "#000",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  cancelBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});