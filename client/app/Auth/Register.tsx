import { Pressable, Text, View, StyleSheet } from "react-native";
import LeftArrow from "@/assets/icons/LeftArrow.svg";
import { globalStyles } from "@/styles/global";
import { Colors, Spacing, Typography } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/Button";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onBack = () => {
    router.replace("/")
  };

  return (
    <View style={globalStyles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={10}>
          <LeftArrow />
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
          value={fullName}
          setValue={setFullName}
          placeholder="Full Name"
          autoCapitalize="words"
        />
        <Input 
          value={email} 
          setValue={setEmail} 
          placeholder="Email" 
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          value={password}
          setValue={setPassword}
          placeholder="Password"
          isPassword
        />
      </View>

      {/* Action Section */}
      <View style={styles.actionSection}>
        <Button title="Create Account" styleClass={styles.buttonWidth} />
        
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