import React from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Text,
} from "react-native";
import { Colors, Spacing, Typography } from "@/theme";

interface CustomInputProps<T> extends Omit<
  TextInputProps,
  "value" | "onChangeText"
> {
  label?: string;
  value: T;
  error?: string;
  setValue: (val: T) => void;
  isPassword?: boolean;
}

export default function Input<T>({
  label,
  value,
  setValue,
  isPassword,
  error,
  style,
  ...rest
}: CustomInputProps<T>) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, style, error ? styles.error : null]}
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
      {error && (
        <Text style={[styles.errorMsg, Typography.bodyMd]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.onSecondaryContainer,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.onSurface,
  },
  error: {
    borderBottomColor: Colors.tertiary,
  },
  errorMsg: {
    fontSize: 8,
    color: Colors.error,
  },
});
