import { View, ScrollView } from "react-native";
import { Rounded, Spacing } from "@/theme";
import List from "./List";
import { globalStyles } from "@/styles/global";
type BoardProps = {
  id: string;
  Lists?: {
    id: string;
    title: string;
    position: number;
    boardId: string;
  };
};

export default function Board({ id }: BoardProps) {
  const lists = [
    {
      id: "l1",
      title: "Todo",
      position: 1,
      boardId: "b1",
    },
    {
      id: "l2",
      title: "Doing",
      position: 2,
      boardId: "b1",
    },
    {
      id: "l3",
      title: "Done",
      position: 3,
      boardId: "b1",
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[globalStyles.container, { flex: 1 }]}
      contentContainerStyle={{
        paddingHorizontal: Spacing.md,
        gap: Spacing.xxl,
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: Spacing.xxl,
          borderRadius: Rounded.sm,
        }}
      >
        {lists.map((list) => (
          <View
            key={list.id}
            style={{
              alignSelf: "flex-start",
              borderRadius: Rounded.sm,
              width: 280,
            }}
          >
            <List
              boardId={id}
              list={{ title: list.title, id: list.id }}
              quantity={lists.length}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
