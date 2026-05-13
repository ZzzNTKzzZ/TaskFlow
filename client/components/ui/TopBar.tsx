import { Text, View } from "react-native";
import LeftRightIcon from "../icons/LeftRightIcon";
import SymbolIcon, { SymbolColor, SymbolName } from "../icons/SymbolIcon";
import Icons from "../icons/Icons";

interface TopBarProps {
  icon?: SymbolName;
  color?: SymbolColor;
  title: string;
}

export default function TopBar({ icon, color, title }: TopBarProps) {
  return (
    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
      <View style={{ flexDirection: "row" }}>
        <LeftRightIcon direction="left" />
        {icon && <SymbolIcon name={icon} color={color} />}
        <Text>{title}</Text>
      </View>
      <View>
        <Icons name="Search" />
      </View>
    </View>
  );
}
