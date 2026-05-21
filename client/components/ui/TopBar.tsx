import { Text, TouchableOpacity, View } from "react-native";
import LeftRightIcon from "../icons/LeftRightIcon";
import SymbolIcon, { SymbolColor, SymbolName } from "../icons/SymbolIcon";
import Icons from "../icons/Icons";
import CreateList from "../overlays/CreateList";
import { Theme } from "@/theme/theme";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import {
  router,
} from "expo-router";
import { useState } from "react";
import KebabMenu, { KebabMenuType } from "../overlays/KebabMenu";

export default function TopBar({
  name,
  icon,
  color,
  parentName,
  menu = [],
  onBack = () => router.push("../"),
}: {
  name: string;
  icon?: SymbolName;
  color?: SymbolColor;
  parentName?: string;
  onBack?: () => void
  menu: KebabMenuType[]
}) {

  const [active, setActive] = useState<boolean>(false)
  const [isCreateListVisible, setIsCreateListVisible] = useState(false)
  const handleSelectMenu = (item: KebabMenuType) => {
    if (item === "Create list") {
      setIsCreateListVisible(true)
    }
    if(item === "Create board") {
      router.navigate("/(board)/create")
    }
  }

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

        <Text numberOfLines={1} style={[Typography.heading, { fontSize: 20, maxWidth: 200 }]}>{name}</Text>
        {parentName && <Text style={[Typography.caption ,{fontSize: 12}]}>{parentName}</Text>}
        </View>
      </View>
      <View style={{flexDirection: "row", gap: Spacing[3], alignItems: "center"}}>
        <Icons name="Search" size={20}/>
        <TouchableOpacity onPress={() => {setActive(true)}}>
          <Icons name="KebabV" size={20}/>
        </TouchableOpacity>
      </View>
      <KebabMenu
        visible={active}
        onClose={() => setActive(false)}
        menu={menu}
        onSelectMenu={handleSelectMenu}
      />
      <CreateList
        visible={isCreateListVisible}
        onClose={() => setIsCreateListVisible(false)}
      />
    </View>
  );
}
