import BoardCard from "@/components/boards/BoardCard";
import Icons from "@/components/icons/Icons";
import { Screen } from "@/components/layout/Screen";
import KebabMenu from "@/components/overlays/KebabMenu";
import Button from "@/components/ui/Button";
import { BoardCardUI } from "@/modules/board/board";
import WorkspaceService from "@/modules/workspace/workspace.service";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { useIsFocused } from "@react-navigation/core";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function WorkspaceDetail() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const isFocused = useIsFocused();

  const [boards, setBoards] = useState<BoardCardUI[]>([]); // Dữ liệu gốc từ API
  const [displayBoards, setDisplayBoards] = useState<BoardCardUI[]>([]); // Dữ liệu thực tế hiển thị trên UI
  const [active, setActive] = useState(false);
  const [sort, setSort] = useState("Recently");
  const [search, setSearch] = useState("");

  // 1. Fetch dữ liệu từ API khi chuyển màn hình hoặc có thay đổi id
  useEffect(() => {
    const getWorkspace = async () => {
      try {
        const response = await WorkspaceService.getWorkspaceBoards(id);
        setBoards(response);
      } catch (error) {
        console.error("Lỗi lấy danh sách board:", error);
      }
    };
    if (id) getWorkspace();
  }, [id, isFocused]);

  // 2. Tự động xử lý Filter & Sort tập trung khi bất kỳ state liên quan nào thay đổi
  useEffect(() => {
    // Lọc theo từ khóa tìm kiếm (nếu sau này bạn thêm thanh Input Search)
    let processedData = boards.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );

    // Xử lý Sắp xếp (Sort)
    if (sort === "Name(A-Z)" || sort === "Recently") {
      processedData = [...processedData].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    } else if (sort === "Members") {
      processedData = [...processedData].sort(
        (a, b) => b.memberCount - a.memberCount,
      );
    }

    // Cập nhật mảng kết quả vào state hiển thị UI
    setDisplayBoards(processedData);
  }, [boards, sort, search]); // Lắng nghe sự thay đổi của cả mảng gốc, sort, search

  const handleSortSelect = (sortType: string) => {
    setSort(sortType);
    setActive(false);
  };

  return (
    <Screen>
      <View style={{ flexDirection: "column", marginBottom: Spacing[3] }}>
        {/* Header Section */}
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

          {/* Action Buttons */}
          <View style={{ paddingVertical: Spacing[3], flexDirection: "row" }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActive(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: Spacing[2],
                paddingHorizontal: Spacing[2],
                backgroundColor: Theme.surface,
                borderWidth: 1.5,
                borderColor: Theme.border,
                borderRadius: 8,
                marginRight: Spacing[2],
              }}
            >
              <Icons name="Sort" size={24} color={Theme.primary} />
            </TouchableOpacity>

            <Button
              leftIcon={<Icons name="Plus" color={Theme.surface} size={18} />}
              onPress={() =>
                router.push({
                  pathname: "/(board)/create",
                  params: { id, name },
                })
              }
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

        {/* Boards Grid View */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: Spacing[3],
          }}
        >
          {displayBoards.map((b) => (
            <BoardCard
              key={b.id}
              {...b}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/workspace/[id]/[boardId]/(board-detail)",
                  params: {
                    id: id,
                    boardId: b.id,
                    name: b.name,
                    parentName: name,
                  },
                })
              }
              styleCard={{ width: "48%" }}
              styleText={{ fontSize: 14 }}
              showMembers={false}
            />
          ))}
        </View>
      </View>

      {/* Kebab Menu Sort */}
      <KebabMenu
        visible={active}
        onClose={() => setActive(false)}
        menu={["Recently", "Name(A-Z)", "Members"]}
        onSelectMenu={handleSortSelect}
      />
    </Screen>
  );
}
