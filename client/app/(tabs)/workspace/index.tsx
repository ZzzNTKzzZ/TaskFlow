import DisplayIcon from "@/components/icons/DisplayIcon";
import Icons from "@/components/icons/Icons";
import { Screen } from "@/components/layout/Screen";
import KebabMenu from "@/components/overlays/KebabMenu";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import WorkspaceCardUI from "@/components/workspaces/WorkspaceCard";
import { useCurrentUser } from "@/modules/auth/hook/useCurrentUser";
import { WorkspaceCard } from "@/modules/workspace/workspace";
import WorkspaceService from "@/modules/workspace/workspace.service";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Workspace() {
  const ITEM_ONE_PAGE = 8;

  const [data, setData] = useState<WorkspaceCard[]>([]);
  const [displayType, setDisplayType] = useState<"Grid" | "List">("Grid");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("Recently"); // State giữ kiểu sort
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<WorkspaceCard[]>([]);
  const [totalPage, setToltalPage] = useState<number>(1);
  const [page, setPage] = useState(1);
  const user = useCurrentUser();
  const [active, setActive] = useState<boolean>(false);

  // 1. Chỉ gọi API lấy dữ liệu thô một lần duy nhất khi vào trang
  useEffect(() => {
    const initWorkspaces = async () => {
      try {
        setLoading(true);
        const list = await WorkspaceService.getWorkspaces(24);
        setData(list);
      } catch (error) {
        console.error("Lỗi khởi tạo Workspace:", error);
      } finally {
        setLoading(false);
      }
    };
    initWorkspaces();
  }, []);

  // 2. TỰ ĐỘNG XỬ LÝ: Tìm kiếm -> Sắp xếp -> Phân trang mỗi khi các state liên quan thay đổi
  useEffect(() => {
    if (data.length === 0) return;

    // Bước A: Lọc theo tìm kiếm (Search)
    let processedData = data.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "Name(A-Z)" || sort === "Recently") {
      processedData = [...processedData].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "Members") {
      processedData = [...processedData].sort((a, b) => b.memberCount - a.memberCount);
    }

    const calculatedTotalPage = Math.ceil(processedData.length / ITEM_ONE_PAGE);
    setToltalPage(calculatedTotalPage || 1);

    const startIndex = ITEM_ONE_PAGE * (page - 1);
    const endIndex = ITEM_ONE_PAGE * page;
    setWorkspaces(processedData.slice(startIndex, endIndex));
  }, [data, search, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  // Hàm xử lý khi chọn Menu Sort
  const handleSortSelect = (sortType: string) => {
    setSort(sortType);
    setActive(false);
  };

  if (loading) return <Text style={{ padding: Spacing[4] }}>Loading...</Text>;

  return (
    <Screen>
      <View style={{ paddingVertical: Spacing[6] }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={[Typography.heading]}>Workspaces</Text>
            <Text style={[Typography.caption]}>
              All your workspaces in one place
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(workspace)/create")}
            activeOpacity={0.7}
            style={{
              backgroundColor: Theme.surface,
              borderRadius: 100,
              padding: Spacing[2],
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
            }}
          >
            <Icons name="Plus" />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={{ marginVertical: Spacing[4] }}>
          <Input
            isSearch
            value={search}
            setValue={setSearch}
            placeholder="Search workspace..."
            stylesInput={{ marginBottom: Spacing[0] }}
          />
        </View>

        {/* Toolbar: Stats & Sort/Display */}
        <View
          style={{
            marginBottom: Spacing[2],
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[Typography.caption]}>
            {data.length} workspaces
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: Spacing[2],
              zIndex: 100,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActive(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: Spacing[2],
                paddingHorizontal: Spacing[2],
              }}
            >
              <Icons name="Sort" size={24} />
              <Text style={[Typography.subtitle, { color: Theme.primary, fontSize: 14 }]}>
                {sort}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setDisplayType("Grid")}
              style={{
                backgroundColor: Theme.surface,
                borderRadius: 8,
                padding: Spacing[1],
                elevation: 2,
              }}
            >
              <DisplayIcon name="Gird" active={displayType === "Grid"} />
            </TouchableOpacity>
            
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setDisplayType("List")}
              style={{
                backgroundColor: Theme.surface,
                borderRadius: 8,
                padding: Spacing[1],
                elevation: 2,
              }}
            >
              <DisplayIcon name="List" active={displayType === "List"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Grid/List Content */}
        <View
          style={{
            flexDirection: displayType === "Grid" ? "row" : "column",
            flexWrap: displayType === "Grid" ? "wrap" : "nowrap",
            justifyContent: "space-between",
            minHeight: 500,
            marginBottom: Spacing[3],
          }}
        >
          {workspaces.map((ws) => (
            <WorkspaceCardUI
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/workspace/[id]/(workspace-detail)",
                  params: {
                    id: ws.id,
                    name: ws.name,
                    icon: ws.icon,
                    color: ws.color,
                  },
                });
              }}
              key={ws.id}
              {...ws}
            />
          ))}
        </View>

        {/* Pagination */}
        <Pagination
          totalPage={totalPage}
          page={page}
          setPage={(newPage) => setPage(newPage)}
        />
      </View>

      {/* Kebab Menu */}
      <KebabMenu
        visible={active}
        onClose={() => setActive(false)}
        menu={["Recently", "Name(A-Z)", "Members"]}
        onSelectMenu={handleSortSelect}
      />
    </Screen>
  );
}