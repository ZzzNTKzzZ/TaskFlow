import { ReactNode } from "react";
import { Text, View } from "react-native";
import Avatar from "../ui/Avatar";
import { getTimeDifference } from "@/helper/Day";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";

export interface ActivityCardProps {
  name: string;
  action: string;
  icon?: ReactNode;
  boardName: string;
  time: string;
}

export function ActivityCard({
  name,
  action,
  icon,
  boardName,
  time,
}: ActivityCardProps) {
  const timeDiff = getTimeDifference(time);
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: Spacing[2],
        gap: Spacing[4],
      }}
    >
      <Avatar name={name} size={36} />
      <View style={{ flexDirection: "row", flex: 1, justifyContent: "center" }}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1}>{`${name} ${action}`}</Text>
          <Text>in {boardName}</Text>
        </View>
        <View style={{justifyContent: "center"}}>
          <Text style={[Typography.caption, { fontSize: 12 }]}>{timeDiff}</Text>
        </View>
      </View>
      {icon}
    </View>
  );
}
