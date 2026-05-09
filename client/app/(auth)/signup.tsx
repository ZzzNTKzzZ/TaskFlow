import { Screen } from "@/components/layout/Screen";
import Button from "@/components/ui/Button";
import BackButton from "@/components/navigation/BackButton";
import Input from "@/components/ui/Input";
import { useAuth } from "@/modules/auth/hook/useAuth";
import { SignUpData } from "@/modules/auth/types/auth";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SignUp() {
  const [name, setName] = useState<string>("User1");
  const [email, setEmail] = useState<string>("User3@gmail.com");
  const [password, setPassword] = useState<string>("User12345");
  const [errMsg, setErrMsg] = useState<string | null>("");
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const handleRegister = async () => {
    const data: SignUpData = {
      name,
      email,
      password,
    };

    const response = await signup(data);
    if (!response.success) setErrMsg(response.errMsg || null);
  };

  const handleLogIn = () => {
    router.back();
  };

  const handleNameChange = (text: string) => {
    if (errMsg) {
      setErrMsg(null);
      setName("");
    }
    setName(text);
  };

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

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.headline}>
          <BackButton />
          <View>
            <Text style={Typography.heading}>Sign Up</Text>
            <Text style={styles.caption}>Create an account to continue!</Text>
          </View>
        </View>
        <View style={styles.form}>
          <Input
            value={name}
            setValue={handleNameChange}
            label="Name"
            placeholder="John Wick"
          />
          <Input
            value={email}
            setValue={handleEmailChange}
            label="Email"
            placeholder="jw@gmail.com"
          />
          <Input
            value={password}
            setValue={handlePasswordChange}
            label="Password"
            placeholder="Password"
            isPassword
            showPassword={showPassword}
            onPressIcon={togglePassword}
          />
        </View>
        <View>
          <Text style={styles.errMsg}>{errMsg}</Text>
          <Button onPress={handleRegister} style={styles.signupBtn}>
            Register
          </Button>
        </View>
        <View style={styles.spacer} />
        <View style={styles.footer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={handleLogIn}>
            <Text style={styles.logInText}>Log In</Text>
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
  form: {
    marginTop: Spacing[8],
    gap: Spacing[4],
  },
  signupBtn: {
    marginVertical: Spacing[4],
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
  logInText: {
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
