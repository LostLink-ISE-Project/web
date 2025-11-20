import { create } from "zustand";
import type { MeResponse } from "@/api/auth/auth.dto";

interface AuthState {
  token: string | null;
  user: MeResponse | null;
  setToken: (token: string | null) => void;
  setUser: (user: MeResponse | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  return {
    token,
    user: user ? JSON.parse(user) : null,
    setToken: (token) => {
      if (token) localStorage.setItem("accessToken", token);
      else localStorage.removeItem("accessToken");
      set({ token });
    },
    setUser: (user) => {
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
      set({ user });
    },
    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      set({ token: null, user: null });
    },
  };
});
