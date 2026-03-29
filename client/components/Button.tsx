import { Colors, Rounded, Spacing, Typography } from "@/theme";
import { Manrope_600SemiBold, useFonts } from "@expo-google-fonts/manrope";
import React, { useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type ButtonProps = {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "primary" | "ghost" | "secondary";
  onPress?: () => void;
  styleClass?: StyleProp<ViewStyle>;
};

const stylesButton = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  secondary: {
    backgroundColor: Colors.surfaceHigh,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
  textPrimary: {
    fontSize: 14,
    color: Colors.onPrimary,
    fontFamily: "Manrope_600SemiBold",
  },

  textSecondary: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: "Manrope_600SemiBold",
  },

  textGhost: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: "Manrope_600SemiBold",
  },
});

const animateConfig = {
  primary: {
    fn: (
      scaleValue: any,
      toScale: number,
      toOpacity: number,
      opacityValue: any,
    ) =>
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
      ]),
  },
  ghost: {
    fn: (
      scaleValue: any,
      toScale: number,
      toOpacity: number,
      opacityValue: any,
    ) =>
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: toScale,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: toOpacity,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
  },
  secondary: {
    fn: (
      scaleValue: any,
      toScale: number,
      toOpacity: number,
      opacityValue: any,
    ) =>
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
      ]),
  },
};

export default function Button({
  title,
  leftIcon,
  rightIcon,
  variant = "primary",
  onPress,
  styleClass
}: ButtonProps) {
  const [loader] = useFonts({
    Manrope_600SemiBold,
  });

  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;
  const animation = animateConfig[variant] || animateConfig.primary;
  const animate = (toScale: number, toOpacity: number) => {
    animation.fn(scaleValue, toScale, toOpacity, opacityValue).start();
  };

  if (!loader) return null;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animate(0.95, 0.8)}
      onPressOut={() => animate(1, 1)}
      style={[{ alignSelf: "flex-start" }, styleClass]}
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
        {leftIcon && <View style={{paddingTop: 1}}>{leftIcon}</View>}
        <Text
          style={[
            Typography.titleMd,
              variant === "primary" && stylesButton.textPrimary,
              variant === "secondary" && stylesButton.textSecondary,
              variant === "ghost" && stylesButton.textGhost,
          ]}
        >
          {title}
        </Text>
        {rightIcon && <View style={{paddingTop: 1}}>{rightIcon}</View>}
      </Animated.View>
    </Pressable>
  );
}
