import { create } from "zustand";
import { User } from "@/types/auth";
import * as SecureStore from "expo-secure-store"
interface AuthStore {
  user: User | null;

  accessToken: string | null;

  refreshToken: string | null;

  setUser: (user: User | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setUser: (user) => set({ user }),

  // Cập nhật từng cái
  setAccessToken: (token) => set({ accessToken: token }),
  
  setRefreshToken: (token) => set({ refreshToken: token }),

  setTokens: (access: string, refresh: string) => set({ 
    accessToken: access, 
    refreshToken: refresh 
  }),

  logout: async () => {
    // Xóa trong store
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    });
    try {
      await SecureStore.deleteItemAsync("ACCESS_TOKEN");
      await SecureStore.deleteItemAsync("REFRESH_TOKEN"); 
    } catch (error) {
      console.log("Lỗi khi xóa token cứng:", error);
    }
  },
}));