import { Colors, Spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: Spacing.xxl,
    flex: 1,
  },
  textHeading: {
    fontSize: 50,
    letterSpacing: -2.4,
    lineHeight: 52,
    paddingBottom: Spacing.lg,
  },
  textDescription: {
    fontSize: 16,
    color: Colors.description,
  },
});
