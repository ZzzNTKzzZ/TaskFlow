import { Screen } from "@/components/layout/Screen";
import ListCard from "@/components/list/ListCard";
import BoardService from "@/modules/board/board.service";
import { ListCardUI } from "@/modules/list/list";
import { Spacing } from "@/theme/spacing";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";


export default function List() {
  const { boardId } = useGlobalSearchParams();
  const [list, setList] = useState<ListCardUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await BoardService.getBoard(boardId as string);
        setList(response.lists);
      } finally {
        setLoading(false);
      }
    };

    getList();
  }, []);

  if (loading) return <Text>Loading...</Text>;

  return (
    <Screen isScroll={false}>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        nestedScrollEnabled
        scrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: Spacing[6],
          borderRadius: 8,
        }}
        renderItem={({ item }) => <ListCard typeCard="List" {...item} />}
      />
    </Screen>
  );
}
