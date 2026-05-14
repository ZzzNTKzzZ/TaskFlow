import { View, StyleSheet, ScrollView } from "react-native";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";

export function Screen({ children, padding = Spacing[6] }: { children: any, padding?: number }) {
  return <ScrollView style={[styles.container, {paddingHorizontal: padding}]}>{children}</ScrollView>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background, 
  },
});
