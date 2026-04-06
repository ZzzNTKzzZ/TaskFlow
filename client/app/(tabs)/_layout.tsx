import { Colors } from "@/theme";
import { Tabs } from "expo-router";
import Home from "@/assets/icons/Home.svg";
import Workspace from "@/assets/icons/Workspace.svg";
import Todo from "@/assets/icons/Todo.svg";
import {
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/manrope";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import { AppIcon } from "@/components/ui/AppIcon";
export default function TabLayout() {
  const [loaded, error] = useFonts({
    Manrope_800ExtraBold,
    Manrope_700Bold,
    Manrope_600SemiBold,
    Inter_400Regular,
  });
  if (!loaded && !error) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.description,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <AppIcon name="Home" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="Board"
        options={{
          title: "Board",
          tabBarIcon: ({ color }) => (
            <AppIcon name="Workspace" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="Todo"
        options={{
          title: "Todo",
          tabBarIcon: ({ color }) => (
            <AppIcon name="Todo" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="Alerts"
        options={{
          title: "Alerts",
        }}
      />
    </Tabs>
  );
}
