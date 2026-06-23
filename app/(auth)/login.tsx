import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";

import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../../src/lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log("Login error:", error.message);
        return;
      }

      if (data.session) {
        router.replace("/(tabs)/home");
      }
    } catch (err) {
      console.log("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  // dncKDwA71wMohmOR

  // https://cjmbxizvwtbkmndiemxk.supabase.co/rest/v1/id
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {/* HEADER */}
        <View style={styles.topImg}>
          <Image
            source={require("../../assets/images/loginImg.png")}
            style={styles.img}
          />
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Login to your account to continue using our app.
          </Text>
        </View>

        {/* cards */}

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          {/* password */}

          <View style={styles.inputGroup}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity style={styles.forgotWrapper} onPress={() => ``}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.passwordWrapper}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
              />

              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Login Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* DIVIDER */}

          <View style={styles.divider}>
            <View style={styles.line} />

            <Text style={styles.or}>OR CONTINUE WITH</Text>

            <View style={styles.line} />
          </View>
          {/* SOCIAL BUTTONS */}

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <MaterialIcons name="mail" size={20} color="#111" />

              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn}>
              <MaterialIcons name="apple" size={20} color="#111" />

              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* FOOTER */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text
              style={styles.footerLink}
              onPress={() => router.push("/(auth)/register")}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  wrapper: {
    padding: 20,
    maxWidth: 480,
    alignSelf: "center",
    width: "100%",
    marginTop: 20,
  },
  topImg: {
    alignItems: "center",
    marginBottom: 20,
  },
  img: {
    width: 300,
    height: 160,
    borderRadius: 16,
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
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
    backgroundColor: "#FFFFFF",
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  eyeBtn: {
    position: "absolute",
    right: 12,
  },

  forgotWrapper: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },

  forgotText: {
    color: "#6C63FF",
    fontWeight: "400",
  },

  button: {
    backgroundColor: "#6C63FF",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
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

  socialText: {
    fontWeight: "600",
  },

  footer: {
    marginTop: 24,
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
