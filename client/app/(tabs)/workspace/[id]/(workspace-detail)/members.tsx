import { Screen } from "@/components/layout/Screen";
import Avatar from "@/components/ui/Avatar";
import WorkspaceService from "@/services/workspace.service";
import { Theme } from "@/theme/theme";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View, Alert, TouchableOpacity, TextInput } from "react-native";
import { WorkspaceMemberRespone } from "@/types/workspace";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Button from "@/components/ui/Button";
import InviteMembers from "@/components/overlays/InviteMembers";
import Icons from "@/components/icons/Icons";

function MemberItem({
  item,
  isCurrentUser,
  currentUserRole,
  onChangeRole,
}: {
  item: WorkspaceMemberRespone;
  isCurrentUser: boolean;
  currentUserRole?: string;
  onChangeRole: (memberId: string, currentRole: string) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing[3],
        paddingVertical: Spacing[3],
        paddingHorizontal: Spacing[4],
        borderBottomWidth: 1,
        borderRadius: 12,
        borderBottomColor: Theme.border,
        backgroundColor: isCurrentUser ? Colors.primary[100] : "transparent",
      }}
    >
      <Avatar name={item.name} size={40} />

      <View style={{ flex: 1 }}>
        <Text
          style={[
            Typography.body,
            { color: Theme.textPrimary, fontWeight: "500" },
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            Typography.caption,
            { color: Theme.textSecondary, marginTop: 2 },
          ]}
        >
          {item.email}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          if (currentUserRole !== "OWNER") {
            Alert.alert("Permission Denied", "Only the OWNER can change member roles.");
            return;
          }
          if (isCurrentUser) {
            Alert.alert("Action Denied", "You cannot change your own role.");
            return;
          }
          onChangeRole(item.id, item.role);
        }}
        style={{
          paddingHorizontal: Spacing[2],
          paddingVertical: 4,
          backgroundColor:
            item.role === "ADMIN" ? Theme.primary : Theme.background,
          borderWidth: item.role === "ADMIN" ? 0 : 1,
          borderColor: Theme.border,
          borderRadius: 4,
        }}
      >
        <Text
          style={[
            Typography.caption,
            {
              color: item.role === "ADMIN" ? "white" : Theme.textSecondary,
              fontWeight: "600",
              fontSize: 10,
            },
          ]}
        >
          {item.role}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function Members() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const [members, setMembers] = useState<WorkspaceMemberRespone[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [isInviteVisible, setIsInviteVisible] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      if (!id) return;
      const data = await WorkspaceService.getWorkspaceMembers(id);

      // Sort current user to the first position
      const sortedData = [...data].sort((a, b) => {
        if (currentUser?.id === a.id) return -1;
        if (currentUser?.id === b.id) return 1;
        return 0;
      });

      setMembers(sortedData);
    } catch (error) {
      console.error("Failed to load workspace members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [id]);

  const handleInvite = async (email: string) => {
    if (!id) return;
    try {
      await WorkspaceService.addWorkspaceMember(id, email);
      fetchMembers();
    } catch (error) {
      console.error("Failed to invite member", error);
    }
  };

  const handleChangeRole = (memberId: string, currentRole: string) => {
    Alert.alert(
      "Change Role",
      `Select a new role for this member:`,
      [
        {
          text: "ADMIN",
          onPress: async () => {
            if (!id || currentRole === "ADMIN") return;
            try {
              await WorkspaceService.updateWorkspaceMemberRole(id, memberId, "ADMIN");
              fetchMembers();
            } catch (error) {
              console.error("Failed to update role", error);
            }
          },
        },
        {
          text: "MEMBER",
          onPress: async () => {
            if (!id || currentRole === "MEMBER") return;
            try {
              await WorkspaceService.updateWorkspaceMemberRole(id, memberId, "MEMBER");
              fetchMembers();
            } catch (error) {
              console.error("Failed to update role", error);
            }
          },
        },
        {
          text: "VIEWER",
          onPress: async () => {
            if (!id || currentRole === "VIEWER") return;
            try {
              await WorkspaceService.updateWorkspaceMemberRole(id, memberId, "VIEWER");
              fetchMembers();
            } catch (error) {
              console.error("Failed to update role", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const currentWorkspaceUser = members.find((m) => m.id === currentUser?.id);
  const currentUserRole = currentWorkspaceUser?.role;

  return (
    <Screen isScroll={false}>
      <View style={{ flex: 1, marginVertical: Spacing[4] }}>
        {loading ? (
          <Text
            style={{
              textAlign: "center",
              marginTop: 40,
              color: Theme.textSecondary,
            }}
          >
            Loading members...
          </Text>
        ) : (
          <FlatList
            data={filteredMembers}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 40,
                  color: Theme.textSecondary,
                }}
              >
                No members found
              </Text>
            }
            renderItem={({ item }) => (
              <MemberItem
                item={item}
                isCurrentUser={currentUser?.id === item.id}
                currentUserRole={currentUserRole}
                onChangeRole={handleChangeRole}
              />
            )}
          />
        )}
      </View>
      {(currentUserRole === "OWNER" || currentUserRole === "ADMIN") && (
        <View style={{ paddingHorizontal: Spacing[4], marginBottom: Spacing[4] }}>
          <Button onPress={() => setIsInviteVisible(true)}>Invite Member</Button>
        </View>
      )}
      <InviteMembers
        visible={isInviteVisible}
        onClose={() => setIsInviteVisible(false)}
        onInvite={handleInvite}
      />
    </Screen>
  );
}
