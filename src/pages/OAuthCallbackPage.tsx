import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '@/stores/useAppStore.ts';
import { authService } from '@/features/auth/services/authService.ts';
import { toast } from 'react-hot-toast';
import { AuthLayout } from '@/features/auth/components/AuthLayout.tsx';

export const OAuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAppStore((state) => state.setUser);

  const code = searchParams.get('code');
  console.log(code , 'code')
  const { mutate: handleCallback, isPending, isError } = useMutation({
    mutationFn: (code: string) => authService.handleOAuthCallback(code),
    onSuccess: (data) => {
      console.log('=== OAUTH CALLBACK SUCCESS ===');
      console.log(data , 'data')
      console.log('1. Data received:', {
        hasUser: !!data.data?.user || !!data.user,
        hasAccessToken: !!data.data?.accessToken || !!data.accessToken,
        hasRefreshToken: !!data.data?.refreshToken || !!data.refreshToken,
      });

      // Handle different response structures
      const accessToken = data.data?.accessToken || data.accessToken;
      const refreshToken = data.data?.refreshToken || data.refreshToken;
      const userData = data.data?.user || data.user;

      // Store tokens FIRST
      console.log('2. Storing tokens in localStorage...');
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      console.log('3. Tokens stored:', {
        accessToken: localStorage.getItem('accessToken')?.substring(0, 20) + '...',
        refreshToken: localStorage.getItem('refreshToken')?.substring(0, 20) + '...',
      });
      console.log(userData , 'userData'	)

      // Update store SECOND
      if (userData) {
        // Transform user data to match useAppStore User interface
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

      console.log('4. Store updated:', {
        isAuthenticated: useAppStore.getState().isAuthenticated,
        hasUser: !!useAppStore.getState().user,
      });

      console.log('5. Showing success toast');
      toast.success('Login successful!');

      console.log('6. Navigating to /dashboard');
      navigate('/dashboard', { replace: true });

      console.log('=== OAUTH CALLBACK FLOW COMPLETE ===');
    },
    onError: (error: unknown) => {
      console.error('OAuth callback error:', error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Authentication failed. Please try again.';
      toast.error(message);
      // Redirect to login on error
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    },
  });

  useEffect(() => {
    if (code) {
      handleCallback(code);
    } else {
      console.error('No authorization code found in callback URL');
      toast.error('Authorization code not found. Please try again.');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
    }
  }, [code, handleCallback, navigate]);

  return (
    <AuthLayout title="Completing sign in...">
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        {isPending && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1976D2] mb-4"></div>
            <p className="text-sm text-[#545454]">Completing authentication...</p>
          </>
        )}
        {isError && (
          <>
            <div className="text-red-500 mb-4">✕</div>
            <p className="text-sm text-red-600">Authentication failed. Redirecting to login...</p>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

