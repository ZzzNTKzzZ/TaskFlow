import { Colors, Rounded, Spacing, Typography } from "@/theme";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceLow,
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
  formSylte: {
    backgroundColor: Colors.onPrimary,
    borderTopColor: Colors.primary,
    borderTopWidth: 2,
    borderRadius: Rounded.lg,
    padding: Spacing.xxl,
    marginTop: 40,
    display: "flex",
    gap: Spacing.lg,
  },
  subHeader: { 
    letterSpacing: 1, 
    ...Typography.labelSm,
  },
});
