import { useAppStore } from '../../../stores/useAppStore.ts';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.ts';
import type { LoginCredentials } from '../types/auth.types.ts';
import { toast } from 'react-hot-toast';
import localStorageService from '@/services/storage/localStorage.ts';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAppStore((state) => state.setUser);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      console.log('=== LOGIN SUCCESS ===');
      console.log('1. Data received:', {
        hasUser: !!data.data?.user || !!data.user,
        hasAccessToken: !!data.data?.accessToken || !!data.accessToken,
        hasRefreshToken: !!data.data?.refreshToken || !!data.refreshToken,
      });

      // Handle different response structures
      // Response can be: { data: { user, accessToken, refreshToken } } or { user, accessToken, refreshToken }
      const accessToken = data.data?.accessToken || data.accessToken;
      const refreshToken = data.data?.refreshToken || data.refreshToken;
      const userData = data.data?.user || data.user;

      // Store tokens FIRST
      console.log('2. Storing tokens in localStorage...');
      if (accessToken) {
        localStorageService.setToken(accessToken); 
      }
      if (refreshToken) {
        localStorageService.setRefreshToken(refreshToken);
      }
      
      console.log('3. Tokens stored:', {
        accessToken: localStorage.getItem('accessToken')?.substring(0, 20) + '...',
        refreshToken: localStorage.getItem('refreshToken')?.substring(0, 20) + '...',
      });

      // Update store SECOND
      if (userData) {
        // Transform user data to match useAppStore User interface
        // API User has 'name', but store expects 'firstName' and 'lastName'
        const nameParts = userData.name?.split(' ') || [];
        const firstName = userData.firstName || nameParts[0] || '';
        const lastName = userData.lastName || nameParts.slice(1).join(' ') || '';
        
        const storeUser = {
          id: userData.id || '',
          email: userData.email || '',
          firstName,
          lastName,
          role: userData.role || '',
        };
        setAuth(storeUser);
      }
      
      console.log('5. Store updated:', {
        isAuthenticated: useAppStore.getState().isAuthenticated,
        hasUser: !!useAppStore.getState().user
      });

      console.log('6. Showing success toast');
      toast.success('Login successful!');
      
      console.log('7. Navigating to /overview');
      navigate('/dashboard', { replace: true });
      
      console.log('=== LOGIN FLOW COMPLETE ===');
    },
    onError: (error: unknown) => {
      console.error('Login error:', error);
      const message = 
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        'Login failed';
      toast.error(message);
    },
  });
};