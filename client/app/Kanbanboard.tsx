import Breadcrumb from "@/components/Breadcrumb";
import Plus from "../assets/icons/Plus.svg";
import Filter from "../assets/icons/Filter.svg";
import Button from "@/components/Button";
import { Spacing, Typography } from "@/theme";
import { Manrope_800ExtraBold, useFonts } from "@expo-google-fonts/manrope";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Board from "@/components/Board";
import { globalStyles } from "@/styles/global";

type KanbanProps = {
  id: string;
  title: string;
};

const styles = StyleSheet.create({
  groupButton: {
    flexDirection: "row",
    gap: Spacing.md,
  },
});

export default function KanbanBoard({ id, title }: KanbanProps) {
  const [loader] = useFonts({
    Manrope_800ExtraBold,
    Inter_400Regular,
  });

  if (!loader) return null;

  return (
    <View>
      <View
        style={[
          globalStyles.container,
          {
            marginVertical: 32,
          },
        ]}
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

        <Text
          style={[
            Typography.displayLg,
            { fontSize: 36, paddingBottom: Spacing.md },
          ]}
        >
          {title}
        </Text>

        <View style={styles.groupButton}>
          <Button leftIcon={<Filter />} title="Filter" variant="secondary" />
          <Button leftIcon={<Plus />} title="New Task" variant="primary" />
        </View>
      </View>

      <View style={{ minWidth: 280 }}>
        <Board id={"1"} />
      </View>
    </View>
  );
}
