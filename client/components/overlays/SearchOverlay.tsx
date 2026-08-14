import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import BaseOverlay from "./BaseOverlay";
import Icons from "../icons/Icons";
import { Typography } from "@/theme/typography";
import { Theme } from "@/theme/theme";
import { Spacing } from "@/theme/spacing";
import Input from "../ui/Input";

interface SearchOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ visible, onClose }: SearchOverlayProps) {
  const [search, setSearch] = useState("");

  return (
    <BaseOverlay visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={[Typography.heading, { fontSize: 20, color: Theme.textPrimary }]}>
          Search
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icons name="Cross" size={20} color={Theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: Spacing[4] }}>
        <Input
          placeholder="Search for boards, cards, etc."
          value={search}
          setValue={setSearch}
        />
      </View>

      <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
        {search.length > 0 ? (
          <View style={{ paddingVertical: Spacing[4], alignItems: "center" }}>
            <Text style={[Typography.body, { color: Theme.textSecondary }]}>
              Search feature is currently under development.
            </Text>
            <Text style={[Typography.caption, { color: Theme.textSecondary, marginTop: 8 }]}>
              Global search API is required.
            </Text>
          </View>
        ) : (
          <View style={{ paddingVertical: Spacing[4], alignItems: "center" }}>
            <Icons name="Search" size={40} color={Theme.border} />
            <Text style={[Typography.body, { color: Theme.textSecondary, marginTop: Spacing[2] }]}>
              Type to start searching...
            </Text>
          </View>
        )}
      </ScrollView>
    </BaseOverlay>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
});
