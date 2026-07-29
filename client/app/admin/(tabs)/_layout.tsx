import { Tabs } from "expo-router";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,

          height: 70,

          backgroundColor: "#FFFFFF",

          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",

          paddingTop: 8,
          paddingBottom: 8,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 8,

          elevation: 8,
        },

        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "grid" : "grid-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="events"
        options={{
          title: "Events",

          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "event" : "event-note"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",

          tabBarIcon: ({ color }) => (
            <Ionicons
              name="stats-chart"
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          title: "Users",

          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account-group" : "account-group-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}