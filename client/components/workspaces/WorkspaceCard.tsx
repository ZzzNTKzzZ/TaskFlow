import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import SymbolIcon from "../icons/SymbolIcon";
import { WorkspaceCard } from "@/modules/workspace/workspace";
import { Theme } from "@/theme/theme";
import StarIcon from "../icons/StarIcon";
import Icons from "../icons/Icons";
import KebabMenu from "../overlays/KebabMenu";

interface WorkspaceCardProps extends Omit<WorkspaceCard, "role" | "value"> {
  checked?: boolean;
  onPress?: () => void;
}
export default function WorkspaceCardUI({
  id,
  name,
  memberCount,
  color = "Primary",
  icon,
  checked = false,
  onPress,
}: WorkspaceCardProps) {
  const [checkedCard, setCheckedCard] = useState(checked);
  const [active, setActive] = useState<boolean>(false);

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
      <TouchableOpacity
        style={{ gap: Spacing[2], alignItems: "flex-start" }}
        onPress={onPress}
      >
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
      <View style={{ alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setCheckedCard((prev) => !prev)}
        >
          <StarIcon checked={checkedCard} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={() => setActive(true)}>
          <Icons name="KebabH" size={18} />
        </TouchableOpacity>
      </View>
      <KebabMenu
        visible={active}
        onClose={() => setActive(false)}
        menu={[
          "Workspace settings",
          "Invite members",
          "Change role",
          "Members",
          "Manage boards",
          "Leave workspace",
          "Delete workspace",
        ]}
      />
    </View>
  );
}
