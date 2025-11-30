import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { localStorageService } from '@/services/storage/localStorage';
import { toast } from '@/stores/useNotificationStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = localStorageService.getToken();

    // 🔥 FIX: ensure headers object exists
    config.headers = config.headers || {};

    if (token) {
      // Check if token is expired and try to refresh if needed
      if (localStorageService.isTokenExpired()) {
        const refreshToken = localStorageService.getRefreshToken();
        
        if (refreshToken) {
          try {
            // Refresh token before making the request
            // Use direct axios to avoid interceptor loop
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            const refreshUrl = `${baseURL}/auth/refresh`;
            
            const response = await axios.post(
              refreshUrl,
              { refresh_token: refreshToken }
            );

            const { access_token, expires_in } = response.data.data || response.data;
            
            if (access_token) {
              localStorageService.setToken(access_token);
              if (expires_in) {
                localStorageService.setExpiresIn(expires_in);
              }
              config.headers.Authorization = `Bearer ${access_token}`;
            } else {
              // No token in refresh response, remove tokens
              localStorageService.removeToken();
              localStorageService.removeUser();
              window.location.href = '/login';
              return Promise.reject(new Error('Token refresh failed'));
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            localStorageService.removeToken();
            localStorageService.removeUser();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token, redirect to login
          localStorageService.removeToken();
          localStorageService.removeUser();
          window.location.href = '/login';
          return Promise.reject(new Error('No refresh token available'));
        }
      } else {
        // Token is still valid
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorageService.getRefreshToken();
        
        if (refreshToken) {
          const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
          const refreshUrl = `${baseURL}/auth/refresh`;
          
          const response = await axios.post(
            refreshUrl,
            { refresh_token: refreshToken }
          );

          const { access_token, expires_in } = response.data.data || response.data;
          localStorageService.setToken(access_token);
          
          if (expires_in) {
            localStorageService.setExpiresIn(expires_in);
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorageService.removeToken();
        localStorageService.removeUser();
        window.location.href = '/login';
      }
    }

    // Handle other errors
    if (error.response) {
      const message = (error.response.data as { message?: string })?.message || 'An error occurred';
      toast.error('Error', message);
    } else if (error.request) {
      toast.error('Network Error', 'Please check your internet connection');
    }

    return Promise.reject(error);
  }
);

export default apiClient;