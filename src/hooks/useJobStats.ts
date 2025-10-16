import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { JobStats } from '@/types/job';

interface JobStatsApiResponse {
  success: boolean;
  message: string;
  data: JobStats;
}

export const useJobStats = () => {
  return useQuery({
    queryKey: ['jobStats'],
    queryFn: async () => {
      const response = await api.get<JobStatsApiResponse>('/admin/jobs/stats');
      return (response as JobStatsApiResponse).data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 1000, // 10 seconds
  });
};

