import Icons from "@/components/icons/Icons";
import { Screen } from "@/components/layout/Screen";
import SectionCard from "@/components/layout/SectionCard";
import DropDown from "@/components/overlays/DropDown";
import InviteMembers from "@/components/overlays/InviteMembers";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import WorkspaceService from "@/services/workspace.service";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { router, Tabs } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Create() {
  const [isInviteVisible, setIsInviteVisible] = useState(false);
  const [name, setName] = useState<string>("");
  const [selected, setSelected] = useState<{
    id: string | number;
    name: string;
  }>({
    id: 1,
    name: "Team",
  });
  const handleSendInvite = (email: string) => {
    console.log("Tiến hành gửi lời mời tới email:", email);
  };
  const options = [
    {
      id: 1,
      name: "Team",
    },
    {
      id: 2,
      name: "Private",
    },
    {
      id: 3,
      name: "Public",
    },
  ];

  const handleCreateWorkspace = async () => {
    const tempId = `tmp-${Date.now()}`;
    const tempWs = { id: tempId, name, boardCount: 0, memberCount: 0, icon: "Company", color: "Primary" } as any;

    try {
      const eventBus = await import("@/services/eventBus");
      eventBus.emit("workspace:creating", tempWs);
    } catch (e) {}

    try {
      const response = await WorkspaceService.createWorkspace(name);
      if (response && response.id) {
        try {
          const eventBus = await import("@/services/eventBus");
          eventBus.emit("workspace:created", { tempId, created: response });
        } catch (e) {}
      } else {
        const eventBus = await import("@/services/eventBus");
        eventBus.emit("workspace:create_failed", { tempId });
      }
    } catch (error) {
      try {
        const eventBus = await import("@/services/eventBus");
        eventBus.emit("workspace:create_failed", { tempId });
      } catch (e) {}
      console.error("Create workspace error:", error);
    }

    router.replace("/(tabs)/workspace");
  }
  return (
    <Screen isScroll={false}>
        <View
          style={{
            marginTop: Spacing[2],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", left: 0 }}
            onPress={() => {
              router.back();
            }}
          >
            <Icons name="Cross" size={24} />
          </TouchableOpacity>
          <Text style={[Typography.heading, { fontSize: 28 }]}>
            Create Workspace
          </Text>
        </View>
        <View style={{ marginVertical: Spacing[4], flex: 1 }}>
          <Input
            label="Workspace name"
            placeholder="e.g. Acme Team"
            value={name}
            setValue={setName}
            stylesLabel={[
              Typography.title,
              {
                color: Theme.textPrimary,
                marginBottom: Spacing[2],
                fontSize: 16,
              },
            ]}
          />
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
                    {o.name}
                  </Text>
                </View>
              )}
            />
          </View>
          <TouchableOpacity
            onPress={() => {setIsInviteVisible(true)}}
            activeOpacity={0.7}
            style={{
              marginTop: Spacing[4],
              paddingVertical: Spacing[3],
              paddingHorizontal: Spacing[4],
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
                alignItems: "center",
                gap: Spacing[2],
              }}
            >
              <Icons name="Members" size={24} />
              <Text style={[Typography.title, { fontSize: 16 }]}>
                Invite members
              </Text>
            </View>
            <Icons name="Plus" size={24} />
          </TouchableOpacity>
        </View>
        <Button onPress={() => handleCreateWorkspace()} style={{marginBottom: Spacing[4]}}>Create Board</Button>
        <Button type="ghost" onPress={() => router.back()} style={{marginBottom: Spacing[4]}} styleText={{color: Colors.primary[700]}}>Cancel</Button>
        <InviteMembers
        visible={isInviteVisible}
        onClose={() => setIsInviteVisible(false)}
        onInvite={handleSendInvite}
      />
    </Screen>
  );
}
