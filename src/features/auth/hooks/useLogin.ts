import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.ts';
import { useAuthStore } from '../stores/authStore.ts';
import type { LoginCredentials } from '../types/auth.types.ts';
import { toast } from 'react-hot-toast';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      console.log('=== LOGIN SUCCESS ===');
      console.log('1. Data received:', {
        hasUser: !!data.user,
        hasAccessToken: !!data.accessToken,
        hasRefreshToken: !!data.refreshToken,
      });

      // Store tokens FIRST
      console.log('2. Storing tokens in localStorage...');
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      console.log('3. Tokens stored:', {
        accessToken: localStorage.getItem('accessToken')?.substring(0, 20) + '...',
        refreshToken: localStorage.getItem('refreshToken')?.substring(0, 20) + '...',
      });

      // Update store SECOND
      console.log('4. Updating auth store...');
      setAuth(data.user, data.accessToken, data.refreshToken);
      
      console.log('5. Store updated:', {
        isAuthenticated: useAuthStore.getState().isAuthenticated,
        hasUser: !!useAuthStore.getState().user
      });

      console.log('6. Showing success toast');
      toast.success('Login successful!');
      
      console.log('7. Navigating to /overview');
      navigate('/overview', { replace: true });
      
      console.log('=== LOGIN FLOW COMPLETE ===');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });
};