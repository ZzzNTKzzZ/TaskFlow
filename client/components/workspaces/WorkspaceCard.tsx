import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import { ReactNode, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SymbolIcon, { SymbolColor, SymbolName } from "../icons/SymbolIcon";
import { Colors } from "@/theme/colors";
import { WorkspaceCard } from "@/modules/workspace/workspace";
import { Theme } from "@/theme/theme";
import StarIcon from "../icons/StarIcon";
import { router } from "expo-router";

interface WorkspaceCardProps extends Omit<WorkspaceCard, "role" | "value"> {
  checked?: boolean;
}
export default function WorkspaceCardUI({
  id,
  name,
  memberCount,
  color = "Primary",
  icon,
  checked = false,
}: WorkspaceCardProps) {
  const [checkedCard, setCheckedCard] = useState(checked);

  const handleClick =((id: string, name: string, icon:SymbolName) => {
    router.push(`/(tabs)/workspace/${id}?name=${name}&icon=${icon}&color=${color}`);
  })
  return (
    <View
      style={{
        width: "48%",
        marginBottom: Spacing[3],
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: Theme.surface,
        borderRadius: 16,
        padding: Spacing[4],

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
      }}
    >
      <TouchableOpacity style={{ gap: Spacing[2], alignItems: "flex-start"}} onPress={() => handleClick(id, name, icon)}>
        <SymbolIcon name={icon} color={color} />
        <View
          style={{ flexDirection: "column", gap: Spacing[2], maxWidth: 100 }}
        >
          <Text
          
            numberOfLines={2}
            style={[
              Typography.label,
              { fontSize: 14, color: Theme.textPrimary },
              
            ]}
          >
            {name}
          </Text>
          <Text style={[Typography.caption]}>{memberCount} members</Text>
        </View>
      </TouchableOpacity>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setCheckedCard((prev) => !prev)}
        >
          <StarIcon checked={checkedCard} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
