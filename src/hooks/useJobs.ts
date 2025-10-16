import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { JobsListResponse, JobFilters } from '@/types/job';

interface JobsApiResponse {
  success: boolean;
  message: string;
  data: JobsListResponse;
}

export const useJobs = (filters: JobFilters = {}) => {
  const queryParams = new URLSearchParams();

  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.user_id) queryParams.append('user_id', filters.user_id);
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.date_from) queryParams.append('date_from', filters.date_from);
  if (filters.date_to) queryParams.append('date_to', filters.date_to);
  if (filters.sort_by) queryParams.append('sort_by', filters.sort_by);
  if (filters.sort_order) queryParams.append('sort_order', filters.sort_order);

  const queryString = queryParams.toString();
  const url = `/admin/jobs${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const response = await api.get<JobsApiResponse>(url);
      return (response as JobsApiResponse).data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

