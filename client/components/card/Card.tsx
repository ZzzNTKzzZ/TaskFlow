import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CardRespone } from "@/types/card";
import Badges from "../ui/Badges";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import Icons from "../icons/Icons";
import { formatMonthDate } from "@/helper/Day";
import { Typography } from "@/theme/typography";
import Checked from "../ui/Checked";
import { router } from "expo-router";

interface CardUIProps extends CardRespone {
  typeCard?: "Board" | "List" | "Detailed";
}

const BoardView = ({
  name,
  priority,
  nChecked,
  totalCheckList,
  dueDate,
}: any) => (
  <>
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: Spacing[1],
        }}
      >
        <Icons name="CheckList" size={18} />
        <Text style={[Typography.body, { fontSize: 12 }]}>
          {nChecked}/{totalCheckList}
        </Text>
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
  </>
);

const ListView = ({
  name,
  priority,
  nChecked,
  totalCheckList,
  dueDate,
}: any) => (
  <View
    style={{
      justifyContent: "space-between",
      flex: 1,
      gap: Spacing[2],
    }}
  >
    <View>
      <Text numberOfLines={1} style={[Typography.heading, { fontSize: 18 }]}>
        {name}
      </Text>
    </View>
    <View
      style={{ flexDirection: "row", alignItems: "center", gap: Spacing[3] }}
    >
      <Badges name={priority} size={12} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: Spacing[1],
        }}
      >
        <Icons name="CheckBox" size={16} />
        <Text style={[Typography.caption]}>
          {nChecked}/{totalCheckList}
        </Text>
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

export default function CardUI(props: CardUIProps) {
  const { checklists, typeCard = "Board" } = props;
  const [nChecked, setNChecked] = useState(0);
  const [totalCheckList, setTotalCheckList] = useState(0);
  
  const handleClick = (cardId: string) => {
    router.push(`./${cardId}`);
  };

  useEffect(() => {
    if (checklists && checklists.length > 0) {
      const totalCompleted = checklists.reduce((total, checklist) => {
        return (
          total + checklist.items.filter((item) => item.isCompleted).length
        );
      }, 0);
      const total = checklists.reduce((total, checklist) => {
        return total + checklist.items.length;
      }, 0);

      setNChecked(totalCompleted);
      setTotalCheckList(total);
    } else if (props.stats) {
      // Safely resolves pre-computed count utilizing exact backend spelling typos
      setNChecked(props.stats.checkListCompelete || 0);
      setTotalCheckList(props.stats.checkListCount || 0);
    }
  }, [checklists, props.stats]);

  const renderContent = () => {
    const commonProps = { ...props, nChecked, totalCheckList };

    switch (typeCard) {
      case "List":
        return <ListView {...commonProps} />;
      case "Board":
      default:
        return <BoardView {...commonProps} />;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => handleClick(props.id)}
      style={{
        paddingHorizontal: Spacing[4],
        paddingVertical: Spacing[4],
        backgroundColor: Theme.surface,
        borderRadius: typeCard === "Board" ? 8 : 0,
        minWidth: 150,
        maxWidth: typeCard === "Board" ? 170 : "100%",
        gap: Spacing[2],
      }}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}
