import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * View type for content listings
 * Matches the values expected by AdaptiveCardGrid component
 */
export type ViewType = 'grid' | 'small' | 'large';

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
