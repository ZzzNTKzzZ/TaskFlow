import { Colors, Typography } from "@/theme";
import { Manrope_400Regular, useFonts } from "@expo-google-fonts/manrope";
import { View, Text, StyleSheet, Pressable } from "react-native";

export type BreadcrumbItem = {
  label: string;
  onPress?: () => void;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const [loader] = useFonts({
    Manrope_400Regular
  })

  if(!loader) return null

  return (
    <View style={{flexDirection: "row"}}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Pressable disabled={!item.onPress} onPress={item.onPress}>
              <Text style={[{color: Colors.onSurfaceVariant, letterSpacing: 2}, Typography.labelSm]}>{item.label}</Text>
            </Pressable>
            {!isLast && <Text style={{color: Colors.onSurfaceVariant}}> / </Text>}
          </View>
        );
      })}
    </View>
  );
}
