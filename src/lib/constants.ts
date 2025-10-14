// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.futureguide.id/api';

// Authentication
export const TOKEN_KEY = 'fg_admin_token';
export const USER_KEY = 'fg_admin_user';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/admin/auth/login',
  AUTH_VERIFY: '/admin/auth/verify',
  AUTH_LOGOUT: '/admin/auth/logout',
  
  // Users
  USERS: '/admin/users',
  USER_DETAIL: (id: string) => `/admin/users/${id}`,
  USER_TOKENS: (id: string) => `/admin/users/${id}/tokens`,
  USER_JOBS: (id: string) => `/admin/users/${id}/jobs`,
  USER_CONVERSATIONS: (id: string) => `/admin/users/${id}/conversations`,
  
  // Jobs
  JOBS: '/admin/jobs',
  JOB_STATS: '/admin/jobs/stats',
  JOB_DETAIL: (id: string) => `/admin/jobs/${id}`,
  JOB_RESULTS: (id: string) => `/admin/jobs/${id}/results`,
  
  // Chatbot
  CHATBOT_STATS: '/admin/chatbot/stats',
  CHATBOT_MODELS: '/admin/chatbot/models',
  CONVERSATIONS: '/admin/conversations',
  CONVERSATION_DETAIL: (id: string) => `/admin/conversations/${id}`,
  CONVERSATION_CHATS: (id: string) => `/admin/conversations/${id}/chats`,
  
  // System
  SYSTEM_METRICS: '/admin/system/metrics',
} as const;

// Route Paths
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  USERS: '/users',
  USER_DETAIL: (id: string) => `/users/${id}`,
  JOBS: '/jobs',
  JOB_DETAIL: (id: string) => `/jobs/${id}`,
  CHATBOT: '/chatbot',
  CONVERSATION_DETAIL: (id: string) => `/chatbot/conversations/${id}`,
} as const;

// Protected Routes (require authentication)
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  '/users',
  '/jobs',
  '/chatbot',
];

// Public Routes (no authentication required)
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
];

