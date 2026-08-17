import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Event, eventService } from "../../../src/services/eventService";

type EventFilter = "all" | "live" | "upcoming" | "ended";

function statusOf(event: Event): Exclude<EventFilter, "all"> {
  const date = new Date(`${event.date}T${event.time || "00:00"}`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (Number.isNaN(date.getTime())) return "upcoming";
  if (date < today) return "ended";
  return date.toDateString() === today.toDateString() ? "live" : "upcoming";
}

function dateLabel(event: Event) {
  const date = new Date(`${event.date}T${event.time || "00:00"}`);
  return Number.isNaN(date.getTime())
    ? `${event.date} · ${event.time}`
    : `${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${event.time}`;
}

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<EventFilter>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadEvents = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    const response = await eventService.getAllEvents();
    if (response.success && response.data) setEvents(response.data);
    else setError(response.error || "Unable to load your events.");
    refresh ? setRefreshing(false) : setLoading(false);
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const counts = useMemo(
    () => ({
      all: events.length,
      live: events.filter((event) => statusOf(event) === "live").length,
      upcoming: events.filter((event) => statusOf(event) === "upcoming").length,
      ended: events.filter((event) => statusOf(event) === "ended").length,
    }),
    [events],
  );

  const visibleEvents = useMemo(
    () =>
      filter === "all"
        ? events
        : events.filter((event) => statusOf(event) === filter),
    [events, filter],
  );

  const deleteEvent = (event: Event) =>
    Alert.alert(
      "Delete event?",
      `“${event.title}” will be permanently removed.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(event._id);
            const response = await eventService.deleteEvent(event._id);
            setDeletingId(null);
            if (response.success)
              setEvents((current) =>
                current.filter((item) => item._id !== event._id),
              );
            else
              Alert.alert(
                "Could not delete event",
                response.error || "Please try again.",
              );
          },
        },
      ],
    );

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadEvents(true)}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Manage Your Events</Text>
            <Text style={styles.subtitle}>
              Review and organize your scheduled events.
            </Text>
          </View>
          {/* <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push("/admin/events/create")}
          >
            <Ionicons name="add-circle" size={19} color="#FFF" />
            <Text style={styles.createText}>Create Event</Text>
          </TouchableOpacity> */}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {(
            [
              ["all", "All Events"],
              ["live", "Live"],
              ["upcoming", "Upcoming"],
              ["ended", "Ended"],
            ] as [EventFilter, string][]
          ).map(([value, label]) => (
            <Pressable
              key={value}
              onPress={() => setFilter(value)}
              style={[styles.chip, filter === value && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  filter === value && styles.chipTextActive,
                ]}
              >
                {label} ({counts[value]})
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.muted}>Loading events…</Text>
          </View>
        ) : error ? (
          <State
            icon="cloud-off"
            title="Couldn’t load events"
            body={error}
            action="Try again"
            onPress={() => loadEvents()}
          />
        ) : events.length === 0 ? (
          <EmptyEvents onPress={() => router.push("/admin/events/create")} />
        ) : visibleEvents.length === 0 ? (
          <State
            icon="event-note"
            title={`No ${filter === "all" ? "events" : `${filter} events`} yet`}
            body="Create an event to start selling tickets."
            action="Create Event"
            onPress={() => router.push("/admin/events/create")}
          />
        ) : (
          <View style={styles.list}>
            {visibleEvents.map((event) => {
              const status = statusOf(event);
              const sold = Math.max(
                0,
                event.totalTickets - event.availableTickets,
              );
              return (
                <View
                  key={event._id}
                  style={[styles.card, status === "ended" && styles.endedCard]}
                >
                  {event.image ? (
                    <Image source={{ uri: event.image }} style={styles.image} />
                  ) : (
                    <View style={[styles.image, styles.imageFallback]}>
                      <MaterialIcons name="image" size={32} color="#64748B" />
                    </View>
                  )}
                  <View style={styles.cardBody}>
                    <View style={styles.cardTop}>
                      <Text
                        style={[
                          styles.status,
                          status === "live"
                            ? styles.live
                            : status === "ended"
                              ? styles.ended
                              : styles.upcoming,
                        ]}
                      >
                        {status}
                      </Text>
                      <View style={styles.actions}>
                        <IconButton
                          label={`Edit ${event.title}`}
                          icon="edit"
                          onPress={() =>
                            router.push({
                              pathname: "/admin/events/edit",
                              params: { id: event._id },
                            })
                          }
                        />
                        <IconButton
                          label={`View ${event.title}`}
                          icon="visibility"
                          onPress={() =>
                            router.push({
                              pathname: "/admin/events/[id]",
                              params: { id: event._id },
                            })
                          }
                        />
                        <IconButton
                          label={`Delete ${event.title}`}
                          icon="delete"
                          color="#DC2626"
                          loading={deletingId === event._id}
                          onPress={() => deleteEvent(event)}
                        />
                      </View>
                    </View>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Meta icon="calendar-today" text={dateLabel(event)} />
                    <Meta icon="location-on" text={event.location} />
                    <View style={styles.footer}>
                      <View style={styles.groupIcon}>
                        <MaterialIcons
                          name="groups"
                          size={17}
                          color="#1D4ED8"
                        />
                      </View>
                      <Text style={styles.ticketText}>
                        {sold} of {event.totalTickets} tickets sold
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
     {
      events.length === 0 ? (
        <></>
      ) : <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/admin/events/create")}
        accessibilityLabel="Create event"
      >
        <Ionicons name="add" size={28} color="#1E3A8A" />
      </TouchableOpacity>
     }
    </View>
  );
}

function Meta({
  icon,
  text,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.meta}>
      <MaterialIcons name={icon} size={16} color="#2563EB" />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}
function IconButton({
  icon,
  onPress,
  label,
  color = "#475569",
  loading = false,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  label: string;
  color?: string;
  loading?: boolean;
}) {
  return (
    <TouchableOpacity
      accessibilityLabel={label}
      style={styles.iconButton}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <MaterialIcons name={icon} size={20} color={color} />
      )}
    </TouchableOpacity>
  );
}
function EmptyEvents({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.designedEmptyState}>
      <Image
        source={{
          uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJMFumWWiMoA7DhDSpBbmo14JSVBj6rXzA-WbjbJwnVFwVtDZDEU7GTHT-Mt12bcPewe_Z_79GuHbQOYBI_aTO1VR0ip321jyrJ-NcX3qNGQEjzvxlFQgLIsaaQlSw8qFMg9zjP3lsjtH4STH6K0gmNmYPqQz58oT22xfATyoBSUjESvTXVRQOzpKY-MKVqtXUbUhoBCiFKYsmLzpdnecaB5J2IgiIFL7MiynFrHAa6jtlBBR-XKYp",
        }}
        style={styles.emptyIllustration}
        resizeMode="contain"
      />
      <Text style={styles.designedEmptyTitle}>No Events Yet</Text>
      <Text style={styles.designedEmptyText}>
        You haven&apos;t created any events. Start by creating your first event to see it here.
      </Text>
      <TouchableOpacity style={styles.firstEventButton} onPress={onPress}>
        <Ionicons name="add-circle" size={20} color="#FFFFFF" />
        <Text style={styles.firstEventButtonText}>Create My First Event</Text>
      </TouchableOpacity>
    </View>
  );
}
function State({
  icon,
  title,
  body,
  action,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  body: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.state}>
      <MaterialIcons name={icon} size={44} color="#64748B" />
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateBody}>{body}</Text>
      <TouchableOpacity style={styles.stateButton} onPress={onPress}>
        <Text style={styles.stateButtonText}>{action}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC", marginTop: 40 },
  content: { padding: 20, paddingBottom: 105 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 22,
  },
  headerCopy: { flex: 1 },
  title: { fontSize: 25, fontWeight: "800", color: "#0F172A" },
  subtitle: { fontSize: 14, lineHeight: 20, color: "#64748B", marginTop: 5 },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2563EB",
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 12,
  },
  createText: { color: "#FFF", fontSize: 13, fontWeight: "700" },
  filters: { gap: 9, paddingBottom: 18 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 99,
    backgroundColor: "#FFF",
  },
  chipActive: { backgroundColor: "#DBEAFE", borderColor: "#BFDBFE" },
  chipText: { color: "#475569", fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: "#1D4ED8" },
  list: { gap: 14 },
  card: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 13,
    flexDirection: "row",
    gap: 13,
  },
  endedCard: { opacity: 0.74 },
  image: {
    width: 92,
    height: 118,
    borderRadius: 11,
    backgroundColor: "#E2E8F0",
  },
  imageFallback: { alignItems: "center", justifyContent: "center" },
  cardBody: { flex: 1, minWidth: 0 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 4,
  },
  status: {
    overflow: "hidden",
    textTransform: "uppercase",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 5,
  },
  live: { backgroundColor: "#DCFCE7", color: "#166534" },
  upcoming: { backgroundColor: "#DBEAFE", color: "#1D4ED8" },
  ended: { backgroundColor: "#FEE2E2", color: "#B91C1C" },
  actions: { flexDirection: "row", marginTop: -5, marginRight: -7 },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 5,
    marginBottom: 8,
  },
  meta: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 4 },
  metaText: { flex: 1, color: "#64748B", fontSize: 12, lineHeight: 17 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    marginTop: 8,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  groupIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  ticketText: { color: "#475569", fontSize: 12, fontWeight: "600" },
  loading: { paddingTop: 70, alignItems: "center", gap: 12 },
  muted: { color: "#64748B", fontSize: 14 },
  state: {
    marginTop: 36,
    padding: 28,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
  },
  stateTitle: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 12,
  },
  stateBody: {
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 5,
  },
  stateButton: {
    marginTop: 16,
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  stateButtonText: { color: "#1D4ED8", fontWeight: "800" },
  designedEmptyState: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 92,
    paddingBottom: 12,
  },
  emptyIllustration: { width: 224, height: 224, marginBottom: 18 },
  designedEmptyTitle: { color: "#0F172A", fontSize: 24, fontWeight: "800" },
  designedEmptyText: {
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 9,
    maxWidth: 320,
  },
  firstEventButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 13,
    marginTop: 24,
  },
  firstEventButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  fab: {
    position: "absolute",
    right: 22,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.24,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
