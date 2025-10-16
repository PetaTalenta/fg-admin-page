import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ConversationDetail } from '@/types/chatbot';

interface ConversationDetailApiResponse {
  success: boolean;
  message: string;
  data: ConversationDetail;
}

export const useConversationDetail = (conversationId: string | undefined) => {
  return useQuery({
    queryKey: ['conversationDetail', conversationId],
    queryFn: async () => {
      if (!conversationId) throw new Error('Conversation ID is required');

      const response = await api.get<ConversationDetailApiResponse>(`/admin/conversations/${conversationId}`);
      return (response as ConversationDetailApiResponse).data;
    },
    enabled: !!conversationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

