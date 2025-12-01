import localStorageService from '@/services/storage/localStorage';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Modal State
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // User State
        user: null,
        isAuthenticated: false,
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        logout: () => {
          localStorageService.removeToken();

          set({
            user: null,
            isAuthenticated: false,
          });
        },

        // UI State
        sidebarOpen: true,
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        // Loading
        isLoading: false,
        setLoading: (loading) => set({ isLoading: loading }),

        // Modal
        activeModal: null,
        setActiveModal: (modal) => set({ activeModal: modal }),

        // Search
        searchQuery: '',
        setSearchQuery: (query) => set({ searchQuery: query }),
      }),
      {
        name: 'app-storage',
        // Only persist user authentication state, not UI preferences
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AppStore' }
  )
);
