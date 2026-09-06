import Icons from "@/components/icons/Icons";
import UpDownIcon from "@/components/icons/UpDownIcon";
import { Screen } from "@/components/layout/Screen";
import CreateCheckList from "@/components/overlays/CreateCheckList";
import CreateCheckListItem from "@/components/overlays/CreateCheckListItem";
import Badges from "@/components/ui/Badges";
import Button from "@/components/ui/Button";
import Checked from "@/components/ui/Checked";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatMonthDate } from "@/helper/Day";
import { CardRespone } from "@/types/card";
import CardService from "@/services/card.service";
import BoardService from "@/services/board.service";
import ChecklistService from "@/services/checklist.service";
import {
  Checklist,
  ChecklistItem as ChecklistItemType,
} from "@/types/checklist"; // Assuming item type name
import { Spacing } from "@/theme/spacing";
import { Colors } from "@/theme/colors";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import BaseOverlay from "@/components/overlays/BaseOverlay";
import { useGlobalSearchParams, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View, TextInput } from "react-native";
import CommentService from "@/services/comment.service";
import { Comment } from "@/types/comment";
import { useAuthStore } from "@/store/auth.store";
import LoadingScreen from "@/components/ui/LoadingScreen";

function InnerTodoItem({
  item,
  onToggle,
  onDelete,
}: {
  item: ChecklistItemType;
  onToggle: (item: ChecklistItemType) => void;
  onDelete: (item: ChecklistItemType) => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(item)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing[2],
        marginVertical: Spacing[1],
      }}
    >
      <Checked isChecked={item.isCompleted} />
      <Text
        style={[
          Typography.body,
          {
            fontSize: 14,
            textDecorationLine: item.isCompleted ? "line-through" : undefined,
            color: item.isCompleted ? Theme.textSecondary : undefined,
          },
        ]}
      >
        {item.name}
      </Text>
      <View style={{ flex: 1 }} />
      <TouchableOpacity onPress={() => onDelete(item)} style={{ paddingHorizontal: Spacing[2] }}>
        <Icons name="Trash" size={16} color={Theme.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function ChecklistItem({
  checklist,
  onToggle,
  onDeleteChecklist,
  onDeleteItem,
}: {
  checklist: Checklist;
  onToggle: (item: ChecklistItemType) => void;
  onDeleteChecklist: (checklist: Checklist) => void;
  onDeleteItem: (item: ChecklistItemType) => void;
}) {
  const [active, setActive] = useState(true);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const items = checklist.items || [];
  const completedCount = items.filter((i) => i.isCompleted).length;
  const progress =
    items.length > 0 ? completedCount / items.length : 0;

  return (
    <View
      style={{
        marginBottom: Spacing[2],
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Theme.border,
        paddingHorizontal: Spacing[2],
        paddingVertical: Spacing[3],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setActive((prev) => !prev)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing[4],
            flex: 1,
          }}
        >
          <Text
            style={[
              Typography.label,
              { fontSize: 16, color: Theme.textPrimary },
            ]}
          >
            {checklist.name}
          </Text>
          {items.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: Spacing[2],
                flex: 1,
              }}
            >
              <Text style={{ color: Theme.success, fontSize: 12 }}>
                {completedCount}/{items.length}
              </Text>
              <ProgressBar
                progress={progress}
                height={5}
                style={{ width: "40%" }}
              />
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing[2] }}>
          <TouchableOpacity onPress={(e) => { e.stopPropagation(); onDeleteChecklist(checklist); }} style={{ padding: Spacing[1] }}>
            <Icons name="Trash" size={18} color={Theme.error} />
          </TouchableOpacity>
          <UpDownIcon active={active} />
        </View>
      </TouchableOpacity>

      {active && (
        <View
          style={{
            paddingLeft: Spacing[4],
            marginTop: Spacing[1],
            gap: Spacing[3],
          }}
        >
          {items.map((item) => (
            <InnerTodoItem
              key={item.id}
              item={item}
              onToggle={(itemToToggle) =>
                onToggle ? onToggle(itemToToggle) : undefined
              }
              onDelete={onDeleteItem}
            />
          ))}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: Spacing[2],
              alignItems: "center",
            }}
            onPress={() => setIsOpenCreate(true)}
          >
            <Icons name="Plus" color={Theme.primary} />
            <Text
              style={[Typography.title, { color: Theme.primary, fontSize: 14 }]}
            >
              Add item
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <CreateCheckListItem
        active={isOpenCreate}
        onClose={() => setIsOpenCreate(false)}
        cardId={checklist.cardId}
        checkListId={checklist.id}
      />
    </View>
  );
}

export default function Card() {
  const { boardId, cardId } = useGlobalSearchParams();
  const [card, setCard] = useState<CardRespone>();
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<boolean>(false);
  const [isOpenAssignee, setIsOpenAssignee] = useState<boolean>(false);
  const [boardMembers, setBoardMembers] = useState<any[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const currentUserId = useAuthStore((state) => state.user?.id);

  const handleToggleChecklistItem = async (
    checklistId: string,
    item: ChecklistItemType,
  ) => {
    const nextCompleted = !item.isCompleted;
    setCard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        checklists: (prev.checklists || []).map((checklist) =>
          checklist.id === checklistId
            ? {
                ...checklist,
                items: (checklist.items || []).map((it) =>
                  it.id === item.id
                    ? { ...it, isCompleted: nextCompleted }
                    : it,
                ),
              }
            : checklist,
        ),
      };
    });
    try {
      await ChecklistService.completeChecklistItem(
        boardId as string,
        cardId as string,
        checklistId,
        item.id,
        nextCompleted,
      );
    } catch (error) {
      console.error("Failed to update checklist item:", error);
      setCard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          checklists: (prev.checklists || []).map((checklist) =>
            checklist.id === checklistId
              ? {
                  ...checklist,
                  items: (checklist.items || []).map((it) =>
                    it.id === item.id
                      ? { ...it, isCompleted: item.isCompleted }
                      : it,
                  ),
                }
              : checklist,
          ),
        };
      });
    }
  };

  const handleDeleteChecklist = async (checklistId: string) => {
    Alert.alert("Delete Checklist", "Are you sure you want to delete this checklist?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          await ChecklistService.deleteChecklist(boardId as string, cardId as string, checklistId);
          setCard(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              checklists: (prev.checklists || []).filter(c => c.id !== checklistId)
            };
          });
        } catch (error) {
          console.error(error);
          Alert.alert("Error", "Failed to delete checklist.");
        }
      }}
    ]);
  };

  const handleDeleteChecklistItem = async (checklistId: string, item: ChecklistItemType) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          await ChecklistService.deleteChecklistItem(boardId as string, cardId as string, checklistId, item.id);
          setCard(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              checklists: (prev.checklists || []).map(c => 
                c.id === checklistId 
                  ? { ...c, items: (c.items || []).filter(it => it.id !== item.id) }
                  : c
              )
            };
          });
        } catch (error) {
          console.error(error);
          Alert.alert("Error", "Failed to delete item.");
        }
      }}
    ]);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      const created = await CommentService.createComment(boardId as string, cardId as string, newComment.trim());
      if (created) {
        setComments(prev => [created, ...prev]);
        setNewComment("");
      }
    } catch (e) {
      console.error("Failed to post comment", e);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert("Delete Comment", "Are you sure you want to delete this comment?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          const success = await CommentService.deleteComment(boardId as string, cardId as string, commentId);
          if (success) {
            setComments(prev => prev.filter(c => c.id !== commentId));
          }
        } catch (e) {
          console.error("Failed to delete comment", e);
        }
      }}
    ]);
  };

  useEffect(() => {
    if (!card) return;

    // Calculate completed vs total checklist items
    const totalCompleted = (card.checklists || []).reduce((total, checklist) => {
      return total + (checklist.items || []).filter((item) => item.isCompleted).length;
    }, 0);
    const total = (card.checklists || []).reduce((total, checklist) => {
      return total + (checklist.items || []).length;
    }, 0);

    const updatedStats = {
      checkListCount: total,
      checkListCompelete: totalCompleted,
    };

    (async () => {
      try {
        const eventBus = await import("@/services/eventBus");
        eventBus.emit("card:updated", {
          cardId: card.id,
          payload: {
            stats: updatedStats,
            checklists: card.checklists,
          },
        });
      } catch (e) {
        console.error("Failed to emit card:updated:", e);
      }
    })();
  }, [JSON.stringify(card?.checklists || [])]);

  useEffect(() => {
    if (!boardId || !cardId || boardId === "undefined" || cardId === "undefined") {
      return;
    }
    const getCard = async () => {
      try {
        const response = await CardService.getCard(
          boardId as string,
          cardId as string,
        );
        setCard(response as any);
        const members = await BoardService.getBoardMembers(boardId as string);
        setBoardMembers(members || []);
        const loadedComments = await CommentService.getComments(boardId as string, cardId as string);
        setComments(loadedComments);
      } catch (error) {
        console.error("Failed to fetch card:", error);
      } finally {
        setLoading(false);
      }
    };
    getCard();

    // subscribe to checklist events for optimistic updates
    let isMounted = true;
    const unsubscribers: (() => void)[] = [];

    (async () => {
      try {
        const eventBus = await import("@/services/eventBus");
        if (!isMounted) return;

        const offCreating = eventBus.on(
          "checklist:creating",
          ({ cardId: targetCardId, checklist }: any) => {
            if (targetCardId === cardId) {
              setCard((prev) => ({
                ...(prev as any),
                checklists: [...((prev as any).checklists || []), checklist],
              }));
            }
          },
        );
        unsubscribers.push(offCreating);

        const offCreated = eventBus.on(
          "checklist:created",
          ({ tempId, created }: any) => {
            setCard((prev) => ({
              ...(prev as any),
              checklists: ((prev as any).checklists || []).map((c: any) =>
                c.id === tempId ? created : c,
              ),
            }));
          },
        );
        unsubscribers.push(offCreated);

        const offFailed = eventBus.on(
          "checklist:create_failed",
          ({ tempId }: any) => {
            setCard((prev) => ({
              ...(prev as any),
              checklists: ((prev as any).checklists || []).filter(
                (c: any) => c.id !== tempId,
              ),
            }));
          },
        );
        unsubscribers.push(offFailed);

        // checklist item events
        const offItemCreating = eventBus.on(
          "checklistItem:creating",
          ({ checklistId, item }: any) => {
            setCard((prev) => ({
              ...(prev as any),
              checklists: ((prev as any).checklists || []).map((c: any) =>
                c.id === checklistId
                  ? { ...c, items: [...(c.items || []), item] }
                  : c,
              ),
            }));
          },
        );
        unsubscribers.push(offItemCreating);

        const offItemCreated = eventBus.on(
          "checklistItem:created",
          ({ tempId, created }: any) => {
            setCard((prev) => ({
              ...(prev as any),
              checklists: ((prev as any).checklists || []).map((c: any) => ({
                ...c,
                items: (c.items || []).map((it: any) =>
                  it.id === tempId ? created : it,
                ),
              })),
            }));
          },
        );
        unsubscribers.push(offItemCreated);

        const offItemFailed = eventBus.on(
          "checklistItem:create_failed",
          ({ tempId }: any) => {
            setCard((prev) => ({
              ...(prev as any),
              checklists: ((prev as any).checklists || []).map((c: any) => ({
                ...c,
                items: (c.items || []).filter((it: any) => it.id !== tempId),
              })),
            }));
          },
        );
        unsubscribers.push(offItemFailed);

        const offCardUpdated = eventBus.on(
          "card:updated",
          ({ cardId: targetCardId, payload }: any) => {
            if (targetCardId === cardId) {
              setCard((prev) => {
                if (!prev) return prev;
                return { ...prev, ...payload };
              });
            }
          }
        );
        unsubscribers.push(offCardUpdated);
      } catch (e) {
        console.error("eventBus subscribe error:", e);
      }
    })();

    return () => {
      isMounted = false;
      unsubscribers.forEach((unsub) => {
        try {
          unsub();
        } catch (e) {}
      });
    };
  }, [boardId, cardId]);

  if (loading) return <LoadingScreen />;
  if (!card) return <Text style={{ padding: Spacing[6] }}>Card not found</Text>;

  return (
    <Screen padding={0}>
      <View
        style={{
          gap: Spacing[4],
          paddingVertical: Spacing[4],
          paddingHorizontal: Spacing[6],
          borderBottomColor: Theme.border,
          borderBottomWidth: 2,
        }}
      >
        <View>
          <Badges name={card.priority} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing[4],
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: Spacing[1],
            }}
          >
            <Icons name="CheckBox" />
            <Text style={[Typography.title, { fontSize: 16 }]}>
              {card.stats?.checkListCompelete ?? 0}/
              {card.stats?.checkListCount ?? 0}
            </Text>
          </View>

          <Badges
            name={formatMonthDate(card.dueDate)}
            style={{ ...Typography.title, fontSize: 16 }}
          />
        </View>
      </View>

      <View
        style={{
          gap: Spacing[2],
          paddingVertical: Spacing[4],
          paddingHorizontal: Spacing[6],
          borderBottomColor: Theme.border,
          borderBottomWidth: 2,
        }}
      >
        <Text style={[Typography.heading, { fontSize: 20 }]}>Description</Text>
        <Text numberOfLines={2} style={[Typography.caption, { fontSize: 16 }]}>
          {card.description || "No description provided."}
        </Text>
      </View>

      <View
        style={{
          gap: Spacing[2],
          paddingVertical: Spacing[4],
          paddingHorizontal: Spacing[6],
          borderBottomColor: Theme.border,
          borderBottomWidth: 2,
        }}
      >
        <Text style={[Typography.heading, { fontSize: 20 }]}>Assignees</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing[2], alignItems: "center" }}>
          {card.assignees?.map((assignee: any) => (
            <View
              key={assignee.id || assignee.userId}
              style={{
                backgroundColor: Colors.primary[100],
                paddingVertical: Spacing[1],
                paddingHorizontal: Spacing[3],
                borderRadius: 16,
              }}
            >
              <Text style={{ color: Theme.textPrimary }}>
                {assignee.user?.name || assignee.user?.email || "Unknown"}
              </Text>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => setIsOpenAssignee(true)}
            style={{
              backgroundColor: Theme.border,
              paddingVertical: Spacing[1],
              paddingHorizontal: Spacing[3],
              borderRadius: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icons name="Plus" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          gap: Spacing[2],
          paddingVertical: Spacing[2],
          paddingHorizontal: Spacing[6],
          borderBottomColor: Theme.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={[Typography.heading, { fontSize: 20 }]}>Checklist</Text>
        <Button
          onPress={() => setActive(true)}
          type="ghost"
          styleText={{ color: Theme.primary, fontSize: 16 }}
          style={{ borderWidth: 0 }}
        >
          Add checklist
        </Button>
      </View>

      <View
        style={{
          gap: Spacing[2],
          paddingHorizontal: Spacing[6],
          borderBottomColor: Theme.border,
        }}
      >
        {card.checklists?.map((c) => (
          <ChecklistItem
            key={c.id}
            checklist={c}
            onToggle={(item) => handleToggleChecklistItem(c.id, item)}
            onDeleteChecklist={() => handleDeleteChecklist(c.id)}
            onDeleteItem={(item) => handleDeleteChecklistItem(c.id, item)}
          />
        ))}
      </View>
      <View
        style={{
          gap: Spacing[2],
          paddingVertical: Spacing[4],
          paddingHorizontal: Spacing[6],
          borderBottomColor: Theme.border,
          borderBottomWidth: 2,
        }}
      >
        <Text style={[Typography.heading, { fontSize: 20, marginBottom: Spacing[2] }]}>Comments</Text>
        <View style={{ flexDirection: "row", gap: Spacing[2], marginBottom: Spacing[4], alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Write a comment..."
              placeholderTextColor={Theme.textSecondary}
              style={{
                borderWidth: 1,
                borderColor: Theme.border,
                borderRadius: 16,
                paddingHorizontal: Spacing[3],
                paddingVertical: Spacing[2],
                color: Theme.textPrimary,
              }}
              multiline
            />
          </View>
          <TouchableOpacity
            onPress={handlePostComment}
            style={{
              backgroundColor: Theme.primary,
              paddingVertical: Spacing[2],
              paddingHorizontal: Spacing[3],
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Post</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: Spacing[4] }}>
          {comments.map((comment) => (
            <View key={comment.id} style={{ flexDirection: "row", gap: Spacing[3] }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: Colors.primary[200],
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: Theme.textPrimary, fontWeight: "bold" }}>
                  {(comment.author?.name || comment.author?.email || "?")[0].toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing[1] }}>
                  <Text style={[Typography.title, { fontSize: 14, color: Theme.textPrimary }]}>
                    {comment.author?.name || comment.author?.email || "Unknown"}
                  </Text>
                  {comment.authorId === currentUserId && (
                    <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                      <Text style={{ color: Theme.error, fontSize: 12 }}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor: Theme.border,
                    padding: Spacing[3],
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: Theme.textPrimary, fontSize: 14 }}>{comment.content}</Text>
                </View>
                <Text style={{ color: Theme.textSecondary, fontSize: 10, marginTop: Spacing[1] }}>
                  {new Date(comment.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <CreateCheckList
        active={active}
        onClose={() => setActive(false)}
        cardId={cardId as string}
      />

      <BaseOverlay
        visible={isOpenAssignee}
        onClose={() => setIsOpenAssignee(false)}
      >
        <Text style={[Typography.heading, { fontSize: 20, marginBottom: Spacing[4], color: Theme.textPrimary }]}>
          Assign Members
        </Text>
        <View style={{ gap: Spacing[3] }}>
          {boardMembers.map((member) => {
            const isAssigned = (card.assignees || []).some((a: any) => a.userId === member.userId || a.user?.id === member.userId);
            return (
              <TouchableOpacity
                key={member.userId || member.id}
                onPress={async () => {
                  try {
                    const mId = member.userId || member.id;
                    let newAssignees;
                    if (isAssigned) {
                      await CardService.unassignUserFromCard(boardId as string, cardId as string, mId);
                      newAssignees = (card.assignees || []).filter((a: any) => a.userId !== mId && a.user?.id !== mId);
                    } else {
                      await CardService.assignUsersToCard(boardId as string, cardId as string, [mId]);
                      newAssignees = [
                        ...(card.assignees || []),
                        {
                          id: Math.random().toString(),
                          userId: mId,
                          cardId,
                          user: { id: mId, name: member.name, email: member.email || "", createdAt: "" },
                        },
                      ];
                    }
                    
                    setCard(prev => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        assignees: newAssignees
                      } as any;
                    });

                    // Emit event bus to update board detail view immediately
                    const eventBus = await import("@/services/eventBus");
                    eventBus.default.emit("card:updated", {
                      cardId,
                      payload: { assignees: newAssignees }
                    });
                  } catch (e) {
                    console.error("Assign error", e);
                  }
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: Spacing[3],
                  borderWidth: 1,
                  borderColor: isAssigned ? Theme.primary : Theme.border,
                  borderRadius: 12,
                  backgroundColor: isAssigned ? Colors.primary[100] : "transparent",
                }}
              >
                <Text style={{ color: Theme.textPrimary, fontSize: 16 }}>{member.name || member.email || "Unknown"}</Text>
                {isAssigned && <Icons name="Checked" size={20} color={Theme.primary} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </BaseOverlay>
    </Screen>
  );
}
