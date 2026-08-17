import { Redirect, Tabs } from "expo-router";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import "react-native-url-polyfill/auto";
import { useAuth } from "../../src/context/AuthContext";
export default function TabsLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (user.role === "admin") return <Redirect href="/admin/(tabs)/dashboard" />;

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

        tabBarActiveTintColor: "#6C63FF",
        tabBarInactiveTintColor: "#6B7280",

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="search"
        options={{
          title: "Search",

          tabBarIcon: ({ color }) => (
            <Ionicons
              name="search"
              size={22}
              color={color}
            />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="tickets"
        options={{
          title: "Tickets",

          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="confirmation-number"
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                focused
                  ? "heart"
                  : "heart-outline"
              }
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={
                focused
                  ? "account"
                  : "account-outline"
              }
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
