import { Stack } from "expo-router";

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Workspaces" }}/>
      <Stack.Screen name="Create" options={{ title: "Create new Workspace" }} />
    </Stack>
  );
}
