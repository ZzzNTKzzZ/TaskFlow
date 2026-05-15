import { Screen } from "@/components/layout/Screen";
import ListCard from "@/components/list/ListCard";
import BoardService from "@/modules/board/board.service";
import { ListCardUI } from "@/modules/list/list";
import { Spacing } from "@/theme/spacing";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Board() {
  const { boardId } = useLocalSearchParams();
  const [list, setList] = useState<ListCardUI[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getList = async () => {
      try {
        setLoading(true);
        const response = await BoardService.getBoard(boardId as string);
        setList(response.lists);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    getList();
  }, []);

  if (loading) return <Text>Loading...</Text>;

  return (
    <Screen>
      <View style={{ flexDirection: "row", gap: Spacing[3] }}>
        {list.map((l) => (
          <View>
            <ListCard key={l.id} {...l} />
          </View>
        ))}
      </View>
    </Screen>
  );
}
