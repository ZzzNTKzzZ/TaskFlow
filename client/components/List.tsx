import { Colors, Spacing, Rounded, Typography } from "@/theme";
import MeatBall from "@/assets/icons/MeatBall.svg";
import { Animated, Pressable, Text, View } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
  ScrollView,
  Gesture,
} from "react-native-gesture-handler";

import Card, { CardProps } from "./Card";
import { Priority } from "@/Types/enum";
type ListProps = {
  boardId: string;
  list: {
    id: string;
    title: string;
  };
  quantity: number;
};


export default function List({ boardId, list, quantity }: ListProps) {
  const cards = [
    {
      id: "c1",
      title: "Setup project",
      description: "Initialize repo",
      position: 1,
      dueDate: new Date("2026-04-01"),
      listId: "l1",
      createdAt: new Date(),
      priority: "high" as Priority,
    },
    {
      id: "c2",
      title: "Build API",
      description: "Create backend",
      position: 2,
      dueDate: new Date("2026-04-05"),
      listId: "l1",
      createdAt: new Date(),
      priority: "medium" as Priority,
    },
    {
      id: "c3",
      title: "Write documentation",
      description: "Add README and docs",
      position: 3,
      dueDate: null,
      listId: "l1",
      createdAt: new Date(),
      priority: "low" as Priority,
    },
    {
      id: "c4",
      title: "Fix critical bug",
      description: "Resolve production issue",
      position: 4,
      dueDate: new Date("2026-04-28"),
      listId: "l1",
      createdAt: new Date(),
      priority: "urgent" as Priority,
    },
  ];

  return (
    <View
      style={{
        minWidth: 280,
        backgroundColor: Colors.surfaceLow,
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.xxl,
        borderRadius: Rounded.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing.md,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: Colors.onSurfaceVariant,
              borderRadius: Rounded.full,
            }}
          ></View>
          <Text style={[Typography.labelSm, { fontSize: 14 }]}>
            {list.title}
          </Text>
          <View
            style={{
              aspectRatio: 1,
              backgroundColor: Colors.surfaceHighest,
              borderRadius: Rounded.full,
              justifyContent: "center",
              alignItems: "center",
              minWidth: 20,
            }}
          >
            <Text style={{ fontSize: 12, fontFamily: "Manrope_600SemiBold" }}>
              {quantity}
            </Text>
          </View>
        </View>
        <View>
          <Pressable>
            <MeatBall />
          </Pressable>
        </View>
      </View>
      <GestureHandlerRootView>
        {cards.map((card) => (
          <Card key={card.id} card={card} listId={list.id} />
        ))}
      </GestureHandlerRootView>
    </View>
  );
}
