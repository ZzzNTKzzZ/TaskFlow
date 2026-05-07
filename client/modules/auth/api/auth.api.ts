import { api } from "@/services/api";
import { LoginData, SignUpData } from "../types/auth";
export const loginApi = async (data: LoginData) => {
  try {
    const response = await api.post("/auth/login", data);
    const { success, data: payload } = response.data;
    return {
      user: payload.user,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      success: true,
    };
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
    const { success, data: payload } = response.data;
    return {
      user: payload.user,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      success: true,
    };
  } catch (error: any) {
    const errorData = error.response?.data;
    return {
      success: false,
      errMsg: errorData?.message || "Lỗi kết nối máy chủ",
    };
  }
};
