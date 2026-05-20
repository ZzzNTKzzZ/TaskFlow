import { Spacing } from "@/theme/spacing";
import React from "react";
import { Modal, StyleSheet, TouchableWithoutFeedback, View, Animated, Dimensions, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BaseOverlayProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
export default function BaseOverlay({ visible, onClose, children }: BaseOverlayProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide" 
      onRequestClose={onClose}
    >
      {/* Vùng nền mờ phía sau - Bấm vào đây sẽ đóng Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Nội dung chính của Overlay (Dạng Bottom Sheet) */}
      <ScrollView style={[styles.contentContainer, { paddingBottom: insets.bottom + 16 }]}>
        {/* Thanh kéo nhỏ phía trên để tạo cảm giác UI Bottom Sheet */}
        <View style={styles.indicator} />
        
        {children}
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Làm tối màn hình phía sau
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[3],
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20, // Đổ bóng cho Android
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: Spacing[5],
  },
});