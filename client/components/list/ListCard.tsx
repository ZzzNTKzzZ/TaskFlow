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
import UpDownIcon from "../icons/UpDownIcon";
import { useState } from "react";
import DropDown from "../overlays/DropDown";

interface ListCardProps extends ListCardUI {
  styleList?: StyleProp<ViewStyle>;
  typeCard?: "Board" | "List";
  onLongPress?: () => void;
}

export default function ListCard({
  name,
  cardCount,
  styleList,
  cards,
  onLongPress,
  typeCard = "Board",
}: ListCardProps) {
  const [active, setActive] = useState(false)
  if (typeCard === "List")
    return (
      <View
        style={[
          {
            backgroundColor: Colors.gray[100],
            borderRadius: 16,
            marginBottom: Spacing[4],
            borderWidth: 1,
            borderColor: Theme.border
          },
          styleList,
        ]}
      >
        <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setActive(prev => !prev)}
          style={{ flexDirection: "row", gap: Spacing[2], alignItems: "center", justifyContent: "space-between",              marginVertical: Spacing[2],
              marginHorizontal: Spacing[2], }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: Spacing[2],
              alignItems: "center"
            }}
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
          </View>
          <UpDownIcon active={active} />
        </TouchableOpacity>
        {active && (
          <>
            <View>
              <FlatList
                data={cards}
                keyExtractor={(item) => item.id}
                nestedScrollEnabled
                scrollEnabled
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View 
                    style={{ 
                      height: 1, 
                      backgroundColor: Colors.gray[200], 
                      marginHorizontal: Spacing[3] 
                    }} 
                  />
                )}
                renderItem={({ item }) => <CardUI typeCard={typeCard} {...item} />}
              />
            </View>

            <View>
              <Button
                type="ghost"
                leftIcon={<Icons name="Plus" color={Theme.primary} />}
                onPress={() => {}}
                style={{
                  paddingVertical: Spacing[3],
                  paddingHorizontal: Spacing[3],
                  borderRadius: 0,
                  borderBottomLeftRadius: 14,
                  borderBottomRightRadius: 14,
                  borderWidth: 0,
                  borderTopWidth: 1,
                  borderTopColor: Theme.border,
                  backgroundColor: Theme.surface,
                }}
                styleText={{
                  color: Theme.primary,
                }}
              >
                Add card
              </Button>
            </View>
          </>
        )}
      </View>
    );

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
        style={{ flexDirection: "row", gap: Spacing[2], alignItems: "center" }}
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
      <View style={{ maxHeight: 520 }}>
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
