import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';
import type { UserDetailResponse } from '@/types/user';

export const useUserDetail = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const response = await api.get<{ success: boolean; data: UserDetailResponse }>(`/admin/users/${userId}`);
      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

