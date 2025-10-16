import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import type { User, UpdateUserRequest } from '@/types/user';

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: UpdateUserRequest }) => {
      const response = await api.put<{ success: boolean; data: User }>(`/admin/users/${userId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate user detail query
      queryClient.invalidateQueries({ queryKey: ['user', variables.userId] });
      // Invalidate users list query
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

