import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ConversationChatsResponse } from '@/types/chatbot';

interface ConversationChatsFilters {
  page?: number;
  limit?: number;
}

interface ConversationChatsApiResponse {
  success: boolean;
  message: string;
  data: ConversationChatsResponse;
}

export const useConversationChats = (conversationId: string | undefined, filters: ConversationChatsFilters = {}) => {
  return useQuery({
    queryKey: ['conversationChats', conversationId, filters],
    queryFn: async () => {
      if (!conversationId) throw new Error('Conversation ID is required');

      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get<ConversationChatsApiResponse>(`/admin/conversations/${conversationId}/chats?${params.toString()}`);
      return (response as ConversationChatsApiResponse).data;
    },
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

