'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { API_ENDPOINTS, TOKEN_KEY, USER_KEY, ROUTES } from '@/lib/constants';
import { getFromStorage, setToStorage, removeFromStorage } from '@/lib/utils';
import type { LoginCredentials, LoginResponse, AuthUser } from '@/types/auth';
import type { ApiError } from '@/types/api';

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  verifyToken: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verify token on mount
  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = getFromStorage<string | null>(TOKEN_KEY, null);
      
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const response = await api.get<AuthUser>(API_ENDPOINTS.AUTH_VERIFY);
      
      setUser(response);
      setToStorage(USER_KEY, response);
      setError(null);
    } catch (err) {
      // Token invalid or expired
      removeFromStorage(TOKEN_KEY);
      removeFromStorage(USER_KEY);
      setUser(null);
      setError(null); // Don't show error for expired token
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call login API
      const response = await api.post<LoginResponse>(
        API_ENDPOINTS.AUTH_LOGIN,
        credentials
      );

      // Store token and user
      setToStorage(TOKEN_KEY, response.token);
      setToStorage(USER_KEY, response.user);
      
      setUser({
        id: response.user.id,
        email: response.user.email,
        user_type: response.user.user_type,
      });

      // Redirect to dashboard
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Call logout API (optional, for server-side session invalidation)
      try {
        await api.post(API_ENDPOINTS.AUTH_LOGOUT);
      } catch {
        // Ignore logout API errors
      }

      // Clear local storage
      removeFromStorage(TOKEN_KEY);
      removeFromStorage(USER_KEY);
      
      setUser(null);
      setError(null);

      // Redirect to login
      router.push(ROUTES.LOGIN);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    verifyToken,
  };
}

