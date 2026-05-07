import { create } from "zustand";
import { User } from "../types/auth";

interface AuthStore {
  user: User | null;

  accessToken: string | null;

  setUser: (user: User | null) => void;
  setAccessToken: (accessToken: string | null) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,

  setUser: (user) => set({ user }),

  setAccessToken: (token) => set({ accessToken: token }),
    
  logout: () =>
    set({
      user: null,
      accessToken: null,
    }),
}));
