import { Screen } from "@/components/layout/Screen";
import { Activity } from "@/types/activity";
import ActivityService from "@/services/activity.service";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import Avatar from "@/components/ui/Avatar";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { SectionList, Text, View } from "react-native";
import { useFocusEffect, useGlobalSearchParams } from "expo-router";

type ActivitySection = {
  title: string;
  data: Activity[];
};

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

function ActivityItem({ item }: { item: Activity }) {
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

export default function ActivityTab() {
  const { boardId } = useGlobalSearchParams<{ boardId: string }>();
  const [activityLogs, setActivityLogs] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchActivities = async () => {
        try {
          setLoading(true);
          if (!boardId) return;
          const data = await ActivityService.getBoardActivities(boardId);
          setActivityLogs(data);
        } catch (error) {
          console.error("Failed to load board activities", error);
        } finally {
          setLoading(false);
        }
      };

      fetchActivities();
    }, [boardId])
  );

  const sections = useMemo(
    () => groupActivitiesByDate(activityLogs),
    [activityLogs]
  );

  return (
    <Screen isScroll={false}>
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 40, color: Theme.textSecondary }}>
          Loading activities...
        </Text>
      ) : (
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
      )}
    </Screen>
  );
}