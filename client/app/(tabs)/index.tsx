import {
  ActivityCard,
  ActivityCardProps,
} from "@/components/activity/ActivityCard";
import BoardCard from "@/components/boards/BoardCard";
import Icons from "@/components/icons/Icons";
import SymbolIcon, {
  SymbolColor,
  SymbolName,
} from "@/components/icons/SymbolIcon";
import { Screen } from "@/components/layout/Screen";
import SectionCard from "@/components/layout/SectionCard";
import SectionHeader from "@/components/layout/SectionHeader";
import ActionCard from "@/components/navigation/ActionCard";
import DropDown from "@/components/overlays/DropDown";
import TodoCard from "@/components/todo/TodoCard";
import Avatar from "@/components/ui/Avatar";
import CardDropDown from "@/components/workspaces/CardDropDown";
import { useCurrentUser } from "@/modules/auth/hook/useCurrentUser";
import { BoardCardUI } from "@/modules/board/board";
import { WorkspaceCard } from "@/modules/workspace/workspace";
import WorkspaceService from "@/modules/workspace/workspace.service";
import BoardService from "@/modules/board/board.service";
import ActivityService from "@/modules/activity/activity.service";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { Priority } from "@/types/type";
import { router } from "expo-router";
import React, { ReactNode, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const user = useCurrentUser();

  const [selected, setSelected] = useState<{
    name: string;
    id: string;
    icon: SymbolName;
    color: SymbolColor;
  }>({
    name: "",
    id: "",
    icon: "Company",
    color: "Primary",
  });
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<WorkspaceCard[]>([]);
  const [boards, setBoards] = useState<BoardCardUI[]>([]);
  const [activities, setActivities] = useState<ActivityCardProps[]>([]);
  useEffect(() => {
    const initWorkspaces = async () => {
      try {
        setLoading(true);
        const list = await WorkspaceService.getWorkspaces(4);
        setWorkspaces(list);

        if (list.length > 0) {
          setSelected({
            id: list[0].id,
            name: list[0].name,
            icon: list[0].icon,
            color: list[0].color,
          });
        }
      } catch (error) {
        console.error("Lỗi khởi tạo Workspace:", error);
      } finally {
        setLoading(false);
      }
    };
    initWorkspaces();
  }, []);

  // subscribe to workspace create events
  useEffect(() => {
    let offCreating: any;
    let offCreated: any;
    let offFailed: any;

    (async () => {
      try {
        const eventBus = await import("@/services/eventBus");
        offCreating = eventBus.on("workspace:creating", (tempWs: any) => {
          setWorkspaces((prev) => [...prev, tempWs]);
        });
        offCreated = eventBus.on(
          "workspace:created",
          ({ tempId, created }: any) => {
            setWorkspaces((prev) =>
              prev.map((w) => (w.id === tempId ? created : w)),
            );
          },
        );
        offFailed = eventBus.on(
          "workspace:create_failed",
          ({ tempId }: any) => {
            setWorkspaces((prev) => prev.filter((w) => w.id !== tempId));
          },
        );
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
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activityList = await ActivityService.getGlobalActivities(3);
        setActivities(
          activityList.map((a) => ({
            name: a.user.name,
            action: a.action.toLowerCase().replace(/_/g, " "),
            boardName: a.board?.name || a.description || "Workspace",
            time: a.createdAt,
          })),
        );
      } catch (error) {
        console.error("Lỗi lấy danh sách Activity:", error);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    if (!selected.id) return;

    const fetchBoards = async () => {
      try {
        const boardList = await WorkspaceService.getWorkspaceBoards(
          selected.id,
          3,
        );
        setBoards(boardList);
      } catch (error) {
        console.error("Lỗi lấy danh sách Board:", error);
      }
    };

    fetchBoards();
  }, [selected.id]);
  if (loading && !workspaces) return;

  const todos = [
    {
      check: false,
      name: "Design mobile onboarding",
      priority: "high",
      dueDate: "2026-05-13T05:03:04.427Z",
    },
    {
      check: false,
      name: "Review pull request",
      priority: "medium",
      dueDate: "2026-05-12T05:03:04.427Z",
    },
    {
      check: false,
      name: "Prepare presentation",
      priority: "low",
      dueDate: "2026-05-20T00:00:00.000Z",
    },
    {
      check: false,
      name: "Update documentation",
      priority: "urgent",
      dueDate: "2026-05-20T00:00:00.000Z",
    },
  ];

  return (
    <Screen padding={Spacing[4]}>
      <View style={styles.container}>
        <View style={styles.headline}>
          <Avatar />

          <View style={{ flex: 1 }}>
            <Text style={[Typography.title, { fontSize: 16 }]}>
              Hello, {user?.name || "User"}
            </Text>
            <Text style={Typography.label}>Let's get things done</Text>
          </View>

          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            style={styles.searchButton}
          >
            <Icons name="Search" size={18} />
          </TouchableOpacity>
        </View>

        <SectionCard style={{ paddingVertical: Spacing[4] }}>
          <Text
            style={[
              Typography.heading,
              {
                fontSize: 16,
                paddingHorizontal: Spacing[4],
              },
            ]}
          >
            Quick Action
          </Text>

          <View style={styles.quickAction}>
            <ActionCard
              type="newBoard"
              onPress={() => router.push("/(board)/create")}
            />
            <ActionCard type="newTodo" onPress={() => {}} />
            <ActionCard type="inviteMembers" onPress={() => {}} />
            <ActionCard type="automation" onPress={() => {}} />
          </View>
        </SectionCard>
        {workspaces && (
          <SectionCard
            style={{
              paddingTop: Spacing[4],
              paddingHorizontal: Spacing[4],
            }}
          >
            <DropDown
              icon={((): ReactNode => {
                const ws =
                  workspaces.find((w) => w.id === selected.id) ?? workspaces[0];
                return (
                  <SymbolIcon
                    name={ws?.icon as SymbolName}
                    size={28}
                    color={ws?.color as SymbolColor}
                  />
                );
              })()}
              label="Workspace:"
              selected={selected.name}
              setSelected={setSelected}
              options={workspaces}
              renderItem={(item) => (
                <CardDropDown
                  icon={
                    <SymbolIcon name={item.icon} size={28} color={item.color} />
                  }
                  name={item.name}
                  memberSize={item.memberCount}
                  role={item.role}
                  selected={selected.id === item.id}
                />
              )}
            />
          </SectionCard>
        )}
        <View>
          <View style={styles.boardHeader}>
            <Text style={[Typography.title, { fontSize: 16 }]}>
              Your Boards
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={async () => {
                try {
                  await WorkspaceService.getWorkspace(selected.id);
                  router.push({
                    pathname: "/(tabs)/workspace/[id]/(workspace-detail)",
                    params: {
                      id: selected.id,
                      name: selected.name,
                      icon: selected.icon,
                      color: selected.color,
                    },
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.boardList}>
            {boards.map((b) => (
              <BoardCard
                showMembers={true}
                onPress={async () => {
                  try {
                    await BoardService.getBoard(b.id);
                    router.push({
                      pathname:
                        "/(tabs)/workspace/[id]/[boardId]/(board-detail)",
                      params: {
                        id: selected.id,
                        boardId: b.id,
                        name: b.name,
                        parentName: selected.name,
                        workspaceIcon: selected.icon,
                        workspaceColor: selected.color,
                      },
                    });
                  } catch (e) {
                    console.error(e);
                  }
                }}
                key={b.id}
                {...b}
                styleCard={{ width: "32%" }}
              />
            ))}
          </View>
        </View>

        <SectionCard
          style={{
            paddingTop: Spacing[4],
            paddingHorizontal: Spacing[4],
          }}
        >
          <SectionHeader
            title="Recent Activity"
            onPress={() => router.navigate("/(tabs)/activity")}
          />

          <View style={styles.list}>
            {activities.map((a, index) => (
              <React.Fragment key={index}>
                <ActivityCard {...a} />
                {activities.length !== index + 1 && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </View>
        </SectionCard>

        <SectionCard
          style={{
            paddingTop: Spacing[4],
            paddingHorizontal: Spacing[4],
          }}
        >
          <SectionHeader title="My Todo" onPress={() => {}} />

          <View style={styles.divider} />

          <View style={styles.todoList}>
            {todos.map((t, index) => (
              <React.Fragment key={index}>
                <TodoCard
                  isChecked={t.check}
                  dueDate={t.dueDate}
                  name={t.name}
                  priority={t.priority as Priority}
                />
                {todos.length !== index + 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </SectionCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: Spacing[6],
  },

  headline: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  searchButton: {
    backgroundColor: Theme.surface,
    borderRadius: 16,
    padding: Spacing[3],

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Spacing[4],
    paddingHorizontal: Spacing[3],
  },

  boardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing[4],
  },

  boardList: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  viewAll: {
    ...Typography.title,
    fontSize: 14,
    color: Colors.primary[700],
  },

  list: {
    gap: Spacing[1],
    justifyContent: "space-between",
    marginBottom: Spacing[2],
  },

  todoList: {
    justifyContent: "space-between",
    marginBottom: Spacing[2],
    paddingHorizontal: Spacing[3],
  },

  divider: {
    borderWidth: 0.5,
    borderColor: Theme.border,
  },
});
