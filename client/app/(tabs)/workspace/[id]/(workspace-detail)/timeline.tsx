import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, RefreshControl, ActivityIndicator } from 'react-native';
import { Theme } from '@/theme/theme';
import { Typography } from '@/theme/typography';
import { Spacing } from '@/theme/spacing';
import { Colors } from '@/theme/colors';
import { useFocusEffect, useGlobalSearchParams, router } from 'expo-router';
import WorkspaceService from '@/modules/workspace/workspace.service';
import { TimelineCard } from '@/modules/workspace/workspace.api';
import dayjs from 'dayjs';
import Badges from '@/components/ui/Badges';
import Icons from '@/components/icons/Icons';

type TimelineItem = {
  id: string;
  name: string;
  boardId: string;
  boardName: string;
  boardColor: string;
  time: string;
  priority: string;
  listName: string;
  isOverdue: boolean;
  dueDate: string | null;
  createdAt: string;
  checklistTotal: number;
  checklistCompleted: number;
};

type TimelineSection = {
  title: string;
  date: string;
  isToday: boolean;
  isPast: boolean;
  data: TimelineItem[];
};

const BOARD_PALETTE = [
  Colors.primary[500],   // Blue
  Colors.success,        // Green
  Colors.warning,        // Orange
  Colors.error,          // Red
  Colors.secondary[500], // Purple
  "#06B6D4",             // Cyan
  "#14B8A6",             // Teal
  "#EC4899",             // Pink
  "#F43F5E",             // Rose
  "#84CC16",             // Lime
];

function getBoardColor(boardId: string): string {
  if (!boardId) return Colors.primary[500];
  let hash = 0;
  for (let i = 0; i < boardId.length; i++) {
    hash = boardId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BOARD_PALETTE.length;
  return BOARD_PALETTE[index];
}

const priorityWeights: Record<string, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function groupCardsByDueDate(cards: TimelineCard[]): TimelineSection[] {
  const sectionsMap: Record<string, TimelineItem[]> = {};
  const noDueDateSection: TimelineItem[] = [];

  cards.forEach((card) => {
    const boardColor = getBoardColor(card.boardId);
    const timeText = card.dueDate ? dayjs(card.dueDate).format("h:mm A") : "";
    const isOverdue = card.dueDate ? dayjs(card.dueDate).isBefore(dayjs()) : false;

    const item: TimelineItem = {
      id: card.id,
      name: card.name,
      boardId: card.boardId,
      boardName: card.boardName,
      boardColor: boardColor,
      time: timeText,
      priority: card.priority?.toLowerCase() || "low",
      listName: card.listName,
      isOverdue: isOverdue,
      dueDate: card.dueDate,
      createdAt: card.createdAt,
      checklistTotal: card.checklistTotal || 0,
      checklistCompleted: card.checklistCompleted || 0,
    };

    if (!card.dueDate) {
      noDueDateSection.push(item);
      return;
    }

    const dateStr = dayjs(card.dueDate).format("YYYY-MM-DD");
    if (!sectionsMap[dateStr]) {
      sectionsMap[dateStr] = [];
    }
    sectionsMap[dateStr].push(item);
  });

  const sortedDates = Object.keys(sectionsMap).sort((a, b) => a.localeCompare(b));

  const sections: TimelineSection[] = sortedDates.map((dateStr) => {
    const d = dayjs(dateStr);
    const today = dayjs().startOf("day");
    const yesterday = dayjs().subtract(1, "day").startOf("day");
    const tomorrow = dayjs().add(1, "day").startOf("day");

    let title = "";
    let isToday = false;
    const isPast = d.isBefore(today);

    if (d.isSame(today, "day")) {
      title = "Today";
      isToday = true;
    } else if (d.isSame(yesterday, "day")) {
      title = "Yesterday";
    } else if (d.isSame(tomorrow, "day")) {
      title = "Tomorrow";
    } else {
      title = d.format("ddd, MMM D");
    }

    const sortedData = sectionsMap[dateStr].sort((a, b) => {
      const weightA = priorityWeights[a.priority] || 0;
      const weightB = priorityWeights[b.priority] || 0;
      return weightB - weightA;
    });

    return { title, date: dateStr, isToday, isPast, data: sortedData };
  });

  if (noDueDateSection.length > 0) {
    noDueDateSection.sort((a, b) => {
      const weightA = priorityWeights[a.priority] || 0;
      const weightB = priorityWeights[b.priority] || 0;
      return weightB - weightA;
    });

    sections.push({
      title: "No Due Date",
      date: "none",
      isToday: false,
      isPast: false,
      data: noDueDateSection,
    });
  }

  return sections;
}

export default function Timeline() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const [cards, setCards] = useState<TimelineCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTimeline = async () => {
    try {
      if (!id) return;
      const data = await WorkspaceService.getWorkspaceTimeline(id);
      setCards(data);
    } catch (error) {
      console.error("Failed to load workspace timeline cards", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchTimeline().finally(() => setLoading(false));
    }, [id])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTimeline();
    setRefreshing(false);
  };

  const handleCardPress = (item: TimelineItem) => {
    if (!id || !item.boardId || !item.id) return;
    router.push(`/(tabs)/workspace/${id}/${item.boardId}/${item.id}`);
  };

  const sections = useMemo(() => groupCardsByDueDate(cards), [cards]);

  // ─── Checklist color helper ───
  const getChecklistColors = (completed: number, total: number) => {
    if (completed === total) {
      return { bg: Colors.success + '15', text: Colors.success, icon: Colors.success };
    } else if (completed > 0) {
      return { bg: Colors.warning + '15', text: Colors.warning, icon: Colors.warning };
    }
    return { bg: Colors.gray[100], text: Colors.gray[600], icon: Colors.gray[500] };
  };

  // ─── Render a single card ───
  const renderItem = ({ item, index, section }: { item: TimelineItem; index: number; section: TimelineSection }) => {
    const isLast = index === section.data.length - 1;
    const clColors = item.checklistTotal > 0
      ? getChecklistColors(item.checklistCompleted, item.checklistTotal)
      : null;

    return (
      <View style={styles.timelineRow}>
        {/* Left timeline connector */}
        <View style={styles.connectorCol}>
          <View style={[
            styles.dot,
            item.isOverdue
              ? { backgroundColor: Colors.error }
              : section.isToday
                ? { backgroundColor: Theme.primary }
                : { backgroundColor: Colors.gray[300] },
          ]} />
          {!isLast && (
            <View style={[
              styles.connectorLine,
              section.isToday
                ? { backgroundColor: Colors.primary[200] }
                : { backgroundColor: Colors.gray[200] },
            ]} />
          )}
        </View>

        {/* Card body */}
        <TouchableOpacity
          style={[
            styles.card,
            {
              borderLeftColor: item.isOverdue ? Colors.gray[400] : item.boardColor,
              opacity: item.isOverdue ? 0.75 : 1,
            },
          ]}
          activeOpacity={0.7}
          onPress={() => handleCardPress(item)}
        >
          {/* Row 1: Card name + priority */}
          <View style={styles.cardTitleRow}>
            <Text
              style={[
                styles.cardTitle,
                item.isOverdue && { textDecorationLine: 'line-through', color: Colors.gray[500] },
              ]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Badges name={item.priority} size={10} />
          </View>

          {/* Row 2: Metadata chips */}
          <View style={styles.cardMeta}>
            {/* Board badge */}
            <Badges
              name={item.boardName}
              color={item.boardColor + '18'}
              style={{ color: item.boardColor }}
              size={10}
            />

            {/* Checklist progress */}
            {clColors && (
              <Badges
                name={`${item.checklistCompleted}/${item.checklistTotal}`}
                size={10}
                color={clColors.bg}
                style={{ color: clColors.text }}
                icon={<Icons name="CheckList" size={11} color={clColors.icon} />}
              />
            )}

            {/* Due date — only shown when the card actually has one */}
            {item.dueDate && (
              <Badges
                name={dayjs(item.dueDate).format("MMM D • h:mm A")}
                size={10}
                color={item.isOverdue ? Colors.error + '12' : Colors.primary[500] + '12'}
                style={{ color: item.isOverdue ? Colors.error : Colors.primary[500] }}
                icon={<Icons name="Calender" size={11} color={item.isOverdue ? Colors.error : Colors.primary[500]} />}
              />
            )}
          </View>

          {/* Row 3: List name */}
          <Text style={styles.listLabel}>{item.listName}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ─── Render section header ───
  const renderSectionHeader = ({ section }: { section: TimelineSection }) => {
    const cardCount = section.data.length;
    return (
      <View style={styles.sectionHeader}>
        <View style={[
          styles.sectionBadge,
          section.isToday && styles.sectionBadgeToday,
          section.isPast && styles.sectionBadgePast,
        ]}>
          <Text style={[
            styles.sectionTitle,
            section.isToday && styles.sectionTitleToday,
            section.isPast && styles.sectionTitlePast,
          ]}>
            {section.title}
          </Text>
        </View>

        <View style={styles.sectionLine} />

        <Text style={styles.sectionCount}>
          {cardCount} {cardCount === 1 ? 'card' : 'cards'}
        </Text>
      </View>
    );
  };

  // ─── Loading state ───
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.primary} />
        <Text style={styles.loadingText}>Loading timeline…</Text>
      </View>
    );
  }

  // ─── Main render ───
  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Theme.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icons name="Calender" size={48} color={Colors.gray[300]} />
            <Text style={styles.emptyTitle}>No cards yet</Text>
            <Text style={styles.emptyText}>
              Cards from your boards will appear here on the timeline
            </Text>
          </View>
        }
      />
    </View>
  );
}

// ════════════════════════════════════════════════
//  STYLES
// ════════════════════════════════════════════════

const DOT_SIZE = 10;
const CONNECTOR_WIDTH = 32;

const styles = StyleSheet.create({
  // ─── Layout ───
  container: {
    flex: 1,
    backgroundColor: Theme.background,
  },
  listContent: {
    paddingTop: Spacing[2],
    paddingBottom: Spacing[8],
  },

  // ─── Loading ───
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.background,
  },
  loadingText: {
    ...Typography.body,
    marginTop: Spacing[3],
    color: Theme.textSecondary,
  },

  // ─── Section header ───
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    marginTop: Spacing[5],
    marginBottom: Spacing[1],
  },
  sectionBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
  },
  sectionBadgeToday: {
    backgroundColor: Colors.primary[500],
  },
  sectionBadgePast: {
    backgroundColor: Colors.gray[200],
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.gray[600],
    letterSpacing: 0.3,
  },
  sectionTitleToday: {
    color: '#FFFFFF',
  },
  sectionTitlePast: {
    color: Colors.gray[500],
  },
  sectionLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray[200],
    marginHorizontal: Spacing[2],
  },
  sectionCount: {
    ...Typography.label,
    fontSize: 11,
    color: Colors.gray[400],
  },

  // ─── Timeline row (connector + card) ───
  timelineRow: {
    flexDirection: 'row',
    paddingRight: Spacing[4],
    paddingLeft: Spacing[4],
  },
  connectorCol: {
    width: CONNECTOR_WIDTH,
    alignItems: 'center',
    paddingTop: Spacing[4] + DOT_SIZE / 2,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Colors.gray[300],
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.gray[200],
    marginTop: 2,
    borderRadius: 1,
  },

  // ─── Card ───
  card: {
    flex: 1,
    backgroundColor: Theme.surface,
    borderRadius: 14,
    padding: Spacing[3],
    marginVertical: Spacing[1],
    borderLeftWidth: 4,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },

  // Row 1: title + priority
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing[2],
  },
  cardTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Theme.textPrimary,
    flex: 1,
    lineHeight: 20,
  },

  // Row 2: metadata badges
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing[1],
    marginTop: Spacing[2],
  },

  // Row 3: list label
  listLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.gray[400],
    marginTop: Spacing[2],
  },

  // ─── Empty state ───
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: Spacing[8],
  },
  emptyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.gray[700],
    marginTop: Spacing[4],
  },
  emptyText: {
    ...Typography.body,
    color: Colors.gray[400],
    textAlign: 'center',
    marginTop: Spacing[1],
    lineHeight: 20,
  },
});