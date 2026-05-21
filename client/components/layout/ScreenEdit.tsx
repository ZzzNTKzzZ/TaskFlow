import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { router } from "expo-router";

export function ScreenEdit({
  children,
  padding = Spacing[6],
  isScroll = true,
  onSave,
}: {
  children: any;
  padding?: number;
  isScroll?: boolean;
  onSave: () => void
}) {
  if (isScroll)
    return (
      <ScrollView style={[styles.container, { paddingHorizontal: padding }]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Text
              style={[
                Typography.body,
                { fontSize: 18, color: Theme.primary },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSave}>

          <Text
            style={[Typography.body, { fontSize: 18, color: Theme.primary }]}
            >
            Save
          </Text>
              </TouchableOpacity>
        </View>

        {children}
      </ScrollView>
    );

  return (
    <View style={[styles.container, { paddingHorizontal: padding }]}>
      <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Text
              style={[
                Typography.body,
                { fontSize: 18, color: Theme.primary },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSave}>

          <Text
            style={[Typography.body, { fontSize: 18, color: Theme.primary }]}
            >
            Save
          </Text>
              </TouchableOpacity>
        </View>

        {children}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
});
