import { View } from "react-native";
import { Theme } from "@/theme/theme";
import Icons from "../icons/Icons";

interface CheckedProps {
  isChecked: boolean;
}

export default function Checked({
  isChecked = false,
}: CheckedProps) {
  return (
    <View
      style={{
        borderWidth: 1.5,
        borderColor: !isChecked ? Theme.border : "transparent",
        backgroundColor: isChecked ? Theme.success : undefined,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
      }}
    >
      {isChecked && <Icons name="Checked" color={Theme.surface} size={20} />}
    </View>
  );
}
