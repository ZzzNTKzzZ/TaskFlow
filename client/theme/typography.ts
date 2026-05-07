import { Colors } from "./colors";
import { Theme } from "./theme";

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
};

export const Typography = {
  heading: {
    fontFamily: "Inter_700Bold",
    fontSize: 32
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },

  subtitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  
  caption: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Theme.textSecondary
  },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Theme.textSecondary,
    lineHeight: 12 * 1.6
  }
  
};