import { Animated, Pressable, Text, View } from "react-native";
import Checked from "../ui/Checked";
import { useRef, useState } from "react";
import Badges from "../ui/Badges";
import { Typography } from "@/theme/typography";
import { Theme } from "@/theme/theme";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import CalenderIcon from "../icons/CalenderIcon";
import { formatMonthDate } from "@/helper/Day";

export type Priority = "low" | "medium" | "high" | "urgent";

interface TodoCardProps {
  isChecked: boolean;
  priority: Priority;
  dueDate: string;
  name: string;
}

export default function TodoCard({
  isChecked,
  priority,
  dueDate,
  name,
}: TodoCardProps) {
  const [checked, setChecked] = useState<boolean>(isChecked);

  const animatedValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(229, 231, 235, 0)", Colors.gray[200]]
  });
  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => setChecked((prev) => !prev)}
    >
      <Animated.View
      style={{
          flexDirection: "row",
          gap: Spacing[3],
          paddingVertical: Spacing[4],
          paddingHorizontal: Spacing[2], 
          backgroundColor: backgroundColor,
          borderRadius: 8, 
        }}>
        <Checked
          isChecked={checked}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            numberOfLines={1}
            style={[
              Typography.title,
              { fontSize: 12, color: Colors.gray[800] },
            ]}
          >
            {name}
          </Text>
        </View>
        <Badges name={priority} />
        <View
          style={{
            flexDirection: "row",
            gap: Spacing[1],
            alignItems: "center",
          }}
        >
          <CalenderIcon size={16} />
          <Text style={{ fontSize: 12 }}>{formatMonthDate(dueDate)}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
