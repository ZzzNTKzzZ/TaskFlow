import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import BaseOverlay from "./BaseOverlay";
import Icons from "../icons/Icons";
import { Typography } from "@/theme/typography";
import { Theme } from "@/theme/theme";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import Badges from "../ui/Badges";
import SearchService from "@/services/search.service";
import { SearchResult, Priority } from "@/types/types";

interface SearchOverlayProps {
  visible: boolean;
  onClose: () => void;
}

type FilterTab = "ALL" | "BOARDS" | "CARDS" | "WORKSPACES";

export default function SearchOverlay({ visible, onClose }: SearchOverlayProps) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [results, setResults] = useState<SearchResult>({
    workspaces: [],
    boards: [],
    cards: [],
  });

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!visible) {
      setSearch("");
      setResults({ workspaces: [], boards: [], cards: [] });
      setActiveTab("ALL");
      setLoading(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
  }, [visible]);

  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed) {
      setResults({ workspaces: [], boards: [], cards: [] });
      setLoading(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    setLoading(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const data = await SearchService.search(trimmed);
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [search]);

  const totalResults =
    results.workspaces.length + results.boards.length + results.cards.length;

  const navigateToWorkspace = (workspace: { id: string; name: string }) => {
    onClose();
    router.push({
      pathname: "/(tabs)/workspace/[id]/(workspace-detail)",
      params: { id: workspace.id, name: workspace.name },
    });
  };

  const navigateToBoard = (board: {
    id: string;
    name: string;
    workspaceId: string;
    workspaceName: string;
  }) => {
    onClose();
    router.push({
      pathname: "/(tabs)/workspace/[id]/[boardId]/(board-detail)",
      params: {
        id: board.workspaceId,
        boardId: board.id,
        name: board.name,
        parentName: board.workspaceName,
      },
    });
  };

  const navigateToCard = (card: {
    id: string;
    boardId: string;
    workspaceId: string;
  }) => {
    onClose();
    router.push({
      pathname: "/(tabs)/workspace/[id]/[boardId]/[cardId]",
      params: {
        id: card.workspaceId,
        boardId: card.boardId,
        cardId: card.id,
      },
    });
  };

  const showWorkspaces =
    (activeTab === "ALL" || activeTab === "WORKSPACES") &&
    results.workspaces.length > 0;
  const showBoards =
    (activeTab === "ALL" || activeTab === "BOARDS") && results.boards.length > 0;
  const showCards =
    (activeTab === "ALL" || activeTab === "CARDS") && results.cards.length > 0;

  const filteredCount =
    activeTab === "ALL"
      ? totalResults
      : activeTab === "WORKSPACES"
      ? results.workspaces.length
      : activeTab === "BOARDS"
      ? results.boards.length
      : results.cards.length;

  return (
    <BaseOverlay visible={visible} onClose={onClose}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[Typography.heading, { fontSize: 20, color: Theme.textPrimary }]}>
          Search
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icons name="Cross" size={20} color={Theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBarContainer}>
        <Icons name="Search" size={18} color={Theme.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search workspaces, boards, cards..."
          placeholderTextColor={Theme.textSecondary}
          value={search}
          onChangeText={setSearch}
          autoFocus={visible}
          returnKeyType="search"
        />
        {loading ? (
          <ActivityIndicator size="small" color={Theme.primary} />
        ) : search.length > 0 ? (
          <TouchableOpacity onPress={() => setSearch("")} style={{ padding: 4 }}>
            <Icons name="Cross" size={16} color={Theme.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Tabs */}
      {search.trim().length > 0 && (
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "ALL" && styles.tabButtonActive]}
            onPress={() => setActiveTab("ALL")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "ALL" && styles.tabTextActive,
              ]}
            >
              All ({totalResults})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "BOARDS" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("BOARDS")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "BOARDS" && styles.tabTextActive,
              ]}
            >
              Boards ({results.boards.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "CARDS" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("CARDS")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "CARDS" && styles.tabTextActive,
              ]}
            >
              Cards ({results.cards.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "WORKSPACES" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("WORKSPACES")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "WORKSPACES" && styles.tabTextActive,
              ]}
            >
              Workspaces ({results.workspaces.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results Area */}
      <ScrollView
        style={{ maxHeight: 420 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {search.trim().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icons name="Search" size={44} color={Theme.border} />
            <Text style={[Typography.body, { color: Theme.textSecondary, marginTop: Spacing[3], textAlign: "center" }]}>
              Search for your workspaces, boards, and task cards in one place.
            </Text>
          </View>
        ) : loading && totalResults === 0 ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={Theme.primary} />
            <Text style={[Typography.caption, { color: Theme.textSecondary, marginTop: Spacing[2] }]}>
              Searching...
            </Text>
          </View>
        ) : filteredCount === 0 ? (
          <View style={styles.emptyContainer}>
            <Icons name="Search" size={40} color={Theme.border} />
            <Text style={[Typography.body, { color: Theme.textPrimary, marginTop: Spacing[2], fontWeight: "600" }]}>
              No results found
            </Text>
            <Text style={[Typography.caption, { color: Theme.textSecondary, marginTop: 4, textAlign: "center" }]}>
              We couldn't find any match for "{search}".
            </Text>
          </View>
        ) : (
          <View style={{ paddingBottom: Spacing[6] }}>
            {/* Workspaces Section */}
            {showWorkspaces && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>WORKSPACES</Text>
                {results.workspaces.map((ws) => (
                  <TouchableOpacity
                    key={ws.id}
                    style={styles.itemRow}
                    activeOpacity={0.7}
                    onPress={() => navigateToWorkspace(ws)}
                  >
                    <View style={[styles.iconWrapper, { backgroundColor: Colors.primary[100] }]}>
                      <Icons name="WorkspaceManage" size={18} color={Theme.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{ws.name}</Text>
                      <Text style={styles.itemSubtitle}>
                        {ws.boardCount} boards • {ws.memberCount} members
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Boards Section */}
            {showBoards && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>BOARDS</Text>
                {results.boards.map((b) => (
                  <TouchableOpacity
                    key={b.id}
                    style={styles.itemRow}
                    activeOpacity={0.7}
                    onPress={() => navigateToBoard(b)}
                  >
                    <View style={[styles.iconWrapper, { backgroundColor: "#E0E7FF" }]}>
                      <Icons name="Board" size={18} color="#4F46E5" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{b.name}</Text>
                      <Text style={styles.itemSubtitle}>In {b.workspaceName}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Cards Section */}
            {showCards && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>CARDS</Text>
                {results.cards.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.cardItemRow}
                    activeOpacity={0.7}
                    onPress={() => navigateToCard(c)}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing[2], flex: 1 }}>
                        <Icons name="Todo" size={18} color={Theme.textSecondary} />
                        <Text numberOfLines={1} style={[styles.itemTitle, { flex: 1 }]}>
                          {c.name}
                        </Text>
                      </View>
                      {c.priority && (
                        <Badges name={c.priority as Priority} size={10} />
                      )}
                    </View>

                    {c.description ? (
                      <Text numberOfLines={2} style={styles.cardDescription}>
                        {c.description}
                      </Text>
                    ) : null}

                    <View style={styles.breadcrumbContainer}>
                      <Text numberOfLines={1} style={styles.breadcrumbText}>
                        {c.workspaceName} › {c.boardName} › {c.listName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </BaseOverlay>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing[3],
  },
  closeButton: {
    padding: 4,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Theme.border,
    borderRadius: 14,
    backgroundColor: Theme.surface,
    paddingHorizontal: Spacing[3],
    height: 46,
    marginBottom: Spacing[3],
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing[2],
    color: Theme.textPrimary,
    fontSize: 15,
    paddingVertical: 0,
  },
  tabsContainer: {
    flexDirection: "row",
    gap: Spacing[2],
    marginBottom: Spacing[3],
    flexWrap: "wrap",
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Theme.background,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  tabButtonActive: {
    backgroundColor: Theme.primary,
    borderColor: Theme.primary,
  },
  tabText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: "600",
    color: Theme.textSecondary,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  emptyContainer: {
    paddingVertical: Spacing[6],
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing[4],
  },
  sectionContainer: {
    marginTop: Spacing[2],
    marginBottom: Spacing[2],
  },
  sectionTitle: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: Theme.textSecondary,
    marginBottom: Spacing[2],
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[2],
    borderRadius: 12,
    marginBottom: 4,
  },
  cardItemRow: {
    padding: Spacing[3],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Theme.border,
    backgroundColor: Theme.surface,
    marginBottom: Spacing[2],
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitle: {
    ...Typography.title,
    fontSize: 15,
    color: Theme.textPrimary,
  },
  itemSubtitle: {
    ...Typography.caption,
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 2,
  },
  cardDescription: {
    ...Typography.caption,
    fontSize: 12,
    color: Theme.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  breadcrumbContainer: {
    marginTop: Spacing[2],
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: Theme.border,
  },
  breadcrumbText: {
    ...Typography.caption,
    fontSize: 11,
    color: Theme.textSecondary,
  },
});
