import Icons from "@/components/icons/Icons";
import { Screen } from "@/components/layout/Screen";
import Badges from "@/components/ui/Badges";
import { CardRespone } from "@/modules/card/card";
import CardService from "@/modules/card/card.service";
import { Typography } from "@/theme/typography";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Card() {
  const { boardId, cardId } = useGlobalSearchParams();
  const [card, setCard] = useState<CardRespone>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getCard = async () => {
      try {
        console.log(cardId);
        const response = await CardService.getCard(
          boardId as string,
          cardId as string,
        );
        setCard(response)
    } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    getCard();
  }, []);

  if(loading) return <Text>Loading...</Text>

  return (
    <Screen>
      <View>
        <View>
            <Text style={[Typography.heading, { fontSize: 24}]}>{card?.name}</Text>
            <View>
                <Badges name={card!?.priority}/>
                <Badges name="" />
            </View>
            <View>
                <View>

                <Icons name="CheckBox"/>
                <Text></Text>
                </View>
            </View>
        </View>
      </View>
    </Screen>
  );
}
