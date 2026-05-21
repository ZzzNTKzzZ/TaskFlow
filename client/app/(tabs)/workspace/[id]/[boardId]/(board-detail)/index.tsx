import { Screen } from "@/components/layout/Screen";
import ListCard from "@/components/list/ListCard";
import BoardService from "@/modules/board/board.service";
import { ListCardUI } from "@/modules/list/list";
import { Spacing } from "@/theme/spacing";
import { useLocalSearchParams, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

export default function Board() {
  const { boardId, refresh } = useLocalSearchParams();
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
  }, [refresh, boardId]);

  if (loading) return <Text>Loading...</Text>;

  return (
    <Screen isScroll={false} padding={Spacing[4]}>
      
      <DraggableFlatList
        data={list}
        horizontal
        nestedScrollEnabled
        activationDistance={20}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onDragEnd={({ data }) => {
          setList(data);

          // call api save order
          // BoardService.updateListOrder(data)
        }}
        style={{ paddingVertical: Spacing[4] }}
        renderItem={({ item, drag, isActive }) => (
          <TouchableOpacity
          activeOpacity={0.7}
            style={{
              marginRight: Spacing[3],
            }}
          >
            <ListCard {...item} onLongPress={drag} />
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
