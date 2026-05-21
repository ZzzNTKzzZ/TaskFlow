import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Input from "@/components/ui/Input"; 
import Button from "@/components/ui/Button"; 
import Icons from "@/components/icons/Icons"; 
import { Typography } from "@/theme/typography";
import { Theme } from "@/theme/theme";
import { Spacing } from "@/theme/spacing";
import BaseOverlay from "./BaseOverlay";

interface InviteMembersProps {
  visible: boolean;
  onClose: () => void;
  onInvite: (email: string) => void;
}

export default function InviteMembers({ visible, onClose, onInvite }: InviteMembersProps) {
  const [email, setEmail] = useState<string>("");

  const handleInvite = () => {
    if (email.trim()) {
      onInvite(email.trim());
      setEmail(""); 
      onClose(); 
    }
  };

  return (
    <BaseOverlay visible={visible} onClose={onClose}>
      {/* Header của Overlay */}
      <View style={styles.header}>
        <Text style={[Typography.heading, { fontSize: 20, color: Theme.textPrimary }]}>
          Invite Members
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icons name="Cross" size={20} color={Theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={[Typography.body, styles.subTitle]}>
        Want to collaborate? Type their email below to send an invitation link to this project.
      </Text>

      {/* Ô Nhập Email */}
      <View style={{ marginBottom: Spacing[4] }}>
        <Input
          label="Email address"
          placeholder="e.g. alex@acme.com"
          value={email}
          setValue={setEmail}
          stylesLabel={[
            Typography.title,
            { fontSize: 14, color: Theme.textPrimary, marginBottom: Spacing[1] },
          ]}
        />
      </View>

      {/* Nút hành động */}
      <Button onPress={handleInvite} disable={!email.trim()}>
        Send Invitation
      </Button>
    </BaseOverlay>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Đã sửa lỗi ở đây từ "between" thành "space-between"
    position: "relative",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 20,
    lineHeight: 20,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    padding: 4,
  },
});