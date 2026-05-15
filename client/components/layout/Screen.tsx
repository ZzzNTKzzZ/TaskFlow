import { View, StyleSheet, ScrollView } from "react-native";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";

export function Screen({ children, padding = Spacing[6], isScroll = true }: { children: any, padding?: number, isScroll?: boolean }) {
  if(isScroll) return <ScrollView style={[styles.container, {paddingHorizontal: padding}]}>{children}</ScrollView>;

  return <View style={[styles.container, {paddingHorizontal: padding}]}>{children}</View>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background, 
  },
});
