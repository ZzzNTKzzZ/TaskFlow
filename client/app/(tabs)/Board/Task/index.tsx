import Button from "@/components/Button";
import Header from "@/components/layout/Header";
import { getBoardByWorkspaceIdApi, getListsApi } from "@/service/board.service";
import { globalStyles } from "@/styles/global";
import { Colors, Rounded, Spacing, Typography } from "@/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { AppIcon } from "@/components/ui/AppIcon";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type ListProps = {
  boardId: string;
  id: string;
  position: number;
  title: string;
};
export default function Detail() {
  const { boardId, name } = useLocalSearchParams();
  const [data, setData] = useState<ListProps[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCreate = () => {
    router.push(`/Board/Task/Create?boardId=${boardId}`);
  };

  useEffect(() => {
    const loadBoard = async () => {
      try {
        setLoading(true);
        const data = await getListsApi({ boardId: boardId as string });
        console.log("data", data);
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

  const renderBoards = () => {
    return (
      <View>
        {data.map((d) => (
          <View
            key={d.id}
            style={{
              minWidth: 280,
              backgroundColor: Colors.surfaceLow,
              paddingHorizontal: Spacing.xxl,
              paddingVertical: Spacing.xxl,
              borderRadius: Rounded.md,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: Spacing.md,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: Colors.onSurfaceVariant,
                    borderRadius: Rounded.full,
                  }}
                ></View>
                <Text style={[Typography.labelSm, { fontSize: 14 }]}>
                  {d.title}
                </Text>
                <View
                  style={{
                    aspectRatio: 1,
                    backgroundColor: Colors.surfaceHighest,
                    borderRadius: Rounded.full,
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: 20,
                  }}
                >
                  <Text
                    style={{ fontSize: 12, fontFamily: "Manrope_600SemiBold" }}
                  >
                    {/* {quantity} */}
                  </Text>
                </View>
              </View>
              <View>
                <Pressable>
                  <AppIcon name="MeatBall" />
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

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
      {data.length <= 0 ? renderEmptyBoards() : renderBoards()}
    </ScrollView>
  );
}
