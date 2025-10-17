import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';
import type { UsersListResponse, UserFilters } from '@/types/user';

export const useUsers = (filters: UserFilters = {}) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.user_type) params.append('user_type', filters.user_type);
      if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
      if (filters.auth_provider) params.append('auth_provider', filters.auth_provider);
      if (filters.school_id) params.append('school_id', filters.school_id.toString());

      const response = await api.get<{ success: boolean; data: UsersListResponse }>(`/admin/users?${params.toString()}`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

