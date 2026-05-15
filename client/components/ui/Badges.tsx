import { ReactNode } from "react";
import { StyleSheet, View, Text, ViewStyle, TextStyle } from "react-native";
import { Colors } from "@/theme/colors";
import { Theme } from "@/theme/theme";
import capitalizeFirstLetter from "@/helper/capitalizeFirstLetter";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import { Priority } from "@/types/type";

interface BadgesProps {
  name: string | Priority;
  color?: string;
  icon?: ReactNode;
  size?: number
}

function isPriority(value: any): value is Priority {
  return ["low", "medium", "high", "urgent"].includes(value);
}

export default function Badges({ name, color, icon, size =12}: BadgesProps) {
  const priorityConfig = {
    low: {
      backgroundColor: Colors.pLowBg,
      textColor: Colors.pLowText,
    },
    medium: {
      backgroundColor: Colors.pMdBg,
      textColor: Colors.pMdText,
    },
    high: {
      backgroundColor: Colors.pHighBg,
      textColor: Colors.pHighText,
    },
    urgent: {
      backgroundColor: Colors.pUrgentBg,
      textColor: Colors.pUrgentText,
    },
  };

  let containerStyle: ViewStyle = {
    backgroundColor: color || Theme.background,
  };
  let textStyle: TextStyle = { color: Theme.textPrimary };

  if (isPriority(name)) {
    const config = priorityConfig[name];
    containerStyle = { backgroundColor: config.backgroundColor };
    textStyle = { color: config.textColor };
  }

  return (
    <View style={[styles.badgeContainer, containerStyle]}>
      {icon && <View style={styles.iconWrapper}>{icon}</View>}
      <Text style={[Typography.title,textStyle, { fontSize: size, letterSpacing: 1}]}>
        {capitalizeFirstLetter(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  iconWrapper: {
    marginRight: 4,
  },
 
});
