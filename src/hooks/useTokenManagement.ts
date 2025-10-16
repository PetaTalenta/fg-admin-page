import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import type { TokenData, UpdateTokenRequest, UpdateTokenResponse } from '@/types/user';

export const useTokenHistory = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['tokens', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const response = await api.get<{ success: boolean; data: TokenData }>(`/admin/users/${userId}/tokens`);
      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UpdateTokenRequest }) => {
      const response = await api.put<{ success: boolean; data: UpdateTokenResponse }>(`/admin/users/${userId}/tokens`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate token history query
      queryClient.invalidateQueries({ queryKey: ['tokens', variables.userId] });
      // Invalidate user detail query to update token balance
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      // Invalidate users list query
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

