import {
  ActivityCard,
  ActivityCardProps,
} from "@/components/activity/ActivityCard";
import BoardCard from "@/components/boards/BoardCard";
import SearchIcon from "@/components/icons/SearchIcon";
import SymbolIcon, {
  SymbolColor,
  SymbolName,
} from "@/components/icons/SymbolIcon";
import { BackgroundColor } from "@/components/illustrations/BackgroundCard";
import { Screen } from "@/components/layout/Screen";
import SectionCard from "@/components/layout/SectionCard";
import SectionHeader from "@/components/layout/SectionHeader";
import ActionCard from "@/components/navigation/ActionCard";
import DropDown from "@/components/overlays/DropDown";
import TodoCard, { Priority } from "@/components/todo/TodoCard";
import Avatar from "@/components/ui/Avatar";
import CardDropDown from "@/components/workspaces/CardDropDown";
import { useCurrentUser } from "@/modules/auth/hook/useCurrentUser";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { RoleWorkspace } from "@/types/workspaces";
import React, { ReactNode, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const user = useCurrentUser();

  const [selected, setSelected] = useState("WS 1");

  const workspaces = [
    {
      value: "WS 1",
      label: "WS 1",
      memberSize: 9,
      role: "OWNER",
      icon: "Company",
      color: "Primary",
    },
    {
      value: "WS 2",
      label: "WS 2",
      memberSize: 10,
      role: "MEMBER",
      icon: "Company",
      color: "Primary",
    },
  ];

  const activitys: ActivityCardProps[] = [
    {
      name: "Jane",
      action: "moved",
      boardName: "Design Tasks",
      time: "2026-05-10T03:45:05.608Z",
    },
    {
      name: "Alex",
      action: "commented",
      boardName: "Design Tasks",
      time: "2026-05-10T02:45:05.608Z",
    },
    {
      name: "Mike",
      action: "commented",
      boardName: "Design Tasks",
      time: "2026-04-10T02:45:05.608Z",
    },
  ];

  const boards = [
    {
      background: "DeepPrussianBlue",
      name: "Product Roadmap",
      member: 8,
    },
    {
      background: "Blue",
      name: "Marketing Plan",
      member: 5,
    },
    {
      background: "DeepPrussianBlue",
      name: "Product Roadmap 2",
      member: 8,
    },
  ];

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
            <Text style={Typography.label}>
              Let's get things done
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            style={styles.searchButton}
          >
            <SearchIcon />
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
            <ActionCard type="newBoard" onPress={() => {}} />
            <ActionCard type="newTodo" onPress={() => {}} />
            <ActionCard type="inviteMembers" onPress={() => {}} />
            <ActionCard type="automation" onPress={() => {}} />
          </View>
        </SectionCard>

        <SectionCard
          style={{
            paddingTop: Spacing[4],
            paddingHorizontal: Spacing[4],
          }}
        >
          <DropDown
            icon={((): ReactNode => {
              const ws =
                workspaces.find(
                  (w) => w.value === selected
                ) ?? workspaces[0];

              return (
                <SymbolIcon
                  name={ws.icon as SymbolName}
                  size={28}
                  color={ws.color as SymbolColor}
                />
              );
            })()}
            label="Workspace:"
            selected={selected}
            setSelected={setSelected}
            options={workspaces}
            renderItem={(item) => (
              <CardDropDown
                icon={
                  <SymbolIcon
                    name={item.icon as SymbolName}
                    size={28}
                    color={item.color as SymbolColor}
                  />
                }
                name={item.label}
                memberSize={item.memberSize}
                role={item.role as RoleWorkspace}
                selected={selected === item.value}
              />
            )}
          />
        </SectionCard>

        <View>
          <View style={styles.boardHeader}>
            <Text style={[Typography.title, { fontSize: 16 }]}>
              Your Boards
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {}}
            >
              <Text style={styles.viewAll}>
                View all
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.boardList}>
            {boards.map((b) => (
              <BoardCard
                key={b.name}
                name={b.name}
                background={
                  b.background as BackgroundColor
                }
                member={b.member}
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
            onPress={() => {}}
          />

          <View style={styles.list}>
            {activitys.map((a, index) => (
              <React.Fragment key={index}>
                <ActivityCard {...a} />
                {activitys.length !== index + 1 && (
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
          <SectionHeader
            title="My Todo"
            onPress={() => {}}
          />

          <View style={styles.divider} />

          <View style={styles.todoList}>
            {todos.map((t, index) => (
              <React.Fragment key={index}>
                <TodoCard
                  isChecked={t.check}
                  dueDate={t.dueDate}
                  name={t.name}
                  priority={
                    t.priority as Priority
                  }
                />
                {todos.length !== index + 1 && (
                  <View style={styles.divider} />
                )}
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
    padding: 12,

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
    justifyContent: "space-between",
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