import TopBar from "@/components/ui/TopBar";
import {
  router,
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { useEffect } from "react";

export default function WorkspaceIdLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="(board-detail)"
        options={({ route }) => {
          const routeParams = route.params as any;
          return {
            headerShown: true,
            header: () => (
              <TopBar
                name={routeParams.name}
                icon={routeParams.icon}
                color={routeParams.color}
                menu={["Create list", "Members", "Board settings", "Delete board"]}
              />
            ),
          };
        }}
      />
        <Stack.Screen name="[cardId]"/>
    </Stack>
  );
}
