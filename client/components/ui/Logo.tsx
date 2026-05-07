import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  color?: string;
  text?: boolean;
  size?: LogoSize;
}

export default function Logo({ 
  color = "#3B82F6", 
  text = false, 
  size = "sm" 
}: LogoProps) {
  const sizeConfig = {
    sm: {
      logoSize: 18,
      fontSize: 16,
    },
    md: {
      logoSize: 24,
      fontSize: 20,
    },
    lg: {
      logoSize: 32,
      fontSize: 24,
    }
  };

  // Fallback to "sm" if an invalid size is passed
  const currentSize = sizeConfig[size] || sizeConfig.sm;

  return (
    <View style={styles.container}>
      <Svg 
        width={currentSize.logoSize} 
        height={currentSize.logoSize} 
        viewBox="0 0 18 18" 
        fill="none"
      >
        <Path
          d="M0 8V0H8V8H0ZM0 18V10H8V18H0ZM10 8V0H18V8H10ZM10 18V10H18V18H10ZM2 6H6V2H2V6ZM12 6H16V2H12V6ZM12 16H16V12H12V16ZM2 16H6V12H2V16Z"
          fill={color}
        />
      </Svg>

      {text && (
        <Text 
          style={[
            styles.text, 
            { fontSize: currentSize.fontSize }
          ]}
        >
          TaskFlow
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 6,
    fontWeight: "600",
    color: "#111827",
  },
});