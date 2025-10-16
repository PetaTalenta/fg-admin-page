import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Job } from '@/types/job';

interface JobDetailApiResponse {
  success: boolean;
  message: string;
  data: Job;
}

export const useJobDetail = (jobId: string | null) => {
  return useQuery({
    queryKey: ['jobDetail', jobId],
    queryFn: async () => {
      if (!jobId) throw new Error('Job ID is required');
      const response = await api.get<JobDetailApiResponse>(`/admin/jobs/${jobId}`);
      return (response as JobDetailApiResponse).data;
    },
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

