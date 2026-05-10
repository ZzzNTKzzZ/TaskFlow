import { View } from "react-native";
import CheckedIcon from "../icons/CheckedIcon";
import { Theme } from "@/theme/theme";

interface CheckedProps {
  isChecked: boolean;
  setChecked: () => void;
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
      {isChecked && <CheckedIcon color={Theme.surface} size={20} />}
    </View>
  );
}
