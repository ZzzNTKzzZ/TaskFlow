import { Spacing } from "@/theme/spacing";
import { Typography } from "@/theme/typography";
import { ReactNode } from "react";
import { Text, View } from "react-native";
import SymbolIcon, { SymbolColor, SymbolName } from "../icons/SymbolIcon";
import { Colors } from "@/theme/colors";
import { WorkspaceCard } from "@/modules/workspace/workspace";


type WorkspaceCardProps = Omit<WorkspaceCard, "role" | "value"> 

export default function WorkspaceCardUI({ id, name, memberCount, color = "Primary", icon}: WorkspaceCardProps) {

    const cardConfig = {
        Primary: {
            backgroundColor: Colors.primary[50]
        },
        None: {
            backgroundColor: Colors.gray[50]
        }
    }


    const currentCard = cardConfig[color]

    return (
        <View>
            <View style={{flexDirection: "row", gap: Spacing[2]}}>
                <SymbolIcon name={icon} color={color}/>
            <View style={{flexDirection: "column", gap: Spacing[2], backgroundColor: currentCard.backgroundColor}}>
                <Text style={[Typography.label, {fontSize: 14}]}>{name}</Text>
                <Text style={[Typography.caption]}>{memberCount}</Text>
            </View>
            </View>
        </View>
    )
}