import Icons from "@/components/icons/Icons";
import { Screen } from "@/components/layout/Screen";
import Input from "@/components/ui/Input";
import WorkspaceCardUI from "@/components/workspaces/WorkspaceCard";
import { WorkspaceCard } from "@/modules/workspace/workspace";
import WorkspaceService from "@/modules/workspace/workspace.service";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Workspace() {

    const [search, setSearch] = useState<string>("")
    const [sort, setSort] = useState("")
    const [loading, setLoading] = useState(true)
    const [workspaces, setWorkspaces] = useState<WorkspaceCard[]>([])

    useEffect(() => {
        const initWorkspaces = async () => {
              try {
                setLoading(true);
                const list = await WorkspaceService.getWorkspaces();
                setWorkspaces(list);
        
              } catch (error) {
                console.error("Lỗi khởi tạo Workspace:", error);
              } finally {
                setLoading(false);
              }
            };
            initWorkspaces();
    }, [])

  return (
    <Screen padding={Spacing[6]}>
      <View style={{ flex: 1, paddingVertical: Spacing[6] }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={[Typography.heading]}>Workspaces</Text>
            <Text style={[Typography.caption]}>
              All your workspaces in one place
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            style={{
              backgroundColor: Theme.surface,
              borderRadius: 100,
              padding: Spacing[2],

              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
            }}
          >
            <Icons name="Plus" />
          </TouchableOpacity>
        </View>
        <View style={{marginVertical: Spacing[4]}}>
            <Input isSearch value={search} setValue={setSearch} placeholder="Search workspace..."/>
        </View>
        <View>
            {workspaces.map((ws) => (
                <WorkspaceCardUI id={ws.id} name={ws.name} memberCount={ws.memberCount} icon={ws.icon} color={ws.color} />
            ))}
        </View>
      </View>
    </Screen>
  );
}
