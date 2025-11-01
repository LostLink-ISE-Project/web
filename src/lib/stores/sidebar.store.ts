import { create } from "zustand";

interface SidebarState {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export const useDashboardStore = create<SidebarState>((set) => ({
  isSidebarOpen: true,
  setIsSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
