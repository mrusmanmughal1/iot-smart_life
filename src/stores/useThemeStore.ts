import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSystemTheme } from '@/utils/helpers/SystemHelpers';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      effectiveTheme: getSystemTheme(),
      setTheme: (theme: Theme) => {
        const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
        
        // Update document class
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(effectiveTheme);
          document.documentElement.setAttribute('data-theme', effectiveTheme);
        }

        set({ theme, effectiveTheme });
      },

      toggleTheme: () => {
        const { effectiveTheme } = get();
        const newTheme = effectiveTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state   ) {
          // Calculate the effective theme based on current system preference
          const effectiveTheme =
            state.theme === 'system' ? getSystemTheme() : state.theme;
           
          // Apply theme to document
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(effectiveTheme);
          document.documentElement.setAttribute('data-theme', effectiveTheme);
          
          // Update the store state with the correct effectiveTheme
          // This ensures components using effectiveTheme get the right value
          useThemeStore.setState({ effectiveTheme });
        }
      },
    }
  )
);

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      const store = useThemeStore.getState();
      if (store.theme === 'system') {
        // Update effectiveTheme when system theme changes
        const newEffectiveTheme = e.matches ? 'dark' : 'light';
        store.setTheme('system');
        // Ensure the effectiveTheme is updated
        useThemeStore.setState({ effectiveTheme: newEffectiveTheme });
      }
    });
}
