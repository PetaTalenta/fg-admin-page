import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ChatbotStats } from '@/types/chatbot';

interface ChatbotStatsApiResponse {
  success: boolean;
  message: string;
  data: ChatbotStats;
}

export const useChatbotStats = () => {
  return useQuery({
    queryKey: ['chatbotStats'],
    queryFn: async () => {
      const response = await api.get<ChatbotStatsApiResponse>('/admin/chatbot/stats');
      return (response as ChatbotStatsApiResponse).data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
};

