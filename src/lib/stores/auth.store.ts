import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "axios";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        set({ token });
      },
      logout: () => {
        delete api.defaults.headers.common["Authorization"];
        set({ token: null });
      },
    }),
    { name: "lostlink-auth" }
  )
);