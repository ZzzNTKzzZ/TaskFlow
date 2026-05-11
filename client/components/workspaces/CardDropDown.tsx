import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { RoleWorkspace } from "@/types/type";
import { ReactNode } from "react";
import { Text, View } from "react-native";
import CheckedIcon from "../icons/CheckedIcon";
import { Colors } from "@/theme/colors";

interface CardDropDownProps {
  icon?: ReactNode;
  name: string;
  memberSize: number;
  role: RoleWorkspace;
  selected?: boolean;
}

export default function CardDropDown({
  icon,
  name,
  memberSize,
  role,
  selected,
}: CardDropDownProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing[1],
        borderRadius: 16,
        backgroundColor: selected ? Colors.primary[200] : undefined,
        padding: Spacing[3],
        overflow: "hidden",
      }}
    >
      <View>{icon}</View>
      <View style={{ flexDirection: "column" }}>
        <Text style={[Typography.heading, { fontSize: 14 }]}>{name}</Text>
        <View style={{ flexDirection: "row", gap: Spacing[2] }}>
          <Text>{memberSize} members</Text>
          <Text>{role}</Text>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      {selected && <CheckedIcon color={Theme.primary} />}
    </View>
  );
}
