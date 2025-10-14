import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { Job } from '@/types/job';
import type { User } from '@/types/user';
import type { ModelStats } from '@/types/chatbot';
import type { JobTrendData, UserGrowthData, PaginatedResponse } from '@/types/api';

// Calculate date range for trends (last 7 days)
const getLast7Days = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Fetch jobs for trend calculation
const fetchJobsForTrend = async (): Promise<JobTrendData[]> => {
  const dates = getLast7Days();
  const dateFrom = dates[0];
  const dateTo = dates[dates.length - 1];

  const response = await api.get<{ success: boolean; data: PaginatedResponse<Job> }>(
    '/admin/jobs',
    {
      date_from: dateFrom,
      date_to: dateTo,
      limit: 1000, // Get all jobs in the period
      sort_by: 'created_at',
      sort_order: 'ASC',
    }
  );

  // Aggregate jobs by date
  const jobsByDate: Record<string, { count: number; completed: number; failed: number }> = {};
  
  dates.forEach(date => {
    jobsByDate[date] = { count: 0, completed: 0, failed: 0 };
  });

  response.data.data.forEach(job => {
    const jobDate = job.created_at.split('T')[0];
    if (jobsByDate[jobDate]) {
      jobsByDate[jobDate].count++;
      if (job.status === 'completed') {
        jobsByDate[jobDate].completed++;
      } else if (job.status === 'failed') {
        jobsByDate[jobDate].failed++;
      }
    }
  });

  return dates.map(date => ({
    date,
    count: jobsByDate[date].count,
    completed: jobsByDate[date].completed,
    failed: jobsByDate[date].failed,
  }));
};

// Fetch users for growth trend
const fetchUsersForGrowth = async (): Promise<UserGrowthData[]> => {
  const dates = getLast7Days();
  const dateFrom = dates[0];
  const dateTo = dates[dates.length - 1];

  const response = await api.get<{ success: boolean; data: PaginatedResponse<User> }>(
    '/admin/users',
    {
      date_from: dateFrom,
      date_to: dateTo,
      limit: 1000,
      sort_by: 'created_at',
      sort_order: 'ASC',
    }
  );

  // Aggregate users by date
  const usersByDate: Record<string, number> = {};
  
  dates.forEach(date => {
    usersByDate[date] = 0;
  });

  response.data.data.forEach(user => {
    const userDate = user.created_at.split('T')[0];
    if (usersByDate[userDate] !== undefined) {
      usersByDate[userDate]++;
    }
  });

  return dates.map(date => ({
    date,
    count: usersByDate[date],
  }));
};

// Fetch top models
const fetchTopModels = async (): Promise<ModelStats> => {
  const response = await api.get<{ success: boolean; data: ModelStats }>('/admin/chatbot/models');
  return response.data;
};

// Fetch recent jobs with user info
const fetchRecentJobs = async () => {
  const response = await api.get<{ success: boolean; data: PaginatedResponse<Job> }>(
    '/admin/jobs',
    {
      page: 1,
      limit: 10,
      sort_by: 'created_at',
      sort_order: 'DESC',
    }
  );

  // Fetch user details for each job
  const jobsWithUsers = await Promise.all(
    response.data.data.map(async (job) => {
      try {
        const userResponse = await api.get<{ success: boolean; data: User }>(
          `/admin/users/${job.user_id}`
        );
        return {
          ...job,
          user: userResponse.data,
        };
      } catch (error) {
        // If user fetch fails, return job without user info
        return {
          ...job,
          user: undefined,
        };
      }
    })
  );

  return jobsWithUsers;
};

// Hook for job trend data
export const useJobTrend = () => {
  return useQuery({
    queryKey: ['dashboard', 'jobTrend'],
    queryFn: fetchJobsForTrend,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 60 * 1000, // 1 minute
  });
};

// Hook for user growth data
export const useUserGrowth = () => {
  return useQuery({
    queryKey: ['dashboard', 'userGrowth'],
    queryFn: fetchUsersForGrowth,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });
};

// Hook for top models
export const useTopModels = () => {
  return useQuery({
    queryKey: ['dashboard', 'topModels'],
    queryFn: fetchTopModels,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });
};

// Hook for recent jobs
export const useRecentJobs = () => {
  return useQuery({
    queryKey: ['dashboard', 'recentJobs'],
    queryFn: fetchRecentJobs,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000, // 30 seconds
  });
};

