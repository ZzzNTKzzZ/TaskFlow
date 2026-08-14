import React, { ReactNode, useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

// Imports từ hệ thống Component & Icons của bạn
import Icons from "@/components/icons/Icons";
import SymbolIcon, {
  SymbolColor,
  SymbolName,
} from "@/components/icons/SymbolIcon";
import { BackgroundColor } from "@/components/illustrations/BackgroundCard";
import { Screen } from "@/components/layout/Screen";
import SectionCard from "@/components/layout/SectionCard";
import DropDown from "@/components/overlays/DropDown";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// Các Helper & Design Tokens (Theme)
import capitalizeFirstLetter from "@/helper/capitalizeFirstLetter";
import BoardService from "@/services/board.service";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { Visibility } from "@/types/types";

export default function EditBoard() {
  const {
    id: workspaceId,
    boardId,
    parentName,
    workspaceIcon,
    workspaceColor,
  } = useLocalSearchParams<{
    id: string;
    boardId: string;
    parentName: string;
    workspaceIcon: string;
    workspaceColor: string;
  }>();

  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [boardName, setBoardName] = useState<string>("");
  const [background, setBackground] = useState<BackgroundColor>("DeepPrussianBlue");
  const [visibility, setVisibility] = useState<{ id: number; name: Visibility }>({
    id: 1,
    name: "workspace",
  });
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- LOCAL DATA ---
  const backgroundColors: { color: string; name: BackgroundColor }[] = [
    { color: "#002347", name: "DeepPrussianBlue" },
    { color: "#007AFF", name: "Blue" },
    { color: "#34C759", name: "Green" },
    { color: "#FF9500", name: "Orange" },
    { color: "#FF3B30", name: "Red" },
  ];

  const visibilities: { id: number; name: Visibility }[] = [
    { id: 1, name: "workspace" },
    { id: 2, name: "public" },
    { id: 3, name: "private" },
  ];

  // --- FETCH EXISTING BOARD DATA ---
  useEffect(() => {
    const loadBoardData = async () => {
      if (!boardId) return;
      try {
        setLoading(true);
        const board = await BoardService.getBoard(boardId);
        if (board) {
          setBoardName(board.name);
          if (board.background) {
            setBackground(board.background as BackgroundColor);
          }
          const matchedVis = visibilities.find((v) => v.name === board.visibility);
          if (matchedVis) {
            setVisibility(matchedVis);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin Board:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBoardData();
  }, [boardId]);

  const handleUpdate = async () => {
    if (!boardName.trim()) {
      setHasError(true);
      setErrorMessage("Board name is required");
      return;
    }
    setHasError(false);
    setErrorMessage(null);

    try {
      setLoading(true);
      const updated = await BoardService.updateBoard(boardId!, {
        name: boardName.trim(),
        visibility: visibility.name,
        background,
      });

      if (updated) {
        // Phát sự kiện cập nhật để các màn hình khác (như danh sách Board) đồng bộ
        try {
          const eventBus = await import("@/services/eventBus");
          eventBus.emit("board:updated", updated);
        } catch (e) {}

        // Quay lại màn hình Board Detail với các thông tin đã cập nhật mới nhất
        router.replace({
          pathname: "/(tabs)/workspace/[id]/[boardId]/(board-detail)",
          params: {
            id: workspaceId,
            boardId: boardId,
            name: updated.name,
            parentName: parentName || "",
            workspaceIcon: workspaceIcon || "",
            workspaceColor: workspaceColor || "",
            refresh: Date.now().toString(),
          },
        });
      } else {
        alert("Failed to update board. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật board:", error);
      alert("An error occurred while updating the board.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Screen isScroll={false}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={Theme.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen isScroll={false}>
      {/* 1. HEADER SECTION */}
      <View
        style={{
          marginTop: Spacing[2],
          marginBottom: Spacing[4],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <TouchableOpacity
          style={{ position: "absolute", left: 0 }}
          onPress={() => router.back()}
        >
          <Icons name="Cross" size={24} />
        </TouchableOpacity>
        <Text style={[Typography.heading, { fontSize: 28 }]}>Edit Board</Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "column" }}>
          {/* WORKSPACE PREVIEW (READ-ONLY) */}
          <SectionCard
            style={{
              paddingTop: Spacing[4],
              paddingHorizontal: Spacing[4],
              marginBottom: Spacing[4],
              backgroundColor: Theme.card,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing[3], paddingBottom: Spacing[2] }}>
              <SymbolIcon
                name={(workspaceIcon as SymbolName) || "Company"}
                size={28}
                color={(workspaceColor as SymbolColor) || "Primary"}
              />
              <View>
                <Text style={[Typography.caption]}>Workspace</Text>
                <Text style={[Typography.subtitle, { fontSize: 16 }]}>{parentName || "Workspace"}</Text>
              </View>
            </View>
          </SectionCard>

          {/* BOARD NAME INPUT */}
          <View style={{ marginBottom: Spacing[4] }}>
            <Input
              label="Board name"
              placeholder="e.g. Q2 Campaign"
              value={boardName}
              setValue={(val) => {
                setBoardName(val);
                if (val.trim()) {
                  setHasError(false);
                  setErrorMessage(null);
                }
              }}
              error={hasError}
              stylesLabel={[
                Typography.title,
                {
                  color: hasError ? Theme.error : Theme.textPrimary,
                  marginBottom: Spacing[2],
                  fontSize: 16,
                },
              ]}
            />
            {hasError && errorMessage && (
              <Text style={{ color: Theme.error, marginTop: -Spacing[3], marginBottom: Spacing[3], fontSize: 14 }}>
                {errorMessage}
              </Text>
            )}
          </View>

          {/* VISIBILITY SELECTION */}
          <View style={{ marginBottom: Spacing[4] }}>
            <Text
              style={[
                Typography.title,
                {
                  color: Theme.textPrimary,
                  marginBottom: Spacing[2],
                  fontSize: 16,
                },
              ]}
            >
              Visibility
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 16,
                paddingVertical: Spacing[3],
                paddingHorizontal: Spacing[4],
                borderColor: Theme.border,
              }}
            >
              <DropDown
                variant="card"
                selected={capitalizeFirstLetter(visibility.name)}
                setSelected={setVisibility}
                options={visibilities}
                stylesText={{
                  color: Theme.textPrimary,
                  marginBottom: Spacing[2],
                  fontSize: 16,
                }}
                renderItem={(o) => (
                  <View
                    style={{
                      paddingVertical: Spacing[2],
                      borderRadius: 12,
                      paddingHorizontal: Spacing[3],
                      justifyContent: "center",
                      borderBottomColor: Theme.border,
                      backgroundColor:
                        o.name === visibility.name
                          ? Colors.primary[200]
                          : "transparent",
                      overflow: "hidden",
                    }}
                  >
                    <Text
                      style={[
                        Typography.title,
                        {
                          fontSize: 16,
                          color: Theme.textPrimary,
                        },
                      ]}
                    >
                      {capitalizeFirstLetter(o.name)}
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>

          {/* BACKGROUND SELECTION */}
          <View style={{ marginBottom: Spacing[4] }}>
            <Text
              style={[
                Typography.title,
                {
                  color: Theme.textPrimary,
                  marginBottom: Spacing[3],
                  fontSize: 16,
                },
              ]}
            >
              Background (optional)
            </Text>
            <View style={{ flexDirection: "row", gap: Spacing[3] }}>
              {backgroundColors.map((b) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setBackground(b.name)}
                  key={b.name}
                  style={{
                    backgroundColor: b.color,
                    width: 50,
                    aspectRatio: 1,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {b.name === background && (
                    <View
                      style={{
                        paddingHorizontal: Spacing[2],
                        backgroundColor: Theme.surface,
                        aspectRatio: 1,
                        borderRadius: 100,
                        overflow: "hidden",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Icons name="Checked" color={Theme.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* FOOTER BUTTONS */}
      <View style={{ paddingTop: Spacing[2], marginBottom: Spacing[4] }}>
        <Button onPress={handleUpdate} style={{ marginBottom: Spacing[3] }}>
          Save Changes
        </Button>
        <Button
          type="ghost"
          onPress={() => router.back()}
          styleText={{ color: Colors.primary[700] }}
        >
          Cancel
        </Button>
      </View>
    </Screen>
  );
}
