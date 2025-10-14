// Common API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Error Response
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// System Metrics Types
export interface SystemMetrics {
  timestamp: string;
  jobs: {
    total_jobs: string;
    completed_jobs: string;
    failed_jobs: string;
    processing_jobs: string;
    queued_jobs: string;
    avg_processing_time: string | null;
  };
  users: {
    total_users: string;
    active_users: string;
    new_users_today: string;
    active_today: string;
    total_tokens: string;
  };
  chat: {
    total_conversations: string;
    conversations_today: string;
    total_messages: string;
    messages_today: string;
    total_tokens_used: string;
  };
  system: {
    cpu: {
      cores: number;
      model: string;
      loadAverage: number[];
    };
    memory: {
      total: string;
      used: string;
      free: string;
      usagePercent: string;
    };
    process: {
      memory: string;
      pid: number;
      uptime: number;
    };
  };
}

// Dashboard Stats Types
export interface DashboardStats {
  jobStats: {
    total: number;
    completed: number;
    failed: number;
    successRate: number;
  };
  userStats: {
    totalUsers: number;
    newUsersToday: number;
    activeToday: number;
  };
  chatbotStats: {
    totalConversations: number;
    totalMessages: number;
    avgResponseTime: number;
  };
  tokenStats: {
    totalTokensUsed: number;
  };
}

// Trend Data Types
export interface JobTrendData {
  date: string;
  count: number;
  completed: number;
  failed: number;
}

export interface UserGrowthData {
  date: string;
  count: number;
}

