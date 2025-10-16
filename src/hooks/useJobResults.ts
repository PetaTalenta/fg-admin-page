import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { JobResultsResponse } from '@/types/job';

interface JobResultsApiResponse {
  success: boolean;
  message: string;
  data: JobResultsResponse;
}

export const useJobResults = (jobId: string | undefined) => {
  return useQuery({
    queryKey: ['jobResults', jobId],
    queryFn: async () => {
      if (!jobId) throw new Error('Job ID is required');
      const response = await api.get<JobResultsApiResponse>(`/admin/jobs/${jobId}/results`);
      return (response as JobResultsApiResponse).data;
    },
    enabled: !!jobId,
    staleTime: 10 * 60 * 1000, // 10 minutes (static data)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

