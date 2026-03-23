import { Colors, Spacing } from "@/theme";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingLeft: Spacing.xxl,
        paddingRight: Spacing.xxl
    },
    textHeading: {
        color: Colors.primary,
        fontSize: 20,
        fontFamily: "Manrope_700Bold",
    }
    
})