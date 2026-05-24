import { Screen } from "@/components/layout/Screen";
import ListCard from "@/components/list/ListCard";
import BoardService from "@/modules/board/board.service";
import ListService from "@/modules/list/list.service";
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

  // subscribe to list create events from header overlay
  useEffect(() => {
    let offCreating: any;
    let offCreated: any;
    let offFailed: any;

    (async () => {
      try {
        const eventBus = await import("@/services/eventBus");
        offCreating = eventBus.on("list:creating", (tempList: any) => {
          // only add if belongs to this board
          if (tempList.boardId === boardId) {
            setList((prev) => [...prev, tempList]);
          }
        });

        offCreated = eventBus.on("list:created", ({ tempId, created }: any) => {
          setList((prev) =>
            prev.map((l) => (l.id === tempId ? created : l)),
          );
        });

        offFailed = eventBus.on("list:create_failed", ({ tempId }: any) => {
          setList((prev) => prev.filter((l) => l.id !== tempId));
        });
      } catch (e) {
        console.error("eventBus subscribe error:", e);
      }
    })();

    return () => {
      try {
        if (offCreating) offCreating();
        if (offCreated) offCreated();
        if (offFailed) offFailed();
      } catch (e) {}
    };
  }, [boardId]);

  const handleCreateCard = async (boardIdParam: string, listIdParam: string, payload: any) => {
    const previous = list;
    const tempId = `tmp-${Date.now()}`;
    const newCard = {
      id: tempId,
      name: payload.name,
      description: payload.description,
      priority: payload.priority,
      dueDate: payload.dueDate,
    };

    // optimistic update
    setList((prev) =>
      prev.map((l) =>
        l.id === listIdParam
          ? { ...l, cards: [...(l.cards || []), newCard], cardCount: (l.cardCount || 0) + 1 }
          : l,
      ),
    );

    try {
      const response = await ListService.createCardInList(boardIdParam, listIdParam, payload);
      if (response && response.success && response.data) {
        const created = response.data;
        setList((prev) =>
          prev.map((l) =>
            l.id === listIdParam
              ? { ...l, cards: l.cards.map((c: any) => (c.id === tempId ? created : c)) }
              : l,
          ),
        );
      } else {
        setList(previous);
      }
    } catch (error) {
      console.error("Create card API error:", error);
      setList(previous);
    }
  };

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
            <ListCard {...item} onLongPress={drag} onCreateCard={handleCreateCard} />
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}
