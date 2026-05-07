import SearchIcon from "@/components/icons/SearchIcon";
import { Screen } from "@/components/layout/Screen";
import ActionCard from "@/components/navigation/ActionCard";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { useCurrentUser } from "@/modules/auth/hook/useCurrentUser";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";

export default function HomeScreen() {
  const user = useCurrentUser();
  return (
    <Screen padding={Spacing[4]}>
      <View style={styles.container}>
        <View style={styles.headline}>
          <Avatar />
          <View style={{ flex: 1 }}>
            <Text style={[Typography.title, { fontSize: 16 }]}>
              Hello, {user?.name || "User"}
            </Text>
            <Text style={[Typography.label]}>Let's get things done</Text>
          </View>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            style={{
              backgroundColor: Theme.surface,
              borderRadius: 16,
              padding: 12,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,

              elevation: 8,
            }}
          >
            <SearchIcon />
          </TouchableOpacity>
        </View>
        {/* Quick Action */}
        <View style={{backgroundColor: Theme.surface, padding: Spacing[4], borderRadius: 16, borderWidth: 2, borderColor: Theme.border, marginTop: Spacing[4]}}>
          <Text style={[Typography.heading, { fontSize: 16 }]}>
            Quick Action
          </Text>
          <View style={{width: "100%", flexDirection: "row", alignItems: "center", gap: Spacing[2], paddingTop: Spacing[4]}}>
            <ActionCard type="newBoard" onPress={() => {}}/>
            <ActionCard type="newTodo" onPress={() => {}}/>
            <ActionCard type="inviteMembers" onPress={() => {}}/>
            <ActionCard type="automation" onPress={() => {}}/>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Spacing[6],
  },
  headline: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
});
