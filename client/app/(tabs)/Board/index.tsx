import React, { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import Header from "@/components/layout/Header";
import { deleteBoardApi, getBoardByWorkspaceIdApi } from "@/service/board.service";
import { globalStyles } from "@/styles/global";
import { Colors, Rounded, Spacing, Typography } from "@/theme";
import EmptyBoard from "@/assets/icons/EmptyBoard.svg";
import Button from "@/components/Button";
import { AppIcon } from "@/components/ui/AppIcon";
import FAB from "@/components/ui/FAB";
import { Visibility } from "@/Types/enum";
import { BlurView } from "expo-blur";

// Types & Constants
const BOARD_OPTIONS = [
  { name: "Filter", icon: "Filter" },
  { name: "Sort", icon: "Sort" },
] as const;

type BoardProps = {
  id: string;
  title: string;
  background?: string;
  visibility: Visibility;
  workspaceId: string;
  position: number;
  createdAt: Date;
};

export default function Board() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BoardProps[]>([]);
  const { workspaceId, name } = useLocalSearchParams();
  const [selectedBoard, setSelectedBoard] = useState<BoardProps | null>(null)
  const [visible, setVisible] = useState(false)

  const loadBoardData = useCallback(async () => {
    if (!workspaceId) return;
    try {
      setLoading(true);
      const res = await getBoardByWorkspaceIdApi(workspaceId as string);
      setData(res);
    } catch (error) {
      console.error("Failed to load board data:", error);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useFocusEffect(
    useCallback(() => {
      loadBoardData();
    }, [])
  );

  const handleDeleteBoard = async (id: string) => {
    try {
      const response = await deleteBoardApi(id)
      if(response.success) {
        alert("Xóa board thành công")
        setVisible(false)
        setSelectedBoard(null)
        setData((prevData) => prevData.filter(board => board.id !== id))
      }
      console.log(id)
    } catch (error) {
      console.error("Lỗi API",error)
    }
  }
  const handleLongPress = (board: BoardProps) => {
    setSelectedBoard(board)
    setVisible(true)
  }

  const handleCreateBoard = () => {
    router.push(`/Board/Create?workspaceId=${workspaceId}`);
  };
  const handleOpenBoard = (boardId: string, name: string) => {
    router.push(`/Board/Task?boardId=${boardId}&name=${name}`)
  }
  if (loading) {
    return (
      <View style={[globalStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const renderBoards = () => (
    <View>
      <Modal visible={visible} 
      transparent={true}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
      >
         <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
                    <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
                      <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                          Board: {selectedBoard?.title}
                        </Text>
                        
                        <Pressable 
                          style={styles.menuItem} 
                          onPress={() => {
                            setVisible(false);
                          }}
                        >
                          <Text style={styles.menuText}>Sửa Workspace</Text>
                        </Pressable>
                        
                        <Pressable 
                          style={[styles.menuItem, { borderBottomWidth: 0 }]} 
                          onPress={() => {
                            setVisible(false);
                            handleDeleteBoard(selectedBoard?.id!)
                          }}
                        >
                          <Text style={[styles.menuText, { color: 'red' }]}>Xóa Workspace</Text>
                        </Pressable>
                      </View>
                    </Pressable>
                  </BlurView>
      </Modal>

      <View style={styles.statsCard}>
        <Text style={globalStyles.subHeader}>Total board</Text>
        <Text style={[globalStyles.textHeading, Typography.displayLg, styles.statsCount]}>
          {data.length}
        </Text>
      </View>

      <View>
        <View style={styles.listHeader}>
          <Text style={Typography.titleMd}>Recent Board</Text>
          <View style={styles.optionsWrapper}>
            {BOARD_OPTIONS.map((option) => (
              <Pressable key={option.name} style={styles.optionItem}>
                <AppIcon name={option.icon} color={Colors.primary} size={16} />
                <Text style={styles.optionText}>{option.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.boardListContainer}>
          {data.map((item) => (
            <Pressable onLongPress={() => handleLongPress(item)}
            delayLongPress={500} onPress={() => handleOpenBoard(item.id, item.title)} key={item.id} style={styles.boardItem}>
              <Text style={Typography.titleMd}>{item.title}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={[globalStyles.container, styles.emptyContainer]}>
      <EmptyBoard />
      <View style={styles.emptyContent}>
        <Text style={[globalStyles.textHeading, styles.emptyTitle]}>
          No Active Boards
        </Text>
        <Text style={[globalStyles.textDescription, styles.emptyDesc]}>
          Begin your architectural journey. Your engineering ledger is waiting for its first structural framework.
        </Text>
        <Button
          title="Create First Board"
          leftIcon={<AppIcon name="Plus" size={14} />}
          styleClass={styles.createBtn}
          onPress={handleCreateBoard}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
        <Header />
        <View style={styles.headerTitleWrapper}>
          <Text style={globalStyles.subHeader}>{name || "Workspace"}</Text>
          <Text style={[Typography.displayLg, globalStyles.textHeading, styles.mainTitle]}>
            Boards Dashboard
          </Text>
        </View>
        {data.length > 0 ? renderBoards() : renderEmptyState()}
      </ScrollView>
      
      <FAB path={`/(tabs)/Board/Create?workspaceId=${workspaceId}`} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleWrapper: {
    marginBottom: Spacing.xl,
  },
    overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },  
    menuItem: {
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  menuText: {
    fontSize: 18,
    fontWeight: "500",
  },
  mainTitle: {
    fontSize: 32,
    color: Colors.primary,
  },
  statsCard: {
    backgroundColor: Colors.onPrimary,
    padding: Spacing.xl,
    marginBottom: 48,
  },
  statsCount: {
    color: Colors.primary,
    fontSize: 32,
    paddingBottom: 0,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xxl,
  },
  optionsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  optionItem: {
    flexDirection: "row",
    gap: Spacing.xs,
    alignItems: "center",
  },
  optionText: {
    ...Typography.titleMd,
    color: Colors.primary,
    fontSize: 14,
  },
  boardListContainer: {
    padding: Spacing.xl,
    backgroundColor: Colors.onPrimary,
  },
  boardItem: {
    paddingVertical: Spacing.md,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContent: {
    gap: Spacing.lg,
    marginTop: Spacing.xl,
  },
  emptyTitle: {
    color: Colors.primary,
    textAlign: "center",
  },
  emptyDesc: {
    textAlign: "center",
  },
  createBtn: {
    alignSelf: "center",
    borderRadius: Rounded.sm,
  },
});