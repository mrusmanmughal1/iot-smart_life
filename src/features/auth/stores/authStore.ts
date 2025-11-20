import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth.types.ts';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingIn: boolean; // NEW: Track if we're in login process
  
  // Actions
  setUser: (user: User) => void;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setLoggingIn: (loggingIn: boolean) => void; // NEW
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isLoggingIn: false,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: true,
        });
      },

      setAuth: (user, accessToken, refreshToken) => {
        console.log('✅ setAuth: Starting authentication');
        
        // Mark as logging in
        set({ isLoggingIn: true });
        
        // Tokens are stored in localStorage by the hook
        // Just update the store
        set({
          user,
          isAuthenticated: true,
        });
        
        // Wait a bit then clear the flag
        setTimeout(() => {
          set({ isLoggingIn: false });
          console.log('✅ setAuth: Login process complete');
        }, 1000);
      },

      logout: () => {
        // GUARD: Don't allow logout during login
        if (get().isLoggingIn) {
          console.log('🚫 LOGOUT BLOCKED - Currently logging in!');
          return;
        }
        
        console.log('🚨 LOGOUT CALLED - Stack trace:', new Error().stack);
        
        // Clear tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Clear store
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),
        
      setLoggingIn: (loggingIn) =>
        set({
          isLoggingIn: loggingIn,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);