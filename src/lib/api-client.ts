import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, TOKEN_KEY } from './constants';
import { getCookie } from './utils';
import type { ApiError } from '@/types/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from cookie first, then localStorage as fallback
    if (typeof window !== 'undefined') {
      let token = getCookie(TOKEN_KEY);
      if (!token) {
        token = localStorage.getItem(TOKEN_KEY);
      }
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Log API requests for debugging
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? '[REDACTED]' : undefined
      }
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Handle 401 Unauthorized - redirect to login only if not already on login page
      if (status === 401) {
        if (typeof window !== 'undefined') {
          // Don't redirect if already on login page or if this is an auth endpoint
          const currentPath = window.location.pathname;
          const isOnLoginPage = currentPath === '/login';
          const isAuthEndpoint = error.config?.url?.includes('/auth/');

          if (!isOnLoginPage && !isAuthEndpoint) {
            localStorage.removeItem(TOKEN_KEY);
            window.location.href = '/login';
          }
        }
      }
      
      // Return formatted error
      return Promise.reject({
        message: data?.message || data?.error || 'An error occurred',
        statusCode: status,
        error: data?.error || 'Error',
      } as ApiError);
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        message: 'No response from server. Please check your connection.',
        statusCode: 0,
        error: 'Network Error',
      } as ApiError);
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || 'An unexpected error occurred',
        statusCode: 0,
        error: 'Unknown Error',
      } as ApiError);
    }
  }
);

// Helper functions for common HTTP methods
export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) => 
    apiClient.get<T>(url, { params }).then(res => res.data),
  
  post: <T>(url: string, data?: unknown) => 
    apiClient.post<T>(url, data).then(res => res.data),
  
  put: <T>(url: string, data?: unknown) => 
    apiClient.put<T>(url, data).then(res => res.data),
  
  patch: <T>(url: string, data?: unknown) => 
    apiClient.patch<T>(url, data).then(res => res.data),
  
  delete: <T>(url: string) => 
    apiClient.delete<T>(url).then(res => res.data),
};

export default apiClient;

