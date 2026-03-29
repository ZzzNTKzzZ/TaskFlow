import { Colors, Rounded, Spacing, Typography } from "@/theme";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Dimensions,
  Modal,
} from "react-native";
import PriorityTag from "./ui/PriorityTag";
import { Priority } from "@/Types/enum";
import Calendar from "@/assets/icons/Calendar.svg";
import Clock from "@/assets/icons/Clock.svg";
import dayLeft from "@/helper/dayLeft";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useState } from "react";
import Breadcrumb from "./Breadcrumb";

export type CardProps = {
  listId: string;
  card: {
    id: string;
    title: string;
    description?: string | null;
    position: number;
    dueDate?: Date | null;
    listId: string;
    createdAt: Date;
    priority: Priority;
  };
  onArchive?: (id: string) => void; // Thêm callback để xử lý lưu trữ
};

// Component cho nút Archive bên phải
const RightAction = (
  prog: Animated.SharedValue<number>,
  drag: Animated.SharedValue<number>,
) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: prog.value,
      transform: [
        {
          scale: interpolate(prog.value, [0, 1], [0.5, 1], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <View style={styles.rightActionWrapper}>
      <Animated.View style={[styles.archiveButton, animatedStyle]}>
        <Text style={styles.archiveText}>Archive</Text>
      </Animated.View>
    </View>
  );
};
// ... các imports giữ nguyên, thêm CardDetail
import CardDetail from "./CardDetail";

export default function Card({ listId, card, onArchive }: CardProps) {
  const isDragging = useSharedValue(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  // Helper cho ngày tháng
  const dayleft = dayLeft(card?.dueDate);
  const formatDate = card.dueDate?.toLocaleDateString("en-US", {
    month: "short", day: "2-digit", year: "numeric",
  });

  // GESTURES
  const dragGesture = Gesture.Pan()
    .activateAfterLongPress(300)
    .onStart(() => { isDragging.value = true; })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      isDragging.value = false;
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: withTiming(isDragging.value ? 1.05 : 1) },
    ],
    zIndex: isDragging.value ? 999 : 1,
    opacity: isDragging.value ? 0.9 : 1,
    backgroundColor: Colors.onPrimary,
  }));

  return (
    <>
      <Pressable onPress={() => setIsDetailVisible(true)}>
        <GestureDetector gesture={dragGesture}>
          <ReanimatedSwipeable
            friction={2}
            enableTrackpadTwoFingerGesture
            rightThreshold={40}
            renderRightActions={RightAction}
            onSwipeableOpen={() => onArchive?.(card.id)}
          >
            <Animated.View style={[styles.container, animatedStyle]}>
              <View style={styles.priorityWrapper}>
                <PriorityTag priority={card.priority} />
              </View>

              <View style={styles.contentWrapper}>
                <Text style={styles.title}>{card.title}</Text>
                {card.description && (
                  <Text style={styles.description} numberOfLines={2}>
                    {card.description}
                  </Text>
                )}
              </View>

              {card.dueDate && (
                <View style={styles.footer}>
                  {dayleft !== null && (dayleft >= 7 ? <Calendar /> : <Clock />)}
                  <Text style={styles.dateText}>
                    {dayleft !== null && (dayleft >= 7 ? formatDate : `${dayleft} days left`)}
                  </Text>
                </View>
              )}
            </Animated.View>
          </ReanimatedSwipeable>
        </GestureDetector>
      </Pressable>

      {/* Component Detail đã được tách */}
      <CardDetail 
        isVisible={isDetailVisible} 
        onClose={() => setIsDetailVisible(false)} 
        card={card} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    marginVertical: Spacing.sm, // Giảm marginVertical để các thẻ không quá xa nhau
    borderRadius: Rounded.lg,
    elevation: 2,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
  },
  priorityWrapper: {
    marginBottom: Spacing.md,
  },
  contentWrapper: {
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.titleMd,
    fontSize: 20,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.bodyMd,
    color: Colors.description,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    ...Typography.titleMd,
    marginLeft: Spacing.xs,
    fontSize: 12,
    color: Colors.description,
  },
  // Styles cho Swipe Action
  rightActionWrapper: {
    width: 100,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  archiveButton: {
    backgroundColor: "#FF3B30", // Bạn có thể thay bằng Colors.danger nếu có
    width: 80,
    height: "80%",
    borderRadius: Rounded.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  archiveText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    flex: 1,
  },
  detailCard: {
    backgroundColor: Colors.onPrimary,
  },
});
