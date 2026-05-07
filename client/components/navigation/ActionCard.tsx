import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
            d="M0 2.5C0 1.83696 0.263392 1.20107 0.732233 0.732233C1.20107 0.263392 1.83696 0 2.5 0H9.5C10.163 0 10.7989 0.263392 11.2678 0.732233C11.7366 1.20107 12 1.83696 12 2.5V9.5C12 10.163 11.7366 10.7989 11.2678 11.2678C10.7989 11.7366 10.163 12 9.5 12H2.5C1.83696 12 1.20107 11.7366 0.732233 11.2678C0.263392 10.7989 0 10.163 0 9.5V2.5ZM2.5 1C2.10218 1 1.72064 1.15804 1.43934 1.43934C1.15804 1.72064 1 2.10218 1 2.5V3H5.5V1H2.5ZM6.5 1V8H11V2.5C11 2.10218 10.842 1.72064 10.5607 1.43934C10.2794 1.15804 9.89782 1 9.5 1H6.5ZM11 9H6.5V11H9.5C9.89782 11 10.2794 10.842 10.5607 10.5607C10.842 10.2794 11 9.89782 11 9.5V9ZM5.5 11V4H1V9.5C1 9.89782 1.15804 10.2794 1.43934 10.5607C1.72064 10.842 2.10218 11 2.5 11H5.5Z"
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
      title: "Invite Members",
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
    <Pressable onPress={onPress} style={[styles.base, styles[type]]}>
      <View style={styles.iconContainer}>
  {currentCard.icon}
</View>
      <Text
        numberOfLines={2}
        style={[
          Typography.heading,
          {
            height: 24,
            alignItems: "center",
            textAlign: "center",
            fontSize: 10,
            letterSpacing: 0.5,
            color: Colors.gray[500],
          },
        ]}
      >
        {currentCard.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 2,
    borderRadius: 20,

    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: Spacing[1],
    gap: Spacing[1]
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
