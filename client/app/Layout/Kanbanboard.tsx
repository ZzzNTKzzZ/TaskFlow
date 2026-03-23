import Breadcrumb from "@/components/Breadcrumb";
import { Typography } from "@/theme";
import { Manrope_800ExtraBold, useFonts } from "@expo-google-fonts/manrope";
import { Text, View } from "react-native";

type KanbanProps = {
  id: string;
  title: string;
};

export function KanbanBoard({ id, title }: KanbanProps) {
  const [loader] = useFonts({
    Manrope_800ExtraBold
  })

  if(!loader) return null

  return (
    <View
      style={{
        marginTop: 32,
      }}
    >
      <Breadcrumb
        items={[
          {
            label: "Project Ledger",
            onPress: () => console.log("Go workspace"),
          },
          {
            label: "Q4 Roadmap",
          },
        ]}
      />
      <Text style={[Typography.displayLg, {fontSize: 32}]}>{title}</Text>
    </View>
  );
}
