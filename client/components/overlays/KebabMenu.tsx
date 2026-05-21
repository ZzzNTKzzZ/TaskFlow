import { Text, TouchableOpacity, View } from "react-native";
import BaseOverlay from "./BaseOverlay";
import { ReactNode } from "react";
import Icons from "../icons/Icons";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { router } from "expo-router";

export type KebabMenuType =
  | "Workspace settings"
  | "Invite members"
  | "Change role"
  | "Members"
  | "Manage boards"
  | "Leave workspace"
  | "Delete workspace"
  | "Board settings"
  | "Delete board"
  | "Create board"
  | "Join board"
  | "Sort"
  | "Help & feedback"
  | "Create list"
  | "Edit card"
  | "Move card"
  | "Delete card"
  | "Edit list"
  | "Delete list"
  | "Recently"
  | "Updated"
  | "Name(A-Z)"

interface MenuItemConfig {
  name: KebabMenuType;
  icon: ReactNode;
  isDanger?: boolean;
  navigate?: () => void;
}

const KABAB_MENU_CONFIG: Record<KebabMenuType, MenuItemConfig> = {
  "Recently": {
    name: "Recently",
    icon: <Icons size={24} name="Clock" />
  },
  "Updated": {
    name: "Updated",
    icon: <Icons size={24} name="Calender" />
  },
  "Name(A-Z)": {
    name: "Name(A-Z)",
    icon: <Icons size={24} name="Sort(A-Z)" />
  },
  "Edit list": {
    name: "Edit list",
    icon: <Icons size={24} name="Edit" />,
  },
  "Delete list": {
    name: "Delete list",
    icon: <Icons size={24} name="Trash" color={Theme.error} />,
    isDanger: true,
  },
  "Edit card": {
    name: "Edit card",
    icon: <Icons size={24} name="Edit" />,
  },
  "Move card": {
    name: "Move card",
    icon: <Icons size={24} name="LeftArrow" />,
  },
  "Delete card": {
    name: "Delete card",
    icon: <Icons size={24} name="Trash" />,
    isDanger: true,
  },
  "Create list": {
    name: "Create list",
    icon: <Icons size={24} name="Plus" />,
  },
  "Create board": {
    name: "Create board",
    icon: <Icons size={24} name="Plus" />,
  },
  "Join board": {
    name: "Join board",
    icon: <Icons size={24} name="InviteMembers" />,
  },
  Sort: {
    name: "Sort",
    icon: <Icons size={24} name="Sort" />,
  },
  "Help & feedback": {
    name: "Help & feedback",
    icon: <Icons size={24} name="Help" />,
  },
  "Board settings": {
    name: "Board settings",
    icon: <Icons size={24} name="Setting" />,
  },
  "Workspace settings": {
    name: "Workspace settings",
    icon: <Icons size={24} name="Setting" />,
  },
  "Invite members": {
    name: "Invite members",
    icon: <Icons size={24} name="InviteMembers" />,
  },
  "Change role": {
    name: "Change role",
    icon: <Icons size={24} name="MemberRole" />,
  },
  Members: { name: "Members", icon: <Icons size={24} name="Members" /> },
  "Manage boards": {
    name: "Manage boards",
    icon: <Icons size={24} name="WorkspaceManage" />,
  },
  "Leave workspace": {
    name: "Leave workspace",
    icon: <Icons size={24} name="Logout" color={Theme.error} />,
    isDanger: true,
  },
  "Delete workspace": {
    name: "Delete workspace",
    icon: <Icons size={24} name="Trash" color={Theme.error} />,
    isDanger: true,
  },
  "Delete board": {
    name: "Delete board",
    icon: <Icons size={24} name="Trash" color={Theme.error} />,
    isDanger: true,
  },
} as const;

interface KebabProps {
  visible: boolean;
  onClose: () => void;
  menu: KebabMenuType[];
  onSelectMenu?: (item: KebabMenuType) => void;
}

export default function KebabMenu({
  visible,
  onClose,
  menu = [],
  onSelectMenu,
}: KebabProps) {
  return (
    <BaseOverlay visible={visible} onClose={onClose}>
      <View style={{ gap: Spacing[4] }}>
        {menu.map((m) => {
          const itemConfig = KABAB_MENU_CONFIG[m];

          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={m}
              onPress={() => {
                itemConfig.navigate?.();
                onSelectMenu?.(m);
                onClose();
              }}
              style={{
                flexDirection: "row",
                gap: Spacing[4],
                alignItems: "center",
              }}
            >
              <View>{itemConfig.icon}</View>
              <Text
                style={[
                  Typography.subtitle,
                  {
                    fontSize: 16,
                    color: itemConfig.isDanger
                      ? Theme.error
                      : Theme.textSecondary,
                  },
                ]}
              >
                {itemConfig.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BaseOverlay>
  );
}
