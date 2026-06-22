import Icons from "@/components/icons/Icons";
import LeftRightIcon from "@/components/icons/LeftRightIcon";
import { Screen } from "@/components/layout/Screen";
import Avatar from "@/components/ui/Avatar";
import { useCurrentUser } from "@/modules/auth/hook/useCurrentUser";
import WorkspaceService from "@/modules/workspace/workspace.service";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Clipboard, Text, TouchableOpacity, View, Alert } from "react-native";

export default function ProfileSettings() {
  const user = useCurrentUser();
  const [workspaceCount, setWorkspaceCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const list = await WorkspaceService.getWorkspaces(100);
        setWorkspaceCount(list.length);
      } catch (error) {
        console.error("Failed to fetch workspaces for profile statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleCopyId = () => {
    if (user?.id) {
      Clipboard.setString(user.id);
      Alert.alert("Success", "User ID copied to clipboard!");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Screen>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: Spacing[3],
          gap: Spacing[3],
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <LeftRightIcon direction="left" size={32} />
        </TouchableOpacity>
        <Text style={[Typography.heading, { fontSize: 22 }]}>Profile Info</Text>
      </View>

      {/* Profile Card Background Gradient/Modern Style */}
      <View
        style={{
          backgroundColor: Theme.surface,
          borderRadius: 20,
          borderWidth: 1.5,
          borderColor: Theme.border,
          padding: Spacing[5],
          alignItems: "center",
          marginTop: Spacing[3],
          shadowColor: Colors.gray[400],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <View style={{ position: "relative", marginBottom: Spacing[3] }}>
          <Avatar size={90} />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: Theme.primary,
              width: 28,
              height: 28,
              borderRadius: 14,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderColor: Theme.surface,
            }}
          >
            <Icons name="Edit" size={14} color="#FFFFFF" />
          </View>
        </View>

        <Text style={[Typography.heading, { fontSize: 20, marginBottom: Spacing[1] }]}>
          {user?.name || "TaskFlow User"}
        </Text>
        <Text style={[Typography.caption, { fontSize: 14, color: Theme.textSecondary }]}>
          {user?.email}
        </Text>
      </View>

      {/* Account Details Section */}
      <View
        style={{
          marginTop: Spacing[5],
          borderWidth: 1.5,
          borderColor: Theme.border,
          borderRadius: 16,
          padding: Spacing[4],
          gap: Spacing[4],
          backgroundColor: Theme.surface,
        }}
      >
        <Text style={[Typography.title, { fontSize: 16, color: Theme.textPrimary, borderBottomWidth: 1, borderBottomColor: Theme.border, paddingBottom: Spacing[2] }]}>
          Account Details
        </Text>

        {/* Item: Name */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={[Typography.label, { color: Theme.textSecondary }]}>Full Name</Text>
          <Text style={[Typography.title, { fontSize: 15 }]}>{user?.name || "N/A"}</Text>
        </View>

        {/* Item: Email */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={[Typography.label, { color: Theme.textSecondary }]}>Email Address</Text>
          <Text style={[Typography.title, { fontSize: 15 }]}>{user?.email || "N/A"}</Text>
        </View>

        {/* Item: User ID */}
        <TouchableOpacity
          onPress={handleCopyId}
          activeOpacity={0.7}
          style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
        >
          <Text style={[Typography.label, { color: Theme.textSecondary }]}>User ID</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing[1] }}>
            <Text style={[Typography.title, { fontSize: 14, fontFamily: "monospace", color: Theme.primary }]}>
              {user?.id ? `${user.id.slice(0, 8)}...` : "N/A"}
            </Text>
            <Icons name="Search" size={16} color={Theme.primary} />
          </View>
        </TouchableOpacity>

        {/* Item: Created At */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={[Typography.label, { color: Theme.textSecondary }]}>Member Since</Text>
          <Text style={[Typography.title, { fontSize: 15 }]}>
            {formatDate(user?.createdAt)}
          </Text>
        </View>
      </View>

      {/* Account Statistics Section */}
      <View
        style={{
          marginTop: Spacing[5],
          borderWidth: 1.5,
          borderColor: Theme.border,
          borderRadius: 16,
          padding: Spacing[4],
          gap: Spacing[4],
          backgroundColor: Theme.surface,
          marginBottom: Spacing[6],
        }}
      >
        <Text style={[Typography.title, { fontSize: 16, color: Theme.textPrimary, borderBottomWidth: 1, borderBottomColor: Theme.border, paddingBottom: Spacing[2] }]}>
          Workspace Statistics
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: Spacing[2] }}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: Theme.primary }}>
              {loading ? "..." : workspaceCount}
            </Text>
            <Text style={[Typography.caption, { marginTop: Spacing[1] }]}>Workspaces</Text>
          </View>
          <View
            style={{
              width: 1,
              height: 40,
              backgroundColor: Theme.border,
              alignSelf: "center",
            }}
          />
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#10B981" }}>
              Active
            </Text>
            <Text style={[Typography.caption, { marginTop: Spacing[1] }]}>Account Status</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}
