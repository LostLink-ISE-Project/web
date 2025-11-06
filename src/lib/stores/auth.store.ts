import { create } from "zustand";
import type { MeResponse } from "@/api/auth/auth.dto";

interface AuthState {
  token: string | null;
  user: MeResponse | null;
  setToken: (token: string | null) => void;
  setUser: (user: MeResponse | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("accessToken"),
  user: null,
  setToken: (token) => {
    if (token) localStorage.setItem("accessToken", token);
    else localStorage.removeItem("accessToken");
    set({ token });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem("accessToken");
    set({ token: null, user: null });
  },
}));
