import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

// Components
import { Screen } from "@/components/layout/Screen";
import Logo from "@/components/ui/Logo";
import Input from "@/components/ui/Input";
import Buttons from "@/components/ui/Button";

// Theme & Assets
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import { Theme } from "@/theme/theme";
import GoogleIcon from "@/assets/icon/GoogleIcon.svg";
import FacebookIcon from "@/assets/icon/FacebookIcon.svg";
import { LoginData } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Login() {
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [errMsg, setErrMsg] = useState<string | null>("");
  const user = useCurrentUser();

  const handleForgot = () => router.navigate("/(auth)/forgot");
  const handleLogin = async () => {
    const data: LoginData = {
      email,
      password,
    };
    const dataResponse = await login(data);
    if (!dataResponse.success) setErrMsg(dataResponse.errMsg || null);
  };
  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleEmailChange = (text: string) => {
    if (errMsg) {
      setErrMsg(null);
      setEmail("");
    }
    setEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    if (errMsg) {
      setErrMsg(null);
      setPassword("");
    }
    setPassword(text);
  };

  const handleSignUp = () => {
    router.navigate("/(auth)/signup")
  }

  useEffect(() => {
    if (!!user) router.navigate("/(tabs)");
  }, [user]);

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headline}>
          <Logo text size="md" />
          <View>
            <Text style={Typography.heading}>
              Sign in to your {"\n"}Account
            </Text>
            <Text style={styles.caption}>
              Enter your email and password to log in
            </Text>
          </View>
        </View>

        <View style={styles.field}>
          <Input
            value={email}
            setValue={handleEmailChange}
            placeholder="Email"
            label="Email"
            error={!!errMsg}
          />
          <Input
            value={password}
            setValue={handlePasswordChange}
            placeholder="Password"
            label="Password"
            isPassword
            showPassword={showPassword}
            onPressIcon={togglePassword}
            error={!!errMsg}
          />
          <TouchableOpacity onPress={handleForgot} activeOpacity={0.7}>
            <Text style={styles.forgotText}>Forgot Password ?</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.errMsg}>{errMsg}</Text>
          <Buttons onPress={handleLogin} style={styles.loginBtn}>
            Log In
          </Buttons>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialButtons}>
            <Buttons onPress={() => {}} type="ghost" leftIcon={<GoogleIcon />}>
              Continue with Google
            </Buttons>
            <Buttons
              onPress={() => {}}
              type="ghost"
              leftIcon={<FacebookIcon />}
            >
              Continue with Facebook
            </Buttons>
          </View>
        </View>

        <View style={styles.spacer} />

        <View style={styles.footer}>
          <Text style={styles.footerLabel}>Don’t have an account?</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={handleSignUp}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing[6],
  },
  headline: {
    gap: Spacing[8],
  },
  caption: {
    ...Typography.caption,
    marginTop: Spacing[3],
  },
  field: {
    marginTop: Spacing[8],
    gap: Spacing[4],
  },
  forgotText: {
    ...Typography.subtitle,
    textAlign: "right",
    color: Theme.primary,
    fontSize: 14,
  },

  loginBtn: {
    marginVertical: Spacing[4],
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[4],
    marginBottom: Spacing[4],
  },
  line: {
    height: 1,
    backgroundColor: Theme.border,
    flex: 1,
  },
  orText: {
    ...Typography.label,
    fontSize: 16,
  },
  socialButtons: {
    gap: Spacing[4],
  },
  spacer: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing[1],
    marginBottom: Spacing[4],
    paddingVertical: Spacing[2],
  },
  footerLabel: {
    ...Typography.label,
    fontSize: 14,
  },
  signUpText: {
    ...Typography.subtitle,
    color: Theme.primary,
    fontSize: 14,
  },
  errMsg: {
    ...Typography.label,
    marginTop: Spacing[2],
    color: Theme.error,
    fontSize: 14,
    textAlign: "center",
  },
});
