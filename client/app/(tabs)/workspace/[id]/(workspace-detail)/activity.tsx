import { Screen } from "@/components/layout/Screen";
import { Activity } from "@/types/activity";
import ActivityService from "@/services/activity.service";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { SectionList, Text, View, RefreshControl, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useFocusEffect, useGlobalSearchParams } from "expo-router";
import { ActivityItem } from "@/components/ui/ActivityItem";
import Icons from "@/components/icons/Icons";
import { Colors } from "@/theme/colors";

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

export default function WorkspaceActivityTab() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const [activityLogs, setActivityLogs] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchActivities = async () => {
    try {
      if (!id) return;
      const data = await ActivityService.getWorkspaceActivities(id);
      setActivityLogs(data);
    } catch (error) {
      console.error("Failed to load workspace activities", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchActivities().finally(() => setLoading(false));
    }, [id])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchActivities();
    setRefreshing(false);
  };

  const filteredLogs = useMemo(() => {
    let logs = activityLogs;
    if (activeFilter !== "All") {
      logs = activityLogs.filter((log) => {
        const action = log.action || "";
        switch (activeFilter) {
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
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      logs = logs.filter(
        (log) =>
          log.user.name.toLowerCase().includes(q) ||
          (log.description && log.description.toLowerCase().includes(q))
      );
    }

    return logs;
  }, [activityLogs, activeFilter, searchQuery]);

  const sections = useMemo(
    () => groupActivitiesByDate(filteredLogs),
    [filteredLogs]
  );

  return (
    <Screen isScroll={false}>
      <View style={{ paddingBottom: Spacing[3], borderBottomWidth: 1, borderBottomColor: Theme.border, marginTop: Spacing[4] }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing[2]}}>
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                activeOpacity={0.7}
                onPress={() => setActiveFilter(filter)}
                style={{
                  paddingVertical: Spacing[1],
                  paddingHorizontal: Spacing[3],
                  borderRadius: 8,
                  borderWidth: 1.5,
                  borderColor:
                    isActive ? Colors.primary[500] : Theme.border,
                  backgroundColor:
                    isActive ? Colors.primary[100] : Colors.gray[100],
                }}
              >
                <Text
                  style={[
                    Typography.title,
                    {
                      fontSize: 12,
                      color:
                        isActive ? Theme.primary : Theme.textSecondary,
                    },
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
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
          contentContainerStyle={{ paddingHorizontal: Spacing[4] }}
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