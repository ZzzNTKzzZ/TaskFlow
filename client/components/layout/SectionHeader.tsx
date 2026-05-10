import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import { Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  onPress: () => void;
}

export default function SectionHeader({
  title,
  onPress,
}: SectionHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: Spacing[3],
      }}
    >
      <Text style={[Typography.title, { fontSize: 16 }]}>
        {title}
      </Text>

      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <Text
          style={[
            Typography.title,
            {
              fontSize: 14,
              color: Colors.primary[700],
            },
          ]}
        >
          View all
        </Text>
      </TouchableOpacity>
    </View>
  );
}