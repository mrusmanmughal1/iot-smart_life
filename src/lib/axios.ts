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
  (config: InternalAxiosRequestConfig) => {
    const token = localStorageService.getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;``
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
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
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
            { refresh_token: refreshToken }
          );

          const { access_token } = response.data;
          localStorageService.setToken(access_token);

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