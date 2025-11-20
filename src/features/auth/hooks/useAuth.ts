import { useAuthStore } from '../stores/authStore.ts';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/authService.ts';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  // Only fetch current user if authenticated but no user data
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated && !user, // Only fetch if authenticated but no user data
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (currentUser && !user) {
      setUser(currentUser);
    }
  }, [currentUser, user, setUser]);

  return {
    user: user || currentUser,
    isAuthenticated,
    isLoading,
    logout,
  };
};