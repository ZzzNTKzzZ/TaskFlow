import { ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import UpDownIcon from "../icons/UpDownIcon";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import { Theme } from "@/theme/theme";
import { useClickOutside } from "@/helper/clickOutSide";
import SymbolIcon from "../icons/SymbolIcon";
import { Colors } from "@/theme/colors";

interface Option {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface DropDownProps<T extends Option> {
  options: T[];
  selected: string;
  setSelected: (selected: string) => void;
  label: string;
  icon?: ReactNode;
  renderItem?: (item: T) => ReactNode;
}

export default function DropDown<T extends Option>({
  options,
  selected,
  setSelected,
  label,
  icon,
  renderItem,
}: DropDownProps<T>) {
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const maxHeight = 80 * options.length;
  const [isOpen, setIsOpen] = useState(false);

  const dropDownRef = useRef<View>(null);

  const toggleDropDown = () => {
    const toValue = isOpen ? 0 : maxHeight;
    setIsOpen((prev) => !prev);

    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSelected = (value: string) => {
    setSelected(value);
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOutSide = useClickOutside(
    dropDownRef,
    () => setIsOpen(false),
    isOpen,
  );

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleDropDown}>
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginBottom: Spacing[4],
          }}
        >
          <View style={{flexDirection: "row", alignItems: "center", gap: Spacing[4]}}>
            {icon}
            <View style={{ flexDirection: "row", gap: Spacing[1] }}>
              <Text style={[Typography.title, { fontSize: 14, color: Theme.textSecondary }]}>
                {label}
              </Text>
              {!isOpen && (
                <Text
                  style={[
                    Typography.title,
                    {
                      fontSize: 14,
                      textAlignVertical: "center",
                      color: Colors.primary[700],
                    },
                  ]}
                >
                  {selected}
                </Text>
              )}
            </View>
          </View>
          <View>
            <UpDownIcon active={isOpen} />
          </View>
        </View>
        <Pressable ref={dropDownRef} onPress={handlePressOutSide}>
          <Animated.View
            onStartShouldSetResponder={() => true}
            style={{
              height: animatedHeight,
              overflow: "hidden",
              opacity: animatedHeight.interpolate({
                inputRange: [0, maxHeight],
                outputRange: [0, 1],
              }),
              gap: Spacing[3],
            }}
          >
            {options.map((o) => (
              <TouchableOpacity
                style={{ flexDirection: "column" }}
                key={o.value}
                onPress={() => handleSelected(o.value)}
              >
                {renderItem ? (
                  renderItem(o)
                ) : (
                  <View>
                    {o.icon}
                    <Text>{o.label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            <View style={{ flex: 1 }} />
          </Animated.View>
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
});
