import { Colors, Rounded, Spacing, Typography } from "@/theme";
import { Manrope_600SemiBold, useFonts } from "@expo-google-fonts/manrope";
import React, { useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ButtonProps = {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "primary" | "ghost";
  onPress?: () => void;
};

const stylesButton = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Rounded.sm,
    gap: Spacing.sm,
  },
  primary: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  textPrimary: {
    fontSize: 14,
    color: Colors.onPrimary,
    fontFamily: "Manrope_600SemiBold",
  },
  textGhost: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "Manrope_600SemiBold",
  },
});

export function Buttons({
  title,
  leftIcon,
  rightIcon,
  variant = "primary",
  onPress,
}: ButtonProps) {
  const [loader] = useFonts({
    Manrope_600SemiBold,
  });

  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  const animate = (toScale: number, toOpacity: number) => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: toScale,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: toOpacity,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (!loader) return null;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animate(0.95, 0.8)}
      onPressOut={() => animate(1, 1)}
      style={{ alignSelf: "flex-start" }}
    >
    
      <Animated.View
        style={[
          stylesButton.base,
          stylesButton[variant],
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      >
        {leftIcon}
        <Text
          style={[
            Typography.titleMd,
            variant === "primary" ? stylesButton.textPrimary : stylesButton.textGhost,
          ]}
        >
          {title}
        </Text>
        {rightIcon}
      </Animated.View>
    </Pressable>
  );
}