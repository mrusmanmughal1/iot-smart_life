import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { localStorageService } from '@/services/storage/localStorage';
import { toast } from '@/stores/useNotificationStore';
import { useAppStore } from '@/stores/useAppStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ====================================
// GLOBAL REFRESH TOKEN HANDLING
// ====================================
let isRefreshing = false;
let subscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  subscribers.push(cb);
}

function onRefreshed(token: string) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

async function refreshAccessToken() {
  const refreshToken = localStorageService.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const baseURL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const refreshUrl = `${baseURL}/auth/refresh`;

  const response = await axios.post(refreshUrl, {
    refreshToken: refreshToken,
  });
  const { accessToken, expiresIn } = response.data.data || response.data;
  console.log(accessToken);
  if (!accessToken) {
    // Clear store and logout if no access token
    useAppStore.getState().logout();
    localStorageService.removeToken();
    localStorageService.removeUser();
    throw new Error('Refresh failed - no access token');
  }

  localStorageService.setToken(accessToken);
  if (expiresIn) localStorageService.setExpiresIn(expiresIn);

  return accessToken;
}

// ====================================
// REQUEST INTERCEPTOR
// ====================================
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers = config.headers || {};

    const token = localStorageService.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

// ====================================
// RESPONSE INTERCEPTOR
// ====================================
apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // avoid multiple refresh requests
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onRefreshed(newToken);
        } catch (err) {
          isRefreshing = false;
          // Clear store and logout
          useAppStore.getState().logout();
          localStorageService.removeToken();
          localStorageService.removeUser();
          // window.location.href = '/login';
          return Promise.reject(err);
        }
      }

      // wait until token is refreshed
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers!.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    // OTHER ERRORS
    if (error.response) {
      const message =
        (error.response.data as { message?: string })?.message ||
        'An error occurred';

      toast.error('Error', message);
    } else if (error.request) {
      toast.error('Network Error', 'Please check your internet connection');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
