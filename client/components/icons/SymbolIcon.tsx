import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

export type SymbolName = "Company";
export type SymbolColor = "Primary" | "None";
interface SymbolIconProps {
  name: SymbolName;
  color?: SymbolColor;
  size?: number;
}

export default function SymbolIcon({
  name,
  color = "None",
  size = 20,
}: SymbolIconProps) {
  const colors = {
    Primary: {
      iconColor: Colors.primary[500],
      backgroundColor: Colors.primary[50],
      borderColor: Colors.primary[600],
    },
    None: {
      iconColor: Colors.gray[500],
      backgroundColor: Colors.gray[100],
      borderColor: Colors.gray[800],
    },
  };
  const colorConfig = colors[color];

  const icons = {
    Company: (
      <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <Path
          d="M12 10H10.6667V11.3333H12M12 7.33333H10.6667V8.66667H12M13.3333 12.6667H8.00001V11.3333H9.33334V10H8.00001V8.66667H9.33334V7.33333H8.00001V6H13.3333M6.66668 4.66667H5.33334V3.33333H6.66668M6.66668 7.33333H5.33334V6H6.66668M6.66668 10H5.33334V8.66667H6.66668M6.66668 12.6667H5.33334V11.3333H6.66668M4.00001 4.66667H2.66668V3.33333H4.00001M4.00001 7.33333H2.66668V6H4.00001M4.00001 10H2.66668V8.66667H4.00001M4.00001 12.6667H2.66668V11.3333H4.00001M8.00001 4.66667V2H1.33334V14H14.6667V4.66667H8.00001Z"
          fill={colorConfig.iconColor}
        />
      </Svg>
    ),
  };

  return (
    <View
      style={{
        backgroundColor: colorConfig.backgroundColor,
        borderColor: colorConfig.borderColor,
        borderRadius: 8,
        padding: Spacing[2],
      }}
    >
      {icons[name]}
    </View>
  );
}
