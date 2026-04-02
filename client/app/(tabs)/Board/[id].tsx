import Button from "@/components/Button";
import Header from "@/components/layout/Header";
import { getBoardByWorkspaceIdApi } from "@/service/board.service";
import { globalStyles } from "@/styles/global";
import { Colors, Typography } from "@/theme";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Plus from "@/assets/icons/Plus.svg";

export default function Detail() {
  const { id, name } = useLocalSearchParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadBoard = async () => {
      try {
        setLoading(true);
        const data = await getBoardByWorkspaceIdApi(id as string);
        setData(data);
        console.log(data);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, []);
  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  return (
    <ScrollView style={[globalStyles.container]}>
      <Header />
      <Text
        style={[
          Typography.displayLg,
          globalStyles.textHeading,
          { color: Colors.primary },
        ]}
      >
        {name}
      </Text>
      <Button title="NEW TASK" leftIcon={<Plus width={14} height={14}/>} styleClass={{alignSelf: "flex-end"}}/>
    </ScrollView>
  );
}
