import { Text, TouchableOpacity, View } from "react-native";
import LeftRightIcon from "../icons/LeftRightIcon";
import SymbolIcon, { SymbolColor, SymbolName } from "../icons/SymbolIcon";
import Icons from "../icons/Icons";
import { Theme } from "@/theme/theme";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import {
  router,
} from "expo-router";

export default function TopBar({
  name,
  icon,
  color,
  parentName,
  
  onBack = () => router.push("../"),
}: {
  name: string;
  icon?: SymbolName;
  color?: SymbolColor;
  parentName?: string;
  onBack?: () => void
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Theme.background,
        paddingVertical: Spacing[3],
        paddingHorizontal: Spacing[4],
      }}
    >
      <View
        style={{ flexDirection: "row", gap: Spacing[2], alignItems: "center" }}
      >
        <TouchableOpacity onPress={onBack}>
          <LeftRightIcon direction="left" size={32} />
        </TouchableOpacity>
        {icon && (
          <SymbolIcon name={icon as SymbolName} color={color as SymbolColor} />
        )}
        <View>

        <Text style={[Typography.heading, { fontSize: 20 }]}>{name}</Text>
        {parentName && <Text style={[Typography.caption ,{fontSize: 12}]}>{parentName}</Text>}
        </View>
      </View>
      <View>
        <Icons name="Search" />
      </View>
    </View>
  );
}
