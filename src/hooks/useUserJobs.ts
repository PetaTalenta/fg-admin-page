import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';
import type { JobsListResponse } from '@/types/job';

interface UserJobsFilters {
  page?: number;
  limit?: number;
}

export const useUserJobs = (userId: string | undefined, filters: UserJobsFilters = {}) => {
  return useQuery({
    queryKey: ['userJobs', userId, filters],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await api.get<{ success: boolean; data: JobsListResponse }>(`/admin/users/${userId}/jobs?${params.toString()}`);
      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

