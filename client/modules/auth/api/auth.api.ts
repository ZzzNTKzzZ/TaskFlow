import { api } from "@/services/api";
import { LoginData, SignUpData } from "../types/auth";
export const loginApi = async (data: LoginData) => {
  try {
    const response = await api.post("/auth/login", data);
   return response.data
  } catch (error: any) {
    const errorData = error.response?.data;
    return {
      success: false,
      errMsg: errorData?.message || "Lỗi kết nối máy chủ",
    };
  }
};

export const signupApi = async (data: SignUpData) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data
  } catch (error: any) {
    const errorData = error.response?.data;
    return {
      success: false,
      errMsg: errorData?.message || "Lỗi kết nối máy chủ",
    };
  }
};

export const refreshTokenApi = async () => {
  try {
    const response = await api.post("/auth/refresh-token");
    return response.data;
  } catch (error) {
    console.error("API Error [refreshTokenApi]:", error);
    return { success: false };
  }
}