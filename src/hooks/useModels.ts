import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ModelStats } from '@/types/chatbot';

interface ModelsApiResponse {
  success: boolean;
  message: string;
  data: ModelStats;
}

export const useModels = () => {
  return useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const response = await api.get<ModelsApiResponse>('/admin/chatbot/models');
      return (response as ModelsApiResponse).data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

