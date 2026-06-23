import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/auth.store";
import { LoginData, SignUpData } from "@/types/auth";

import AuthService from "../services/auth.service";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);
  const login = async (data: LoginData) => {
    try {
      setLoading(true);

      const response = await AuthService.login(data);
      if (response.success) {
        // Ép kiểu hoặc cung cấp chuỗi rỗng nếu giá trị là null/undefined
        const accessToken = String(response.accessToken ?? "");
        const refreshToken = String(response.refreshToken ?? "");

        // Kiểm tra nếu thực sự có token thì mới lưu
        if (accessToken && refreshToken) {
          setTokens(accessToken, refreshToken);
          setUser(response.user);

          await SecureStore.setItemAsync("ACCESS_TOKEN", accessToken);
          await SecureStore.setItemAsync("REFRESH_TOKEN", refreshToken);
        } else {
          console.error("Login thành công nhưng không nhận được token hợp lệ");
        }
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignUpData) => {
    try {
      setLoading(true);

      const response = await AuthService.signup(data);
      if (response.success) {
        const accessToken = response.accessToken ?? "";
        const refreshToken = response.refreshToken ?? "";

        setTokens(accessToken, refreshToken);
          setUser(response.user);

        await SecureStore.setItemAsync("ACCESS_TOKEN", accessToken);
        await SecureStore.setItemAsync("REFRESH_TOKEN", refreshToken);
      }

      return response;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    login,
    signup,
  };
};
