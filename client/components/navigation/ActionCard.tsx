import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

interface ActionCardProps {
  type: "newBoard" | "newTodo" | "inviteMembers" | "automation";
  onPress: () => void;
}

export default function ActionCard({ type, onPress }: ActionCardProps) {
  const card = {
    newBoard: {
      icon: (
        <Svg width="28" height="28" viewBox="0 0 18 18" fill="none">
          <Path
            d="M2 4.5C2 3.83696 2.26339 3.20107 2.73223 2.73223C3.20107 2.26339 3.83696 2 4.5 2H11.5C12.163 2 12.7989 2.26339 13.2678 2.73223C13.7366 3.20107 14 3.83696 14 4.5V11.5C14 12.163 13.7366 12.7989 13.2678 13.2678C12.7989 13.7366 12.163 14 11.5 14H4.5C3.83696 14 3.20107 13.7366 2.73223 13.2678C2.26339 12.7989 2 12.163 2 11.5V4.5ZM4.5 3C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V5H7.5V3H4.5ZM8.5 3V10H13V4.5C13 4.10218 12.842 3.72064 12.5607 3.43934C12.2794 3.15804 11.8978 3 11.5 3H8.5ZM13 11H8.5V13H11.5C11.8978 13 12.2794 12.842 12.5607 12.5607C12.842 12.2794 13 11.8978 13 11.5V11ZM7.5 13V6H3V11.5C3 11.8978 3.15804 12.2794 3.43934 12.5607C3.72064 12.842 4.10218 13 4.5 13H7.5Z"
            fill="#3B82F6"
          />
        </Svg>
      ),
      title: "New Board",
      caption: "Create a new board",
    },
    newTodo: {
      icon: (
        <Svg width="28" height="28" viewBox="0 0 18 18" fill="none">
          <Path
            d="M3.16668 1.83333H12.8333C13.572 1.83333 14.1667 2.42799 14.1667 3.16666V12.8333C14.1667 13.572 13.572 14.1667 12.8333 14.1667H3.16668C2.42801 14.1667 1.83334 13.572 1.83334 12.8333V3.16666C1.83334 2.42799 2.42801 1.83333 3.16668 1.83333Z"
            stroke="#16A34A"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <Path
            d="M4.67065 7.71267L7.08165 10.124L11.3293 5.87601"
            stroke="#16A34A"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </Svg>
      ),
      title: "New Todo",
      caption: "Add a personal task",
    },
    inviteMembers: {
      icon: (
        <Svg width="28" height="24" viewBox="0 0 20 16" fill="none">
          <G clip-path="url(#clip0_192_11)">
            <Path
              d="M3 4C3 2.93913 3.42143 1.92172 4.17157 1.17157C4.92172 0.421427 5.93913 0 7 0C8.06087 0 9.07828 0.421427 9.82843 1.17157C10.5786 1.92172 11 2.93913 11 4C11 5.06087 10.5786 6.07828 9.82843 6.82843C9.07828 7.57857 8.06087 8 7 8C5.93913 8 4.92172 7.57857 4.17157 6.82843C3.42143 6.07828 3 5.06087 3 4ZM0 15.0719C0 11.9937 2.49375 9.5 5.57188 9.5H8.42813C11.5063 9.5 14 11.9937 14 15.0719C14 15.5844 13.5844 16 13.0719 16H0.928125C0.415625 16 0 15.5844 0 15.0719ZM15.75 9.75V7.75H13.75C13.3344 7.75 13 7.41563 13 7C13 6.58437 13.3344 6.25 13.75 6.25H15.75V4.25C15.75 3.83437 16.0844 3.5 16.5 3.5C16.9156 3.5 17.25 3.83437 17.25 4.25V6.25H19.25C19.6656 6.25 20 6.58437 20 7C20 7.41563 19.6656 7.75 19.25 7.75H17.25V9.75C17.25 10.1656 16.9156 10.5 16.5 10.5C16.0844 10.5 15.75 10.1656 15.75 9.75Z"
              fill="#7C3AED"
            />
          </G>
          <Defs>
            <ClipPath id="clip0_192_11">
              <Rect width="20" height="16" fill="white" />
            </ClipPath>
          </Defs>
        </Svg>
      ),
      title: "Add Member",
      caption: "Invite people to workspace",
    },
    automation: {
      icon: (
        <Svg width="28" height="28" viewBox="0 0 18 18" fill="none">
          <Path
            d="M5.99999 10H3.93333C3.66666 10 3.46933 9.88067 3.34133 9.642C3.21333 9.40333 3.22733 9.17267 3.38333 8.95L8.36666 1.78333C8.47777 1.62778 8.62222 1.51956 8.79999 1.45867C8.97777 1.39778 9.1611 1.40045 9.34999 1.46667C9.53888 1.53289 9.67777 1.64956 9.76666 1.81667C9.85555 1.98378 9.88888 2.16156 9.86666 2.35L9.33333 6.66667H11.9167C12.2055 6.66667 12.4084 6.79445 12.5253 7.05C12.6422 7.30556 12.606 7.54445 12.4167 7.76667L6.93333 14.3333C6.8111 14.4778 6.6611 14.5722 6.48333 14.6167C6.30555 14.6611 6.13333 14.6444 5.96666 14.5667C5.79999 14.4889 5.66955 14.3696 5.57533 14.2087C5.4811 14.0478 5.44488 13.8727 5.46666 13.6833L5.99999 10Z"
            fill="#EA580C"
          />
        </Svg>
      ),
      title: "Automation",
    },
  };

  const currentCard = card[type];

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={[styles.base, styles[type]]}>
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
