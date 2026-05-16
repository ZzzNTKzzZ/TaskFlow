import Icons from "@/components/icons/Icons";
import UpDownIcon from "@/components/icons/UpDownIcon";
import { Screen } from "@/components/layout/Screen";
import Badges from "@/components/ui/Badges";
import Button from "@/components/ui/Button";
import Checked from "@/components/ui/Checked";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatMonthDate } from "@/helper/Day";
import { CardRespone } from "@/modules/card/card";
import CardService from "@/modules/card/card.service";
import {
  Checklist,
  ChecklistItem as ChecklistItemType,
} from "@/modules/checklist/checklist"; // Assuming item type name
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

function InnerTodoItem({ item }: { item: ChecklistItemType }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing[2],
        marginVertical: Spacing[1],
      }}
    >
      <Checked isChecked={item.isCompleted} />
      <Text
        style={[
          Typography.body,
          {
            fontSize: 14,
            textDecorationLine: item.isCompleted ? "line-through" : undefined,
            color: item.isCompleted ? Theme.textSecondary : undefined,
          },
        ]}
      >
        {item.title}
      </Text>
    </View>
  );
}

function ChecklistItem({ checklist }: { checklist: Checklist }) {
  const [active, setActive] = useState(false);

  const completedCount = checklist.items.filter((i) => i.isCompleted).length;
  const progress =
    checklist.items.length > 0 ? completedCount / checklist.items.length : 0;

  return (
    <View style={{ marginBottom: Spacing[2], borderRadius: 8, borderWidth: 1, borderColor: Theme.border, paddingHorizontal: Spacing[2], paddingVertical: Spacing[3] }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setActive((prev) => !prev)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing[4],
            flex: 1,
          }}
        >
          <Text style={[Typography.label, { fontSize: 16, color: Theme.textPrimary }]}>
            {checklist.title}
          </Text>
          {checklist.items.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: Spacing[2],
                flex: 1,
              }}
            >
              <Text style={{ color: Theme.success, fontSize: 12 }}>
                {completedCount}/{checklist.items.length}
              </Text>
              <ProgressBar
                progress={progress}
                height={5}
                style={{ width: "40%" }}
              />
            </View>
          )}
        </View>
        <UpDownIcon active={active} />
      </TouchableOpacity>

      {active && (
        <View style={{ paddingLeft: Spacing[4], marginTop: Spacing[1], gap: Spacing[3]}}>
          {checklist.items.map((item) => (
            <InnerTodoItem key={item.id} item={item} />
          ))}
          <TouchableOpacity style={{flexDirection: "row", gap: Spacing[2], alignItems: "center"}}>
            <Icons name="Plus" color={Theme.primary}/>
            <Text style={[Typography.title ,{color: Theme.primary, fontSize: 14}]}>Add item</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function Card() {
  const { boardId, cardId } = useGlobalSearchParams();
  const [card, setCard] = useState<CardRespone>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCard = async () => {
      try {
        const response = await CardService.getCard(
          boardId as string,
          cardId as string,
        );
        setCard(response);
      } catch (error) {
        console.error("Failed to fetch card:", error);
      } finally {
        setLoading(false);
      }
    };
    getCard();
  }, [boardId, cardId]);

  if (loading) return <Text style={{ padding: Spacing[6] }}>Loading...</Text>;
  if (!card) return <Text style={{ padding: Spacing[6] }}>Card not found</Text>;

  return (
    <Screen padding={0}>
      <View
        style={{
          gap: Spacing[4],
          paddingVertical: Spacing[4],
          paddingHorizontal: Spacing[6],
          borderBottomColor: Theme.border,
          borderBottomWidth: 2,
        }}
      >
        <Text style={[Typography.heading, { fontSize: 24 }]}>{card.name}</Text>
        <View>
          <Badges name={card.priority} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: Spacing[4],
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: Spacing[1],
            }}
          >
            <Icons name="CheckBox" />
            <Text style={[Typography.title, { fontSize: 16 }]}>
              {card.stats?.checkListCompelete ?? 0}/
              {card.stats?.checkListCount ?? 0}
            </Text>
          </View>

          {/* FIXED: Passed style as an Array structure here instead of spreading an array inside an object literal */}
          <Badges
            name={formatMonthDate(card.dueDate)}
            style={{ ...Typography.title, fontSize: 16 }}
          />
        </View>
      </View>

      <View
        style={{
          gap: Spacing[2],
          paddingVertical: Spacing[4],
          paddingHorizontal: Spacing[6],
          borderBottomColor: Theme.border,
          borderBottomWidth: 2,
        }}
      >
        <Text style={[Typography.heading, { fontSize: 20 }]}>Description</Text>
        <Text
          numberOfLines={2}
          style={[Typography.caption, { fontSize: 16 }]}
        >
          {card.description || "No description provided."}
        </Text>
      </View>

      <View
        style={{
          gap: Spacing[2],
          paddingVertical: Spacing[2],
          paddingHorizontal: Spacing[6],
          borderBottomColor: Theme.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={[Typography.heading, { fontSize: 20 }]}>Checklist</Text>
        <Button
          onPress={() => {}}
          type="ghost"
          styleText={{ color: Theme.primary, fontSize: 16 }}
          style={{ borderWidth: 0 }}
        >
          Add checklist
        </Button>
      </View>

      <View
        style={{
          gap: Spacing[2],
          paddingHorizontal: Spacing[6],
          borderBottomColor: Theme.border,
        }}
      >
        {card.checklists?.map((c) => (
          <ChecklistItem key={c.id} checklist={c} />
        ))}
      </View>
    </Screen>
  );
}
