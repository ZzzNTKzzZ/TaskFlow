import { Text, TouchableOpacity, View, Alert } from "react-native";
import LeftRightIcon from "../icons/LeftRightIcon";
import SymbolIcon, { SymbolColor, SymbolName } from "../icons/SymbolIcon";
import Icons from "../icons/Icons";
import CreateList from "../overlays/CreateList";
import MoveCard from "../overlays/MoveCard";
import InviteMembers from "../overlays/InviteMembers";
import ManageBoards from "../overlays/ManageBoards";
import SearchOverlay from "../overlays/SearchOverlay";
import { Theme } from "@/theme/theme";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import {
  router,
  useGlobalSearchParams,
} from "expo-router";
import { useState } from "react";
import KebabMenu, { KebabMenuType } from "../overlays/KebabMenu";
import WorkspaceService from "@/services/workspace.service";
import BoardService from "@/services/board.service";
import CardService from "@/services/card.service";

export default function TopBar({
  name,
  icon,
  color,
  parentName,
  workspaceId,
  menu = [],
  onBack = () => router.back(),
}: {
  name: string;
  icon?: SymbolName;
  color?: SymbolColor;
  parentName?: string;
  workspaceId?: string;
  onBack?: () => void
  menu: KebabMenuType[]
}) {

  const [active, setActive] = useState<boolean>(false)
  const [isCreateListVisible, setIsCreateListVisible] = useState(false)
  const [isMoveCardVisible, setIsMoveCardVisible] = useState(false)
  const [isInviteMembersVisible, setIsInviteMembersVisible] = useState(false)
  const [isManageBoardsVisible, setIsManageBoardsVisible] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [members, setMembers] = useState<any[]>([])
  
  const { id: searchId, boardId, cardId } = useGlobalSearchParams<{
    id: string;
    boardId: string;
    cardId: string;
  }>();

  const rawId = workspaceId || searchId;
  const id = rawId && rawId !== "undefined" && !rawId.startsWith("(") ? rawId : undefined;

  const handleSelectMenu = async (item: KebabMenuType) => {
    if (item === "Create list") {
      setIsCreateListVisible(true)
    }
    if (item === "Members" || item === "Change role" || item === "Invite members") {
      setIsInviteMembersVisible(true)
      if (id) {
        try {
          const workspaceMembers = await WorkspaceService.getWorkspaceMembers(id);
          // Only show users, filter out OWNER
          setMembers(workspaceMembers?.filter((m: any) => m.role !== "OWNER") || []);
        } catch (e) {
          console.error("Failed to fetch workspace members", e);
        }
      }
    }
    if(item === "Create board") {
      router.navigate("/(board)/create")
    }
    if(item === "Edit card") {
      router.push({
        pathname: "/(card)/edit",
        params: { id, boardId, cardId }
      });
    }

    if(item === "Move card") {
      setIsMoveCardVisible(true)
    }

    if (item === "Board settings") {
      router.push({
        pathname: "/(board)/edit",
        params: {
          id,
          boardId,
          name,
          parentName,
          workspaceIcon: icon,
          workspaceColor: color,
        },
      });
    }
    if (item === "Delete workspace") {
      Alert.alert("Delete Workspace", "Are you sure you want to delete this workspace?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
          if (!id) return;
          const success = await WorkspaceService.deleteWorkspace(id);
          if (success) {
            try {
              const eventBus = await import("@/services/eventBus");
              eventBus.emit("workspace:deleted", id);
            } catch (e) {}
            router.replace("/(tabs)/" as any);
          } else {
            Alert.alert("Error", "Failed to delete workspace. You might not have permission.");
          }
        }},
      ]);
    }

    if (item === "Delete board") {
      Alert.alert("Delete Board", "Are you sure you want to delete this board?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
          if (!boardId) return;
          try {
            const eventBus = await import("@/services/eventBus");
            eventBus.emit("board:deleting", boardId);
          } catch (e) {}
          const success = await BoardService.deleteBoard(boardId);
          if (success) {
            if (id) {
              router.replace({
                pathname: `/(tabs)/workspace/${id}/(workspace-detail)`,
                params: {
                  id,
                  name: parentName || "",
                  icon: icon || "",
                  color: color || "",
                },
              } as any);
            } else {
              router.replace("/(tabs)/" as any);
            }
          } else {
            Alert.alert("Error", "Failed to delete board. You might not have permission.");
          }
        }},
      ]);
    }

    if (item === "Delete card") {
      Alert.alert("Delete Card", "Are you sure you want to delete this card?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
          if (!boardId || !cardId) return;
          const success = await CardService.deleteCard(boardId, cardId);
          if (success) {
            const eventBus = await import("@/services/eventBus");
            eventBus.default.emit("card:deleted", cardId);
            router.back();
          } else {
            Alert.alert("Error", "Failed to delete card. You might not have permission.");
          }
        }},
      ]);
    }
    if (item === "Workspace settings") {
      if (id) {
        router.push({
          pathname: "/(workspace)/edit",
          params: { id, name, workspaceIcon: icon, workspaceColor: color }
        });
      }
    }

    if (item === "Manage boards") {
      setIsManageBoardsVisible(true)
    }

    if (item === "Leave workspace") {
      Alert.alert("Leave Workspace", "Are you sure you want to leave this workspace?", [
        { text: "Cancel", style: "cancel" },
        { text: "Leave", style: "destructive", onPress: async () => {
          if (!id) return;
          const { useAuthStore } = await import("@/store/auth.store");
          const userId = useAuthStore.getState().user?.id;
          if (!userId) return;
          const success = await WorkspaceService.removeWorkspaceMember(id, userId);
          if (success) {
            try {
              const eventBus = await import("@/services/eventBus");
              eventBus.default.emit("workspace:deleted", id);
            } catch (e) {}
            router.replace("/(tabs)/" as any);
          } else {
            Alert.alert("Error", "Failed to leave workspace.");
          }
        }},
      ]);
    }

    if (item === "Join board") {
      Alert.alert("Join Board", "Feature coming soon.");
    }
    
    if (item === "Sort") {
      try {
        import("@/services/eventBus").then((eventBus) => {
          eventBus.default.emit("board:open_sort");
        });
      } catch (e) {
        console.error("Failed to emit board:open_sort", e);
      }
    }

    if (item === "Help & feedback") {
      Alert.alert("Help & feedback", "Contact support@taskflow.com");
    }
  }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Theme.background,
        paddingVertical: Spacing[3],
        paddingHorizontal: Spacing[4],
      }}
    >
      <View
        style={{ flexDirection: "row", gap: Spacing[2], alignItems: "center" }}
      >
        <TouchableOpacity onPress={onBack}>
          <LeftRightIcon direction="left" size={32} />
        </TouchableOpacity>
        {icon && (
          <SymbolIcon name={icon as SymbolName} color={color as SymbolColor} />
        )}
        <View>

        <Text numberOfLines={1} style={[Typography.heading, { fontSize: 20, maxWidth: 200 }]}>{name}</Text>
        {parentName && <Text style={[Typography.caption ,{fontSize: 12}]}>{parentName}</Text>}
        </View>
      </View>
      <View style={{flexDirection: "row", gap: Spacing[3], alignItems: "center"}}>
        <TouchableOpacity onPress={() => setIsSearchVisible(true)}>
          <Icons name="Search" size={20}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {setActive(true)}}>
          <Icons name="KebabV" size={20}/>
        </TouchableOpacity>
      </View>
      <KebabMenu
        visible={active}
        onClose={() => setActive(false)}
        menu={menu}
        onSelectMenu={handleSelectMenu}
      />
      <CreateList
        visible={isCreateListVisible}
        onClose={() => setIsCreateListVisible(false)}
      />
      <MoveCard
        visible={isMoveCardVisible}
        onClose={() => setIsMoveCardVisible(false)}
        boardId={boardId}
        cardId={cardId}
      />
      <InviteMembers
        visible={isInviteMembersVisible}
        onClose={() => setIsInviteMembersVisible(false)}
        members={members}
        onChangeRole={async (memberId, newRole) => {
          if (id) {
            try {
              const res = await WorkspaceService.updateWorkspaceMemberRole(id, memberId, newRole);
              if (res) {
                // Refresh members list and filter
                const workspaceMembers = await WorkspaceService.getWorkspaceMembers(id);
                setMembers(workspaceMembers?.filter((m: any) => m.role !== "OWNER") || []);
              } else {
                Alert.alert("Error", "Failed to update role. You might not have permission.");
              }
            } catch (e) {
              Alert.alert("Error", "Failed to update role.");
            }
          }
        }}
        onInvite={async (email) => {
          if (id) {
            try {
              await WorkspaceService.addWorkspaceMember(id, email);
              Alert.alert("Success", "Invitation sent to " + email);
              // Refresh members list and filter again
              const workspaceMembers = await WorkspaceService.getWorkspaceMembers(id);
              setMembers(workspaceMembers?.filter((m: any) => m.role !== "OWNER") || []);
            } catch (e) {
              Alert.alert("Error", "Failed to invite member.");
            }
          } else {
            Alert.alert("Error", "Workspace not found.");
          }
        }}
      />
      {id && (
        <ManageBoards
          visible={isManageBoardsVisible}
          onClose={() => setIsManageBoardsVisible(false)}
          workspaceId={id}
        />
      )}
      <SearchOverlay
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />
    </View>
  );
}
