import { View, StyleSheet } from "react-native";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";

export function Screen({ children, padding = Spacing[6] }: { children: any, padding?: number }) {
  return <View style={[styles.container, {paddingHorizontal: padding}]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background, 
  },
});
