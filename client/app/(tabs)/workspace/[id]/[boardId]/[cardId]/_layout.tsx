import TopBar from "@/components/ui/TopBar";
import { Stack } from "expo-router";

export default function CardLayout() {
  return (
    <>
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={({ route }) => {
          const routeParams = route.params as any;
          return {
            headerShown: true,
            header: () => (
              <TopBar
                name={"Card details"}
                icon={routeParams.icon}
                color={routeParams.color}
                menu={["Edit card", "Move card", "Delete card"]}
              />
            ),
          };
        }}
      />
    </Stack>
    
        </>
  );
}
