// User Types
export type UserType = 'user' | 'admin' | 'superadmin';
export type AuthProvider = 'email' | 'google' | 'firebase';
export type FederationStatus = 'pending' | 'active' | 'inactive';

export interface User {
  id: string;
  username: string;
  email: string;
  user_type: UserType;
  is_active: boolean;
  auth_provider: AuthProvider;
  firebase_uid?: string;
  federation_status?: FederationStatus;
  profile?: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface UserStats {
  total_jobs: number;
  total_conversations: number;
  last_login?: string;
}

export interface UserDetail extends User {
  stats?: UserStats;
}

export interface TokenBalance {
  user_id: string;
  balance: number;
  last_updated: string;
}

export interface TokenTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'credit' | 'debit';
  reason: string;
  new_balance: number;
  created_at: string;
}

