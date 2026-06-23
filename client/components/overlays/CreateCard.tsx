import { Touchable, TouchableOpacity, View, ScrollView, Modal } from "react-native";
import BaseOverlay from "./BaseOverlay";
import { Text } from "react-native";
import Icons from "../icons/Icons";
import { Typography } from "@/theme/typography";
import Input from "../ui/Input";
import { useActionState, useEffect, useRef, useState } from "react";
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
import { Priority } from "@/types/type";
import ListService from "@/services/list.service";

export default function CreateCard({
  visible,
  onClose,
  listId,
  onCreateCard,
}: {
  visible: boolean;
  onClose: () => void;
  listId: string;
  onCreateCard?: (boardId: string, listId: string, payload: any) => Promise<any> | void;
}) {
  const dateNow = new Date();
  const {id ,boardId } = useLocalSearchParams();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
  const [time, setTime] = useState<{ hour: number; minute: number }>({
    hour: dateNow.getHours(),
    minute: dateNow.getMinutes(),
  });
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [isOpenCalender, setIsOpenCalender] = useState(false);
  const [isOpenTimePicker, setIsOpenTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState<{ hour: number; minute: number }>({
    hour: dateNow.getHours(),
    minute: dateNow.getMinutes(),
  });
  const handleClose = () => {
    setName("");
    setDescription("");
    setHasError(false);
    setErrorMessage(null);
    onClose();
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setHasError(true);
      setErrorMessage("Card name is required");
      return;
    }
    setHasError(false);
    setErrorMessage(null);

    const merged = new Date(date);
    merged.setHours(time.hour, time.minute, 0, 0);
    const payload = {
      name: name.trim(),
      description: description.trim(),
      priority: priority.name,
      dueDate: merged.toString(),
    };

    if (onCreateCard) {
      try {
        // Parent handles optimistic update and API call
        onCreateCard(boardId as string, selected.id, payload);
      } catch (error) {
        console.error("Create card handler error:", error);
      }
    } else {
      try {
        await ListService.createCardInList(boardId as string, selected.id, payload);
        router.navigate({ pathname: "/(tabs)/workspace/[id]/[boardId]/(board-detail)", params: {
          id: id as string,
          boardId: boardId as string,
        }});
      } catch (error) {
        console.error("Create card error:", error);
      }
    }

    setName("");
    setDescription("");
    onClose();
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
    <BaseOverlay visible={visible} onClose={handleClose}>
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
        <TouchableOpacity activeOpacity={0.7} onPress={handleClose}>
          <Icons name="Cross" size={24} />
        </TouchableOpacity>
      </View>
      <Input
        label="Card title"
        value={name}
        setValue={(val) => {
          setName(val);
          if (val.trim()) {
            setHasError(false);
            setErrorMessage(null);
          }
        }}
        error={hasError}
        placeholder="e.g.Design landing page"
        stylesLabel={[
          Typography.title,
          { color: Theme.textPrimary, fontSize: 16 },
        ]}
      />
      {hasError && errorMessage && (
        <Text style={{ color: "red", marginTop: -Spacing[3], marginBottom: Spacing[3], fontSize: 14 }}>
          {errorMessage}
        </Text>
      )}
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
      <View style={{ flexDirection: "row", gap: Spacing[2], marginBottom: Spacing[4] }}>
        {/* Date picker button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsOpenCalender(true)}
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 16,
            borderColor: Theme.border,
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

        {/* Time picker button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setTempTime({ ...time });
            setIsOpenTimePicker(true);
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing[2],
            borderWidth: 1,
            borderRadius: 16,
            borderColor: Theme.border,
            paddingHorizontal: Spacing[3],
            paddingVertical: Spacing[4],
          }}
        >
          <Icons name="Clock" size={18} />
          <Text style={[Typography.title, { color: Theme.textPrimary, fontSize: 16 }]}>
            {String(time.hour).padStart(2, "0")}:{String(time.minute).padStart(2, "0")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker Modal */}
      <Modal
        visible={isOpenTimePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpenTimePicker(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: Theme.surface,
              borderRadius: 20,
              padding: Spacing[5],
              width: 260,
            }}
          >
            <Text
              style={[
                Typography.heading,
                { fontSize: 18, marginBottom: Spacing[4], textAlign: "center" },
              ]}
            >
              Select Time
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: Spacing[2],
                marginBottom: Spacing[5],
              }}
            >
              {/* Hour column */}
              <View style={{ alignItems: "center" }}>
                <Text style={[Typography.caption, { marginBottom: 4 }]}>HH</Text>
                <ScrollView
                  style={{
                    height: 150,
                    width: 64,
                    borderWidth: 1,
                    borderColor: Theme.border,
                    borderRadius: 12,
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.7}
                      onPress={() => setTempTime((prev) => ({ ...prev, hour: i }))}
                      style={{
                        paddingVertical: Spacing[2],
                        alignItems: "center",
                        borderRadius: 8,
                        backgroundColor:
                          tempTime.hour === i ? Colors.primary[200] : "transparent",
                      }}
                    >
                      <Text
                        style={[
                          Typography.body,
                          {
                            color:
                              tempTime.hour === i
                                ? Theme.primary
                                : Theme.textPrimary,
                            fontWeight: tempTime.hour === i ? "700" : "400",
                          },
                        ]}
                      >
                        {String(i).padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={[Typography.heading, { fontSize: 24, marginTop: 20 }]}>:</Text>

              {/* Minute column */}
              <View style={{ alignItems: "center" }}>
                <Text style={[Typography.caption, { marginBottom: 4 }]}>MM</Text>
                <ScrollView
                  style={{
                    height: 150,
                    width: 64,
                    borderWidth: 1,
                    borderColor: Theme.border,
                    borderRadius: 12,
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.7}
                      onPress={() => setTempTime((prev) => ({ ...prev, minute: i }))}
                      style={{
                        paddingVertical: Spacing[2],
                        alignItems: "center",
                        borderRadius: 8,
                        backgroundColor:
                          tempTime.minute === i ? Colors.primary[200] : "transparent",
                      }}
                    >
                      <Text
                        style={[
                          Typography.body,
                          {
                            color:
                              tempTime.minute === i
                                ? Theme.primary
                                : Theme.textPrimary,
                            fontWeight: tempTime.minute === i ? "700" : "400",
                          },
                        ]}
                      >
                        {String(i).padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Actions */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsOpenTimePicker(false)}
              >
                <Text style={[Typography.body, { fontSize: 16, color: Theme.primary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setTime({ ...tempTime });
                  setIsOpenTimePicker(false);
                }}
              >
                <Text style={[Typography.body, { fontSize: 16, color: Theme.primary, fontWeight: "700" }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
