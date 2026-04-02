import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import Login from "./Auth/Login"; 

export default function Page() {
  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <Login />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});