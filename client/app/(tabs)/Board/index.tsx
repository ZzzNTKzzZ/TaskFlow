import Header from "@/components/layout/Header";
import { getBoardByWorkspaceIdApi } from "@/service/board.service";
import { globalStyles } from "@/styles/global";
import { Colors, Rounded, Spacing, Typography } from "@/theme";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import EmptyBoard from "@/assets/icons/EmptyBoard.svg";
import Button from "@/components/Button";
import Plus from "@/assets/icons/Plus.svg";
import { AppIcon } from "@/components/ui/AppIcon";
export default function Board() {
  const [loading, setLoading] = useState(true);
  const { workspaceId, name } = useLocalSearchParams();

  const [data, setData] = useState([]);
  const loadBoardData = async () => {
    try {
      setLoading(false);
      const data = await getBoardByWorkspaceIdApi(workspaceId as string);
      console.log("Boards", data);
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadBoardData();
    }, []),
  );

  const handleCreateBoard = () => {
    router.push(`/Board/Create?workspaceId=${workspaceId}`)
  }

  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  const renderEmptyBoards = () => {
    return (
      <View
        style={[
          globalStyles.container,
          {
            paddingVertical: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <EmptyBoard />
        <View style={{ gap: Spacing.lg }}>
          <Text
            style={[
              globalStyles.textHeading,
              { color: Colors.primary, textAlign: "center" },
            ]}
          >
            No Active Boards
          </Text>
          <Text style={[globalStyles.textDescription, { textAlign: "center" }]}>
            Begin your architectural journey. Your engineering ledger is waiting
            for its first structural framework.
          </Text>
          <Button
            title="Create First Board"
            leftIcon={<AppIcon name="Plus" size={14} />}
            styleClass={{
              alignSelf: "center",
              borderRadius: Rounded.sm,
            }}
            onPress={handleCreateBoard}
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[globalStyles.container]}>
      <Header />
      <View style={{ marginBottom: Spacing.xl }}>
        <Text style={[globalStyles.subHeader]}>{name}</Text>
        <Text
          style={[
            Typography.displayLg,
            globalStyles.textHeading,
            { fontSize: 32 },
          ]}
        >
          Boards Dashboard
        </Text>
      </View>
      {data.length <= 0 ? renderEmptyBoards() : <Text>b</Text>}
    </ScrollView>
  );
}
