import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewType = 'grid' | 'small-tile' | 'large-tile';

interface ContentFilterState {
  viewType: ViewType;
  setViewType: (viewType: ViewType) => void;
}

/**
 * Global store for content listing preferences
 * Persists view type selection across page navigations
 */
export const useContentFilterStore = create<ContentFilterState>()(
  persist(
    (set) => ({
      viewType: 'grid',
      setViewType: (viewType: ViewType) => set({ viewType }),
    }),
    {
      name: 'tw-content-filter-storage',
    }
  )
);
