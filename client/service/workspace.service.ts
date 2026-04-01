import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import { refreshTokenApi } from "./auth.service";

interface MyTokenPayload {
  workspaceId: string;
  exp: number;
  [key: string]: any; // Cho phép các field khác nếu có
}
/**
 * Hàm gọi API lấy thông tin Workspace
 */
export const getWorkspace = async (token: string) => {
  try {
    const response = await api.get("/workspaces/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Lỗi API getWorkspace:", error);
    throw error;
  }
};

export const fetchWorkspaceData = async () => {
  try {
    let accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!accessToken) throw new Error("NO_ACCESS_TOKEN");
    
    const decoded = jwtDecode<MyTokenPayload>(accessToken);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.log("Access Token hết hạn, đang thử Refresh...");

      if (!refreshToken) {
        await SecureStore.deleteItemAsync("accessToken");
        throw new Error("SESSION_EXPIRED"); // Hết hạn mà ko có refresh token -> login lại
      }

      try {
        const newTokens = await refreshTokenApi(refreshToken);
        
        // Lưu token mới vào bộ nhớ
        await SecureStore.setItemAsync("accessToken", newTokens.accessToken);
        if (newTokens.refreshToken) {
          await SecureStore.setItemAsync("refreshToken", newTokens.refreshToken);
        }
        
        accessToken = newTokens.accessToken; // Gán lại token mới để gọi API bên dưới
        console.log("Refresh Token thành công!");
      } catch (rfError) {
        // Nếu refresh token cũng hết hạn hoặc lỗi
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        throw new Error("SESSION_EXPIRED");
      }
    }
    // --- GỌI API CHÍNH ---
    const workspaceData = await getWorkspace(accessToken!);
    return workspaceData;

  } catch (error) {
    console.error("Lỗi fetchWorkspaceData:", error);
    throw error;
  }
};
