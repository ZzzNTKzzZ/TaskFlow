import React, { useState, useRef, useEffect } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Animated,
  Easing,
  FlatList,
} from "react-native";
import ChevronDown from "@/assets/icons/ChevronDown.svg";
import { Colors, Rounded, Spacing, Typography } from "@/theme";

type SelectProps = {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
};

export default function Select({
  label,
  value,
  setValue,
  options,
}: SelectProps) {
  const [showList, setShowList] = useState(false);

  const animatedController = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    if (!showList) {
      setShowList(true);
      Animated.timing(animatedController, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else {
      // 1. Animate out
      Animated.timing(animatedController, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => setShowList(false));
    }
  };

  const handleSelect = (item: string) => {
    setValue(item);
    toggleDropdown();
  };

  // Interpolations
  const arrowRotation = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const dropdownOpacity = animatedController;

  const dropdownTranslateY = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  return (
    <View style={styles.container}>
      <Text style={[Typography.labelSm,{ fontSize: 14, marginBottom: Spacing.xs}]}>{label}</Text>

      <Pressable
        style={[styles.selector, showList && styles.selectorActive]}
        onPress={toggleDropdown}
      >
        <Text style={styles.valueText}>
          {value
            ? value.charAt(0).toUpperCase() + value.slice(1)
            : "Select an option"}
        </Text>
        <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
          <ChevronDown width={14} height={14} />
        </Animated.View>
      </Pressable>

      {showList && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              opacity: dropdownOpacity,
              transform: [{ translateY: dropdownTranslateY }],
            },
          ]}
        >
          <View style={{ maxHeight: 250 }}>
            {options.map((item) => (
              <Pressable
                key={item}
                style={({ pressed }) => [
                  styles.option,
                  pressed && { backgroundColor: "#f9f9f9" },
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    item === value && styles.selectedOptionText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
    position: "relative",
    zIndex: 10,
  },

  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.secondaryFixed,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  selectorActive: {
    borderColor: Colors.primary_T90,
  },
  valueText: {
    fontSize: 16,
    color: "#333",
  },
  dropdown: {
    position: "absolute",
    top: 82,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: Rounded.md,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  option: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0F0F0",
  },
  optionText: {
    fontSize: 16,
    color: "#555",
    textTransform: "capitalize"
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
});
