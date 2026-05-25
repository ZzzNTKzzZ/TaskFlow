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

  // 2. Synchronize with the same events your Board uses!
  useEffect(() => {
    if (!boardId) return;
    
    let offCreating: any;
    let offCreated: any;
    let offFailed: any;

    (async () => {
      try {
        const eventBus = await import("@/services/eventBus");
        
        offCreating = eventBus.on("list:creating", (tempList: any) => {
          if (tempList.boardId === boardId) {
            setList((prev) => [...prev, tempList]);
          }
        });

        offCreated = eventBus.on("list:created", ({ tempId, created }: any) => {
          setList((prev) => prev.map((l) => (l.id === tempId ? created : l)));
        });

        offFailed = eventBus.on("list:create_failed", ({ tempId }: any) => {
          setList((prev) => prev.filter((l) => l.id !== tempId));
        });
      } catch (e) {
        console.error("eventBus sync error in List view:", e);
      }
    })();

    return () => {
      if (offCreating) offCreating();
      if (offCreated) offCreated();
      if (offFailed) offFailed();
    };
  }, [boardId]);

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
