// User Types
export type UserType = 'user' | 'admin' | 'superadmin';
export type AuthProvider = 'local' | 'google' | 'firebase';
export type FederationStatus = 'pending' | 'active' | 'inactive' | 'failed';

export interface ProviderData {
  disabled?: boolean;
  provider_id?: string;
  creation_time?: string;
  email_verified?: boolean;
  last_sign_in_time?: string;
}

// School Types
export interface School {
  id: number;
  name: string;
  address?: string;
  city?: string;
  province?: string;
  created_at: string;
}

export interface UserProfile {
  full_name?: string;
  date_of_birth?: string;
  gender?: string;
  school_id?: number;
  school?: School;
  phone?: string;
  avatar_url?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  user_type: UserType;
  is_active: boolean;
  token_balance: number;
  last_login?: string | null;
  firebase_uid?: string;
  auth_provider: AuthProvider;
  provider_data?: ProviderData;
  last_firebase_sync?: string;
  federation_status?: FederationStatus;
  created_at: string;
  updated_at: string;
  profile?: UserProfile | null;
}

// User Detail Response
export interface UserDetailResponse {
  user: User;
  statistics: {
    jobs: Record<string, unknown>[];
    conversations: number;
  };
  recentJobs: Record<string, unknown>[];
  recentConversations: Record<string, unknown>[];
}

// Token Management Types
export interface TokenHistory {
  id: string;
  user_id: string;
  admin_id: string;
  activity_type: string;
  activity_data: {
    amount: number;
    reason: string;
    newBalance: number;
    oldBalance: number;
  };
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface TokenData {
  currentBalance: number;
  history: TokenHistory[];
}

export interface UpdateTokenRequest {
  amount: number;
  reason: string;
}

export interface UpdateTokenResponse {
  userId: string;
  email: string;
  oldBalance: number;
  newBalance: number;
  amount: number;
}

// User Update Types
export interface UpdateUserRequest {
  username?: string;
  is_active?: boolean;
  user_type?: UserType;
  federation_status?: FederationStatus;
  profile?: UserProfile;
}

// User List Response
export interface UsersListResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// User Filters
export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  user_type?: UserType;
  is_active?: boolean;
  auth_provider?: AuthProvider;
  school_id?: number;
}

