import { globalStyles } from "@/styles/global";
import { Colors, Spacing, Typography } from "@/theme";
import { Pressable, Text, View, StyleSheet } from "react-native";
import Logo from "@/assets/icons/Logo.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/Button";
import Input from "@/components/ui/Input"; 
import { useState } from "react";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerPress = () => {
    router.push("/Auth/Register");
  };

  return (
    <View style={globalStyles.container}>
      {/* Header Logo */}
      <View style={styles.headerContainer}>
        <View style={styles.logoWrapper}>
          <Logo />
          <Text style={globalStyles.textHeading}>TaskFlow Pro</Text>
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
            setValue={setEmail} 
            placeholder="Email Address" 
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input 
            value={password} 
            setValue={setPassword} 
            placeholder="Password" 
            isPassword={true} 
          />

          <Pressable>
            <Text style={[Typography.labelSm, styles.forgotPassword]}>
              Forgot Password?
            </Text>
          </Pressable>
        </SafeAreaView>

        <Button title="Sign In" styleClass={{ alignSelf: "stretch" }} />
      </View>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
      </View>

      {/* Footer Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Pressable onPress={registerPress}>
          <Text style={[Typography.labelSm, styles.signUpLink]}>
            Get Started
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: Spacing.xxl,
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
});