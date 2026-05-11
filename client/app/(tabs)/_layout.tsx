import TabIcon from "@/components/icons/TabIcon";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const inset = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingTop: 2,
          height: inset.top + 16,
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
        },
        tabBarLabelStyle: {
          ...Typography.title,
          fontSize: 14, 
          letterSpacing: 0.2,
        },
        tabBarActiveTintColor: Theme.primary, 
        tabBarInactiveTintColor: Theme.textSecondary
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="home" active={focused} />,
          title: "Home",
        }}
      />
      <Tabs.Screen 
        name="workspace"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="board" active={focused} />,
          title: "Workspace"
        }}
      />
      <Tabs.Screen 
      name="activity"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="activity" active={focused} />,
          title: "Activity"
        }}
      />
      <Tabs.Screen 
      name="setting"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="setting" active={focused} />,
          title: "Setting"
        }}
      />
    </Tabs>
  );
}
