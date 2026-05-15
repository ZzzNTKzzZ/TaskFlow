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
        swipeEnabled: false,
        tabBarActiveTintColor: Theme.primary,
        tabBarInactiveTintColor: Theme.textSecondary,
        tabBarIndicatorStyle: {
          backgroundColor: Theme.primary,
          height: 3,
        },
        tabBarLabelStyle: { ...Typography.heading, fontSize: 16 },
        tabBarStyle: { backgroundColor: Theme.background },
      }}
    >
      <TopTabs.Screen name="index" options={{ title: "Boards" }} />
      <TopTabs.Screen name="list" options={{ title: "List" }} />
      <TopTabs.Screen name="card" options={{ title: "Card" }} />
      <TopTabs.Screen name="activity" options={{ title: "Activity" }} />
    </TopTabs>
  );
}
