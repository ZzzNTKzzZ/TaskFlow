import { Card } from "@/modules/card/card";
import { Text, View } from "react-native";
import Badges from "../ui/Badges";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import Icons from "../icons/Icons";
import { formatMonthDate } from "@/helper/Day";
import { Typography } from "@/theme/typography";
import { useEffect, useState } from "react";

export default function CardUI({
  id,
  name,
  dueDate,
  priority,
  checklists,
}: Card) {
  const [nChecked, setNChecked] = useState(0);
  const [totalCheckList, setTotalCheckList] = useState(0)
  useEffect(() => {
    const totalCompleted = checklists.reduce((total, checklist) => {
      return total + checklist.items.filter((item) => item.isCompleted).length;
    }, 0);
    setNChecked(totalCompleted);

    const total = checklists.reduce((total, checklist) => {
      return total + checklist.items.length
    }, 0)
    setTotalCheckList(total)
  }, []);

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
      <Text numberOfLines={2} style={[Typography.heading, { fontSize: 14 }]}>
        {name}
      </Text>
      <Badges name={priority} size={10} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing[1]}}>
          <Icons name="CheckBox" size={16} />
          <Text style={[Typography.body, { fontSize: 12}]}>{nChecked}/{totalCheckList}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: Spacing[2],
            alignItems: "center",
          }}
        >
          <Icons name="Calender" size={16} />
          <Text style={[Typography.caption]}>{formatMonthDate(dueDate)}</Text>
        </View>
      </View>
    </View>
  );
}
