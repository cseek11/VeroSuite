import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { enhancedApi } from '@/lib/enhanced-api';

export type ViewMode = 'list' | 'cards' | 'dense';
export type DensityMode = 'dense' | 'standard';

export interface UserPreferences {
  viewMode: ViewMode;
  densityMode: DensityMode;
  defaultFilters: Record<string, any>;
  sortPreferences: Record<string, 'asc' | 'desc'>;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

const defaultPreferences: UserPreferences = {
  viewMode: 'list',
  densityMode: 'dense',
  defaultFilters: {},
  sortPreferences: {
    name: 'asc',
    created_at: 'desc',
  },
  theme: 'light',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
};

interface UserPreferencesStore {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  syncWithDatabase: () => Promise<void>;
}

export const useUserPreferencesStore = create<UserPreferencesStore>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      isLoading: false,
      error: null,

      updatePreferences: async (updates: Partial<UserPreferences>) => {
        const { preferences } = get();
        const newPreferences = { ...preferences, ...updates };
        
        set({ preferences: newPreferences, isLoading: true });
        
        try {
          // Update local storage immediately for responsive UX
          localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
          
          // Sync to database in background
          // TODO: Implement when user preferences API is ready
          // await enhancedApi.userPreferences.update(newPreferences);
          
          set({ isLoading: false, error: null });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to update preferences' 
          });
        }
      },

      resetPreferences: async () => {
        set({ isLoading: true });
        
        try {
          set({ preferences: defaultPreferences, isLoading: false, error: null });
          localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to reset preferences' 
          });
        }
      },

      syncWithDatabase: async () => {
        set({ isLoading: true });
        
        try {
          // TODO: Implement when user preferences API is ready
          // const dbPreferences = await enhancedApi.userPreferences.getByUser(userId);
          // const localPreferences = get().preferences;
          // const mergedPreferences = { ...defaultPreferences, ...dbPreferences, ...localPreferences };
          // set({ preferences: mergedPreferences, isLoading: false, error: null });
          
          set({ isLoading: false, error: null });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to sync preferences' 
          });
        }
      },
    }),
    {
      name: 'userPreferences',
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
);

// Hook for easy access to preferences
export const useUserPreferences = () => {
  const { preferences, updatePreferences, isLoading, error } = useUserPreferencesStore();
  
  return {
    preferences,
    updatePreferences,
    isLoading,
    error,
    
    // Convenience methods
    setViewMode: (viewMode: ViewMode) => updatePreferences({ viewMode }),
    setDensityMode: (densityMode: DensityMode) => updatePreferences({ densityMode }),
    setTheme: (theme: 'light' | 'dark' | 'auto') => updatePreferences({ theme }),
  };
};








