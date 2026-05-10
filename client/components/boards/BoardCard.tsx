import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import BackgroundCard, {
  BackgroundColor,
} from "../illustrations/BackgroundCard";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import { Theme } from "@/theme/theme";
import { Colors } from "@/theme/colors";

interface BoardCardProps {
  background: BackgroundColor;
  name: string;
  member: number;
  styleCard?: StyleProp<ViewStyle>;
}

export default function BoardCard({
  background,
  name,
  member,
  styleCard,
}: BoardCardProps) {
  return (
    <Pressable
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
        <View style={{ padding: Spacing[4] }}>
          <Text
            numberOfLines={2}
            style={[Typography.heading, { fontSize: 10, textAlign: "left", height: 24, lineHeight: 1.2 * 10 }]}
          >
            {name}
          </Text>
          <Text style={[Typography.caption, { fontSize: 10 }]}>
            {member} members
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
