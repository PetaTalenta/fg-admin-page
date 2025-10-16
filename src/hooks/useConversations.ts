import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ConversationsListResponse, ConversationFilters } from '@/types/chatbot';

interface ConversationsApiResponse {
  success: boolean;
  message: string;
  data: ConversationsListResponse;
}

export const useConversations = (filters: ConversationFilters = {}) => {
  return useQuery({
    queryKey: ['conversations', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.user_id) params.append('user_id', filters.user_id);
      if (filters.context_type) params.append('context_type', filters.context_type);
      if (filters.search) params.append('search', filters.search);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_order) params.append('sort_order', filters.sort_order);

      const response = await api.get<ConversationsApiResponse>(`/admin/conversations?${params.toString()}`);
      return (response as ConversationsApiResponse).data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

