import React from "react";
import { View, Text } from "react-native";
import { Activity } from "@/types/activity";
import capitalizeFirstLetter from "@/helper/capitalizeFirstLetter";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import Avatar from "@/components/ui/Avatar";
import Icons, { Icon } from "@/components/icons/Icons";
import dayjs from "dayjs";

function getActivityIcon(action: string): Icon {
  if (action.startsWith("BOARD_")) return "Board";
  if (action.startsWith("LIST_")) return "Todo";
  if (action.startsWith("CARD_")) return "BoardManage";
  if (action.startsWith("CHECKLIST_")) return "CheckList";
  if (action.startsWith("COMMENT_")) return "Activity";
  return "Activity";
}

export function ActivityItem({ item }: { item: Activity }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: Spacing[3],
        paddingVertical: Spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: Theme.border,
      }}
    >
      <Avatar name={item.user.name} />

      <View style={{ flex: 1 }}>
        <Text
          style={[
            Typography.body,
            {
              color: Theme.textPrimary,
              lineHeight: 22,
            },
          ]}
        >
          <Text style={{ fontWeight: "600" }}>{item.user.name}</Text>{" "}
          {capitalizeFirstLetter(item.description)}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
          <Icons name={getActivityIcon(item.action)} size={12} color={Theme.textSecondary} />
          <Text
            style={[
              Typography.caption,
              { color: Theme.textSecondary },
            ]}
          >
            {dayjs(item.createdAt).format("hh:mm A")}
          </Text>
        </View>
      </View>
    </View>
  );
}
