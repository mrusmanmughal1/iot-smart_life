import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.ts';
import { useAppStore } from '../../../stores/useAppStore.ts';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAppStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Get tokens from localStorage
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('accessToken');
      
      if (refreshToken && accessToken) {
        // Call logout API with refresh token in body and access token in headers
        await authService.logout(refreshToken, accessToken);
      }
      
      // Return void even if no tokens (local logout)
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all queries cache
      queryClient.clear();
      
      // Clear user state from store
      logout();
      
      // Clear all localStorage items (tokens, etc.)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      toast.success('Logged out successfully');
      
      // Navigate to login page
      navigate('/login', { replace: true });
    },
    onError: (error: unknown) => {
      console.error('Logout error:', error);
      
      // Even if API call fails, clear local state
      queryClient.clear();
      logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.clear();
      
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Logout completed';
      
      toast.success(message);
      navigate('/login', { replace: true });
    },
  });
};

