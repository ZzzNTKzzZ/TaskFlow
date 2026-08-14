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
  members?: any[];
  onChangeRole?: (memberId: string, newRole: string) => void;
}

export default function InviteMembers({ visible, onClose, onInvite, members = [], onChangeRole }: InviteMembersProps) {
  const [email, setEmail] = useState<string>("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

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
          Workspace Members
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

      {members && members.length > 0 && (
        <View style={{ marginTop: Spacing[4] }}>
          <Text style={[Typography.title, { fontSize: 16, marginBottom: Spacing[3], color: Theme.textPrimary }]}>
            Current Members
          </Text>
          <View style={{ gap: Spacing[3] }}>
            {members.map((member) => (
              <View
                key={member.id || member.userId}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: Theme.primary,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: Spacing[3],
                    }}
                  >
                    <Text style={{ color: Theme.surface, ...Typography.heading, fontSize: 16 }}>
                      {(member.name || member.email || "U").charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View>
                    <Text style={[Typography.title, { fontSize: 14, color: Theme.textPrimary }]}>
                      {member.name || member.email || "Unknown"}
                    </Text>
                    {member.role && (
                      <Text style={[Typography.caption, { fontSize: 12, color: Theme.textSecondary }]}>
                        {member.role}
                      </Text>
                    )}
                  </View>
                </View>
                
                {onChangeRole && (
                  <View style={{ position: "relative" }}>
                    <TouchableOpacity
                      onPress={() => setSelectedMemberId(selectedMemberId === (member.id || member.userId) ? null : (member.id || member.userId))}
                      style={{ padding: Spacing[2], backgroundColor: Theme.border, borderRadius: 8 }}
                    >
                      <Text style={[Typography.caption, { fontSize: 12, color: Theme.textPrimary }]}>Change Role</Text>
                    </TouchableOpacity>
                    
                    {selectedMemberId === (member.id || member.userId) && (
                      <View style={{
                        position: "absolute",
                        top: 40,
                        right: 0,
                        backgroundColor: Theme.background,
                        borderWidth: 1,
                        borderColor: Theme.border,
                        borderRadius: 8,
                        padding: Spacing[2],
                        zIndex: 100,
                        minWidth: 120,
                      }}>
                        {["ADMIN", "MEMBER", "VIEWER"].map((r) => (
                          <TouchableOpacity
                            key={r}
                            onPress={() => {
                              onChangeRole(member.userId || member.id, r);
                              setSelectedMemberId(null);
                            }}
                            style={{ paddingVertical: Spacing[2], paddingHorizontal: Spacing[3] }}
                          >
                            <Text style={[Typography.body, { color: member.role === r ? Theme.primary : Theme.textPrimary }]}>{r}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}
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