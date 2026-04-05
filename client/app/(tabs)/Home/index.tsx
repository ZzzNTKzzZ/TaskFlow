import React, { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { router, useFocusEffect } from "expo-router";

// Import components & theme của bạn
import Header from "@/components/layout/Header";
import { globalStyles } from "@/styles/global";
import { Colors, Rounded, Spacing, Typography } from "@/theme";
import Button from "@/components/Button";
import FAB from "@/components/ui/FAB";

// Service
import { deleteWorkspaceApi, fetchWorkspaceData } from "@/service/workspace.service";
import { AppIcon } from "@/components/ui/AppIcon";

type WorkspaceProps = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  memberCount: number;
};

export default function Home() {
  const [workspaces, setWorkspaces] = useState<WorkspaceProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedWs, setSelectedWs] = useState<WorkspaceProps | null>(null);

  const des = [
    {
      title: "Hierarchical View",
      icon: <AppIcon name="Hierarchical" />,
      description: "Organize complex projects into nested task layers.",
    },
    {
      title: "Seamless Collaboration",
      icon: <AppIcon name="Collaboration" />,
      description: "Invite team members and maintain granular control.",
    },
    {
      title: "Real-time Velocity",
      icon: <AppIcon name="Velocity" />,
      description: "Track the progress through beautifully rendered data.",
    },
  ];

  const loadWorkspace = async () => {
  try {
    setLoading(true);
    const data = await fetchWorkspaceData();
    setWorkspaces(data || []);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  // Lấy dữ liệu mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
    loadWorkspace();
  }, [])
  );

  const handleOpenWorkspace = (id: string, name: string) => {
    router.push({
      pathname: "/(tabs)/Board",
      params: { workspaceId: id, name },
    });
  };

  const handleDeleteWorkspace = async (id: string) => {
    try {
      const response = await deleteWorkspaceApi(id)
      console.log(response)
      if (response.success) {
        alert("Xóa Workspace thành công!")
        setVisible(false)
        setSelectedWs(null)
        loadWorkspace();
      }
    } catch (error: any) {
      console.error("Lỗi API:", error.message);
      alert(error.message);
    }
  }

  const handleLongPress = (ws: WorkspaceProps) => {
    setSelectedWs(ws);
    setVisible(true);
  };

  const renderWorkspaceList = () => {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          visible={visible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setVisible(false)}
        >
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
            <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Workspace: {selectedWs?.name}
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
                    handleDeleteWorkspace(selectedWs?.id!)
                  }}
                >
                  <Text style={[styles.menuText, { color: 'red' }]}>Xóa Workspace</Text>
                </Pressable>
              </View>
            </Pressable>
          </BlurView>
        </Modal>

        <ScrollView style={[globalStyles.container]}>
          <Header />
          <View style={{ marginBottom: Spacing.xl }}>
            <Text style={[globalStyles.subHeader]}>
              Workspace Overview
            </Text>
            <Text style={[Typography.displayLg, globalStyles.textHeading, { fontSize: 32 }]}>
              Active Workspaces
            </Text>
          </View>

          <View style={{ gap: Spacing.lg, paddingBottom: 100 }}>
            {workspaces.map((ws) => (
              <Pressable
                key={ws.id}
                onLongPress={() => handleLongPress(ws)}
                delayLongPress={500}
                onPress={() => handleOpenWorkspace(ws.id, ws.name)}
                style={({ pressed }) => [
                  styles.wsCard,
                  { opacity: pressed ? 0.8 : 1 }
                ]}
              >
                <Text style={[Typography.headlineSm]}>{ws.name}</Text>
                <Text style={globalStyles.textDescription}>
                  {ws.memberCount} members • Role: {ws.role}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <ScrollView>
        <Header />
        <View style={[globalStyles.container]}>
          <View style={{ paddingBottom: 32 }}>
            <Text style={[Typography.labelSm, styles.onboardingTag]}>
              Onboarding experience
            </Text>
            <Text style={[Typography.displayLg, globalStyles.textHeading]}>
              Let's build your first workspace.
            </Text>
            <Text style={[Typography.titleMd, globalStyles.textDescription]}>
              TaskFlow Pro is designed for architectural precision.
            </Text>
          </View>
          <View style={{ gap: Spacing.lg, paddingBottom: Spacing.xxl }}>
            <Button title="Create New Workspace" styleClass={{ alignSelf: "stretch" }} />
            <Button title="Join with Invite Code" variant="ghost" styleClass={{ alignSelf: "stretch" }} />
          </View>
        </View>
        <View style={[globalStyles.container, styles.featureSection]}>
          {des.map((i, index) => (
            <View key={index} style={{ gap: Spacing.sm, marginBottom: Spacing.lg }}>
              <View style={styles.iconContainer}>{i.icon}</View>
              <Text style={[Typography.titleMd]}>{i.title}</Text>
              <Text style={styles.featureDescription}>{i.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading Workspaces...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {workspaces.length > 0 ? renderWorkspaceList() : renderEmptyState()}
      <FAB path="/(tabs)/Home/Create" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingCenter: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  wsCard: {
    backgroundColor: Colors.onPrimary,
    padding: Spacing.xxl,
    borderTopColor: Colors.primary,
    borderTopWidth: 3,
    borderRadius: Rounded.sm,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subHeader: { 
    letterSpacing: 1, 
    textTransform: "uppercase" 
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
  onboardingTag: {
    letterSpacing: 1,
    color: Colors.primary,
    paddingBottom: Spacing.sm,
  },
  featureSection: {
    backgroundColor: Colors.surfaceLow,
    paddingVertical: 40,
  },
  iconContainer: {
    backgroundColor: Colors.onPrimary,
    padding: 10,
    alignSelf: "flex-start",
    borderRadius: Rounded.lg,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.description,
  }
});