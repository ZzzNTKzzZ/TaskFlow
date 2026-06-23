import Icons from "@/components/icons/Icons";
import { Screen } from "@/components/layout/Screen";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Colors } from "@/theme/colors";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { SectionList, Text, TouchableOpacity, View, RefreshControl, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";

import { Activity } from "@/types/activity";
import ActivityService from "@/services/activity.service";
import { ActivityItem } from "@/components/ui/ActivityItem";

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

const FILTERS = ["All", "Boards", "Lists", "Cards", "Checklists", "Comments"];

export default function ActivityScreen() {
  const [selected, setSelected] = useState("All");

  const [activityLogs, setActivityLogs] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActivities = async () => {
    try {
      const data = await ActivityService.getGlobalActivities();
      setActivityLogs(data);
    } catch (error) {
      console.error("Failed to load activities", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchActivities().finally(() => setLoading(false));
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
  };

  const filteredLogs = useMemo(() => {
    if (selected === "All") return activityLogs;
    return activityLogs.filter((log) => {
      const action = log.action || "";
      switch (selected) {
        case "Boards":
          return action.startsWith("BOARD_");
        case "Lists":
          return action.startsWith("LIST_");
        case "Cards":
          return action.startsWith("CARD_") || action.startsWith("MEMBER_");
        case "Checklists":
          return action.startsWith("CHECKLIST_");
        case "Comments":
          return action.startsWith("COMMENT_");
        default:
          return true;
      }
    });
  }, [activityLogs, selected]);

  const sections = useMemo(
    () => groupActivitiesByDate(filteredLogs),
    [filteredLogs],
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
          marginBottom: Spacing[4],
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing[2] }}>
          {FILTERS.map((badge) => (
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
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <Text style={{ textAlign: "center", marginTop: 40, color: Theme.textSecondary }}>
          Loading activities...
        </Text>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Theme.primary} />
          }
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                marginTop: 40,
                color: Theme.textSecondary,
              }}
            >
              No activity found
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
