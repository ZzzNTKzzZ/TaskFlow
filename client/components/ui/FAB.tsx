import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { router, Href } from "expo-router";
import { Colors, Rounded, Spacing } from "@/theme";
import { AppIcon } from "./AppIcon";

type FABProps = {
  path: Href; 
};

export default function FAB({ path }: FABProps) {
  const handlePress = () => {
    router.push(path);
  };

  return (
    <Pressable 
      onPress={handlePress} 
      style={styles.container}
    >
      <AppIcon name="Plus" size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Spacing.xl, 
    right: Spacing.xl,
    
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Rounded.lg,
    
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    justifyContent: "center",
    alignItems: "center",
  },
});