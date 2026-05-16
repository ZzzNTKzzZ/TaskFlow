import React from "react";
import { DimensionValue, View, ViewStyle } from "react-native";
import { Theme } from "@/theme/theme";

interface ProgressBarProps {
  progress: number; 
  style?: ViewStyle;
  color?: string;
  height?: number;
}

export default function ProgressBar({
  progress,
  style,
  color = Theme.success,
  height = 6,            
}: ProgressBarProps) {
  
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const widthPercent: DimensionValue = `${clampedProgress * 100}%`;

  return (
    <View
      style={[
        {
          backgroundColor: Theme.border,
          height: height,
          width: "100%",
          borderRadius: height / 2,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <View
        style={{
          backgroundColor: color,      
          height: "100%",
          width: widthPercent,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}