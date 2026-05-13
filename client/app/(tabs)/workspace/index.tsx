import DisplayIcon from "@/components/icons/DisplayIcon";
import Icons from "@/components/icons/Icons";
import { Screen } from "@/components/layout/Screen";
import DropDown from "@/components/overlays/DropDown";
import Input from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import WorkspaceCardUI from "@/components/workspaces/WorkspaceCard";
import { useCurrentUser } from "@/modules/auth/hook/useCurrentUser";
import { WorkspaceCard } from "@/modules/workspace/workspace";
import WorkspaceService from "@/modules/workspace/workspace.service";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Workspace() {
  const ITEM_ONE_PAGE = 8; // Number workspaces display in 1 page

  const [data, setData] = useState<WorkspaceCard[]>([])
  const [displayType, setDisplayType] = useState<"Grid" | "List">("Grid");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<{ name: string; id: number }>({
    id: 0,
    name: "",
  });
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<WorkspaceCard[]>([]);
  const [totalPage, setToltalPage] = useState<number>(1);
  const [page, setPage] = useState(2);
  const user = useCurrentUser();

  const sorts = [
    {
      id: 1,
      name: "Recently Updated",
    },
    {
      id: 2,
      name: "Name (A-Z)",
    },
    {
      id: 3,
      name: "Visibility",
    },
    {
      id: 4,
      name: "Most Active",
    },
  ];

  useEffect(() => {
    const initWorkspaces = async () => {
      try {
        setLoading(true);
        const list = await WorkspaceService.getWorkspaces(24);
        setData(list)
        setWorkspaces(
          list.slice(ITEM_ONE_PAGE * (page - 1), ITEM_ONE_PAGE * page),
        );
        if (user?.workspaceStats) {
          setToltalPage(
            Math.ceil(user?.workspaceStats.workspaceCount / ITEM_ONE_PAGE),
          );
        } else {
          setToltalPage(0);
        }
      } catch (error) {
        console.error("Lỗi khởi tạo Workspace:", error);
      } finally {
        setLoading(false);
      }
    };
    initWorkspaces();
  }, []);

  useEffect(() => {
       setWorkspaces(
          data.slice(ITEM_ONE_PAGE * (page - 1), ITEM_ONE_PAGE * page),
        );
  }, [page])



  return (
    <Screen padding={Spacing[6]}>
      <View style={{ paddingVertical: Spacing[6] }}>
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
            onPress={() => {}}
            activeOpacity={0.7}
            style={{
              backgroundColor: Theme.surface,
              borderRadius: 100,
              padding: Spacing[2],

              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
            }}
          >
            <Icons name="Plus" />
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: Spacing[4] }}>
          <Input
            isSearch
            value={search}
            setValue={setSearch}
            placeholder="Search workspace..."
            stylesInput={{ marginBottom: Spacing[0] }}
          />
        </View>
        <View
          style={{
            marginBottom: Spacing[2],
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={[Typography.caption]}>
            {user?.workspaceStats.workspaceCount || 0} workspaces
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end", // Đẩy tất cả sang phải
              gap: Spacing[2],
              position: "relative",
              zIndex: 100,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: Spacing[2],
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setDisplayType("Grid")}
                style={{
                  backgroundColor: Theme.surface,
                  borderRadius: 8,
                  padding: Spacing[1],

                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 4.65,
                  elevation: 8,
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

                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 4.65,
                  elevation: 8,
                }}
              >
                <DisplayIcon name="List" active={displayType === "List"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            minHeight: 500,
            marginBottom: Spacing[3],
          }}
        >
          {workspaces.map((ws) => (
            <WorkspaceCardUI
              key={ws.id}
              id={ws.id}
              name={ws.name}
              memberCount={ws.memberCount}
              icon={ws.icon}
              color={ws.color}
            />
          ))}
        </View>
        <Pagination totalPage={totalPage} page={page} setPage={(newPage) => setPage(newPage)} />
      </View>
    </Screen>
  );
}
