import { Text, View, TouchableOpacity } from "react-native";
import BaseOverlay from "./BaseOverlay";
import Icons from "../icons/Icons";
import DropDown from "./DropDown";
import Button from "../ui/Button";
import { useEffect, useState } from "react";
import { Theme } from "@/theme/theme";
import { Spacing } from "@/theme/spacing";
import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import capitalizeFirstLetter from "@/helper/capitalizeFirstLetter";
import BoardService from "@/services/board.service";
import CardService from "@/services/card.service";
import { router } from "expo-router";

export default function MoveCard({
  visible,
  onClose,
  boardId,
  cardId,
}: {
  visible: boolean;
  onClose: () => void;
  boardId?: string;
  cardId?: string;
}) {

  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<{ id: string; name: string }>({
    id: "",
    name: "",
  });

  useEffect(() => {
    if (!visible || !boardId) return;
    const getLists = async () => {
      const response = await BoardService.getBoardList(boardId);
      if (!response) return;
      const filteredOptions = response.map((rs: any) => ({
        id: rs.id,
        name: rs.name,
      }));
      setOptions(filteredOptions);

      if (filteredOptions.length > 0) {
        setSelected(filteredOptions[0]);
      }
    };
    getLists();
  }, [visible, boardId]);

  const handleMove = async () => {
    if (!boardId || !cardId || !selected.id) return;
    try {
      await CardService.updateCard(boardId, cardId, { listId: selected.id });
      try {
        const eventBus = await import("@/services/eventBus");
        eventBus.default.emit("card:updated", { cardId: cardId, payload: { listId: selected.id } });
      } catch (e) {}
      router.back();
    } catch (e) {
      console.error(e);
    }
    onClose();
  };

  return (
    <BaseOverlay visible={visible} onClose={onClose}>
      <View style={{ gap: Spacing[3] }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={[Typography.heading, { fontSize: 24, letterSpacing: 1 }]}>
            Move Card
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icons name="Cross" />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: Spacing[4] }}>
          <Text
            style={[
              Typography.title,
              { color: Theme.textPrimary, fontSize: 16, marginBottom: Spacing[2] },
            ]}
          >
            List selected
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 16,
              borderColor: Theme.border,
              paddingVertical: Spacing[3],
              paddingHorizontal: Spacing[4],
            }}
          >
            <DropDown
              variant="card"
              selected={selected.name || (options[0]?.name ?? "")}
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
                      o.name === selected.name ? Colors.primary[200] : "transparent",
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
                    {capitalizeFirstLetter(o.name) || ""}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>

        <Button onPress={handleMove}>Move</Button>
      </View>
    </BaseOverlay>
  );
}
