import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import React, { ReactNode, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  children: ReactNode;

  onPress: () => void;

  disable?: boolean;

  type?: "ghost" | "primary" | "secondary";

  style?: StyleProp<ViewStyle>;
  styleText?: StyleProp<TextStyle>;
  leftIcon?: ReactNode;

  rightIcon?: ReactNode;
}

export default function Button({
  children,
  onPress,
  disable = false,
  type = "primary",
  style,
  styleText,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const buttonStyles = {
    ghost: styles.ghost,
    primary: styles.primary,
    secondary: styles.secondary,
  };

  const opacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(opacity, {
      toValue: 0.7,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ opacity }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disable}
        style={[
          styles.base,
          buttonStyles[type],
          disable && styles.disabled,
          style,
        ]}
      >
        <View style={styles.content}>
          {leftIcon}

          <Text
            style={[
              styles.text,
              type === "ghost" && {
                color: Theme.textPrimary,
              },
              styleText
            ]}
          >
            {children}
          </Text>

          {rightIcon}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  primary: {
    backgroundColor: Theme.primary,
  },

  secondary: {
    backgroundColor: Theme.secondary,
  },

  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Theme.border,
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    color: Theme.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});