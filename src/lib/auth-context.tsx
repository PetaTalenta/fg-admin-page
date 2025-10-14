'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { API_ENDPOINTS, TOKEN_KEY, USER_KEY, ROUTES } from '@/lib/constants';
import { getFromStorage, setToStorage, removeFromStorage, setCookie, removeCookie } from '@/lib/utils';
import type { LoginCredentials, LoginResponse, AuthUser, VerifyTokenResponse } from '@/types/auth';
import type { ApiError } from '@/types/api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user and token from storage on app load (no API call to prevent race conditions)
  useEffect(() => {
    try {
      setIsLoading(true);
      const token = getFromStorage<string | null>(TOKEN_KEY, null);
      const savedUser = getFromStorage<AuthUser | null>(USER_KEY, null);

      if (token && savedUser) {
        setUser(savedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
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
      const response = await api.get<VerifyTokenResponse>(API_ENDPOINTS.AUTH_VERIFY);

      if (!response.data) {
        throw new Error('Invalid response format');
      }

      setUser(response.data);
      setToStorage(USER_KEY, response.data);
      setError(null);
    } catch (err) {
      // Token invalid or expired - clear all auth data
      removeFromStorage(TOKEN_KEY);
      removeCookie(TOKEN_KEY);
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

      if (!response.data) {
        throw new Error('Invalid response format');
      }

      // Store token and user
      setToStorage(TOKEN_KEY, response.data.token);
      setCookie(TOKEN_KEY, response.data.token, 7); // 7 days
      setToStorage(USER_KEY, response.data.user);

      setUser({
        id: response.data.user.id,
        email: response.data.user.email,
        user_type: response.data.user.user_type,
      });

      // Small delay to ensure cookie is set before redirect
      await new Promise(resolve => setTimeout(resolve, 500));

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

      // Clear local storage and cookies
      removeFromStorage(TOKEN_KEY);
      removeCookie(TOKEN_KEY);
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

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
