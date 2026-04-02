import { Pressable, ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import { globalStyles } from "@/styles/global";
import { Colors, Rounded, Spacing, Typography } from "@/theme";
import Button from "@/components/Button";
import Hierarchical from "@/assets/icons/Hierarchical.svg";
import Collaboration from "@/assets/icons/Collaboration.svg";
import Velocity from "@/assets/icons/Velocity.svg";
import { router } from "expo-router";
import { fetchWorkspaceData } from "@/service/workspace.service";

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
  const des = [
    {
      title: "Hierarchical View",
      icon: <Hierarchical />,
      description:
        "Organize complex projects into nested task layers with the precision of an architectural blueprint.",
    },
    {
      title: "Seamless Collaboration",
      icon: <Collaboration />,
      description:
        "Invite team members to specific workspaces and maintain granular control over permissions and access.",
    },
    {
      title: "Real-time Velocity",
      icon: <Velocity />,
      description:
        "Track the progress of your team through beautifully rendered data ledgers and activity streams.",
    },
  ];

  const handleOpenWorkspace = (id: string, name: string) => {
    router.push({
      pathname: "/(tabs)/Board/[id]", 
      params: {
        id, name
      }
    })
  }

  const handleOpenCreate = () => {
    // router.push("/Workspace/Create")
  };
  // Get workspace user data
  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        setLoading(true);
        const data = await fetchWorkspaceData();
        if (!data) {
          router.replace("/Auth/Login");
        }
        setWorkspaces(data);
      } catch (error: any) {
        console.error("Lỗi xác thực hoặc API:", error.message);

        router.replace("/Auth/Login");
      } finally {
        setLoading(false);
      }
    };
    loadWorkspace();
  }, []);

  const renderEmptyState = () => {
    return (
      <ScrollView>
        <Header />
        <View style={[globalStyles.container]}>
          <View style={{ paddingBottom: 32 }}>
            <Text
              style={[
                Typography.labelSm,
                {
                  letterSpacing: 1,
                  color: Colors.primary,
                  paddingBottom: Spacing.sm,
                },
              ]}
            >
              Onboarding experience
            </Text>
            <Text style={[Typography.displayLg, globalStyles.textHeading]}>
              Let's build your first workspace.
            </Text>
            <Text style={[Typography.titleMd, globalStyles.textDescription]}>
              TaskFlow Pro is designed for architectural precision. Start by
              creating a workspace or joining an existing team.
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              gap: Spacing.lg,
              paddingBottom: Spacing.xxl,
            }}
          >
            <Button
              title="Create New Workspace"
              styleClass={{ alignSelf: "stretch" }}
              onPress={() => handleOpenCreate()}
            />
            <Button
              title="Join with Invite Code"
              variant="ghost"
              styleClass={{ alignSelf: "stretch" }}
            />
          </View>
        </View>
        <View
          style={[
            globalStyles.container,
            { backgroundColor: Colors.surfaceLow, paddingVertical: 40 },
          ]}
        >
          {des.map((i, index) => (
            <View
              key={index}
              style={{
                display: "flex",
                gap: Spacing.lg,
                paddingBottom: Spacing.lg,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.onPrimary,
                  padding: 10,
                  alignSelf: "flex-start",
                  borderRadius: Rounded.lg,
                }}
              >
                {i.icon}
              </View>
              <View>
                <Text style={[Typography.titleMd]}>{i.title}</Text>
              </View>
              <View>
                <Text
                  style={[
                    Typography.labelSm,
                    {
                      textTransform: "none",
                      fontSize: 14,
                      color: Colors.description,
                    },
                  ]}
                >
                  {i.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderWorkspaceList = () => {
    return (
      <ScrollView style={[globalStyles.container]}>
        <Header />
        <View>
          <Text
            style={[
              globalStyles.textDescription,
              { fontSize: 14, letterSpacing: 1, textTransform: "uppercase" },
            ]}
          >
            Workspace Overview
          </Text>
          <Text
            style={[
              Typography.displayLg,
              globalStyles.textHeading,
              { fontSize: 40 },
            ]}
          >
            Active Workspaces
          </Text>
        </View>
        <View style={{ display: "flex", gap: Spacing.lg }}>
          {workspaces.map((ws) => (
            <Pressable
              onPress={() => handleOpenWorkspace(ws.id, ws.name)}
              key={ws.id}
              style={{
                backgroundColor: Colors.onPrimary,
                padding: Spacing.xxl,
                borderTopColor: Colors.primary,
                borderTopWidth: 3,
                borderRadius: Rounded.sm,
              }}
            >
              <Text style={[Typography.headlineSm]}>{ws.name}</Text>
              <Text>{ws.memberCount}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return workspaces.length > 0 ? renderWorkspaceList() : renderEmptyState();
}
