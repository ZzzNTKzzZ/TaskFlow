import { ListCardUI } from "@/modules/list/list";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import Badges from "../ui/Badges";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Colors } from "@/theme/colors";
import CardUI from "../card/Card";
import Button from "../ui/Button";
import Icons from "../icons/Icons";

interface ListCardProps extends ListCardUI {
  styleList?: StyleProp<ViewStyle>;
}

export default function ListCard({
  name,
  cardCount,
  styleList,
  cards,
}: ListCardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: Colors.gray[100],
          padding: Spacing[2],
          borderRadius: 8,
          gap: Spacing[2],
        },
        styleList,
      ]}
    >
      <View style={{ flexDirection: "row", gap: Spacing[2] }}>
        <Text style={[Typography.title, { fontSize: 16 }]}>{name}</Text>
        <View
          style={{
            paddingVertical: Spacing[1],
            paddingHorizontal: Spacing[2],
            borderRadius: 16,
            backgroundColor: Theme.border,
          }}
        >
          <Text style={[Typography.subtitle, { fontSize: 14 }]}>
            {cardCount}
          </Text>
        </View>
      </View>
      <View style={{ gap: Spacing[3] }}>
        {cards.map((c) => (
          <CardUI key={c.id} {...c} />
        ))}
      </View>
      <View>
        <Button
          type="ghost"
          leftIcon={<Icons name="Plus" color={Theme.primary} />}
          onPress={() => {}}
          style={{
            paddingVertical: Spacing[2],
            paddingHorizontal: Spacing[3],
            borderWidth: 0
        }}
          styleText={{
            color: Theme.primary
          }}
        >
          Add card
        </Button>
      </View>
    </View>
  );
}
