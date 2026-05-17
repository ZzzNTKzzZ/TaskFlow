import Icons from "@/components/icons/Icons";
import { Screen } from "@/components/layout/Screen";
import Avatar from "@/components/ui/Avatar";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { SectionList, Text, TouchableOpacity, View } from "react-native";

type Activity = {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
};

type ActivitySection = {
  title: string;
  data: Activity[];
};

type ActivityItemProps = {
  item: Activity;
};

function ActivityItem({ item }: ActivityItemProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: Spacing[3],
        paddingVertical: Spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: Theme.border,
      }}
    >
      <Avatar name={item.user.name} />

      <View style={{ flex: 1 }}>
        <Text
          style={[
            Typography.body,
            {
              color: Theme.textPrimary,
              lineHeight: 22,
            },
          ]}
        >
          {item.description}
        </Text>

        <Text
          style={[
            Typography.caption,
            {
              marginTop: 4,
              color: Theme.textSecondary,
            },
          ]}
        >
          {dayjs(item.createdAt).format("hh:mm A")}
        </Text>
      </View>
    </View>
  );
}

function groupActivitiesByDate(data: Activity[]): ActivitySection[] {
  const grouped = data.reduce<Record<string, Activity[]>>((acc, item) => {
    const date = dayjs(item.createdAt);

    let title = date.format("DD/MM/YYYY");

    if (date.isSame(dayjs(), "day")) {
      title = "Today";
    } else if (date.isSame(dayjs().subtract(1, "day"), "day")) {
      title = "Yesterday";
    }

    if (!acc[title]) {
      acc[title] = [];
    }

    acc[title].push(item);

    return acc;
  }, {});

  return Object.entries(grouped).map(([title, data]) => ({
    title,
    data,
  }));
}

export default function Activity() {
  const badges = ["All", "Boards", "Cards", "Comments", "Checklist"];

  const [selected, setSelected] = useState("All");

  const activityLogs: Activity[] = [
    {
      id: "1",
      action: "CARD_CREATED",
      description:
        "Khánh created card 'Implement authentication' in 'Backlog' on 'Sprint Planning'",
      createdAt: "2026-05-17T10:45:00.000Z",
      user: {
        id: "1",
        name: "Khánh",
        avatar: "",
      },
    },
    {
      id: "2",
      action: "CARD_MOVED",
      description:
        "Khánh moved card 'Implement authentication' from 'Backlog' to 'In Progress'",
      createdAt: "2026-05-17T09:20:00.000Z",
      user: {
        id: "1",
        name: "Khánh",
        avatar: "",
      },
    },
    {
      id: "3",
      action: "COMMENT_CREATED",
      description:
        "Khánh commented 'Need backend review' on 'Implement authentication'",
      createdAt: "2026-05-17T08:10:00.000Z",
      user: {
        id: "1",
        name: "Khánh",
        avatar: "",
      },
    },
    {
      id: "4",
      action: "CHECKLIST_ITEM_COMPLETED",
      description: "Khánh completed checklist item 'Write code'",
      createdAt: "2026-05-17T07:30:00.000Z",
      user: {
        id: "1",
        name: "Khánh",
        avatar: "",
      },
    },
    {
      id: "5",
      action: "LIST_CREATED",
      description: "Khánh created list 'Done'",
      createdAt: "2026-05-16T16:15:00.000Z",
      user: {
        id: "1",
        name: "Khánh",
        avatar: "",
      },
    },
    {
      id: "6",
      action: "BOARD_UPDATED",
      description: "Khánh updated board background",
      createdAt: "2026-05-16T14:00:00.000Z",
      user: {
        id: "1",
        name: "Khánh",
        avatar: "",
      },
    },
  ];

  const sections = useMemo(
    () => groupActivitiesByDate(activityLogs),
    [activityLogs],
  );

  return (
    <Screen isScroll={false}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: Spacing[3],
        }}
      >
        <Text style={[Typography.heading, { fontSize: 24 }]}>Activity</Text>

        <Icons name="Search" />
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: Spacing[2],
          marginBottom: Spacing[4],
        }}
      >
        {badges.map((badge) => (
          <TouchableOpacity
            key={badge}
            activeOpacity={0.7}
            onPress={() => setSelected(badge)}
            style={{
              paddingVertical: Spacing[1],
              paddingHorizontal: Spacing[3],
              borderRadius: 8,
              borderWidth: 1.5,
              borderColor:
                selected === badge ? Colors.primary[500] : Theme.border,
              backgroundColor:
                selected === badge ? Colors.primary[100] : Colors.gray[100],
            }}
          >
            <Text
              style={[
                Typography.title,
                {
                  fontSize: 12,
                  color:
                    selected === badge ? Theme.primary : Theme.textSecondary,
                },
              ]}
            >
              {badge}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              marginTop: 40,
              color: Theme.textSecondary,
            }}
          >
            No activity yet
          </Text>
        }
        renderSectionHeader={({ section }) => (
          <Text
            style={[
              Typography.title,
              {
                marginTop: Spacing[3],
                marginBottom: Spacing[1],
              },
            ]}
          >
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => <ActivityItem item={item} />}
      />
    </Screen>
  );
}
