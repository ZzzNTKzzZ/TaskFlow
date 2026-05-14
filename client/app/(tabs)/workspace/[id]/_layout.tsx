import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { Text } from "react-native";

export default function WorkspaceTabs() {
  const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

  return (
    <TopTabs
      screenOptions={{
        tabBarActiveTintColor: Theme.primary, 
        tabBarInactiveTintColor: Theme.textSecondary, // Màu chữ khi không chọn
        tabBarIndicatorStyle: { backgroundColor: Theme.primary, height: 3 }, // Thanh gạch chân
        tabBarLabelStyle: { ...Typography.heading, fontSize: 14},
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
