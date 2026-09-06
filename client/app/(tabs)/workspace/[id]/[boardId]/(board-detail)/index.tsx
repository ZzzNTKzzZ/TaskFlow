import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import DraggableFlatList from "react-native-draggable-flatlist";

import { Screen } from "@/components/layout/Screen";
import ListCard from "@/components/list/ListCard";
import BoardService from "@/services/board.service";
import ListService from "@/services/list.service";
import { ListCardUI } from "@/types/list";
import { Spacing } from "@/theme/spacing";
import { Colors } from "@/theme/colors";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import MultiSelectDropDown from "@/components/ui/MultiSelectDropDown";

export default function Board() {
  const { boardId, refresh } = useLocalSearchParams<{ boardId: string; refresh?: string }>();
  const [list, setList] = useState<ListCardUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [boardMembers, setBoardMembers] = useState<any[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Fetch Board Details on Mount / Refresh
  const getBoardData = async () => {
    if (isDeleting) return;
    try {
      setLoading(true);
      setError(null);
      const response = await BoardService.getBoard(boardId);
      const members = await BoardService.getBoardMembers(boardId);
      setBoardMembers(members || []);

      if (response && response.lists) {
        if (response.currentUser?.role) {
          setCurrentUserRole(response.currentUser.role);
        }
        // Sort lists based on position before mapping to UI
        const sortedLists = [...response.lists].sort((a, b) => a.position - b.position);
        setList(sortedLists as any);
      } else {
        setError("Failed to fetch board lists.");
      }
    } catch (err: any) {
      console.error("Lỗi lấy dữ liệu Board:", err);
      setError(err.message || "A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId && !isDeleting) {
      getBoardData();
    }
  }, [refresh, boardId, isDeleting]);

  // EventBus Subscriptions for Live List CRUD Sync
  useEffect(() => {
    let offCreating: any;
    let offCreated: any;
    let offFailed: any;
    let offCardUpdated: any;
    let offCardDeleted: any;
    let offDeleting: any;

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

        offDeleting = eventBus.on("board:deleting", (deletedId: string) => {
          if (deletedId === boardId) {
            setIsDeleting(true);
          }
        });

        offCardUpdated = eventBus.on("card:updated", ({ cardId: targetCardId, payload }: any) => {
          setList((prev) => {
            let existingCard: any = null;
            let currentListId: string | null = null;
            
            prev.forEach(l => {
              const c = l.cards?.find((card: any) => card.id === targetCardId);
              if (c) {
                existingCard = c;
                currentListId = l.id;
              }
            });

            if (!existingCard) return prev; 

            if (payload.listId && currentListId && payload.listId !== currentListId) {
              return prev.map(l => {
                if (l.id === currentListId) {
                  return { ...l, cards: l.cards.filter((c: any) => c.id !== targetCardId), cardCount: Math.max(0, (l.cardCount || 1) - 1) };
                }
                if (l.id === payload.listId) {
                  return { ...l, cards: [...(l.cards || []), { ...existingCard, ...payload }], cardCount: (l.cardCount || 0) + 1 };
                }
                return l;
              });
            } else {
              return prev.map(l => {
                if (l.id === currentListId) {
                  return { ...l, cards: l.cards.map((c: any) => c.id === targetCardId ? { ...c, ...payload } : c) };
                }
                return l;
              });
            }
          });
        });

        offCardDeleted = eventBus.on("card:deleted", (deletedCardId: string) => {
          setList((prev) => 
            prev.map(l => ({
              ...l,
              cards: l.cards?.filter((c: any) => c.id !== deletedCardId),
              cardCount: l.cards?.some((c: any) => c.id === deletedCardId) 
                ? Math.max(0, (l.cardCount || 1) - 1) 
                : l.cardCount
            }))
          );
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
        if (offCardUpdated) offCardUpdated();
        if (offCardDeleted) offCardDeleted();
        if (offDeleting) offDeleting();
      } catch (e) {}
    };
  }, [boardId]);

  // Handle Optimistic List Reordering Action
  const handleReorderLists = async (newData: ListCardUI[], movedItem: ListCardUI) => {
    const previousState = [...list];
    
    // 1. Optimistic Update Local React State Immediately
    setList(newData);

    try {
      const index = newData.findIndex((l) => l.id === movedItem.id);
      const beforeId = index > 0 ? newData[index - 1].id : null;
      const afterId = index < newData.length - 1 ? newData[index + 1].id : null;

      // 2. Trigger asynchronous API call in the background
      const response = await BoardService.reorderList(boardId, {
        listId: movedItem.id,
        beforeId,
        afterId,
      });

      if (!response) {
        throw new Error("Failed to reorder list on server.");
      }
    } catch (err: any) {
      // 3. Roll back smoothly on failure
      Alert.alert(
        "Sync Failed",
        err.message || "An error occurred while saving the list order. Restoring layout...",
        [{ text: "OK" }]
      );
      setList(previousState);
    }
  };

  // Handle Create Card inside List
  const handleCreateCard = async (
    boardIdParam: string,
    listIdParam: string,
    payload: any,
  ) => {
    const previous = list;
    const tempId = `tmp-${Date.now()}`;
    const newCard = {
      id: tempId,
      name: payload.name,
      description: payload.description,
      priority: payload.priority,
      dueDate: payload.dueDate,
      stats: {
        checkListCount: 3,
        checkListCompelete: 0,
      },
      checklists: [
        {
          id: `tmp-checklist-${Date.now()}`,
          name: "Task Checklist",
          items: [
            { id: `tmp-item1-${Date.now()}`, name: "Item 1", isCompleted: false },
            { id: `tmp-item2-${Date.now()}`, name: "Item 2", isCompleted: false },
            { id: `tmp-item3-${Date.now()}`, name: "Item 3", isCompleted: false },
          ]
        }
      ],
    };

    // Optimistic Update local Card state
    setList((prev) =>
      prev.map((l) =>
        l.id === listIdParam
          ? {
              ...l,
              cards: [...(l.cards || []), newCard as any],
              cardCount: (l.cardCount || 0) + 1,
            }
          : l,
      ),
    );

    try {
      const response = await ListService.createCardInList(
        boardIdParam,
        listIdParam,
        payload,
      );
      if (response) {
        // Assign users immediately if selected
        if (payload.assignees && payload.assignees.length > 0) {
          try {
            const CardService = (await import("@/services/card.service")).default;
            await CardService.assignUsersToCard(boardIdParam, response.id, payload.assignees);
            
            // Re-fetch the full card or just append the basic assignments to the UI
            // For now, we rely on the realtime eventBus if implemented, or user will see it on refresh
          } catch (e) {
            console.error("Assign error on create:", e);
          }
        }

        setList((prev) =>
          prev.map((l) =>
            l.id === listIdParam
              ? {
                  ...l,
                  cards: l.cards.map((c: any) =>
                    c.id === tempId ? { ...response, assignees: payload.assignees.map((id: string) => ({ userId: id, user: boardMembers.find(m => m.userId === id || m.id === id) || { id } })) } : c,
                  ),
                }
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

  // Handle Delete List
  const handleDeleteList = (listIdParam: string) => {
    Alert.alert("Delete List", "Are you sure you want to delete this list? All cards inside will be removed.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          const success = await ListService.deleteList(boardId, listIdParam);
          if (success) {
            setList(prev => prev.filter(l => l.id !== listIdParam));
          } else {
            Alert.alert("Error", "Failed to delete list. You might not have permission.");
          }
        } catch(e) {
          console.error(e);
          Alert.alert("Error", "Failed to delete list.");
        }
      }}
    ]);
  };

  // Loading UI State
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Theme.primary} />
        <Text style={styles.metaText}>Syncing board layout...</Text>
      </View>
    );
  }

  // Error UI State
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getBoardData}>
          <Text style={styles.retryText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredList = selectedUserIds.length > 0
    ? list.map((l) => ({
        ...l,
        cards: l.cards?.filter((c: any) =>
          c.assignees?.some(
            (a: any) =>
              selectedUserIds.includes(a.userId) || selectedUserIds.includes(a.user?.id)
          )
        ),
      }))
    : list;

  return (
    <Screen isScroll={false} padding={Spacing[4]}>
      {(currentUserRole === "ADMIN" || currentUserRole === "OWNER") && boardMembers.length > 0 && (
        <MultiSelectDropDown
          options={boardMembers.map((m) => ({
            id: m.userId || m.id,
            name: m.name || m.email || "Unknown",
          }))}
          selectedIds={selectedUserIds}
          onChange={setSelectedUserIds}
        />
      )}

      <DraggableFlatList
        data={filteredList}
        horizontal
        nestedScrollEnabled
        activationDistance={20}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onDragEnd={({ data, to }) => {
          const movedItem = data[to];
          if (movedItem) {
            handleReorderLists(data, movedItem);
          }
        }}
        style={{ paddingVertical: Spacing[2] }}
        renderItem={({ item, drag }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={{ marginRight: Spacing[3] }}
          >
            <ListCard
              {...item}
              onLongPress={drag}
              onCreateCard={handleCreateCard}
              onDeleteList={handleDeleteList}
            />
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray[50],
    padding: Spacing[6],
  },
  metaText: {
    marginTop: Spacing[3],
    ...Typography.body,
    color: Colors.gray[600],
  },
  errorText: {
    ...Typography.title,
    fontSize: 16,
    color: Theme.error[600],
    textAlign: "center",
    marginBottom: Spacing[4],
  },
  retryButton: {
    backgroundColor: Theme.primary,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[6],
    borderRadius: 8,
  },
  retryText: {
    color: Theme.surface,
    ...Typography.heading,
    fontSize: 14,
  },
});
