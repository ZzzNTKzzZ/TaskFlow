import Button from "@/components/Button";
import Header from "@/components/layout/Header";
import Input from "@/components/ui/Input";
import PriorityTag from "@/components/ui/PriorityTag";
import { globalStyles } from "@/styles/global";
import { Colors, Rounded, Spacing, Typography } from "@/theme";
import { Priority } from "@/Types/enum";
import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import { Text, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import RightArrow from "@/assets/icons/RightArrow.svg";
export default function TaskCreate() {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<Priority>("low");
  const [description, setDescription] = useState("");

  // State cho Due Date (Có thể null nếu là Note)
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const priorityLevel: Priority[] = ["low", "medium", "high", "urgent"];

  // --- Helper Functions ---
  const formatDate = (date: Date | null) => {
    if (!date) return "No deadline";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "--:--";
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      // Nếu trước đó null, ta lấy selectedDate. Nếu đã có date, giữ nguyên giờ cũ chỉ đổi ngày.
      const newDate = dueDate || new Date();
      newDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
      );
      setDueDate(new Date(newDate));
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedDate) {
      const newDate = dueDate || new Date();
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setDueDate(new Date(newDate));
    }
  };

  return (
    <ScrollView
      style={[globalStyles.container]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Header />

      {/* Header Section */}
      <View style={{ marginBottom: Spacing.lg }}>
        <Text
          style={[
            globalStyles.textDescription,
            Typography.displayLg,
            styles.entryTag,
          ]}
        >
          New Entry
        </Text>
        <Text
          style={[
            Typography.displayLg,
            globalStyles.textHeading,
            { color: Colors.primary, width: "80%" },
          ]}
        >
          Record a New Task.
        </Text>
        <Text style={[Typography.lighterMd, { marginTop: Spacing.xs }]}>
          Define the architecture of your next milestone. Every great project
          begins with a clear ledger entry.
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={[globalStyles.formSylte]}>
        {/* Task Name */}
        <Input
          value={taskName}
          setValue={setTaskName}
          placeholder="Task specification..."
          label="Title"
        />

        {/* Priority Tier */}
        <View style={{ marginTop: Spacing.md }}>
          <Text style={[Typography.labelSm, styles.label]}>Priority Tier</Text>
          <View style={styles.priorityContainer}>
            {priorityLevel.map((p) => (
              <PriorityTag
                key={p}
                priority={p}
                onPress={() => setPriority(p)}
                isActive={priority === p}
              />
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={{ marginTop: Spacing.md }}>
          <Text style={[Typography.labelSm, styles.label]}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            placeholder="Architecture notes, edge cases, or dependencies..."
            placeholderTextColor={Colors.description}
            style={[Typography.bodyMd, styles.textArea]}
          />
        </View>

        {/* Due Date Section */}
        <View style={{ marginTop: Spacing.lg }}>
          <View style={styles.dateHeader}>
            <Text
              style={[Typography.labelSm, styles.label, { marginBottom: 0 }]}
            >
              Due Date
            </Text>
            {dueDate && (
              <Pressable onPress={() => setDueDate(null)}>
                <Text style={{ color: Colors.tertiary, fontSize: 12 }}>
                  Remove deadline
                </Text>
              </Pressable>
            )}
          </View>

          <View style={styles.dateTimeRow}>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={[styles.dateTimeBox, !dueDate && { opacity: 0.6 }]}
            >
              <Text style={styles.dateTimeLabel}>Date</Text>
              <Text style={[Typography.bodyMd, styles.dateTimeValue]}>
                {formatDate(dueDate)}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowTimePicker(true)}
              style={[styles.dateTimeBox, !dueDate && { opacity: 0.6 }]}
            >
              <Text style={styles.dateTimeLabel}>Time</Text>
              <Text style={[Typography.bodyMd, styles.dateTimeValue]}>
                {formatTime(dueDate)}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={onDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onTimeChange}
          />
        )}

        {/* Action Button */}
        <View
          style={{
            marginTop: Spacing.xl,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Button title="Cancel" variant="secondary" />
          <Button
            title="Create Card"
            onPress={() =>
              console.log({ taskName, priority, description, dueDate })
            }
            rightIcon={<RightArrow />}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  entryTag: { textTransform: "uppercase", fontSize: 12, marginBottom: 4 },
  divider: {
    borderWidth: 0.5,
    width: "20%",
    borderColor: Colors.description,
    marginVertical: Spacing.md,
  },
  label: {
    fontSize: 14,
    marginBottom: Spacing.sm,
    color: Colors.onSurfaceVariant,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    borderRadius: Rounded.md,
  },
  textArea: {
    borderRadius: Rounded.sm,
    backgroundColor: Colors.surfaceLow,
    minHeight: 120,
    textAlignVertical: "top",
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "transparent",
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.description,
    paddingBottom: 8,
    marginBottom: 12,
  },
  dateTimeRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  dateTimeBox: {
    flex: 1,
    backgroundColor: Colors.surfaceLow,
    padding: Spacing.md,
    borderRadius: Rounded.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceLow,
  },
  dateTimeLabel: {
    fontSize: 10,
    color: Colors.description,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dateTimeValue: {
    color: Colors.primary,
    marginTop: 4,
    fontWeight: "600",
  },
});
