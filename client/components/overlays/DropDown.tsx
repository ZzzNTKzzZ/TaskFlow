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
  disable?: boolean;
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
  disable = false,
}: DropDownProps<T>) {
  const itemHeight = optionHeight ?? 56;
  const rawMaxHeight = itemHeight * options.length;
  
  // 🌟 GIẢI PHÁP: Giới hạn mốc chiều cao thực tế mà Dropdown được phép mở ra
  const ALLOWED_MAX_HEIGHT = 220;
  const finalTargetHeight = rawMaxHeight >= ALLOWED_MAX_HEIGHT ? ALLOWED_MAX_HEIGHT : rawMaxHeight;

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef<View>(null);

  const toggleDropDown = () => {
    if (disable) return;
    
    // Đồng bộ toValue chạy đúng đến điểm giới hạn, không chạy thừa thãi
    const toValue = isOpen ? 0 : finalTargetHeight;

    setIsOpen((prev) => !prev);

    Animated.timing(animatedHeight, {
      toValue,
      duration: 250, // 250ms cho cảm giác mượt mà và nhạy hơn
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

      <Animated.ScrollView
        nestedScrollEnabled={true} // Cho phép cuộn mượt bên trong BottomSheet cha
        style={{
          height: animatedHeight,
          overflow: "hidden",
          opacity: animatedHeight.interpolate({
            inputRange: [0, finalTargetHeight || 1], // Tránh chia cho số 0 nếu mảng rỗng
            outputRange: [0, 1],
          }),
          marginBottom: isOpen ? Spacing[4] : 0,
          maxHeight: ALLOWED_MAX_HEIGHT,
        }}
        contentContainerStyle={{ gap: Spacing[2] }}
      >
        {options.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => handleSelected(item)}>
            {renderItem ? (
              renderItem(item)
            ) : (
              <View style={{ height: itemHeight, justifyContent: "center" }}>
                {item.icon}
                <Text>{capitalizeFirstLetter(item.name)}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
    </>
  );

  const renderCard = () => (
    <>
      {label && <Text style={[Typography.title, styles.label, stylesText]}>{label}</Text>}

      <Pressable onPress={toggleDropDown} style={[styles.card, cardStyle, disable && styles.disabledCard]}>
        <View style={styles.cardHeader}>
          <Text
            style={[
              Typography.title,
              {
                color: disable ? Theme.textSecondary : Theme.textPrimary,
                fontSize: 16,
              },
            ]}
          >
            {selected || "Select an option"}
          </Text>
          {!disable && <UpDownIcon active={isOpen} />}
        </View>
      </Pressable>

      <Animated.ScrollView
        nestedScrollEnabled={true} // Ngăn chặn xung đột cuộn
        style={{
          height: animatedHeight,
          overflow: "hidden",
          opacity: animatedHeight.interpolate({
            inputRange: [0, finalTargetHeight || 1],
            outputRange: [0, 1],
          }),
          maxHeight: ALLOWED_MAX_HEIGHT,
          backgroundColor: "#FAFAFA", // Thêm màu nền nhẹ để phân biệt vùng danh sách xổ xuống
          borderRadius: 8,
          marginTop: isOpen ? Spacing[2] : 0,
        }}
      >
        {options.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{
              minHeight: itemHeight,
              justifyContent: "center",
              paddingHorizontal: Spacing[3],
            }}
            onPress={() => handleSelected(item)}
          >
            {renderItem ? renderItem(item) : <Text>{capitalizeFirstLetter(item.name)}</Text>}
          </TouchableOpacity>
        ))}
      </Animated.ScrollView>
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
        <Pressable onPress={toggleDropDown} disabled={disable}>
          {renderInline()}
        </Pressable>
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
    marginBottom: Spacing[2],
  },
  card: {
    borderColor: Theme.border || "#E0E0E0",
    padding: Spacing[3],
    borderRadius: 8,
  },
  disabledCard: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});