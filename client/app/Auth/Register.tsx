import { Pressable, Text, View, StyleSheet, Alert } from "react-native";
import { globalStyles } from "@/styles/global";
import { Colors, Spacing, Typography } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/Button";
import { registerSchema } from "@/utils/validation/auth.schema";
import { registerApi } from "@/service/auth.service";
import { AppIcon } from "@/components/ui/AppIcon";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 1. Quản lý loading và lỗi (đã sửa kiểu dữ liệu)
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const onBack = () => {
    router.replace("/");
  };

  const handleRegister = async () => {
    setErrors({});

    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      const newErrors: { name?: string; email?: string; password?: string } = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as "name" | "email" | "password";
        if (!newErrors[fieldName]) {
          newErrors[fieldName] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await registerApi(name, email, password);
      console.log(name, email, password)
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/") }
      ]);
    } catch (error: any) {
      const serverMsg = error.response?.data?.message || "Registration failed. Please try again.";
      Alert.alert("Registration Error", serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={10}>
          <AppIcon name="LeftArrow" />
        </Pressable>
        <Text style={globalStyles.textHeading}>TaskFlow Pro</Text>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={[Typography.displayLg, styles.mainTitle]}>
          Create Your Workspace
        </Text>
        <Text style={[Typography.bodyMd, styles.subTitle]}>
          Build your professional workflow with precision and focus.
        </Text>
      </View>

      {/* Form Input Section */}
      <View style={styles.formSection}>
        <Input
          value={name}
          setValue={(val) => {
            setName(val);
            if (errors.name) setErrors({ ...errors, name: "" });
          }}
          placeholder="Full Name"
          autoCapitalize="words"
          error={errors.name} // Hiển thị lỗi fullName
        />
        <Input
          value={email}
          setValue={(val) => {
            setEmail(val);
            if (errors.email) setErrors({ ...errors, email: "" });
          }}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email} // Hiển thị lỗi email
        />
        <Input
          value={password}
          setValue={(val) => {
            setPassword(val);
            if (errors.password) setErrors({ ...errors, password: "" });
          }}
          placeholder="Password"
          isPassword
          error={errors.password} // Hiển thị lỗi password
        />
      </View>

      {/* Action Section */}
      <View style={styles.actionSection}>
        <Button 
            title={loading ? "Creating..." : "Create Account"} 
            styleClass={styles.buttonWidth} 
            onPress={handleRegister} // Gán hàm xử lý
            disabled={loading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={onBack}>
            <Text style={[Typography.labelSm, styles.signInLink]}>
              Sign In
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: Spacing.xxl,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  titleSection: {
    gap: Spacing.lg,
    marginBottom: 40, // Khoảng cách tới form
  },
  mainTitle: {
    fontSize: 32,
    textAlign: "center",
  },
  subTitle: {
    textAlign: "center",
    fontSize: 16,
    color: Colors.description,
    lineHeight: 24,
  },
  formSection: {
    gap: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  actionSection: {
    paddingTop: 40,
    gap: 32,
  },
  buttonWidth: {
    alignSelf: "stretch",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: 11,
  },
  signInLink: {
    color: Colors.primary,
    fontSize: 11,
  },
});