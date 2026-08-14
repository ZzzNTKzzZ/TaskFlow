import { TouchableOpacity, View } from "react-native";
import BaseOverlay from "./BaseOverlay";
import { Text } from "react-native";
import Icons from "../icons/Icons";
import { Typography } from "@/theme/typography";
import Input from "../ui/Input";
import { useEffect, useState } from "react";
import { Theme } from "@/theme/theme";
import { Spacing } from "@/theme/spacing";
import { Colors } from "@/theme/colors";
import capitalizeFirstLetter from "@/helper/capitalizeFirstLetter";
import DropDown from "./DropDown";
import BoardService from "@/services/board.service";
import { router, useLocalSearchParams } from "expo-router";
import Calendar from "../ui/Calendar";
import Button from "../ui/Button";
import { formatYearMonthDate } from "@/helper/Day";
import { Priority } from "@/types/types";
import CardService from "@/services/card.service";

interface CardData {
  id: string;
  name: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  listId: string;
}

export default function EditCard({
  visible,
  onClose,
  card,
  onUpdateCard,
}: {
  visible: boolean;
  onClose: () => void;
  card: CardData | null;
  onUpdateCard?: (cardId: string, payload: any) => Promise<any> | void;
}) {
  const dateNow = new Date();
  const { id, boardId } = useLocalSearchParams<{ id: string; boardId: string }>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const priorities: { id: number; name: Priority }[] = [
    { id: 1, name: "low" },
    { id: 2, name: "medium" },
    { id: 3, name: "high" },
    { id: 4, name: "urgent" },
  ];

  const [priority, setPriority] = useState<{ id: number; name: Priority }>({
    id: 1,
    name: "low",
  });

  const [selected, setSelected] = useState<{ id: string; name: string }>({
    id: "",
    name: "",
  });

  const [date, setDate] = useState<string>(dateNow.toString());
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [isOpenCalender, setIsOpenCalender] = useState<boolean>(false);

  // Fetch Lists on Board for selection options
  useEffect(() => {
    const getBoardLists = async () => {
      if (!boardId) return;
      try {
        setLoading(true);
        const response = await BoardService.getBoardList(boardId);
        const filteredOptions = (Array.isArray(response) ? response : []).map(
          (rs) => ({
            id: rs.id,
            name: rs.name,
          }),
        );
        setOptions(filteredOptions);
      } catch (error) {
        console.error("EditCard fetch list error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (visible && boardId) {
      getBoardLists();
    }
  }, [visible, boardId]);

  // Populate States when Card or Lists loaded
  useEffect(() => {
    if (card) {
      setName(card.name || "");
      setDescription(card.description || "");
      const p = priorities.find((pr) => pr.name === card.priority) || priorities[0];
      setPriority(p);
      setDate(card.dueDate || dateNow.toString());

      if (options.length > 0) {
        const activeList = options.find((opt) => opt.id === card.listId) || options[0];
        setSelected(activeList);
      }
    }
  }, [card, visible, options]);

  const handleUpdate = async () => {
    if (!card || !boardId) return;

    const payload = {
      name,
      description,
      priority: priority.name,
      dueDate: date ? new Date(date).toISOString() : null,
      listId: selected.id,
    };
    console.log(payload)
    if (onUpdateCard) {
      try {
        await onUpdateCard(card.id, payload);
      } catch (error) {
        console.error("Update card callback error:", error);
      }
    } else {
      try {
        await CardService.updateCard(boardId, card.id, payload);
        router.navigate({
          pathname: "/(tabs)/workspace/[id]/[boardId]/(board-detail)",
          params: { id, boardId },
        });
      } catch (error) {
        console.error("Update card error:", error);
      }
    }

    onClose();
  };

  if (loading && visible) {
    return null;
  }

  return (
    <BaseOverlay visible={visible} onClose={onClose}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: Spacing[4],
        }}
      >
        <Text style={[Typography.heading, { fontSize: 24, letterSpacing: 1 }]}>
          Edit Card
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
          <Icons name="Cross" size={24} />
        </TouchableOpacity>
      </View>
      
      <Input
        label="Card title"
        value={name}
        setValue={setName}
        placeholder="e.g. Design landing page"
        stylesLabel={[
          Typography.title,
          { color: Theme.textPrimary, fontSize: 16 },
        ]}
      />

      <Text
        style={[Typography.title, { color: Theme.textPrimary, fontSize: 16 }]}
      >
        List selected
      </Text>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 16,
          borderColor: Theme.border,
          marginBottom: Spacing[4],
          paddingHorizontal: Spacing[3],
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
                {capitalizeFirstLetter(o.name) || ""}
              </Text>
            </View>
          )}
        />
      </View>

      <Input
        label="Description"
        value={description}
        setValue={setDescription}
        stylesLabel={[
          Typography.title,
          { color: Theme.textPrimary, fontSize: 16 },
        ]}
      />

      <Text
        style={[Typography.title, { color: Theme.textPrimary, fontSize: 16 }]}
      >
        Priority
      </Text>
      <View
        style={{
          borderWidth: 1,
          borderRadius: 16,
          borderColor: Theme.border,
          marginBottom: Spacing[4],
          paddingHorizontal: Spacing[3],
        }}
      >
        <DropDown
          variant="card"
          options={priorities}
          selected={capitalizeFirstLetter(priority.name)}
          setSelected={setPriority}
          stylesText={[
            Typography.title,
            { color: Theme.textPrimary, fontSize: 16 },
          ]}
          renderItem={(o) => (
            <View
              style={{
                paddingVertical: Spacing[2],
                paddingHorizontal: Spacing[3],
                borderRadius: 12,
                justifyContent: "center",
                borderBottomColor: Theme.border,
                backgroundColor:
                  o.name === priority.name
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
                {capitalizeFirstLetter(o.name) || ""}
              </Text>
            </View>
          )}
        />
      </View>

      <Text
        style={[Typography.title, { color: Theme.textPrimary, fontSize: 16 }]}
      >
        Due Date
      </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsOpenCalender(true)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderWidth: 1,
          borderRadius: 16,
          borderColor: Theme.border,
          marginBottom: Spacing[4],
          paddingHorizontal: Spacing[3],
          paddingVertical: Spacing[4],
        }}
      >
        <Text
          style={[Typography.title, { color: Theme.textPrimary, fontSize: 16 }]}
        >
          {formatYearMonthDate(date)}
        </Text>
        <Icons name="Calender" />
      </TouchableOpacity>

      <BaseOverlay
        visible={isOpenCalender}
        onClose={() => setIsOpenCalender(false)}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={[Typography.body, { fontSize: 18, color: Theme.primary }]}
            onPress={() => {
              setDate(dateNow.toString());
              setIsOpenCalender(false);
            }}
          >
            Cancel
          </Text>
          <Text
            style={[Typography.body, { fontSize: 18, color: Theme.primary }]}
            onPress={() => setIsOpenCalender(false)}
          >
            Save
          </Text>
        </View>
        <Calendar value={date} setValue={setDate} />
      </BaseOverlay>

      <View style={{ height: Spacing[4] }} />
      <Button onPress={handleUpdate}>Save Changes</Button>
    </BaseOverlay>
  );
}
