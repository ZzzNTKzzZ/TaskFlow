import { Text, View } from "react-native";
import { CardProps } from "./Card";
import { Colors, Spacing } from "@/theme";

type BoardProps = {
    title: string,
    cards: CardProps[],
}

export default function Board({ title, cards}: BoardProps) {
    return (
        <View style={{minWidth: 280, backgroundColor: Colors.surfaceHigh, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.xxl}}>
            <View>
                <Text>{title}</Text>
            </View>
        </View>
    )
}