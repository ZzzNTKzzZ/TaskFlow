import TopBar from "@/components/ui/TopBar";
import { Stack } from "expo-router";

export default function WorkspaceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Workspaces" }} />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Workspace Detail",
        }}
      />
    </Stack>
  );
}
