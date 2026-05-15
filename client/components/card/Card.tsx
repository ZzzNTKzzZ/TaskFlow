import { Card } from "@/modules/card/card";
import { Text, View } from "react-native";
import Badges from "../ui/Badges";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import Icons from "../icons/Icons";
import { formatMonthDate } from "@/helper/Day";
import { Typography } from "@/theme/typography";

export default function CardUI({
  id,
  name,
  dueDate,
  priority,
}: Card) {
  return (
    <View
      style={{
        paddingHorizontal: Spacing[2],
        paddingVertical: Spacing[4],
        backgroundColor: Theme.surface,
        borderRadius: 8,
        gap: Spacing[4],
        minWidth: 150,
        maxWidth: 170,
      }}
    >
      <Text numberOfLines={2} style={[Typography.heading, { fontSize: 16 }]}>
        {name}
      </Text>
      <Badges name={priority} size={10} />
      <View
        style={{ flexDirection: "row", gap: Spacing[2], alignItems: "center" }}
      >
        <Icons name="Calender" size={16} />
        <Text style={[Typography.caption]}>{formatMonthDate(dueDate)}</Text>
      </View>
    </View>
  );
}
