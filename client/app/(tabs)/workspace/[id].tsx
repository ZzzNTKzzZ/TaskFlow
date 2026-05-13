import { Screen } from "@/components/layout/Screen";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function WorkspaceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: `Workspace: ${id}`, // Ghi đè tiêu đề "Loading..." ở trên
        }}
      />
      <View>
      </View>
    </Screen>
  );
}
