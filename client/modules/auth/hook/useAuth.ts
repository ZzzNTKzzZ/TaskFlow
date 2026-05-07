import { useState } from "react";

import { useAuthStore } from "../store/auth.store";
import { LoginData, SignUpData } from "../types/auth";

import AuthService from "../services/auth.services";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const login = async (data: LoginData) => {
    try {
      setLoading(true);

      const response = await AuthService.login(data);

      if (response.success) {
        setUser(response.user || null);
        setAccessToken(response.accessToken || null);
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
        setUser(response.user || null);
        setAccessToken(response.accessToken || null);
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
