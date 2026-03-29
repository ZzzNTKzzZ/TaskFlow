import { Colors, Rounded, Spacing, Typography } from "@/theme";
import { Animated, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
type CheckListProps = {
  id: string;
  items: {
    id: string;
    title: string;
    isCompleted: Boolean;
  }[];
  onPress: () => void;
};

export default function CheckList({ id, items, onPress }: CheckListProps) {
  return (
    <View>
      {items.map((item) => (
        <Pressable
          onPress={onPress}
          key={item.id}
          style={{
            paddingVertical: Spacing.lg,
            paddingHorizontal: Spacing.lg,
            borderRadius: Rounded.lg,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing.lg,
          }}
        >
          <MaterialCommunityIcons
            name={item.isCompleted ? "check-circle" : "circle-outline"}
            size={24}
            color={
              item.isCompleted
                ? Colors.primaryContainer
                : Colors.onSurfaceVariant
            }
          />
          <Text
            style={[
              Typography.titleMd,
              { marginBottom: 4 },
              item.isCompleted
                ? {
                    color: Colors.onSurfaceVariant,
                    textDecorationLine: "line-through",
                  }
                : "",
            ]}
          >
            {item.title}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
