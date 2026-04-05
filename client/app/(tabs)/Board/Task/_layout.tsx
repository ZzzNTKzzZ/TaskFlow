import { Stack } from "expo-router";

export default function TaskStackLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="Create" />
        </Stack>
    )
}