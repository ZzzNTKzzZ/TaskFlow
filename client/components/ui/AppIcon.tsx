import React from "react";
import { IconMap, IconName } from "@/assets/icons";
import { Colors } from "@/theme";

type AppIconProps = {
  name: IconName;
  color?: string;
  size?: number;
};

export const AppIcon = ({ name, color, size = 20 }: AppIconProps) => {
  const SvgIcon = IconMap[name];
  if (!SvgIcon) return null;

  // Xác định màu mặc định cho từng loại icon nếu cần
  const getDefaultColor = (iconName: IconName) => {
  if (iconName === "Logo") return "#2B3896";
  if (iconName === "Warn") return "#FF0000";
  
  if (["Plus", "RightArrow", "LeftArrow", "EmptyBoard"].includes(iconName)) {
    return Colors.onPrimary;
  }
  
  return "#767683";
};

  return (
    <SvgIcon width={size} height={size} fill={color || getDefaultColor(name)} color={color || getDefaultColor(name)}/>
  );
};
