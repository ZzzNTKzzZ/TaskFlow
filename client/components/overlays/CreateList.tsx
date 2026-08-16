import { Text, View } from "react-native";
import BaseOverlay from "./BaseOverlay";
import Icons from "../icons/Icons";
import Input from "../ui/Input";
import DropDown from "./DropDown";
import Button from "../ui/Button";
import { useEffect, useState } from "react";
import { Theme } from "@/theme/theme";
import { Spacing } from "@/theme/spacing";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import capitalizeFirstLetter from "@/helper/capitalizeFirstLetter";
import WorkspaceService from "@/services/workspace.service";
import BoardService from "@/services/board.service";

export default function CreateList({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState<string>("");
  const { boardId, id } = useLocalSearchParams<{
    id: string;
    boardId: string;
  }>();
  const pathname = usePathname()
  const [options, setOptions] = useState<{ id: string; name: string }[]>([
    {
      id: "",
      name: "",
    },
  ]);
  const [selected, setSelected] = useState<{ id: string; name: string }>({
    id: "",
    name: "",
  });

  useEffect(() => {
    const getBoards = async () => {
      const response = await WorkspaceService.getWorkspaceBoards(id);
      const filteredOptions = response.map((rs) => ({
        id: rs.id,
        name: rs.name,
      }));
      setOptions(filteredOptions);

      setSelected(
        () =>
          filteredOptions.find((option) => option.id === boardId) || {
            id: "",
            name: "",
          },
      );
    };
    getBoards();
  }, []);

  const handleCreate = async (payload: { boardId: string; name: string }) => {
    const tempId = `tmp-${Date.now()}`;
    const tempCardId = `tmp-card-${Date.now()}`;
    const tempList = {
      id: tempId,
      name: payload.name,
      boardId: payload.boardId,
      position: 0,
      cards: [
        {
          id: tempCardId,
          name: "New Task",
          description: null,
          listId: tempId,
          position: 0,
          priority: "low",
          dueDate: null,
          assignees: [],
          labels: [],
          checklists: [
            {
              id: `tmp-checklist-${Date.now()}`,
              name: "Task Checklist",
              items: [
                { id: `i1-${Date.now()}`, name: "Item 1", isCompleted: false },
                { id: `i2-${Date.now()}`, name: "Item 2", isCompleted: false },
                { id: `i3-${Date.now()}`, name: "Item 3", isCompleted: false },
              ],
            },
          ],
        },
      ],
      cardCount: 1,
    } as any;

    // optimistic notify
    try {
      const eventBus = await import("@/services/eventBus");
      eventBus.emit("list:creating", tempList);
    } catch (e) {
      console.error("eventBus error:", e);
    }

    try {
      const response = await BoardService.createList(payload);
      if (response && response.id) {
        try {
          const eventBus = await import("@/services/eventBus");
          eventBus.emit("list:created", { tempId, created: response });
        } catch (e) {
          console.error("eventBus error:", e);
        }
      } else {
        const eventBus = await import("@/services/eventBus");
        eventBus.emit("list:create_failed", { tempId });
      }
    } catch (error) {
      console.error("Create list error:", error);
      try {
        const eventBus = await import("@/services/eventBus");
        eventBus.emit("list:create_failed", { tempId });
      } catch (e) {}
    }

    onClose();
    setName("");
  };
  
  return (
    <BaseOverlay visible={visible} onClose={onClose} >
      <View style={{gap: Spacing[3]}}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={[Typography.heading, {fontSize: 24, letterSpacing: 1}]}>Create List</Text>
          <Icons name="Cross" />
        </View>
        <Input
          value={name}
          setValue={setName}
          label="List name"
          placeholder="e.g. In Progress"
          stylesLabel={[
            Typography.title,
            { color: Theme.textPrimary, fontSize: 16 },
          ]}
        />
        <Text
          style={[Typography.title, { color: Theme.textPrimary, fontSize: 16 }]}
        >
          Board selected
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 16,
            paddingVertical: Spacing[3],
            paddingHorizontal: Spacing[4],
            borderColor: Theme.border,
            marginBottom: Spacing[4]
          }}
        >
          <DropDown
            variant="card"
            selected={selected.name || options[0].name}
            setSelected={setSelected}
            options={options}
            stylesText={{
              color: Theme.textPrimary,
              marginBottom: Spacing[2],
              fontSize: 16,
            }}
            renderItem={(o) => (
              <View
                style={{
                  paddingVertical: Spacing[2],
                  paddingHorizontal: Spacing[3],
                  borderRadius: 12,
                  justifyContent: "center",
                  borderBottomColor: Theme.border,
                  backgroundColor:
                    o.name === selected.name
                      ? Colors.primary[200]
                      : "transparent",
                  overflow: "hidden",
                }}
              >
                <Text
                  style={[
                    Typography.caption,
                    {
                      fontSize: 16,
                      color: Theme.textPrimary,
                    },
                  ]}
                >
                  {capitalizeFirstLetter(o.name)}
                </Text>
              </View>
            )}
          />
        </View>
        <Button onPress={() => handleCreate({ boardId: selected.id, name})}>Add List</Button>
      </View>
    </BaseOverlay>
  );
}
