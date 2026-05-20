import React, { ReactNode, useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
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
import CardDropDown from "@/components/workspaces/CardDropDown";

// Các Helper & Design Tokens (Theme)
import capitalizeFirstLetter from "@/helper/capitalizeFirstLetter";
import { WorkspaceCard } from "@/modules/workspace/workspace";
import WorkspaceService from "@/modules/workspace/workspace.service";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { Visibility } from "@/types/type";

export default function Create() {
  // --- STATE MANAGEMENT ---
  const [selected, setSelected] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });

  const [background, setBackground] =
    useState<BackgroundColor>("DeepPrussianBlue");
  const [visibility, setVisibility] = useState<{
    id: number;
    name: Visibility;
  }>({
    id: 1,
    name: "workspace",
  });
  const [boardName, setBoardName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<WorkspaceCard[]>([]);

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

  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  // --- SIDE EFFECTS (API CALL) ---
  useEffect(() => {
    const initWorkspaces = async () => {
      try {
        setLoading(true);
        const list = await WorkspaceService.getWorkspaces();
        setWorkspaces(list);

        if (list.length > 0) {
          setSelected({
            id: id || list[0].id,
            name: name || list[0].name,
          });
        }
      } catch (error) {
        console.error("Lỗi khởi tạo Workspace:", error);
      } finally {
        setLoading(false);
      }
    };
    initWorkspaces();
  }, []);

  if (loading) return <Text>Loading...</Text>;

  const handleCreate = async (payload: {
    workspaceId: string;
    name: string;
    visibility: Visibility;
    background: BackgroundColor;
  }) => {
    try {
       await WorkspaceService.createWorkspaceBoard(payload);
    } catch (error) {
      console.error("Lỗi khi tạo board", error)
    } finally {
      router.back()
    }
  };

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
        <Text style={[Typography.heading, { fontSize: 28 }]}>Create Board</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "column" }}>
          {workspaces && workspaces.length > 0 && (
            <SectionCard
              style={{
                paddingTop: Spacing[4],
                paddingHorizontal: Spacing[4],
                marginBottom: Spacing[4],
              }}
            >
              <DropDown
                icon={((): ReactNode => {
                  const ws =
                    workspaces.find((w) => w.id === selected.id) ??
                    workspaces[0];
                  return (
                    <SymbolIcon
                      name={ws?.icon as SymbolName}
                      size={28}
                      color={ws?.color as SymbolColor}
                    />
                  );
                })()}
                label="Workspace:"
                selected={selected.name}
                setSelected={setSelected}
                options={workspaces}
                renderItem={(item) => (
                  <CardDropDown
                    icon={
                      <SymbolIcon
                        name={item.icon}
                        size={28}
                        color={item.color}
                      />
                    }
                    name={item.name}
                    memberSize={item.memberCount}
                    role={item.role}
                    selected={selected.id === item.id}
                  />
                )}
              />
            </SectionCard>
          )}

          {/* BOARD NAME INPUT */}
          <View style={{ marginBottom: Spacing[4] }}>
            <Input
              label="Board name"
              placeholder="e.g. Q2 Campaign"
              value={boardName}
              setValue={setBoardName}
              stylesLabel={[
                Typography.title,
                {
                  color: Theme.textPrimary,
                  marginBottom: Spacing[2],
                  fontSize: 16,
                },
              ]}
            />
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
                        o.name === selected.name
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
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  backgroundColor: Colors.gray[100],
                  width: 50,
                  aspectRatio: 1,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icons name="KebabH" color={Theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={{ paddingTop: Spacing[2], marginBottom: Spacing[4] }}>
        <Button onPress={() => handleCreate({ workspaceId: selected.id, name: boardName, visibility: visibility.name,background  })} style={{ marginBottom: Spacing[3] }}>
          Create Board
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
