import BoardCard from "@/components/boards/BoardCard";
import Icons from "@/components/icons/Icons";
import { Screen } from "@/components/layout/Screen";
import Button from "@/components/ui/Button";
import { BoardCardUI } from "@/modules/board/board";
import WorkspaceService from "@/modules/workspace/workspace.service";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
export default function WorkspaceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [boards, setBoards] = useState<BoardCardUI[]>([]);

  useEffect(() => {
    const getWorkspace = async () => {
      try {
        const respone = await WorkspaceService.getWorkspaceBoard(id);
        setBoards(respone);
      } catch (error) {}
    };
    getWorkspace();
  }, [id]);
  return (
    <Screen>
      <View style={{ flexDirection: "column" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: Spacing[3],
            alignItems: "center",
          }}
        >
          <View>
            <Text style={[Typography.title, { fontSize: 18 }]}>Board</Text>
            <Text style={[Typography.caption]}>{boards.length} boards</Text>
          </View>
          <View style={{ paddingVertical: Spacing[3] }}>
            <Button
              leftIcon={<Icons name="Plus" color={Theme.surface} size={18} />}
              onPress={() => {}}
              style={{
                paddingVertical: Spacing[2],
                paddingHorizontal: Spacing[3],
                borderRadius: 6,
                gap: Spacing[1],
              }}
            >
              <Text style={{ fontSize: 12 }}>Create Board</Text>
            </Button>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: Spacing[3],
          }}
        >
          {boards.map((b) => (
            <BoardCard
              key={b.id}
              {...b}
              styleCard={{ width: "48%" }}
              styleText={{ fontSize: 14 }}
              showMembers={false}
            />
          ))}
        </View>
      </View>
    </Screen>
  );
}
