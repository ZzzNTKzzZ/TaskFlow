import { Touchable, TouchableOpacity, View } from "react-native";
import BaseOverlay from "./BaseOverlay";
import { Text } from "react-native";
import Icons from "../icons/Icons";
import { Typography } from "@/theme/typography";
import Input from "../ui/Input";
import { useActionState, useEffect, useState } from "react";
import { Theme } from "@/theme/theme";
import { Spacing } from "@/theme/spacing";
import { Colors } from "@/theme/colors";
import capitalizeFirstLetter from "@/helper/capitalizeFirstLetter";
import DropDown from "./DropDown";
import BoardService from "@/modules/board/board.service";
import { router, useLocalSearchParams } from "expo-router";
import Calendar from "../ui/Calendar";
import Button from "../ui/Button";
import { formatDate, formatYearMonthDate } from "@/helper/Day";
import { Priority } from "@/types/type";
import ListService from "@/modules/list/list.service";

export default function CreateCard({
  visible,
  onClose,
  listId,
}: {
  visible: boolean;
  onClose: () => void;
  listId: string
}) {
  const dateNow = new Date();
  const {id ,boardId } = useLocalSearchParams();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const priorities: { id: number; name: Priority }[] = [
    {
      id: 1,
      name: "low",
    },
    {
      id: 2,
      name: "medium",
    },
    {
      id: 3,
      name: "high",
    },
    {
      id: 4,
      name: "urgent",
    },
  ];
  const [priority, setPriority] = useState<{ id: number; name: Priority }>({
    id: 1,
    name: "low",
  });
  const [selected, setSelected] = useState<{ id: string; name: string }>({
    id: boardId as string,
    name: "",
  });
  const [date, setDate] = useState<string>(dateNow.toString());
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [isOpenCalender, setIsOpenCalender] = useState(false);
  const handleCreate = async () => {
    await ListService.createCardInList(boardId as string, selected.id, {
      name,
      description,
      priority: priority.name,
      dueDate: new Date(date).toString()
    })
    onClose()
    router.navigate({pathname: "/(tabs)/workspace/[id]/[boardId]/(board-detail)", params: {
      id: id as string,
      boardId: boardId as string,
    }})
  };
  useEffect(() => {
    const getList = async () => {
      try {
        setLoading(true);
        const response = await BoardService.getBoardList(selected.id);
        const filteredOptions = (Array.isArray(response) ? response : []).map(
          (rs) => ({
            id: rs.id,
            name: rs.name,
          }),
        );
        setOptions(filteredOptions);

        setSelected(
          () =>
            filteredOptions.find((option) => option.id === listId) || {
              id: "",
              name: "",
            },
        );
      } finally {
        setLoading(false);
      }
    };

    getList();
  }, []);

  if (loading && boardId) return;

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
          Create Card
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
          <Icons name="Cross" size={24} />
        </TouchableOpacity>
      </View>
      <Input
        label="Card title"
        value={name}
        setValue={setName}
        placeholder="e.g.Design landing page"
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
          selected={selected.name || options[0].name || ""}
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
            <View style={{width: 100}}/>
      <Button onPress={handleCreate}>Create board</Button>
    </BaseOverlay>
  );
}
