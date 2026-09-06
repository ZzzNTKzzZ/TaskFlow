import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BaseOverlay from "./BaseOverlay";
import Icons, { Icon } from "../icons/Icons";
import { Typography } from "@/theme/typography";
import { Theme } from "@/theme/theme";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";

export type CardSortOption = "DEFAULT" | "DUE_DATE" | "PRIORITY" | "NAME";

interface SortCardsOverlayProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: CardSortOption;
  onSelectSort: (option: CardSortOption) => void;
}

interface SortItem {
  key: CardSortOption;
  title: string;
  subtitle: string;
  icon: Icon;
  iconBg: string;
  iconColor: string;
}

const SORT_OPTIONS: SortItem[] = [
  {
    key: "DEFAULT",
    title: "Default (Manual)",
    subtitle: "Original card order as positioned",
    icon: "BoardManage",
    iconBg: Colors.gray[200],
    iconColor: Colors.gray[600],
  },
  {
    key: "DUE_DATE",
    title: "Due Date (Earliest First)",
    subtitle: "Cards with nearest upcoming deadlines first",
    icon: "Calender",
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
  },
  {
    key: "PRIORITY",
    title: "Priority (Highest First)",
    subtitle: "Urgent ➔ High ➔ Medium ➔ Low",
    icon: "Flash",
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
  },
  {
    key: "NAME",
    title: "Card Name (A - Z)",
    subtitle: "Alphabetical alphabetical order",
    icon: "Sort(A-Z)",
    iconBg: "#E0E7FF",
    iconColor: "#4F46E5",
  },
];

export default function SortCardsOverlay({
  visible,
  onClose,
  selectedSort,
  onSelectSort,
}: SortCardsOverlayProps) {
  const handleSelect = (option: CardSortOption) => {
    onSelectSort(option);
    onClose();
  };

  return (
    <BaseOverlay visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing[2] }}>
          <Icons name="Sort" size={20} color={Theme.primary} />
          <Text style={[Typography.heading, { fontSize: 20, color: Theme.textPrimary }]}>
            Sort Cards
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icons name="Cross" size={20} color={Theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={[Typography.caption, { color: Theme.textSecondary, marginBottom: Spacing[4] }]}>
        Choose how cards inside each list are ordered.
      </Text>

      <View style={{ gap: Spacing[3], paddingBottom: Spacing[6] }}>
        {SORT_OPTIONS.map((item) => {
          const isSelected = selectedSort === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.7}
              onPress={() => handleSelect(item.key)}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
              ]}
            >
              <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                <Icons name={item.icon} size={20} color={item.iconColor} />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.optionTitle,
                    isSelected && { color: Theme.primary, fontWeight: "700" },
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
              </View>

              {isSelected && (
                <View style={styles.checkWrapper}>
                  <Icons name="Checked" size={18} color={Theme.primary} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </BaseOverlay>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing[2],
  },
  closeButton: {
    padding: 4,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing[3],
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Theme.border,
    backgroundColor: Theme.surface,
    gap: Spacing[3],
  },
  optionCardSelected: {
    borderColor: Theme.primary,
    backgroundColor: Colors.primary[100],
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTitle: {
    ...Typography.title,
    fontSize: 15,
    color: Theme.textPrimary,
  },
  optionSubtitle: {
    ...Typography.caption,
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 2,
  },
  checkWrapper: {
    marginLeft: Spacing[2],
  },
});
