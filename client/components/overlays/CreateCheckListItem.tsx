import { TouchableOpacity, View } from "react-native";
import BaseOverlay from "./BaseOverlay";
import Input from "../ui/Input";
import { useState } from "react";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Text } from "react-native";
import Icons from "../icons/Icons";
import Button from "../ui/Button";
import ChecklistService from "@/modules/checklist/checklist.service";
import { useLocalSearchParams } from "expo-router";

export default function CreateCheckListItem({
  active,
  onClose,
  cardId,
  checkListId
}: {
  cardId: string
  checkListId: string
  active: boolean;
  onClose: () => void;
}) {
  const {boardId} = useLocalSearchParams<{boardId: string}>()
  const [name, setName] = useState<string>("");
  const handleSave = async () => {
    await ChecklistService.createChecklistItem(boardId ,cardId, checkListId,name)
  }
  return (
    <BaseOverlay visible={active} onClose={onClose}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: Spacing[4],
        }}
      >
        <Text style={[Typography.heading, { fontSize: 24, letterSpacing: 1 }]}>
          Create CheckList Item
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
          <Icons name="Cross" size={24} />
        </TouchableOpacity>
      </View>
      <Input
        label="Name"
        value={name}
        setValue={setName}
        placeholder="e.g. Create board"
      />
      <Button onPress={handleSave}>Create checklist</Button>
    </BaseOverlay>
  );
}
