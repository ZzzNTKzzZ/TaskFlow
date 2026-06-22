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
  cardId: string;
  active: boolean;
  onClose: () => void;
}) {
  const {boardId} = useLocalSearchParams<{boardId: string}>()
  const [name, setName] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setHasError(true);
      setErrorMessage("Checklist name is required");
      return;
    }
    setHasError(false);
    setErrorMessage(null);

    const tempId = `tmp-${Date.now()}`;
    const tempChecklist = {
      id: tempId,
      name: name.trim(),
      items: [
        {
          id: `tmp-item-${Date.now()}`,
          name: "Default Item",
          isCompleted: false,
          checklistId: tempId,
        },
      ],
      cardId,
    } as any;
    try {
      const eventBus = await import("@/services/eventBus");
      eventBus.emit("checklist:creating", { cardId, checklist: tempChecklist });
    } catch (e) {}

    try {
      const response = await ChecklistService.createChecklist(boardId, cardId, name.trim());
      if (response && response.id) {
        try {
          const eventBus = await import("@/services/eventBus");
          eventBus.emit("checklist:created", { tempId, created: response });
        } catch (e) {}
        setName("");
        onClose();
      } else {
        const eventBus = await import("@/services/eventBus");
        eventBus.emit("checklist:create_failed", { tempId });
      }
    } catch (error) {
      try {
        const eventBus = await import("@/services/eventBus");
        eventBus.emit("checklist:create_failed", { tempId });
      } catch (e) {}
      console.error("Create checklist error:", error);
    }
  }

  const handleClose = () => {
    setName("");
    setHasError(false);
    setErrorMessage(null);
    onClose();
  }

  return (
    <BaseOverlay visible={active} onClose={handleClose}>
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
        <TouchableOpacity activeOpacity={0.7} onPress={handleClose}>
          <Icons name="Cross" size={24} />
        </TouchableOpacity>
      </View>
      <Input
        label="Name"
        value={name}
        setValue={(val) => {
          setName(val);
          if (val.trim()) {
            setHasError(false);
            setErrorMessage(null);
          }
        }}
        error={hasError}
        placeholder="e.g. Create board"
      />
      {hasError && errorMessage && (
        <Text style={{ color: "red", marginTop: -Spacing[3], marginBottom: Spacing[3], fontSize: 14 }}>
          {errorMessage}
        </Text>
      )}
      <Button onPress={handleSave}>Create checklist</Button>
    </BaseOverlay>
  );
}
