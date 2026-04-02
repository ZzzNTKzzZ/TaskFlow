import { Stack } from "expo-router";

export default function TodoStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Todo" }} />

    </Stack>
  );
}
