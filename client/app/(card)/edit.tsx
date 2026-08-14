import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import Icons from "@/components/icons/Icons";
import { Screen } from "@/components/layout/Screen";
import DropDown from "@/components/overlays/DropDown";
import BaseOverlay from "@/components/overlays/BaseOverlay";
import Calendar from "@/components/ui/Calendar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import capitalizeFirstLetter from "@/helper/capitalizeFirstLetter";
import { formatYearMonthDate } from "@/helper/Day";
import BoardService from "@/services/board.service";
import CardService from "@/services/card.service";
import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { Priority } from "@/types/type";

export default function EditCardScreen() {
  const dateNow = new Date();
  
  // Gets query params since we pass them via router.push
  const { id, boardId, cardId } = useLocalSearchParams<{
    id: string;
    boardId: string;
    cardId: string;
  }>();

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

  const [assignees, setAssignees] = useState<any[]>([]);
  const [boardMembers, setBoardMembers] = useState<any[]>([]);
  const [isOpenAssignee, setIsOpenAssignee] = useState<boolean>(false);

  // Fetch Lists on Board & Card Data
  useEffect(() => {
    const initData = async () => {
      if (!boardId || !cardId) {
        console.warn("EditCard fetch failed: Missing boardId or cardId", { boardId, cardId });
        return;
      }
      try {
        setLoading(true);
        // Fetch lists for the dropdown
        const responseLists = await BoardService.getBoardList(boardId);
        const filteredOptions = (Array.isArray(responseLists) ? responseLists : []).map(
          (rs: any) => ({
            id: rs.id,
            name: rs.name,
          }),
        );
        setOptions(filteredOptions);

        // Fetch board members
        const membersRes = await BoardService.getBoardMembers(boardId);
        setBoardMembers(membersRes);

        // Fetch card details
        const cardRes = await CardService.getCard(boardId, cardId);
        if (cardRes) {
          setName(cardRes.name || "");
          setDescription(cardRes.description || "");
          const p = priorities.find((pr) => pr.name === cardRes.priority) || priorities[0];
          setPriority(p);
          setDate(cardRes.dueDate || dateNow.toString());
          setAssignees(cardRes.assignees || []);

          if (filteredOptions.length > 0) {
            const activeList = filteredOptions.find((opt: any) => opt.id === cardRes.listId) || filteredOptions[0];
            setSelected(activeList);
          }
        }
      } catch (error) {
        console.error("EditCard fetch data error:", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [boardId, cardId]);

  const handleUpdate = async () => {
    if (!cardId || !boardId) return;

    const payload = {
      name,
      description,
      priority: priority.name,
      dueDate: date ? new Date(date).toISOString() : null,
      listId: selected.id,
    };

    try {
      setLoading(true);
      await CardService.updateCard(boardId, cardId, payload);
      try {
        const eventBus = await import("@/services/eventBus");
        eventBus.default.emit("card:updated", { cardId, payload });
      } catch (e) {}
      router.back();
    } catch (error) {
      console.error("Update card error:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Screen isScroll={false}>
        <Text>Loading...</Text>
      </Screen>
    );
  }

  return (
    <Screen isScroll={true}>
      {/* HEADER SECTION */}
      <View
        style={{
          marginTop: Spacing[2],
          marginBottom: Spacing[4],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <TouchableOpacity
          style={{ position: "absolute", left: 0 }}
          onPress={() => router.back()}
        >
          <Icons name="Cross" size={24} />
        </TouchableOpacity>
        <Text style={[Typography.heading, { fontSize: 28 }]}>Edit Card</Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "column" }}>
          
          <View style={{ marginBottom: Spacing[4] }}>
            <Input
              label="Card title"
              value={name}
              setValue={setName}
              placeholder="e.g. Design landing page"
              stylesLabel={[
                Typography.title,
                { color: Theme.textPrimary, fontSize: 16, marginBottom: Spacing[2] },
              ]}
            />
          </View>

          <View style={{ marginBottom: Spacing[4] }}>
            <Text
              style={[Typography.title, { color: Theme.textPrimary, fontSize: 16, marginBottom: Spacing[2] }]}
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
          </View>

          <View style={{ marginBottom: Spacing[4] }}>
            <Text
              style={[Typography.title, { color: Theme.textPrimary, fontSize: 16, marginBottom: Spacing[2] }]}
            >
              Assignees
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing[2], alignItems: "center" }}>
              {assignees.map((assignee) => (
                <View
                  key={assignee.id || assignee.userId}
                  style={{
                    backgroundColor: Colors.primary[100],
                    paddingVertical: Spacing[1],
                    paddingHorizontal: Spacing[3],
                    borderRadius: 16,
                  }}
                >
                  <Text style={{ color: Theme.textPrimary }}>
                    {assignee.user?.name || assignee.user?.email || "Unknown"}
                  </Text>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => setIsOpenAssignee(true)}
                style={{
                  backgroundColor: Theme.border,
                  paddingVertical: Spacing[1],
                  paddingHorizontal: Spacing[3],
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icons name="Plus" size={16} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginBottom: Spacing[4] }}>
            <Input
              label="Description"
              value={description}
              setValue={setDescription}
              stylesLabel={[
                Typography.title,
                { color: Theme.textPrimary, fontSize: 16, marginBottom: Spacing[2] },
              ]}
            />
          </View>

          <View style={{ marginBottom: Spacing[4] }}>
            <Text
              style={[Typography.title, { color: Theme.textPrimary, fontSize: 16, marginBottom: Spacing[2] }]}
            >
              Priority
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
          </View>

          <View style={{ marginBottom: Spacing[4] }}>
            <Text
              style={[Typography.title, { color: Theme.textPrimary, fontSize: 16, marginBottom: Spacing[2] }]}
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
                paddingHorizontal: Spacing[4],
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
          </View>
        </View>
      </View>

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

      <BaseOverlay
        visible={isOpenAssignee}
        onClose={() => setIsOpenAssignee(false)}
      >
        <Text style={[Typography.heading, { fontSize: 20, marginBottom: Spacing[4], color: Theme.textPrimary }]}>
          Assign Members
        </Text>
        <View style={{ gap: Spacing[3] }}>
          {boardMembers.map((member) => {
            const isAssigned = assignees.some((a) => a.userId === member.userId || a.user?.id === member.userId);
            return (
              <TouchableOpacity
                key={member.userId || member.id}
                onPress={async () => {
                  try {
                    const mId = member.userId || member.id;
                    if (isAssigned) {
                      await CardService.unassignUserFromCard(boardId, cardId, mId);
                      setAssignees((prev) => prev.filter((a) => a.userId !== mId && a.user?.id !== mId));
                    } else {
                      await CardService.assignUsersToCard(boardId, cardId, [mId]);
                      setAssignees((prev) => [
                        ...prev,
                        {
                          id: Math.random().toString(),
                          userId: mId,
                          cardId,
                          user: { id: mId, name: member.name, email: member.email || "", createdAt: "" },
                        },
                      ]);
                    }
                  } catch (e) {
                    console.error("Assign error", e);
                  }
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: Spacing[3],
                  borderWidth: 1,
                  borderColor: isAssigned ? Theme.primary : Theme.border,
                  borderRadius: 12,
                  backgroundColor: isAssigned ? Colors.primary[100] : "transparent",
                }}
              >
                <Text style={{ color: Theme.textPrimary, fontSize: 16 }}>{member.name || member.email || "Unknown"}</Text>
                {isAssigned && <Icons name="Checked" size={20} color={Theme.primary} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </BaseOverlay>

      <View style={{ paddingTop: Spacing[2], marginBottom: Spacing[4] }}>
        <Button onPress={handleUpdate} style={{ marginBottom: Spacing[3] }}>
          Save Changes
        </Button>
        <Button
          type="ghost"
          onPress={() => router.back()}
          styleText={{ color: Colors.primary[700] }}
        >
          Cancel
        </Button>
      </View>
    </Screen>
  );
}
