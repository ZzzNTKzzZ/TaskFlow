import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import Icons from "../icons/Icons";

interface ActionCardProps {
  type: "newBoard" | "newTodo" | "inviteMembers" | "automation";
  onPress: () => void;
}

export default function ActionCard({ type, onPress }: ActionCardProps) {
  const card = {
    newBoard: {
      icon: <Icons name="BoardManage" color="#3B82F6" size={28} />,
      title: "New Board",
    },
    newTodo: {
      icon: <Icons name="Todo" color="#16A34A" size={28} />,
      title: "New Todo",
    },
    inviteMembers: {
      icon: <Icons name="InviteMembersSolid" color="#7C3AED" size={28} />,
      title: "Add Member",
    },
    automation: {
      icon: <Icons name="Flash" color="#EA580C" size={28} />,
      title: "Automation",
    },
  };

  const currentCard = card[type];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.base, styles[type]]}
    >
      <View style={styles.iconContainer}>{currentCard.icon}</View>
      <Text
        numberOfLines={2}
        style={[
          Typography.heading,
          {
            height: 24,
            alignItems: "center",
            textAlign: "center",
            fontSize: 10,
            letterSpacing: 0.3,
            color: Colors.gray[500],
          },
        ]}
      >
        {currentCard.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: "23%",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderRadius: 12,

    paddingTop: Spacing[2],
    gap: Spacing[1],
  },
  iconContainer: {
    width: 32,
    height: 32,

    alignItems: "center",
    justifyContent: "center",
  },
  newBoard: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  newTodo: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  inviteMembers: {
    backgroundColor: "#F5F3FF",
    borderColor: "#DDD6FE",
  },
  automation: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
  },
});
