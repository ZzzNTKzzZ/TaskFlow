import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  Dimensions,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { Colors, Rounded, Spacing, Typography } from "@/theme";
import Cross from "@/assets/icons/Cross.svg";
import { Priority } from "@/Types/enum";
import CheckList from "./CheckList";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const TOP_SPACING = 100;
const FINAL_HEIGHT = SCREEN_HEIGHT - TOP_SPACING;

type CardDetailProps = {
  isVisible: boolean;
  onClose: () => void;
  card: {
    title: string;
    description?: string | null;
    priority: Priority;
  };
};

export default function CardDetail({
  isVisible,
  onClose,
  card,
}: CardDetailProps) {
  const detailProgress = useSharedValue(0);

  const [data, setData] = useState([
    {
      id: "cl1",
      title: "Project Setup",
      cardId: "c1",
      items: [
        { id: "cli1", title: "Create repository", isCompleted: true },
        { id: "cli2", title: "Install dependencies", isCompleted: true },
        { id: "cli3", title: "Setup folder structure", isCompleted: false },
      ],
    },
    {
      id: "cl2",
      title: "API Development",
      cardId: "c2",
      items: [
        { id: "cli4", title: "Design API routes", isCompleted: true },
        { id: "cli5", title: "Implement controllers", isCompleted: false },
        { id: "cli6", title: "Connect database", isCompleted: false },
      ],
    },
    {
      id: "cl3",
      title: "Documentation",
      cardId: "c3",
      items: [
        { id: "cli7", title: "Write README", isCompleted: false },
        { id: "cli8", title: "Add API docs", isCompleted: false },
      ],
    },
    {
      id: "cl4",
      title: "Bug Fixing",
      cardId: "c4",
      items: [
        { id: "cli9", title: "Reproduce bug", isCompleted: true },
        { id: "cli10", title: "Fix issue", isCompleted: false },
        { id: "cli11", title: "Test again", isCompleted: false },
      ],
    },
  ])

  useEffect(() => {
    if (isVisible) {
      detailProgress.value = withSpring(1, { damping: 100 });
    } else {
      detailProgress.value = withTiming(0, { duration: 200 });
    }
  }, [isVisible]);

  const detailStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(detailProgress.value, [0, 1], [150, FINAL_HEIGHT]),
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomLeftRadius: interpolate(
        detailProgress.value,
        [0, 1],
        [12, 0],
      ),
      borderBottomRightRadius: interpolate(
        detailProgress.value,
        [0, 1],
        [12, 0],
      ),
      transform: [
        {
          translateY: interpolate(
            detailProgress.value,
            [0, 1],
            [SCREEN_HEIGHT, 0],
          ),
        },
      ],
      shadowOpacity: interpolate(detailProgress.value, [0, 1], [0.1, 0.3]),
      elevation: interpolate(detailProgress.value, [0, 1], [2, 20]),
    };
  });
  const detailProcess = useSharedValue(0);
  const process = data.map((checklist) => {
    return checklist.items.reduce((prev, curr) => (curr.isCompleted ? prev + 1 : prev), 0);
  });
  const toggleChecked = (itemId: string) => {
    console.log(itemId)
    setData((prevData) =>
      prevData.map((checklist) => ({
        ...checklist,
        items: checklist.items.map((item) =>
          item.id === itemId 
            ? { ...item, isCompleted: !item.isCompleted } 
            : item
        ),
      }))
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.detailCard, detailStyle]}>
          <Animated.ScrollView contentContainerStyle={styles.scrollContent} showsHorizontalScrollIndicator={false}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Cross />
            </Pressable>
            <View>
              <Text
                style={[
                  Typography.headlineSm,
                  { fontSize: 32, paddingBottom: Spacing.lg },
                ]}
              >
                {card.title}
              </Text>
            </View>
            <View style={{ display: "flex", gap: Spacing.xl }}>
              {data.map((item) => (
                <CheckList key={item.id} id={item.id} items={item.items} onPress={() => toggleChecked(item.id)}/>
              ))}
            </View>
          </Animated.ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    flex: 1,
  },
  detailCard: {
    backgroundColor: Colors.onPrimary,
    overflow: "hidden",
  },
  scrollContent: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
  },
  closeButton: {
    marginBottom: Spacing.sm,
    alignSelf: "flex-start",
  },
  descriptionContainer: {
    marginTop: Spacing.md,
  },
});
