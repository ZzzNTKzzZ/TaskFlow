import { router } from "expo-router";
import { TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function BackIcon() {
  const handleBack = () => {
    // Kiểm tra xem có thể back không trước khi gọi để tránh lỗi điều hướng
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleBack} 
      activeOpacity={0.7}
      style={styles.container}
    >
      <Svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <Path
          d="M5 12H19M5 12L11 6M5 12L11 18" // Giữ nguyên dạng mũi tên có đuôi
          stroke="#1A1C1E"
          strokeWidth="2.8" // Tăng từ 2 lên 2.8 để nhìn đậm nét và mạnh mẽ hơn
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 6, 
    marginLeft: -6,
  }
});