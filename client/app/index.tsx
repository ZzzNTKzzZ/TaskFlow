import Header from "@/components/layout/Header";
import { globalStyles } from "@/styles/global";
import { StyleSheet, Text, View } from "react-native";
import { KanbanBoard } from "./Layout/Kanbanboard";
import { Buttons } from "@/components/Buttons";
import  Plus  from "../assets/icons/Plus.svg"
export default function Page() {
  return (
    <View style={globalStyles.container}>
      <Header />
      <KanbanBoard id="" title="Main Project Board"/>
      <Buttons variant="primary" title="New Task" onPress={() => {console.log("click")}} leftIcon={<Plus />}/>
      <Buttons variant="ghost" title="New Task" onPress={() => {console.log("click")}} rightIcon={<Plus />}/>
    </View>
  );
}
