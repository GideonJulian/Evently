import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../../src/lib/supabase";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
const handleRegister = async () => {
  if (!email || !password || !name) return;
  if (!agree) return;

  try {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      console.log("Register error:", error.message);
      return;
    }

    // IMPORTANT:
    // Supabase may or may not auto-login depending on settings
    if (data.user) {
      router.replace("/(auth)/login");
    }
  } catch (err) {
    console.log("Unexpected error:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Join Evently to discover and book unforgettable experiences.
          </Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          {/* NAME */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              style={styles.input}
            />
          </View>

          {/* EMAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>

            <View style={styles.passwordWrapper}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(!showPassword)
                }
                style={styles.eyeBtn}
              >
                <MaterialIcons
                  name={
                    showPassword
                      ? "visibility-off"
                      : "visibility"
                  }
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* TERMS */}
          <View style={styles.termsRow}>
            <TouchableOpacity
              onPress={() => setAgree(!agree)}
              style={[
                styles.checkbox,
                agree && styles.checkboxActive,
              ]}
            />
            <Text style={styles.termsText}>
              I agree to the{" "}
              <Text style={styles.link}>
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text style={styles.link}>
                Privacy Policy
              </Text>
              .
            </Text>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={[
              styles.button,
              (!agree || loading) &&
                { opacity: 0.6 },
            ]}
            onPress={handleRegister}
            disabled={!agree || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating..." : "Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DIVIDER */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>OR CONTINUE WITH</Text>
          <View style={styles.line} />
        </View>

        {/* SOCIAL */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <MaterialIcons
              name="mail"
              size={20}
              color="#111"
            />
            <Text>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <MaterialIcons
              name="apple"
              size={20}
              color="#111"
            />
            <Text>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* LOGIN LINK */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text
              style={styles.footerLink}
              onPress={() =>
                router.push("/(auth)/login")
              }
            >
              Log In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES (HTML MATCHED) ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  wrapper: {
    padding: 20,
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
    marginTop: 60,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  inputGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  eyeBtn: {
    position: "absolute",
    right: 10,
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    marginBottom: 16,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginRight: 10,
    marginTop: 3,
    borderRadius: 4,
  },

  checkboxActive: {
    backgroundColor: "#6C63FF",
  },

  termsText: {
    flex: 1,
    color: "#6B7280",
  },

  link: {
    color: "#6C63FF",
    fontWeight: "700",
  },

  button: {
    backgroundColor: "#6C63FF",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  or: {
    marginHorizontal: 10,
    fontSize: 12,
    color: "#6B7280",
  },

  socialRow: {
    flexDirection: "row",
    gap: 10,
  },

  socialBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  footer: {
    marginTop: 20,
    alignItems: "center",
  },

  footerText: {
    color: "#6B7280",
  },

  footerLink: {
    color: "#6C63FF",
    fontWeight: "800",
  },
});