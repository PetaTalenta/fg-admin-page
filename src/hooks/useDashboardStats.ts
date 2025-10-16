import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { JobStats } from '@/types/job';
import type { ChatbotStats } from '@/types/chatbot';
import type { SystemMetrics, DashboardStats } from '@/types/api';

// Fetch job statistics
const fetchJobStats = async (): Promise<JobStats['overview']> => {
  const response = await api.get<{ success: boolean; data: JobStats }>('/admin/jobs/stats');
  return response.data.overview;
};

// Fetch system metrics (includes user stats and token stats)
const fetchSystemMetrics = async (): Promise<SystemMetrics> => {
  const response = await api.get<{ success: boolean; data: SystemMetrics }>('/admin/system/metrics');
  return response.data;
};

// Fetch chatbot statistics
const fetchChatbotStats = async (): Promise<ChatbotStats> => {
  const response = await api.get<{ success: boolean; data: ChatbotStats }>('/admin/chatbot/stats');
  return response.data;
};

// Hook for fetching all dashboard statistics
export const useDashboardStats = () => {
  // Fetch job stats
  const jobStatsQuery = useQuery({
    queryKey: ['dashboard', 'jobStats'],
    queryFn: fetchJobStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchInterval: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // Fetch system metrics
  const systemMetricsQuery = useQuery({
    queryKey: ['dashboard', 'systemMetrics'],
    queryFn: fetchSystemMetrics,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  // Fetch chatbot stats
  const chatbotStatsQuery = useQuery({
    queryKey: ['dashboard', 'chatbotStats'],
    queryFn: fetchChatbotStats,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  // Combine all stats into a single object
  const dashboardStats: DashboardStats | undefined = 
    jobStatsQuery.data && systemMetricsQuery.data && chatbotStatsQuery.data
      ? {
          jobStats: {
            total: jobStatsQuery.data.total,
            completed: jobStatsQuery.data.completed,
            failed: jobStatsQuery.data.failed,
            successRate: jobStatsQuery.data.successRate ?? (jobStatsQuery.data.total > 0 ? (jobStatsQuery.data.completed / jobStatsQuery.data.total) * 100 : 0),
          },
          userStats: {
            totalUsers: parseInt(systemMetricsQuery.data.users.total_users),
            newUsersToday: parseInt(systemMetricsQuery.data.users.new_users_today),
            activeToday: parseInt(systemMetricsQuery.data.users.active_today),
          },
          chatbotStats: {
            totalConversations: chatbotStatsQuery.data.overview.totalConversations,
            totalMessages: chatbotStatsQuery.data.overview.totalMessages,
            avgResponseTime: chatbotStatsQuery.data.performance.avgResponseTimeMs,
          },
          tokenStats: {
            totalTokensUsed: parseInt(systemMetricsQuery.data.chat.total_tokens_used),
          },
        }
      : undefined;

  return {
    data: dashboardStats,
    isLoading: jobStatsQuery.isLoading || systemMetricsQuery.isLoading || chatbotStatsQuery.isLoading,
    isError: jobStatsQuery.isError || systemMetricsQuery.isError || chatbotStatsQuery.isError,
    error: jobStatsQuery.error || systemMetricsQuery.error || chatbotStatsQuery.error,
    refetch: () => {
      jobStatsQuery.refetch();
      systemMetricsQuery.refetch();
      chatbotStatsQuery.refetch();
    },
  };
};

