import Icons from "@/components/icons/Icons";
import LeftRightIcon from "@/components/icons/LeftRightIcon";
import { Screen } from "@/components/layout/Screen";
import Avatar from "@/components/ui/Avatar";
import { useCurrentUser } from "@/modules/auth/hook/useCurrentUser";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { Text, View } from "react-native";

type SettingItemType = {
  name: string;
  icon: string;
  color: string;
  backgroundColor: string;
  caption: string;
};

type SettingSectionType = {
  name: string;
  options: SettingItemType[];
};

const settings: SettingSectionType[] = [
  {
    name: "Account",
    options: [
      {
        name: "Profile",
        icon: "Profile",
        color: Colors.primary[500],
        backgroundColor: Colors.primary[100],
        caption: "Manage your personal infomation",
      },
      {
        name: "Account & Security",
        icon: "Security",
        color: "#10B981",
        backgroundColor: "#D1FAE5",
        caption: "Change password, manage devices",
      },
      {
        name: "Notifications",
        icon: "Bell",
        color: "#F59E0B",
        backgroundColor: "#FEF3C7",
        caption: "Configure your notifcation perferences",
      },
      {
        name: "Appearance",
        icon: "Moon",
        color: "#8B5CF6",
        backgroundColor: "#EDE9FE",
        caption: "Theme, color, and display options",
      },
      {
        name: "Language",
        icon: "Language",
        color: Colors.primary[500],
        backgroundColor: Colors.primary[100],
        caption: "Change your app language",
      },
    ],
  },
  {
    name: "More",
    options: [
      {
        name: "Help & Support",
        icon: "Help",
        color: Colors.primary[500],
        backgroundColor: Colors.primary[100],
        caption: "Get help and contact support",
      },
      {
        name: "About",
        icon: "About",
        color: Colors.primary[500],
        backgroundColor: Colors.primary[100],
        caption: "Version 1.0.0",
      },
    ],
  },
];

function Header() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: Spacing[3],
      }}
    >
      <Text style={[Typography.heading, { fontSize: 24 }]}>Settings</Text>
      <Icons name="Bell" />
    </View>
  );
}

function UserCard() {
  const user = useCurrentUser();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1.5,
        borderColor: Theme.border,
        padding: Spacing[3],
        borderRadius: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: Spacing[3],
        }}
      >
        <Avatar />
        <View>
          <Text style={[Typography.title, { fontSize: 16 }]}>
            {user?.name}
          </Text>
          <Text style={[Typography.label, { fontSize: 14 }]}>
            {user?.email}
          </Text>
        </View>
      </View>

      <LeftRightIcon direction="right" />
    </View>
  );
}

function SettingItem({ item }: { item: SettingItemType }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: Spacing[2],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: Spacing[3],
        }}
      >
        <View
          style={{
            padding: Spacing[2],
            borderRadius: 100,
            backgroundColor: item.backgroundColor,
          }}
        >
          <Icons
            name={item.icon as any}
            color={item.color}
            size={24}
          />
        </View>

        <View>
          <Text style={[Typography.title, { fontSize: 16 }]}>
            {item.name}
          </Text>
          <Text style={Typography.caption}>{item.caption}</Text>
        </View>
      </View>

      <LeftRightIcon direction="right" />
    </View>
  );
}

function SettingSection({ section }: { section: SettingSectionType }) {
  return (
    <View
      style={{
        marginTop: Spacing[4],
        borderWidth: 1.5,
        borderColor: Theme.border,
        borderRadius: 12,
        padding: Spacing[3],
        gap: Spacing[2],
      }}
    >
      <Text style={[Typography.label, { fontSize: 16 }]}>
        {section.name}
      </Text>

      {section.options.map((item) => (
        <SettingItem key={item.name} item={item} />
      ))}
    </View>
  );
}

function LogoutButton() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing[4],
        marginVertical: Spacing[4],
        borderWidth: 1.5,
        borderColor: Theme.border,
        padding: Spacing[3],
        borderRadius: 12,
      }}
    >
      <View
        style={{
          padding: Spacing[2],
          borderRadius: 8,
          backgroundColor: "#FEE2E2",
        }}
      >
        <Icons name="Logout" size={24} color="#DC2626" />
      </View>

      <Text
        style={[
          Typography.heading,
          { fontSize: 16, color: "#DC2626" },
        ]}
      >
        Logout
      </Text>
    </View>
  );
}

export default function Setting() {
  return (
    <Screen>
      <Header />
      <UserCard />

      {settings.map((section) => (
        <SettingSection
          key={section.name}
          section={section}
        />
      ))}

      <LogoutButton />
    </Screen>
  );
}