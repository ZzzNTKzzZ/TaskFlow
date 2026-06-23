import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import BackgroundCard from "../illustrations/BackgroundCard";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import { Theme } from "@/theme/theme";
import { Colors } from "@/theme/colors";
import { BoardCardUI } from "@/types/board";

interface BoardCardProps extends BoardCardUI {
  styleCard?: StyleProp<ViewStyle>;
  styleText?: StyleProp<TextStyle>;
  showMembers?: boolean;
  onPress?: () => void;
}

export default function BoardCard({
  id,
  background,
  name,
  memberCount,
  cardCount,
  listCount,
  styleCard,
  styleText,
  onPress,
  showMembers = true,
}: BoardCardProps) {
  return (
    <Pressable
    onPress={onPress}
      style={[
        {
          borderRadius: 12,
          backgroundColor: Theme.surface,
          shadowColor: Colors.gray[400],
          overflow: "hidden",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.7,
          shadowRadius: 16,

          // Shadow for Android
          elevation: 8,
        },
        styleCard,
      ]}
    >
      <View style={{ flexDirection: "column" }}>
        <View
          style={{
            width: "100%",
            maxWidth: 300,
            aspectRatio: 16 / 9,
            alignSelf: "center",
          }}
        >
          <BackgroundCard background={background} />
        </View>
        <View style={{ padding: Spacing[4], gap: Spacing[2] }}>
          <Text
            numberOfLines={2}
            style={[
              Typography.heading,
              {
                fontSize: 10,
                textAlign: "left",
              },
              styleText,
            ]}
          >
            {name}
          </Text>
          {showMembers && listCount === 0 ? (
            <Text style={[Typography.caption, { fontSize: 10 }, styleText]}>
              {memberCount} members
            </Text>
          ) : (
            <View>
              <Text style={[Typography.caption, { fontSize: 12 }, styleText]}>
                {listCount} list - {cardCount} cards
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
