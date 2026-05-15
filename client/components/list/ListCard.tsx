import { ListCardUI } from "@/modules/list/list";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Badges from "../ui/Badges";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Colors } from "@/theme/colors";
import CardUI from "../card/Card";
import Button from "../ui/Button";
import Icons from "../icons/Icons";
import { FlatList } from "react-native";

interface ListCardProps extends ListCardUI {
  styleList?: StyleProp<ViewStyle>;
  onLongPress?: () => void;
}

export default function ListCard({
  name,
  cardCount,
  styleList,
  cards,
  onLongPress,
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
      <TouchableOpacity
        onLongPress={onLongPress}
        style={{ flexDirection: "row", gap: Spacing[2] }}
      >
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
      </TouchableOpacity>
      <View style={{maxHeight: 520}}>
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          nestedScrollEnabled
          scrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: Spacing[3],
          }}
          renderItem={({ item }) => <CardUI {...item} />}
        />
      </View>
      <View>
        <Button
          type="ghost"
          leftIcon={<Icons name="Plus" color={Theme.primary} />}
          onPress={() => {}}
          style={{
            paddingVertical: Spacing[2],
            paddingHorizontal: Spacing[3],
            borderRadius: 6,
            borderWidth: 0,
          }}
          styleText={{
            color: Theme.primary,
          }}
        >
          Add card
        </Button>
      </View>
    </View>
  );
}
