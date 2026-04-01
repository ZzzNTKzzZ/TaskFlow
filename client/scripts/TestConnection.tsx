import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";

export default function ConnectionScreen() {
  const [status, setStatus] = useState("Chờ kiểm tra...");
  const [loading, setLoading] = useState(false);

  const checkConnection = async () => {
    const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

    setLoading(true);
    setStatus("Đang gửi yêu cầu...");

    try {
      const response = await axios.get(`${BASE_URL}/api/check-connection`, {
        timeout: 5000,
      });

      if (response.status === 200) {
        setStatus("✅ Kết nối Axios thành công!");
        Alert.alert("Phản hồi từ BE", response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Lúc này TypeScript biết 'error' là AxiosError
        if (error.response) {
          setStatus(`❌ Lỗi Server: ${error.response.status}`);
        } else if (error.request) {
          setStatus("❌ Không nhận được phản hồi");
        }
      } else {
        // Lỗi không phải do Axios (lỗi code, logic khác...)
        setStatus("❌ Lỗi không xác định");
        console.error("Lỗi lạ:", (error as Error).message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{status}</Text>

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: "#ccc" }]}
        onPress={checkConnection}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Đang thử..." : "Kết nối tới Backend"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  statusText: { fontSize: 18, marginBottom: 20, fontWeight: "500" },
  button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
