import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import UpDownIcon from "../icons/UpDownIcon";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import { Theme } from "@/theme/theme";
import { useClickOutside } from "@/helper/clickOutSide";
import { Colors } from "@/theme/colors";

interface Option {
  id: string;
  name: string;
}

interface MultiSelectDropDownProps {
  options: Option[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  label?: string;
  placeholder?: string;
  stylesView?: StyleProp<ViewStyle>;
}

export default function MultiSelectDropDown({
  options,
  selectedIds,
  onChange,
  label,
  placeholder = "Select options",
  stylesView,
}: MultiSelectDropDownProps) {
  const itemHeight = 48;
  const rawMaxHeight = itemHeight * (options.length + 1); // +1 for "All" option
  const ALLOWED_MAX_HEIGHT = 220;
  const finalTargetHeight = rawMaxHeight >= ALLOWED_MAX_HEIGHT ? ALLOWED_MAX_HEIGHT : rawMaxHeight;

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef<View>(null);

  const toggleDropDown = () => {
    const toValue = isOpen ? 0 : finalTargetHeight;
    setIsOpen((prev) => !prev);
    Animated.timing(animatedHeight, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const closeDropDown = () => {
    setIsOpen(false);
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOutside = useClickOutside(dropDownRef, closeDropDown, isOpen);

  const toggleSelection = (id: string | null) => {
    if (id === null) {
      // "All" selected -> clear selection
      onChange([]);
      return;
    }

    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const displaySelectedText = () => {
    if (selectedIds.length === 0) return "All Members";
    if (selectedIds.length === 1) {
      return options.find((o) => o.id === selectedIds[0])?.name || placeholder;
    }
    return `${selectedIds.length} members selected`;
  };

  return (
    <View ref={dropDownRef} onTouchStart={handlePressOutside} style={[styles.container, stylesView]}>
      <Pressable onPress={toggleDropDown} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text
            style={[
              Typography.title,
              { color: Theme.textPrimary, fontSize: 16 },
            ]}
          >
            {displaySelectedText()}
          </Text>
          <UpDownIcon active={isOpen} />
        </View>
      </Pressable>

      <Animated.ScrollView
        nestedScrollEnabled={true}
        style={{
          height: animatedHeight,
          overflow: "hidden",
          opacity: animatedHeight.interpolate({
            inputRange: [0, finalTargetHeight || 1],
            outputRange: [0, 1],
          }),
          maxHeight: ALLOWED_MAX_HEIGHT,
          backgroundColor: Theme.surface,
          borderRadius: 8,
          marginTop: isOpen ? Spacing[2] : 0,
          borderWidth: isOpen ? 1 : 0,
          borderColor: Theme.border,
        }}
      >
        {/* All Option */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => toggleSelection(null)}
        >
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, selectedIds.length === 0 && styles.checkboxSelected]}>
              {selectedIds.length === 0 && <View style={styles.checkboxInner} />}
            </View>
            <Text style={styles.itemText}>All Members</Text>
          </View>
        </TouchableOpacity>

        {/* Other Options */}
        {options.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => toggleSelection(item.id)}
            >
              <View style={styles.checkboxContainer}>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <View style={styles.checkboxInner} />}
                </View>
                <Text style={styles.itemText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    marginTop: Spacing[3],
    marginBottom: Spacing[1]
  },
  label: {
    marginBottom: Spacing[2],
    color: Theme.textSecondary,
  },
  card: {
    borderColor: Theme.border || "#E0E0E0",
    borderWidth: 1,
    padding: Spacing[3],
    borderRadius: 8,
    backgroundColor: Theme.surface,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  item: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  itemText: {
    fontSize: 16,
    color: Theme.textPrimary,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.gray[400],
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    borderColor: Theme.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: Theme.primary,
  },
});
