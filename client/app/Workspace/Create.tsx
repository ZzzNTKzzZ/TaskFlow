import Button from "@/components/Button";
import Header from "@/components/layout/Header";
import Input from "@/components/ui/Input";
import { globalStyles } from "@/styles/global";
import { Colors, Rounded, Spacing, Typography } from "@/theme";
import { useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import RightArrow from "@/assets/icons/RightArrow.svg";

export default function Create() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [industry, setIndustry] = useState("");
  const [selectedSize, setSelectedSize] = useState("1-5");

  const selectTeamSizes = [
    { title: "1-5", min: 1, max: 5, isSelected: true },
    { title: "6-20", min: 6, max: 20, isSelected: false },
    { title: "21-50", min: 21, max: 50, isSelected: false },
    { title: "50+", min: 50, max: null, isSelected: false },
  ];

  const handleCreateWorkspace = () => {
    console.log({
      workspaceName,
      industry,
    });
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <Header />
      <View style={globalStyles.container}>
        <Text
          style={[
            Typography.displayLg,
            globalStyles.textHeading,
            styles.headingText,
          ]}
        >
          Define your creative space.
        </Text>
        <Text style={[Typography.titleMd, globalStyles.textDescription]}>
          Architectural precision starts with a clean foundation. Organize your
          projects, teams, and assets in a unified environment.
        </Text>
        <View style={styles.formContainer}>
          <View>
            <Text style={[Typography.labelSm, styles.inputLabel]}>
              Workspace name
            </Text>
            <Input
              value={workspaceName}
              setValue={setWorkspaceName}
              placeholder="e.g TaskSpace"
            />
          </View>
          <View>
            <Text style={[Typography.labelSm, styles.inputLabel]}>
              Industry
            </Text>
            <Input
              value={industry}
              setValue={setIndustry}
              placeholder="e.g TaskSpace"
            />
          </View>
          <View>
            <Text style={[Typography.labelSm, styles.inputLabel]}>
              Team size
            </Text>
            <View style={styles.teamSizeWrapper}>
              {selectTeamSizes.map((size) => (
                <Button
                  key={size.title}
                  title={size.title}
                  styleClass={styles.teamSizeButton}
                  onPress={() => setSelectedSize(size.title)}
                  variant={
                    selectedSize === size.title ? "primary" : "secondary"
                  }
                />
              ))}
            </View>
            <Button
              title="Create Workspace"
              rightIcon={<RightArrow />}
              styleClass={{ alignSelf: "stretch", borderRadius: Rounded.lg }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#eeeeee",
    paddingBottom: 100
  },
  headingText: {
    color: Colors.primary,
  },
  formContainer: {
    backgroundColor: Colors.onPrimary,
    borderTopColor: Colors.primary,
    borderTopWidth: 2,
    borderRadius: Rounded.lg,
    padding: Spacing.xxl,
    marginTop: 40,
    paddingTop: 80,
    display: "flex",
    gap: Spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  teamSizeWrapper: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: 40,
  },
  teamSizeButton: {
    borderRadius: Rounded.lg,
  },
});
