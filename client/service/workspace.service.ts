import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { refreshTokenApi } from "./auth.service";
import api from "@/api/api";

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
    return response.data;
  } catch (error) {
    console.error("Lỗi API getWorkspace:", error);
    throw error;
  }
};
export const createWorkspace = async (workspaceName: string) => {
  try {
    const response = await api.post("/workspaces/", {
      name: workspaceName,
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi API createWorkspace: ", error);
    throw error; // Throw để UI có thể bắt được lỗi và hiển thị thông báo
  }
};
export const fetchWorkspaceData = async () => {
  try {
    let accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!accessToken) throw new Error("NO_ACCESS_TOKEN");

    const decoded = jwtDecode<MyTokenPayload>(accessToken);
    const currentTime = Date.now() / 1000;
    const expiryDate = new Date(decoded.exp * 1000);
    const currentDate = new Date();

    console.log("Token sẽ hết hạn lúc:", expiryDate.toLocaleString());
    console.log("Thời gian hiện tại:", currentDate.toLocaleString());
    if (decoded.exp < currentTime) {
      console.log("Access Token hết hạn, đang thử Radefresh...");

      if (!refreshToken) {
        await SecureStore.deleteItemAsync("accessToken");
        throw new Error("SESSION_EXPIRED");
      }

      try {
        const newTokens = await refreshTokenApi(refreshToken);

        await SecureStore.setItemAsync("accessToken", newTokens.accessToken);
        if (newTokens.refreshToken) {
          await SecureStore.setItemAsync(
            "refreshToken",
            newTokens.refreshToken,
          );
        }

        accessToken = newTokens.accessToken;
        console.log("Refresh Token thành công!");
      } catch (rfError) {
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


