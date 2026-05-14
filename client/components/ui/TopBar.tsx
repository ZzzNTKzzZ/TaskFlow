import { Text, TouchableOpacity, View } from "react-native";
import LeftRightIcon from "../icons/LeftRightIcon";
import SymbolIcon, { SymbolColor, SymbolName } from "../icons/SymbolIcon";
import Icons from "../icons/Icons";
import { Theme } from "@/theme/theme";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import { router } from "expo-router";

interface TopBarProps {
  icon?: SymbolName;
  color?: SymbolColor;
  title: string;
}

export default function TopBar({ icon, color, title }: TopBarProps) {
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
        <TouchableOpacity onPress={() => router.back()}>
          <LeftRightIcon direction="left" size={32} />
        </TouchableOpacity>
        {icon && <SymbolIcon name={icon} color={color} />}
        <Text style={[Typography.heading, { fontSize: 16 }]}>{title}</Text>
      </View>
      <View>
        <Icons name="Search" />
      </View>
    </View>
  );
}
