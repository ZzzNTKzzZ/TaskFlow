import TopBar from "@/components/ui/TopBar";
import { router, Stack, useGlobalSearchParams } from "expo-router";

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
                icon={routeParams.workspaceIcon}
                color={routeParams.workspaceColor}
                parentName={routeParams.parentName}
                menu={[
                  "Create list",
                  "Members",
                  "Board settings",
                  "Delete board",
                ]}
                onBack={() =>
                  router.push("../")
                }
              />
            ),
          };
        }}
      />
      <Stack.Screen name="[cardId]" />
    </Stack>
  );
}
