import Header from "@/components/layout/Header";
import { globalStyles } from "@/styles/global";
import { Colors, Spacing, Typography } from "@/theme";
import { Pressable, ScrollView } from "react-native";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Input from "@/components/ui/Input";
import { useState } from "react";
import Select from "@/components/ui/Select";
import { Visibility } from "@/Types/enum";
import { AppIcon } from "@/components/ui/AppIcon";
const VISIBILITY_OPTIONS: Visibility[] = ["workspace", "private", "public"];
export default function Create() {
  const { workspaceId } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("workspace");
  const [template, setTemplate] = useState("Kanban")
  const templates = [
    {
      name: "Kanban",
      icon: <AppIcon name="Kanban" />,
      description: "Continuous flow with visual status columns.",
    },
    {
      name: "Scrum Sprint",
      icon: <AppIcon name="Timer" />,
      description: "Iterative development with defined periods.",
    },
    {
      name: "Task List",
      icon: <AppIcon name="Todo" />,
      description: "Simple linear accountability for smaller teams.",
    },
    {
      name: "Custom Matrix",
      icon: <AppIcon name="Logo" color={"#767683"}/>,
      description: "Architect your own grid of work streams.",
    },
  ];

  return (
    <ScrollView style={[globalStyles.container]}>
      <Header />
      <View>
        <View>
          <Text
            style={[
              Typography.displayLg,
              globalStyles.textHeading,
              { color: Colors.primary },
            ]}
          >
            Create Board
          </Text>
          <Text
            style={[
              Typography.titleMd,
              globalStyles.textDescription,
              { width: "70%" },
            ]}
          >
            Architecture is a visual language. Define yours below.
          </Text>
        </View>
        <View style={[globalStyles.formSylte]}>
          <Input
            label="Board Name"
            placeholder="Enter board name"
            value={name}
            setValue={setName}
          />
          <View>
            <Text
              style={[
                Typography.labelSm,
                { fontSize: 14, marginBottom: Spacing.xs },
              ]}
            >
              Structural Templete
            </Text>
            <View>
              {templates.map((t) => (
                <Pressable key={t.name} onPress={() => setTemplate(t.name)}>
                  <View>{t.icon}</View>
                  <Text>{t.name}</Text>
                  <Text>{t.description}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Select
            label="Visibility"
            value={visibility}
            setValue={(val) => setVisibility(val as Visibility)}
            options={VISIBILITY_OPTIONS}
          />
        </View>
      </View>
    </ScrollView>
  );
}