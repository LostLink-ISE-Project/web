import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ViewType = 'grid' | 'list';

interface ViewStore {
  viewType: ViewType;
  setViewType: (type: ViewType) => void;
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      viewType: 'grid',
      setViewType: (type) => set({ viewType: type }),
    }),
    {
      name: 'lostlink-view-type', // localStorage key
    }
  )
);
