import React, { useState } from "react";
import { Text, View, ScrollView, Pressable, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

// Layout & UI Components
import Header from "@/components/layout/Header";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { AppIcon } from "@/components/ui/AppIcon";

// Theme & Styles
import { globalStyles } from "@/styles/global";
import { Colors, Rounded, Spacing, Typography } from "@/theme";
import { Visibility } from "@/Types/enum";
import Button from "@/components/Button";
import { boardSchema } from "@/utils/validation/board.schema";
import { validateData } from "@/helper/validateData";
import { createBoardApi } from "@/service/board.service";

const VISIBILITY_OPTIONS: Visibility[] = ["workspace", "private", "public"];
type TEMPLATE = "Kanban" | "Scrum Sprint" | "Task List" | "Custom Matrix"

export default function Create() {
  const { workspaceId } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("workspace");
  const [template, setTemplate] = useState<TEMPLATE>("Kanban");
  const [errors, setErrors] = useState<{ title?: string }>({});
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
      icon: <AppIcon name="Logo" />,
      description: "Architect your own grid of work streams.",
    },
  ];

  const handleCreateBoard = async () => {
    const { isValid, errors } = validateData(boardSchema, { 
      workspaceId,
    title: name, 
    visibility 
  });

  if (!isValid) {
    console.log(errors)
    setErrors(errors);
    return;
  }

  try {
    setErrors({}); // Reset lỗi trước khi gọi API
    const response = await createBoardApi({workspaceId: workspaceId as string, title: name, visibility, template });
    router.back()
    alert("Tạo board thành công")
  } catch (apiError) {
    console.error("Lỗi API:", apiError);
    // Có thể set lỗi từ Server trả về vào setErrors ở đây
  }
};

  return (
    <ScrollView
      style={[globalStyles.container]}
      showsVerticalScrollIndicator={false}
    >
      <Header />

      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerTextContainer}>
          <Text style={[Typography.displayLg, styles.title]}>Create Board</Text>
          <Text style={[Typography.titleMd, styles.description]}>
            Architecture is a visual language. Define yours below.
          </Text>
        </View>

        {/* Form Section */}
        <View style={[globalStyles.formSylte, { gap: Spacing.xl }]}>
          <Input
            label="Board Name"
            placeholder="Enter board name"
            value={name}
            setValue={setName}
          />

          <View>
            <Text style={[Typography.labelSm, styles.label]}>
              Structural Template
            </Text>

            <View style={styles.templateList}>
              {templates.map((t) => {
                const isActive = t.name === template;

                return (
                  <Pressable
                    key={t.name}
                    // onPress={() => setTemplate(t.name)}
                    style={({ pressed }) => [
                      styles.templateCard,
                      {
                        backgroundColor: isActive
                          ? Colors.surface
                          : Colors.surfaceLow,
                        borderLeftColor: isActive
                          ? Colors.primary
                          : "transparent",
                        // Hiệu ứng phản hồi khi nhấn (Mochi Effect)
                        transform: [{ scale: pressed ? 0.97 : 1 }],
                        opacity: pressed ? 0.9 : 1,
                      },
                      isActive && styles.activeShadow,
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.iconWrapper}>
                        {React.cloneElement(t.icon, {
                          color: isActive ? Colors.primary : "#767683",
                          size: 26,
                        })}
                      </View>

                      {isActive && (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>Selected</Text>
                        </View>
                      )}
                    </View>

                    <Text
                      style={[
                        Typography.headlineSm,
                        styles.templateName,
                        { color: isActive ? Colors.primary : Colors.text },
                      ]}
                    >
                      {t.name}
                    </Text>

                    <Text
                      style={[
                        Typography.lighterMd,
                        styles.templateDesc,
                        { color: isActive ? Colors.text : "#767683" },
                      ]}
                    >
                      {t.description}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Select
            label="Visibility"
            value={visibility}
            setValue={(val) => setVisibility(val as Visibility)}
            options={VISIBILITY_OPTIONS}
          />

          {/* Nút bấm giả định để hoàn tất */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: Spacing.lg,
              justifyContent: "space-between",
            }}
          >
            <Button
              title="Cancel"
              styleClass={{ borderRadius: Rounded.sm }}
              variant="secondary"
            />
            <Button
            onPress={handleCreateBoard}
              title="Create Board"
              styleClass={{ borderRadius: Rounded.sm, flex: 1 }}
              leftIcon={<AppIcon name="Plus" />}
            />
          </View>
        </View>
      </View>

      {/* Khoảng trống cuối để Scroll thoải mái */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.xxl,
  },
  headerTextContainer: {
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.primary,
    letterSpacing: -1,
  },
  description: {
    color: "#767683",
    width: "80%",
    marginTop: Spacing.xs,
  },
  label: {
    fontSize: 14,
    marginBottom: Spacing.sm,
    color: Colors.text,
    fontWeight: "600",
  },
  templateList: {
    gap: Spacing.md,
  },
  templateCard: {
    padding: Spacing.lg,
    borderRadius: Rounded.sm,
    borderLeftWidth: 5,
    // Smooth transition simulation
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  activeShadow: {
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  iconWrapper: {
    padding: 4,
  },
  templateName: {
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 4,
  },
  templateDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  badge: {
    backgroundColor: "rgba(43, 56, 150, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: Rounded.md,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
