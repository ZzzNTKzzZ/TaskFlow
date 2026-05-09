import SearchIcon from "@/components/icons/SearchIcon";
import SymbolIcon, {
  SymbolColor,
  SymbolName,
} from "@/components/icons/SymbolIcon";
import { Screen } from "@/components/layout/Screen";
import ActionCard from "@/components/navigation/ActionCard";
import DropDown from "@/components/overlays/DropDown";
import Avatar from "@/components/ui/Avatar";
import CardDropDown from "@/components/workspaces/CardDropDown";
import { useCurrentUser } from "@/modules/auth/hook/useCurrentUser";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { RoleWorkspace } from "@/types/workspaces";
import React, { ReactNode, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  const user = useCurrentUser();

  const [selected, setSelected] = useState<string>("WS 1");
  const workspaces = [
    {
      value: "WS 1",
      label: "WS 1",
      memberSize: 9,
      role: "OWNER",
      icon: "Company",
      color: "Primary",
    },

    {
      value: "WS 2",
      label: "WS 2",
      memberSize: 10,
      role: "MEMBER",
      icon: "Company",
      color: "Primary",
    },
  ];

  return (
    <Screen padding={Spacing[4]}>
      <View style={styles.container}>
        <View style={styles.headline}>
          <Avatar />
          <View style={{ flex: 1 }}>
            <Text style={[Typography.title, { fontSize: 16 }]}>
              Hello, {user?.name || "User"}
            </Text>
            <Text style={[Typography.label]}>Let's get things done</Text>
          </View>
          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            style={{
              backgroundColor: Theme.surface,
              borderRadius: 16,
              padding: 12,
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
            <SearchIcon />
          </TouchableOpacity>
        </View>

        {/* Quick Action */}
        <View
          style={{
            backgroundColor: Theme.surface,
            paddingVertical: Spacing[4],
            borderRadius: 16,

            marginTop: Spacing[4],

            shadowColor: Colors.gray[400],
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 16,

            // Shadow for Android
            elevation: 8,
          }}
        >
          <Text
            style={[
              Typography.heading,
              { fontSize: 16, paddingHorizontal: Spacing[4] },
            ]}
          >
            Quick Action
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: Spacing[4],
              paddingHorizontal: Spacing[3],
            }}
          >
            <ActionCard type="newBoard" onPress={() => {}} />
            <ActionCard type="newTodo" onPress={() => {}} />
            <ActionCard type="inviteMembers" onPress={() => {}} />
            <ActionCard type="automation" onPress={() => {}} />
          </View>
        </View>

        {/* DropDown Board */}

        <View
          style={{
            backgroundColor: Theme.surface,
            paddingTop: Spacing[4],
            paddingHorizontal: Spacing[4],
            borderRadius: 16,
            marginTop: Spacing[4],
            shadowColor: Colors.gray[400],

            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.7,
            shadowRadius: 16,

            // Shadow for Android
            elevation: 8,
          }}
        >
          <DropDown
            icon={((): ReactNode => {
              const wsSelected =
                workspaces.find((ws) => ws.value === selected) ?? workspaces[0];
              if (!wsSelected?.icon) return null;
              return (
                <SymbolIcon
                  name={wsSelected.icon as SymbolName}
                  size={28}
                  color={wsSelected.color as SymbolColor}
                />
              );
            })()}
            label="Workspace:"
            selected={selected}
            setSelected={setSelected}
            options={workspaces}
            renderItem={(item) => (
              <CardDropDown
                icon={
                  <SymbolIcon
                    name={item.icon as SymbolName}
                    size={28}
                    color={item.color as SymbolColor}
                  />
                }
                name={item.label}
                memberSize={item.memberSize}
                role={item.role as RoleWorkspace}
                selected={selected === item.value}
              />
            )}
          />
        </View>

        {/* Your Board */}

        <View style={{ flexDirection: "column" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: Spacing[4],
            }}
          >
            <Text style={[Typography.title, { fontSize: 16 }]}>
              Your Boards
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
              <Text style={[Typography.title, { fontSize: 14, color: Colors.primary[700] }]}>View all</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Spacing[6],
  },
  headline: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
});
