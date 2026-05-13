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
           header: (props) => <TopBar title={props.options.title || "Workspace"} />,
        }}
      />
    </Stack>
  );
}
