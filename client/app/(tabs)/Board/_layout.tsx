import { Stack } from "expo-router";

export default function BoardStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Boards" }}/>
      <Stack.Screen name="Create" options={{ title: "Create Board" }} />

      {/* Các màn hình phụ: Luôn hiện Tab bar */}
      <Stack.Screen name="[id]" options={{ title: "Workspace Details" }} />
    </Stack>
  );
}
