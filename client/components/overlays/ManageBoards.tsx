import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from "react-native";
import BaseOverlay from "./BaseOverlay";
import Icons from "../icons/Icons";
import { Typography } from "@/theme/typography";
import { Theme } from "@/theme/theme";
import { Spacing } from "@/theme/spacing";
import WorkspaceService from "@/services/workspace.service";
import BoardService from "@/services/board.service";
import { BoardCardUI } from "@/types/board";
import Input from "../ui/Input";
import { router } from "expo-router";
import { Colors } from "@/theme/colors";

interface ManageBoardsProps {
  visible: boolean;
  onClose: () => void;
  workspaceId: string;
}

export default function ManageBoards({ visible, onClose, workspaceId }: ManageBoardsProps) {
  const [boards, setBoards] = useState<BoardCardUI[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && workspaceId) {
      loadBoards();
    }
  }, [visible, workspaceId]);

  const loadBoards = async () => {
    setLoading(true);
    try {
      const data = await WorkspaceService.getWorkspaceBoards(workspaceId);
      setBoards(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleDelete = (board: BoardCardUI) => {
    Alert.alert("Delete Board", `Are you sure you want to delete "${board.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await BoardService.deleteBoard(board.id);
          if (success) {
            setBoards((prev) => prev.filter((b) => b.id !== board.id));
            try {
              const eventBus = await import("@/services/eventBus");
              eventBus.default.emit("board:deleting", board.id);
            } catch (e) {}
          } else {
            Alert.alert("Error", "Failed to delete board. You might not have permission.");
          }
        },
      },
    ]);
  };

  const handleNavigate = (board: BoardCardUI) => {
    onClose();
    router.push({
      pathname: `/(tabs)/workspace/${workspaceId}/${board.id}/(board-detail)`,
      params: { id: workspaceId, boardId: board.id }
    });
  };

  const filteredBoards = boards.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <BaseOverlay visible={visible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={[Typography.heading, { fontSize: 20, color: Theme.textPrimary }]}>
          Manage Boards
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icons name="Cross" size={20} color={Theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: Spacing[4] }}>
        <Input
          placeholder="Search boards..."
          value={search}
          setValue={setSearch}
        />
      </View>

      {loading ? (
        <Text style={[Typography.body, { textAlign: "center", marginVertical: Spacing[4] }]}>
          Loading boards...
        </Text>
      ) : (
        <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
          {filteredBoards.length === 0 ? (
            <Text style={[Typography.body, { textAlign: "center", marginVertical: Spacing[4], color: Theme.textSecondary }]}>
              No boards found.
            </Text>
          ) : (
            filteredBoards.map((board) => (
              <View
                key={board.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: Spacing[3],
                  borderBottomWidth: 1,
                  borderBottomColor: Theme.border,
                }}
              >
                <TouchableOpacity
                  style={{ flex: 1, paddingRight: Spacing[3] }}
                  onPress={() => handleNavigate(board)}
                >
                  <Text style={[Typography.title, { fontSize: 16, color: Theme.textPrimary }]}>
                    {board.name}
                  </Text>
                  <Text style={[Typography.caption, { fontSize: 12, color: Theme.textSecondary, marginTop: Spacing[1] }]}>
                    {board.listCount} Lists • {board.cardCount} Cards
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(board)}
                  style={{ padding: Spacing[2], backgroundColor: Colors.error[50], borderRadius: 8 }}
                >
                  <Icons name="Trash" size={20} color={Theme.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
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
