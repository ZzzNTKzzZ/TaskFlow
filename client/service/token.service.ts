import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

let refreshPromise: Promise<string | null> | null = null;

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
};

export const getValidAccessToken = async (): Promise<string | null> => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  if (!accessToken) return null;

  try {
    const decoded: any = jwtDecode(accessToken);
    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now();

    // Nếu token còn hạn trên 30 giây, trả về luôn
    if (currentTime < expiryTime - 30000) {
      return accessToken;
    }

    // NẾU ĐANG CÓ MỘT REQUEST REFRESH KHÁC ĐANG CHẠY
    if (refreshPromise) {
      console.log("--- Đang đợi kết quả từ request refresh trước đó... ---");
      return refreshPromise;
    }

    // BẮT ĐẦU REFRESH (Chỉ chạy 1 lần duy nhất cho tất cả các request cùng lúc)
    refreshPromise = (async () => {
      try {
        console.log("--- BẮT ĐẦU REFRESH TOKEN (CHỈ XUẤT HIỆN 1 LẦN) ---");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (!refreshToken) throw new Error("No Refresh Token Found");

        // Gọi API bằng axios thuần để không bị dính vào Interceptor cũ (gây loop)
        const response = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/auth/refresh`, {
          token: refreshToken, 
        });

        const { accessToken: newAccess, refreshToken: newRefresh } = response.data;

        await SecureStore.setItemAsync("accessToken", newAccess);
        if (newRefresh) await SecureStore.setItemAsync("refreshToken", newRefresh);

        return newAccess;
      } catch (err) {
        console.error("Refresh Token failed:", err);
        return null;
      } finally {
        // Giải phóng khóa sau khi xong
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  } catch (e) {
    return null;
  }
};