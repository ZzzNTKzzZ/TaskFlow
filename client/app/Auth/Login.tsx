import React, { useState } from "react";
import { 
  Pressable, 
  Text, 
  View, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  ActivityIndicator 
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import axios from "axios"; // Import thêm axios để dùng isAxiosError

// Styles & Theme
import { globalStyles } from "@/styles/global";
import { Colors, Spacing, Typography } from "@/theme";
import Logo from "@/assets/icons/Logo.svg";

// Components
import Button from "@/components/Button";
import Input from "@/components/ui/Input";
import ConnectionScreen from "@/scripts/TestConnection"; // File test của bạn

// Services & Validation
import { loginApi } from "@/service/auth.service";
import { loginSchema } from "@/utils/validation/auth.schema";

export default function Login() {
  const [email, setEmail] = useState("user@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleOnRegister = () => {
    router.push("/Auth/Register");
  };

  const handleLogin = async () => {
    console.log("Attempting login with:", email);
    setErrors({});

    // 1. Validate Form với Zod
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const newErrors: { email?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as "email" | "password";
        if (!newErrors[fieldName]) {
          newErrors[fieldName] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await loginApi(email, password);
      
      console.log("Login Response:", response);

      if (response.status === "success") {
        // 3. Lưu Token vào SecureStore
        await SecureStore.setItemAsync("accessToken", response.data.accessToken);
        await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);

        
        // 4. Chuyển hướng vào App
        router.replace("/(tabs)" as any);
      }
    } catch (error: unknown) {
      // Xử lý lỗi TypeScript an toàn thay vì dùng 'any'
      let errorMessage = "Login failed. Please try again.";

      if (axios.isAxiosError(error)) {
        if (!error.response) {
          // Lỗi mạng (Sai IP, Port, không chung Wi-Fi)
          errorMessage = "Network Error: Cannot connect to Server. Check your IP/Wi-Fi.";
        } else {
          // Lỗi từ phía Server (Sai pass, user không tồn tại...)
          errorMessage = error.response.data?.message || errorMessage;
        }
      }

      Alert.alert("Authentication Error", errorMessage);
      console.error("Login Error Detail:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={globalStyles.container}>
        {/* Header Logo */}
        <View style={styles.headerContainer}>
          <View style={styles.logoWrapper}>
            <Logo width={28} height={28}/>
            <Text style={[Typography.displayLg, {color: Colors.primary, marginBottom: Spacing.xs}]}>TaskFlow Pro</Text>
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={[Typography.displayLg, styles.welcomeTitle]}>
            Welcome back
          </Text>
          <Text style={[Typography.bodyMd, styles.welcomeSub]}>
            Continue your architectural journey with TaskFlow Pro
          </Text>
        </View>

        {/* Form Input */}
        <View style={styles.formWrapper}>
          <SafeAreaView style={styles.formContainer}>
            <Input
              value={email}
              setValue={(val) => {
                setEmail(val);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              placeholder="Email Address"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              value={password}
              setValue={(val) => {
                setPassword(val);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              placeholder="Password"
              isPassword={true}
              error={errors.password}
            />

            <Pressable>
              <Text style={[Typography.labelSm, styles.forgotPassword]}>
                Forgot Password?
              </Text>
            </Pressable>
          </SafeAreaView>

          <Button
            title={loading ? "Processing..." : "Sign In"}
            disabled={loading}
            styleClass={{ alignSelf: "stretch", opacity: loading ? 0.7 : 1 }}
            onPress={handleLogin}
          />
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
        </View>

        {/* Footer Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable onPress={handleOnRegister}>
            <Text style={[Typography.labelSm, styles.signUpLink]}>
              Get Started
            </Text>
          </Pressable>
        </View>

        {/* --- DEBUG AREA (Sẽ xóa khi hoàn thiện app) --- */}
        <View style={styles.debugSection}>
          <Text style={styles.debugLabel}>DEVELOPER DEBUG TOOL</Text>
          <ConnectionScreen />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: Spacing.xxl,
    marginTop: Spacing.xxl,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  welcomeContainer: {
    paddingBottom: 48,
  },
  welcomeTitle: {
    fontSize: 56,
    lineHeight: 46,
    paddingBottom: Spacing.sm,
  },
  welcomeSub: {
    fontSize: 16,
    color: Colors.description,
  },
  formWrapper: {
    paddingBottom: Spacing.lg,
  },
  formContainer: {
    flexDirection: "column",
    gap: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  forgotPassword: {
    color: Colors.primary,
    fontSize: 12,
    letterSpacing: 1,
    textAlign: "right",
  },
  dividerContainer: {
    paddingVertical: 48,
  },
  divider: {
    borderWidth: 1,
    borderColor: Colors.primary_T90,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: 11,
  },
  signUpLink: {
    fontSize: 11,
    color: Colors.primary,
  },
  // Style cho phần Debug
  debugSection: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "#FDF2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#F87171",
    marginBottom: 40
  },
  debugLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#B91C1C",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1
  }
});