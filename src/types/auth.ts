import { User } from './user';
import { ApiResponse } from './api';

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginData {
  user: User;
  token: string;
}

export type LoginResponse = ApiResponse<LoginData>;

export interface AuthUser {
  id: string;
  email: string;
  user_type: 'user' | 'admin' | 'superadmin';
}

export type VerifyTokenResponse = ApiResponse<AuthUser>;

