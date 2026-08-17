import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { EventPayload, eventService } from "../../../src/services/eventService";

type TicketType = "paid" | "free";
const initialForm: EventPayload = {
  title: "",
  description: "",
  date: "",
  time: "",
  location: "",
  image: "",
  ticketPrice: 0,
  totalTickets: 0,
};

export default function CreateEventScreen() {
  const [form, setForm] = useState<EventPayload>(initialForm);
  const [ticketType, setTicketType] = useState<TicketType>("paid");
  const [submitting, setSubmitting] = useState(false);
  const setField = <K extends keyof EventPayload>(
    key: K,
    value: EventPayload[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const setType = (type: TicketType) => {
    setTicketType(type);
    if (type === "free") setField("ticketPrice", 0);
  };

  const submit = async () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.date.trim() ||
      !form.time.trim() ||
      !form.location.trim()
    ) {
      Alert.alert(
        "Missing details",
        "Complete the title, description, date, time, and location.",
      );
      return;
    }
    if (ticketType === "paid" && form.ticketPrice <= 0) {
      Alert.alert(
        "Set a ticket price",
        "Enter a price greater than 0, or choose Free tickets.",
      );
      return;
    }
    if (!Number.isInteger(form.totalTickets) || form.totalTickets < 1) {
      Alert.alert(
        "Set a ticket limit",
        "Enter the maximum number of tickets available for this event.",
      );
      return;
    }

    setSubmitting(true);
    const response = await eventService.createEvent({
      ...form,
      ticketPrice: ticketType === "free" ? 0 : form.ticketPrice,
      image: form.image?.trim() || undefined,
    });
    setSubmitting(false);
    if (response.success) {
      Alert.alert("Event created", "Your event is ready to manage.", [
        {
          text: "View events",
          onPress: () => router.replace("/admin/(tabs)/events"),
        },
      ]);
    } else {
      Alert.alert(
        "Could not create event",
        response.error || "Please try again.",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#2563EB" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Create Event</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Section>
          <Label>Event Banner</Label>
          <TouchableOpacity
            style={styles.uploadArea}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                "Cover image",
                "Paste an image link in the Cover image URL field below.",
              )
            }
          >
            {form.image ? (
              <Image
                source={{ uri: form.image }}
                style={styles.bannerPreview}
              />
            ) : (
              <>
                <MaterialIcons
                  name="add-photo-alternate"
                  size={46}
                  color="#94A3B8"
                />
                <Text style={styles.uploadTitle}>Upload a cover image</Text>
                <Text style={styles.uploadHint}>
                  Recommended size: 1600 × 900px
                </Text>
              </>
            )}
          </TouchableOpacity>
          <Field
            label="Cover image URL (optional)"
            value={form.image || ""}
            onChangeText={(value) => setField("image", value)}
            placeholder="https://example.com/cover-image.jpg"
            autoCapitalize="none"
          />
          <Field
            label="Event Title"
            value={form.title}
            onChangeText={(value) => setField("title", value)}
            placeholder="e.g. Summer Tech Conference 2026"
          />
          <Field
            label="Description"
            value={form.description}
            onChangeText={(value) => setField("description", value)}
            placeholder="Share what makes your event unique..."
            multiline
          />
        </Section>

        <View style={styles.twoColumn}>
          <Section style={styles.column}>
            <SectionHeading icon="calendar-today" title="Date & Time" />
            <Field
              label="Start date"
              value={form.date}
              onChangeText={(value) => setField("date", value)}
              placeholder="YYYY-MM-DD"
            />
            <Field
              label="Start time"
              value={form.time}
              onChangeText={(value) => setField("time", value)}
              placeholder="e.g. 18:30"
            />
          </Section>
          <Section style={styles.column}>
            <SectionHeading icon="location-on" title="Location" />
            <Field
              label="Venue or online link"
              value={form.location}
              onChangeText={(value) => setField("location", value)}
              placeholder="Search for a venue..."
            />
            <View style={styles.mapPlaceholder}>
              <MaterialIcons name="map" size={32} color="#94A3B8" />
              <Text style={styles.mapText}>Event location</Text>
            </View>
          </Section>
        </View>

        <Section>
          <SectionHeading icon="payments" title="Ticketing & Capacity" />
          <Text style={styles.helper}>
            Choose whether attendees pay for a ticket, then set the maximum
            ticket limit.
          </Text>
          <View style={styles.ticketTypes}>
            <TicketTypeButton
              type="paid"
              active={ticketType === "paid"}
              onPress={() => setType("paid")}
            />
            <TicketTypeButton
              type="free"
              active={ticketType === "free"}
              onPress={() => setType("free")}
            />
          </View>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Field
                label="Ticket Price"
                value={
                  ticketType === "free"
                    ? "Free"
                    : form.ticketPrice
                      ? String(form.ticketPrice)
                      : ""
                }
                onChangeText={(value) =>
                  setField(
                    "ticketPrice",
                    Number(value.replace(/[^0-9.]/g, "")) || 0,
                  )
                }
                placeholder="0.00"
                keyboardType="decimal-pad"
                editable={ticketType === "paid"}
                prefix={ticketType === "paid" ? "$" : undefined}
              />
            </View>
            <View style={styles.column}>
              <Field
                label="Ticket Limit"
                value={form.totalTickets ? String(form.totalTickets) : ""}
                onChangeText={(value) =>
                  setField(
                    "totalTickets",
                    Number(value.replace(/[^0-9]/g, "")) || 0,
                  )
                }
                placeholder="e.g. 500"
                keyboardType="number-pad"
                prefix="groups"
              />
            </View>
          </View>
        </Section>

        <Section style={styles.publishSection}>
          <View style={styles.publishCopy}>
            <Text style={styles.sectionTitle}>Ready to publish</Text>
            <Text style={styles.helper}>
              Your event will be live as soon as you save it.
            </Text>
          </View>
          <Switch
            value
            trackColor={{ false: "#CBD5E1", true: "#2563EB" }}
            thumbColor="#FFFFFF"
            onValueChange={() => {}}
          />
        </Section>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.disabled]}
          onPress={submit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={19} color="#FFFFFF" />
              <Text style={styles.submitText}>Publish Event</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function Section({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <View style={[styles.section, style]}>{children}</View>;
}
function Label({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}
function SectionHeading({
  icon,
  title,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
}) {
  return (
    <View style={styles.sectionHeading}>
      <MaterialIcons name={icon} size={21} color="#2563EB" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}
function TicketTypeButton({
  type,
  active,
  onPress,
}: {
  type: TicketType;
  active: boolean;
  onPress: () => void;
}) {
  const free = type === "free";
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.ticketType, active && styles.ticketTypeActive]}
    >
      <MaterialIcons
        name={free ? "confirmation-number" : "payments"}
        size={20}
        color={active ? "#1D4ED8" : "#64748B"}
      />
      <View>
        <Text
          style={[
            styles.ticketTypeTitle,
            active && styles.ticketTypeTitleActive,
          ]}
        >
          {free ? "Free tickets" : "Paid tickets"}
        </Text>
        {/* <Text style={styles.ticketTypeHint}>
          {free ? "No charge for attendees" : "Set a price per ticket"}
        </Text> */}
      </View>
      <View style={[styles.radio, active && styles.radioActive]}>
        {active && <View style={styles.radioDot} />}
      </View>
    </TouchableOpacity>
  );
}
function Field({
  label,
  multiline,
  prefix,
  ...props
}: {
  label: string;
  multiline?: boolean;
  prefix?: "$" | "groups";
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Label>{label}</Label>
      <View style={styles.inputWrap}>
        {prefix === "$" && <Text style={styles.currency}>₦</Text>}
        {prefix === "groups" && (
          <MaterialIcons
            name="groups"
            size={20}
            color="#94A3B8"
            style={styles.inputIcon}
          />
        )}
        <TextInput
          {...props}
          multiline={multiline}
          style={[
            styles.input,
            prefix && styles.inputWithPrefix,
            multiline && styles.multiline,
          ]}
          placeholderTextColor="#94A3B8"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC", marginTop: 40 },
  topBar: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1D4ED8",
    marginLeft: 5,
  },
  content: { padding: 18, gap: 18, paddingBottom: 112 },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  twoColumn: { flexDirection: "row", gap: 14 },
  column: { flex: 1 },
  label: { color: "#475569", fontSize: 13, fontWeight: "700", marginBottom: 7 },
  field: { marginTop: 15 },
  inputWrap: { position: "relative" },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#0F172A",
    fontSize: 15,
    backgroundColor: "#FFFFFF",
  },
  inputWithPrefix: { paddingLeft: 36 },
  multiline: { height: 116, paddingTop: 12, textAlignVertical: "top" },
  currency: {
    position: "absolute",
    left: 13,
    top: 14,
    zIndex: 1,
    color: "#64748B",
    fontSize: 16,
  },
  inputIcon: { position: "absolute", left: 10, top: 14, zIndex: 1 },
  uploadArea: {
    height: 176,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  bannerPreview: { width: "100%", height: "100%" },
  uploadTitle: {
    marginTop: 8,
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "800",
  },
  uploadHint: { color: "#64748B", fontSize: 13, marginTop: 3 },
  sectionHeading: { flexDirection: "row", alignItems: "center", gap: 7 },
  sectionTitle: { color: "#0F172A", fontSize: 17, fontWeight: "800" },
  mapPlaceholder: {
    height: 86,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  mapText: { color: "#64748B", fontSize: 12, marginTop: 3 },
  helper: { color: "#64748B", fontSize: 13, lineHeight: 19, marginTop: 7 },
  ticketTypes: { flexDirection: "row", gap: 10, marginTop: 16 },
  ticketType: {
    flex: 1,
    minHeight: 78,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 11,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticketTypeActive: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  ticketTypeTitle: { color: "#334155", fontWeight: "800", fontSize: 13 },
  ticketTypeTitleActive: { color: "#1D4ED8" },
  ticketTypeHint: { color: "#64748B", fontSize: 11, marginTop: 2 },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#94A3B8",
    marginLeft: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: "#2563EB" },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563EB",
  },
  publishSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  publishCopy: { flex: 1, paddingRight: 14 },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    height: 78,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelButton: {
    paddingHorizontal: 18,
    height: 44,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    justifyContent: "center",
  },
  cancelText: { color: "#334155", fontWeight: "700" },
  submitButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  disabled: { opacity: 0.65 },
  submitText: { color: "#FFFFFF", fontWeight: "800" },
});
