import { User } from './user';

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_type: 'user' | 'admin' | 'superadmin';
}

export interface VerifyTokenResponse {
  id: string;
  email: string;
  user_type: string;
}

