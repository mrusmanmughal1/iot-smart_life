import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.ts';
// import { useAuthStore } from '../stores/authStore.ts';
import type { RegisterData } from '../types/auth.types.ts';
import { toast } from 'react-hot-toast';

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      // setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success(data.data.message);
      navigate('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });
};