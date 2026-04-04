import Button from "@/components/Button";
import Header from "@/components/layout/Header";
import Input from "@/components/ui/Input";
import { globalStyles } from "@/styles/global";
import { Colors, Rounded, Spacing, Typography } from "@/theme";
import { useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import RightArrow from "@/assets/icons/RightArrow.svg";
import { createWorkspace } from "@/service/workspace.service";
import { workspaceSchema } from "@/utils/validation/workspace.schema";

export default function Create() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setErrors] =useState<{name?: string}>({})

  const handleCreateWorkspace = async () => {
    setErrors({})

    const result = workspaceSchema.safeParse({ name: workspaceName})
    if (!result.success) {
      const newErrors: { name?: string } = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as "name";
        if (!newErrors[fieldName]) {
          newErrors[fieldName] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    if (!workspaceName.trim()) {
      alert("Vui lòng nhập tên Workspace");
      return;
    }

    setLoading(true);
    try {
      console.log("Đang tạo Workspace:", workspaceName);

      const result = await createWorkspace(workspaceName);

      console.log("Tạo thành công:", result);
      alert("Tạo Workspace thành công!");

      setWorkspaceName("");
    } catch (error: any) {
      console.error("Lỗi khi tạo:", error);

      const message =
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView style={[globalStyles.container ,styles.scrollView]} showsVerticalScrollIndicator={false}>
      <Header />
      <View >
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
        <View style={[globalStyles.formSylte]}>
          <View>
            <Input
              label="Workspace name"
              value={workspaceName}
              setValue={setWorkspaceName}
              placeholder="e.g TaskSpace"
              error={error.name}
            />
          </View>
          <Button
            onPress={handleCreateWorkspace}
            title="Create Workspace"
            rightIcon={<RightArrow />}
            styleClass={{ alignSelf: "stretch", borderRadius: Rounded.lg }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#eeeeee",
    paddingBottom: 100,
  },
  headingText: {
    color: Colors.primary,
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
