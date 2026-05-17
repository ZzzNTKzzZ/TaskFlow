import { ReactNode, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
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
import capitalizeFirstLetter from "@/helper/capitalizeFirstLetter";

interface Option {
  id: string | number;
  name: string;
  icon?: ReactNode;
}

type DropDownVariant = "inline" | "card";

interface DropDownProps<T extends Option> {
  options: T[];
  selected: string;
  setSelected: (item: T) => void;
  label?: string;

  icon?: ReactNode;
  renderItem?: (item: T) => ReactNode;

  stylesText?: StyleProp<TextStyle>;
  stylesView?: StyleProp<ViewStyle>;

  variant?: DropDownVariant;

  optionHeight?: number;
  cardStyle?: StyleProp<ViewStyle>;
}

export default function DropDown<T extends Option>({
  options,
  selected,
  setSelected,
  label,
  icon,
  renderItem,
  stylesText,
  stylesView,
  variant = "inline",
  optionHeight,
  cardStyle,
}: DropDownProps<T>) {
  const itemHeight = optionHeight ?? 56;

  const maxHeight = itemHeight * options.length;

  const animatedHeight = useRef(new Animated.Value(0)).current;
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
  const closeDropDown = () => {
    setIsOpen(false);

    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSelected = (item: T) => {
    setSelected(item);
    closeDropDown();
  };

  const handlePressOutside = useClickOutside(
    dropDownRef,
    closeDropDown,
    isOpen,
  );

  const renderInline = () => (
    <>
      <View style={styles.inlineHeader}>
        <View style={styles.left}>
          {icon}

          <View style={styles.row}>
            <Text
              numberOfLines={1}
              style={[Typography.title, styles.label, stylesText]}
            >
              {label}
            </Text>

            {!isOpen && (
              <Text
                style={[
                  Typography.title,
                  {
                    fontSize: 14,
                    color: Colors.primary[700],
                  },
                ]}
              >
                {selected}
              </Text>
            )}
          </View>
        </View>

        <UpDownIcon active={isOpen} />
      </View>

      <Animated.View
        style={{
          height: animatedHeight,
          overflow: "hidden",
          opacity: animatedHeight.interpolate({
            inputRange: [0, maxHeight],
            outputRange: [0, 1],
          }),
          gap: Spacing[2],
          marginBottom: isOpen ? Spacing[4] : 0,
        }}
      >
        {options.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => handleSelected(item)}>
            {renderItem ? (
              renderItem(item)
            ) : (
              <View>
                {item.icon}
                <Text>{capitalizeFirstLetter(item.name)}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </>
  );

  const renderCard = () => (
    <>
      {label && <Text style={[Typography.title, styles.label, stylesText]}>{label}</Text>}

      <Pressable onPress={toggleDropDown} style={[styles.card, cardStyle]}>
        <View style={styles.cardHeader}>
          <Text
            style={[
              Typography.title,
              {
                color: Theme.textPrimary,
                fontSize: 16,
              },
            ]}
          >
            {selected}
          </Text>
          <UpDownIcon active={isOpen} />
        </View>
      </Pressable>

      <Animated.View
        style={{
          height: animatedHeight,
          overflow: "hidden",
          opacity: animatedHeight.interpolate({
            inputRange: [0, maxHeight],
            outputRange: [0, 1],
          }),
        }}
      >
        {options.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{
              minHeight: itemHeight,
              justifyContent: "center",
            }}
            onPress={() => handleSelected(item)}
          >
            {renderItem ? renderItem(item) : <Text>{capitalizeFirstLetter(item.name)}</Text>}
          </TouchableOpacity>
        ))}
      </Animated.View>
    </>
  );

  return (
    <View
      ref={dropDownRef}
      onTouchStart={handlePressOutside}
      style={[styles.container, stylesView]}
    >
      {variant === "card" ? (
        renderCard()
      ) : (
        <Pressable onPress={toggleDropDown}>{renderInline()}</Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },

  inlineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[4],
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[4],
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
  },

  label: {
    fontSize: 14,
    color: Theme.textSecondary,
  },

  card: {
    backgroundColor: Theme.background,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

});
