import Button from "@/components/Button";
import Header from "@/components/layout/Header";
import { getBoardByWorkspaceIdApi } from "@/service/board.service";
import { globalStyles } from "@/styles/global";
import { Colors, Rounded, Spacing, Typography } from "@/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { AppIcon } from "@/components/ui/AppIcon";
export default function Detail() {
  const { id, name } = useLocalSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCreate = () => {
    router.push(`/(tabs)/Board/TaskCreate?boardId=${id}`)
  }

  useEffect(() => {
    const loadBoard = async () => {
      try {
        setLoading(true);
        const data = await getBoardByWorkspaceIdApi(id as string);
        setData(data);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, []);
  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  const renderEmptyBoards = () => {
    return (
      <View
        style={{
          backgroundColor: Colors.surfaceLow,
          padding: Spacing.xxl,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: Rounded.lg,
        }}
      >
        <AppIcon name="Drafting" />
        <Text
          style={[
            Typography.displayLg,
            {
              textTransform: "uppercase",
              fontSize: 28,
              textAlign: "center",
              letterSpacing: 2.4,
              width: "60%",
              marginBottom: Spacing.lg,
            },
          ]}
        >
          No Active Ledger Entries
        </Text>
        <Text
          style={[
            Typography.titleMd,
            globalStyles.textDescription,

            {
              textAlign: "center",
              width: "60%",
              marginBottom: Spacing.lg,
            },
          ]}
        >
          The architectural workspace is currently clear. Initialize your
          project ledger to begin drafting development milestones.
        </Text>
        <Button
        onPress={() => handleCreate()}
          title="Create First Task"
          leftIcon={<AppIcon name="CreateFirstTask" />}
          styleClass={{ alignSelf: "center" }}
        />
      </View>
    );
  };

  return (
    <ScrollView
      style={[globalStyles.container, { backgroundColor: Colors.onPrimary }]}
    >
      <Header />
      <Text
        style={[
          Typography.displayLg,
          globalStyles.textHeading,
          { color: Colors.primary },
        ]}
      >
        {name}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: Spacing.lg,
          marginBottom: 40,
        }}
      >
        <Button
          title="Filter"
          leftIcon={<AppIcon name="Filter" size={14} />}
          variant="secondary"
        />
        <Button
          title="New Task"
          onPress={handleCreate}
          leftIcon={<AppIcon name="Plus" size={14} />}
          styleClass={{ alignSelf: "flex-end" }}
        />
      </View>
      {data.length <= 0 ? renderEmptyBoards() : <Text>b</Text>}
    </ScrollView>
  );
}
