import { TouchableOpacity, View } from "react-native";
import BaseOverlay from "./BaseOverlay";
import Input from "../ui/Input";
import { useState } from "react";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Text } from "react-native";
import Icons from "../icons/Icons";
import Button from "../ui/Button";
import CardService from "@/modules/card/card.service";
import ChecklistService from "@/modules/checklist/checklist.service";
import { useLocalSearchParams } from "expo-router";

export default function CreateCheckList({
  active,
  onClose,
  cardId,
}: {
  cardId: string
  active: boolean;
  onClose: () => void;
}) {
  const {boardId} = useLocalSearchParams<{boardId: string}>()
  const [name, setName] = useState<string>("");
  const handleSave = async () => {
    await ChecklistService.createChecklist(boardId ,cardId, name)
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
          Create CheckList
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
