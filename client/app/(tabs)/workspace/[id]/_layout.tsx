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
        name="(workspace-detail)"
        options={({ route }) => {
          const routeParams = route.params as any;
          return {
            headerShown: true,
            header: () => (
              <TopBar
              name={routeParams.name}
              icon={routeParams.icon}
                color={routeParams.color}
              />
            ),
          };
        }}
      />
      <Stack.Screen
        name="[boardId]"
        options={({ route }) => {
          const routeParams = route.params as any;
          return {
            headerShown: true,
            header: () => (
              <TopBar
                onBack={() => router.navigate(`/(tabs)/workspace/${routeParams.id}/(workspace-detail)`)}
                name={routeParams.name}
                icon={routeParams.icon}
                color={routeParams.color}
                parentName={routeParams.parentName}
              />
            ),
          };
        }}
      />
    </Stack>
  );
}
