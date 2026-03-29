import React from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Text,
} from "react-native";
import { Colors, Spacing } from "@/theme";

// T là Generic, giúp linh hoạt kiểu dữ liệu
interface CustomInputProps<T> extends Omit<
  TextInputProps,
  "value" | "onChangeText"
> {
  label?: string;
  value: T;
  setValue: (val: T) => void;
  isPassword?: boolean;
}

export default function Input<T>({
  label,
  value,
  setValue,
  isPassword,
  style,
  ...rest
}: CustomInputProps<T>) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style]}
        secureTextEntry={isPassword}
        selectionColor={Colors.onSecondaryContainer}
        value={value !== undefined && value !== null ? String(value) : ""}
        onChangeText={(text) => {
          if (typeof value === "number") {
            setValue(Number(text) as unknown as T);
          } else {
            setValue(text as unknown as T);
          }
        }}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.onSecondaryContainer,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.onSurface,
  },
});
