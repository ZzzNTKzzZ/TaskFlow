import { Colors, Rounded, Spacing, Typography } from "@/theme";
import { Priority } from "@/Types/enum";
import { Pressable, StyleSheet, Text, View } from "react-native";

type PriorityTagProps = {
  priority: Priority;
  onPress?: () => void;
  isActive?: boolean;
};

const sytles = StyleSheet.create({
  base: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Rounded.md,
    alignSelf: "flex-start",
  },
  low: {
    backgroundColor: Colors.secondaryFixed,
  },
  medium: {
    backgroundColor: Colors.primary_T90,
  },
  high: {
    backgroundColor: Colors.tertiary_opa_8,
  },
  urgent: {
    backgroundColor: Colors.tertiary,
  },
});

const textStyles = StyleSheet.create({
  base: {
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  low: {
    color: Colors.onSecondaryContainer,
  },
  medium: {
    color: Colors.primary,
  },
  high: {
    color: Colors.tertiary,
  },
  urgent: {
    color: Colors.onPrimary,
  },
});

export default function PriorityTag({
  priority = "low",
  onPress,
  isActive,
}: PriorityTagProps) {
  return (
    <Pressable
      style={[
        sytles.base,
        sytles[priority],
        isActive && {
          borderWidth: 2,
          borderColor: textStyles[priority].color,
          transform: [{ scale: 1.1 }],
        },
      ]}
      onPress={onPress}
    >
      <View>
        <Text
          style={[
            textStyles.base,
            textStyles[priority],
            Typography.displayLg,
            { fontSize: 10 },
            isActive && { fontWeight: "800" },
          ]}
        >
          {priority}
        </Text>
      </View>
    </Pressable>
  );
}
