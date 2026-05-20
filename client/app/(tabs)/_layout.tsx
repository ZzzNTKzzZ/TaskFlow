import Icons from "@/components/icons/Icons";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const inset = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        freezeOnBlur: true,
        headerShown: false,
        lazy: true,
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
        tabBarInactiveTintColor: Theme.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icons name="Home" color={focused ? Theme.primary : undefined} />
          ),
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="workspace"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icons name="Board" color={focused ? Theme.primary : undefined} />
          ),
          title: "Workspace",
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icons
              name="Activity"
              color={focused ? Theme.primary : undefined}
            />
          ),
          title: "Activity",
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icons name="Setting" color={focused ? Theme.primary : undefined} />
          ),
          title: "Setting",
        }}
      />
    </Tabs>
  );
}
