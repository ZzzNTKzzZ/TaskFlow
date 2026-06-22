import { Text, TouchableOpacity, View, Alert } from "react-native";
import LeftRightIcon from "../icons/LeftRightIcon";
import SymbolIcon, { SymbolColor, SymbolName } from "../icons/SymbolIcon";
import Icons from "../icons/Icons";
import CreateList from "../overlays/CreateList";
import { Theme } from "@/theme/theme";
import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import {
  router,
  useGlobalSearchParams,
} from "expo-router";
import { useState } from "react";
import KebabMenu, { KebabMenuType } from "../overlays/KebabMenu";
import WorkspaceService from "@/modules/workspace/workspace.service";
import BoardService from "@/modules/board/board.service";
import CardService from "@/modules/card/card.service";

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
  
  const { id: searchId, boardId, cardId } = useGlobalSearchParams<{
    id: string;
    boardId: string;
    cardId: string;
  }>();

  const rawId = workspaceId || searchId;
  const id = rawId && rawId !== "undefined" && !rawId.startsWith("(") ? rawId : undefined;

  const handleSelectMenu = (item: KebabMenuType) => {
    if (item === "Create list") {
      setIsCreateListVisible(true)
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
            router.back();
          } else {
            Alert.alert("Error", "Failed to delete card. You might not have permission.");
          }
        }},
      ]);
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
        <Icons name="Search" size={20}/>
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
    </View>
  );
}
