import TopBar from "@/components/ui/TopBar";
import { Stack } from "expo-router";

export default function BoardLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Workspace List",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: "Workspace Detail",
          header: (props) => {
            const params = props.route.params as any;
            
            return (
              <TopBar
                
                title={params.name || "Workspace"}
                icon={params?.icon}
                color={params?.color}
              />
            );
          },
        }}
      />
    </Stack>
  );
}
