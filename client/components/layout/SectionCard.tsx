import { ReactNode } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";

interface SectionCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function SectionCard({
  children,
  style,
}: SectionCardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: Theme.surface,
          borderRadius: 16,
          marginTop: Spacing[4],

          shadowColor: Colors.gray[400],
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.7,
          shadowRadius: 16,
          elevation: 8,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}