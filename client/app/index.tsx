import Header from "@/components/layout/Header";
import { globalStyles } from "@/styles/global";
import { StyleSheet, Text, View } from "react-native";
import { KanbanBoard } from "./Layout/Kanbanboard";
export default function Page() {
  return (
    <View style={globalStyles.container}>
      <Header />
      <KanbanBoard id="" title="Main Project Board"/>
      <View>
          
      </View>
    </View>
  );
}
