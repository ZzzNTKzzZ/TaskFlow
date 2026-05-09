import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import { Animated } from "react-native";
import { useEffect, useRef } from "react";

export default function UpDownIcon({ active }: { active: boolean }) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: active ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(); 
  }, [active]);

  const rotation = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
      <Svg width="24" height="24" viewBox="0 0 16 16" fill="none">
        <G clipPath="url(#clip0_198_2)">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.70666 10.7067C8.51916 10.8939 8.265 10.9991 7.99999 10.9991C7.73499 10.9991 7.48083 10.8939 7.29333 10.7067L3.52133 6.936C3.33382 6.7484 3.22851 6.494 3.22858 6.22876C3.22864 5.96352 3.33406 5.70917 3.52166 5.52166C3.70926 5.33416 3.96366 5.22885 4.2289 5.22891C4.49414 5.22897 4.74849 5.3344 4.93599 5.522L7.99999 8.586L11.064 5.522C11.2525 5.33975 11.5051 5.23883 11.7673 5.24099C12.0295 5.24314 12.2803 5.34819 12.4658 5.53351C12.6513 5.71883 12.7566 5.9696 12.759 6.2318C12.7614 6.49399 12.6607 6.74664 12.4787 6.93533L8.70733 10.7073L8.70666 10.7067Z"
            fill="black"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_198_2">
            <Rect width="16" height="16" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    </Animated.View>
  );
}