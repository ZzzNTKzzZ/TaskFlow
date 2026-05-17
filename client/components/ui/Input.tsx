import { Spacing } from "@/theme/spacing";
import { Theme } from "@/theme/theme";
import { Typography } from "@/theme/typography";
import React, { Dispatch, SetStateAction } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import EyeIcon from "../icons/EyeIcon";
import Icons from "../icons/Icons";
import { Colors } from "@/theme/colors";

interface InputProps {
  value: string;
  setValue: (value: string) => void;
  editable?: boolean;
  placeholder?: string;
  label?: string;
  isSearch?: boolean
  isPassword?: boolean;
  showPassword?: boolean;
  onPressIcon?: () => void;
  error?: boolean;
  stylesInput?: StyleProp<ViewStyle>
  stylesLabel?: StyleProp<TextStyle>
}

export default function Input({
  value,
  setValue,
  placeholder,
  editable = true,
  label,
  isSearch = false,
  isPassword = false,
  showPassword,
  onPressIcon,
  error,
  stylesInput,
  stylesLabel,
}: InputProps) {

  const handleFocusError = () => {
    if(error) {
      setValue("")
    }
  }

  return (
    <View style={[styles.container, stylesInput]}>
      {label && <Text style={[Typography.label,{fontSize: 16} ,stylesLabel,error && { color: Theme.error}]}>{label}</Text>}
      
      <View style={[styles.inputContainer, error && styles.error, isSearch && styles.search]}>
        {isSearch && (
          <View style={{flexDirection: "row", alignItems: "center", paddingRight: Spacing[2]}}>
            <Icons name="Search" size={16}/>
          </View>
        )}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(newText) => {
              setValue(newText) 
          }}
          placeholder={placeholder}
          editable={editable}
          secureTextEntry={isPassword && !showPassword} 
          onFocus={handleFocusError}
        />

        {isPassword && (
          <TouchableOpacity 
            style={styles.iconContainer} 
            onPress={onPressIcon} 
            activeOpacity={0.7}
          >
            <EyeIcon open={showPassword} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: Spacing[1] / 2,
    marginBottom: Spacing[4],
  },
  inputContainer: {
    flexDirection: "row", 
    alignItems: "center",
    borderColor: Theme.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[1]
  },
  input: {
    fontSize: 16,
    flex: 1, 
  },
  iconContainer: {
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    borderColor: Theme.error,
    borderWidth: 1.5
  },
  search: {
    paddingVertical: Spacing[0],
    backgroundColor: Colors.gray[100],
    borderRadius: 8
  }
});