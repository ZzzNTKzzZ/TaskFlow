import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";

export default function WorkspaceDetailLayout() {
  const TopTabs = withLayoutContext(
    createMaterialTopTabNavigator().Navigator
  );

  return (
    <TopTabs
      screenOptions={{
        tabBarActiveTintColor: Theme.primary,
        tabBarInactiveTintColor: Theme.textSecondary,
        tabBarIndicatorStyle: {
          backgroundColor: Theme.primary,
          height: 3,
        },
        tabBarLabelStyle: { ...Typography.heading, fontSize: 14 },
        tabBarStyle: { backgroundColor: Theme.background },
      }}
    >
      <TopTabs.Screen name="index" options={{ title: "Boards" }} />
      <TopTabs.Screen name="members" options={{ title: "Members" }} />
      <TopTabs.Screen name="activity" options={{ title: "Activity" }} />
      <TopTabs.Screen name="setting" options={{ title: "Setting" }} />
    </TopTabs>
  );
}
