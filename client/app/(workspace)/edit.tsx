import Icons from "@/components/icons/Icons";
import SymbolIcon from "@/components/icons/SymbolIcon";
import UpDownIcon from "@/components/icons/UpDownIcon";
import { ScreenEdit } from "@/components/layout/ScreenEdit";
import DropDown from "@/components/overlays/DropDown";
import InviteMembers from "@/components/overlays/InviteMembers";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useCurrentUser } from "@/modules/auth/hook/useCurrentUser";
import {
  WorkspaceCard,
  WorkspaceMemberRespone,
} from "@/modules/workspace/workspace";
import WorkspaceService from "@/modules/workspace/workspace.service";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { RoleWorkspace } from "@/types/type";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Hàm helper dùng chung để sắp xếp danh sách theo đúng quy tắc yêu cầu
const sortMembersList = (
  list: WorkspaceMemberRespone[],
  currentUserId?: string
): WorkspaceMemberRespone[] => {
  const roleOrder: Record<RoleWorkspace, number> = {
    OWNER: 1,
    ADMIN: 2,
    MEMBER: 3,
    VIEWER: 4,
  };

  return [...list].sort((a, b) => {
    const isMeA = a.id === currentUserId;
    const isMeB = b.id === currentUserId;

    if (isMeA && !isMeB) return -1;
    if (!isMeA && isMeB) return 1;

    const weightA = roleOrder[a.role as RoleWorkspace] || 99;
    const weightB = roleOrder[b.role as RoleWorkspace] || 99;

    return weightA - weightB;
  });
};

export default function Edit() {
  const user = useCurrentUser();
  const { id } = useLocalSearchParams();
  const [workspace, setWorkspace] = useState<WorkspaceCard>();
  const [isInviteVisible, setIsInviteVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [members, setMembers] = useState<WorkspaceMemberRespone[]>([]);
  const [name, setName] = useState<string>("");
  const [selected, setSelected] = useState<{
    id: string | number;
    name: string;
  }>({
    id: 1,
    name: "Team",
  });

  const options = [
    { id: 1, name: "Team" },
    { id: 2, name: "Private" },
    { id: 3, name: "Public" },
  ];

  useEffect(() => {
    const getWorkspaceDetail = async () => {
      try {
        const response = await WorkspaceService.getWorkspace(id as string);
        const memberList = await WorkspaceService.getWorkspaceMembers(id as string);

        if (response) {
          setWorkspace(response);
          setName(response.name);
        }

        if (memberList) {
          const list = memberList as WorkspaceMemberRespone[];
          setMembers(sortMembersList(list, user?.id));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getWorkspaceDetail();
  }, [id, user?.id]);

  const handleInvite = async (email: string) => {
    try {
      const response = await WorkspaceService.addWorkspaceMember(id as string, email);
      
      if (response) {
        const newMembersData = Array.isArray(response) ? response : [response];
        
        setMembers((prev) => {
          const updatedList = [...prev, ...newMembersData] as WorkspaceMemberRespone[];
          return sortMembersList(updatedList, user?.id);
        });

        if (workspace) {
          setWorkspace({
            ...workspace,
            memberCount: (workspace.memberCount ?? 0) + newMembersData.length,
          });
        }
      }
    } catch (error) {
      console.error("Invite failed:", error);
    }
  };

  const handleSave = async () => {
    await WorkspaceService.updateWorkspace(id as string, name);
    router.replace("/(tabs)/workspace");
  };

  const handleDelete = async() => {
    console.log("first")
    await WorkspaceService.deleteWorkspace(id as string)
    router.replace("/(tabs)/workspace")
  }

  if (loading) return <Text>Loading...</Text>;

  return (
    <ScreenEdit onSave={() => handleSave()} isScroll={false}>
      <View style={{ flex: 1, marginVertical: Spacing[4] }}>
        <View style={{ alignItems: "center", gap: Spacing[4] }}>
          <SymbolIcon name="Company" color="Primary" size={48} />
          <Text style={[Typography.heading, { fontSize: 24 }]}>
            Edit workspace
          </Text>
        </View>
        <Input
          label="Workspace name:"
          value={name}
          setValue={setName}
          stylesLabel={[
            Typography.title,
            { color: Theme.textPrimary, marginBottom: Spacing[2], fontSize: 16 },
          ]}
        />
        <View>
          <Text
            style={[
              Typography.title,
              { color: Theme.textPrimary, marginBottom: Spacing[2], fontSize: 16 },
            ]}
          >
            Privacy
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 16,
              borderColor: Theme.border,
            }}
          >
            <DropDown
              variant="card"
              selected={selected.name}
              setSelected={setSelected}
              options={options}
              stylesText={{
                color: Theme.textPrimary,
                marginBottom: Spacing[2],
                fontSize: 16,
              }}
              renderItem={(o) => (
                <View
                  style={{
                    paddingVertical: Spacing[1],
                    paddingHorizontal: Spacing[2],
                    borderRadius: 12,
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
                      { fontSize: 16, color: Theme.textPrimary },
                    ]}
                  >
                    {o.name}
                  </Text>
                </View>
              )}
            />
          </View>
          
          <TouchableOpacity
            onPress={() => setActive((prev) => !prev)}
            activeOpacity={0.7}
            style={{
              marginTop: Spacing[4],
              paddingVertical: Spacing[3],
              paddingHorizontal: Spacing[3],
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 12,
              borderColor: Theme.border,
              borderWidth: 1.5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: Spacing[2],
                  flex: 1,
                }}
              >
                <Icons name="Members" size={24} />
                <Text style={[Typography.title, { fontSize: 16 }]}>
                  Members
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: Spacing[2],
                  alignItems: "center",
                }}
              >
                <Text style={[Typography.title, { fontSize: 16 }]}>
                  {workspace?.memberCount ?? 0}
                </Text>
                <UpDownIcon active={active} />
              </View>
            </View>
          </TouchableOpacity>

          {active && (
            <ScrollView
              style={{ maxHeight: 250, marginTop: Spacing[4] }}
              showsHorizontalScrollIndicator={false}
            >
              <View style={{ gap: Spacing[2] }}>
                {members.map((m) => (
                  <View
                    key={m.id}
                    style={{
                      paddingVertical: Spacing[3],
                      paddingHorizontal: Spacing[3],
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottomColor: Theme.border,
                      borderBottomWidth: 1.5,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: Spacing[3],
                      }}
                    >
                      <Text
                        style={[
                          Typography.subtitle,
                          {
                            fontSize: 16,
                            color:
                              m.id === user?.id
                                ? Theme.primary
                                : Theme.textSecondary,
                          },
                        ]}
                      >
                        {m.name} {m.id === user?.id && "(You)"}
                      </Text>
                    </View>
                    <Text style={{ color: Theme.textSecondary }}>{m.role}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          <TouchableOpacity
            onPress={() => setIsInviteVisible(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: Spacing[1],
              marginTop: Spacing[4],
            }}
          >
            <Text
              style={[Typography.label, { color: Theme.primary, fontSize: 18 }]}
            >
              Invite member
            </Text>
            <Icons name="Plus" color={Theme.primary} size={26} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Button
        type="ghost"
        onPress={() => handleDelete()}
        styleText={{ color: Theme.error }}
        style={{ borderColor: Theme.error, borderWidth: 1 }}
      >
        Delete workspace
      </Button>
      
      <InviteMembers
        visible={isInviteVisible}
        onClose={() => setIsInviteVisible(false)}
        onInvite={(email) => handleInvite(email)}
      />
    </ScreenEdit>
  );
}