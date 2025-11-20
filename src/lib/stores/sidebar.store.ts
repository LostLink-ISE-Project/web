import { create } from "zustand";

interface SidebarState {
  isSidebarOpen: boolean;        // for desktop
  isMobileSidebarOpen: boolean;  // for mobile
  setIsSidebarOpen: (open: boolean) => void;
  setIsMobileSidebarOpen: (open: boolean) => void;
}

export const useDashboardStore = create<SidebarState>((set) => ({
  isSidebarOpen: true,              // ✅ open by default on desktop
  isMobileSidebarOpen: false,       // ✅ closed by default on mobile
  setIsSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setIsMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
}));
