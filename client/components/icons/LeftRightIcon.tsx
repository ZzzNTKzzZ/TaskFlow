import { Colors } from "@/theme/colors";
import { View } from "react-native";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

export default function LeftRightIcon({
  direction = "left",
  size = 24,
}: {
  direction: "left" | "right";
  size?: number;
}) {
  const isRight = direction === "right" ? "180deg" : "0deg";

  return (
    <View style={{ transform: [{ rotate: isRight }] }}>
      <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <G clip-path="url(#clip0_232_29)">
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.29331 8.70666C5.10604 8.51916 5.00085 8.265 5.00085 7.99999C5.00085 7.73499 5.10604 7.48083 5.29331 7.29333L9.06397 3.52133C9.25157 3.33382 9.50597 3.22851 9.77121 3.22858C9.90254 3.22861 10.0326 3.25451 10.1539 3.30479C10.2752 3.35508 10.3855 3.42877 10.4783 3.52166C10.5712 3.61455 10.6448 3.72482 10.695 3.84616C10.7453 3.96751 10.7711 4.09756 10.7711 4.2289C10.771 4.36023 10.7451 4.49027 10.6948 4.61159C10.6446 4.73292 10.5709 4.84315 10.478 4.93599L7.41464 7.99999L10.4786 11.064C10.5742 11.1562 10.6504 11.2665 10.7029 11.3885C10.7554 11.5105 10.783 11.6417 10.7842 11.7744C10.7854 11.9072 10.7602 12.0389 10.71 12.1618C10.6598 12.2848 10.5856 12.3964 10.4917 12.4904C10.3979 12.5843 10.2862 12.6586 10.1634 12.709C10.0405 12.7593 9.90883 12.7847 9.77605 12.7836C9.64327 12.7825 9.51204 12.755 9.39001 12.7026C9.26798 12.6503 9.1576 12.5741 9.06531 12.4787L5.29197 8.70666H5.29331Z"
            fill={Colors.gray[500]}
          />
        </G>
        <Defs>
          <ClipPath id="clip0_232_29">
            <Rect width="16" height="16" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
}
