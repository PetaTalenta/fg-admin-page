import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';

export interface SchoolsListResponse {
  schools: Array<{
    id: number;
    name: string;
    address?: string;
    city?: string;
    province?: string;
    created_at: string;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SchoolFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export const useSchools = (filters: SchoolFilters = {}) => {
  return useQuery({
    queryKey: ['schools', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);

      const response = await api.get<{ success: boolean; data: SchoolsListResponse }>(`/admin/schools?${params.toString()}`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

