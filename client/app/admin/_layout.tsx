import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />

      {/* <Stack.Screen
        name="events/create"
        options={{
          presentation: "card",
        }}
      />

      <Stack.Screen
        name="events/[id]"
        options={{
          presentation: "card",
        }}
      />

      <Stack.Screen
        name="events/edit"
        options={{
          presentation: "card",
        }}
      />

      <Stack.Screen
        name="tickets/index"
        options={{
          presentation: "card",
        }}
      />

      <Stack.Screen
        name="tickets/[id]"
        options={{
          presentation: "card",
        }}
      />

      <Stack.Screen
        name="profile"
        options={{
          presentation: "card",
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          presentation: "card",
        }}
      /> */}
    </Stack>
  );
}