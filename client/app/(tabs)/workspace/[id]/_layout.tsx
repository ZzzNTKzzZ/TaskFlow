import TopBar from "@/components/ui/TopBar";
import {
  router,
  Stack,
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
        name="(workspace-detail)"
        options={({ route }) => {
          const routeParams = route.params as any;
          return {
            headerShown: true,
            header: () => (
              <TopBar
              onBack={() => router.back()}
                name={routeParams.name}
                icon={routeParams.icon}
                color={routeParams.color}
                workspaceId={routeParams.id}
                menu={["Create board", "Help & feedback", "Delete workspace"]}
              />
            ),
          };
        }}
      />
      <Stack.Screen name="[boardId]" />
    </Stack>
  );
}