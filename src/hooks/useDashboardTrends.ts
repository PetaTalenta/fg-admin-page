import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { ModelStats } from '@/types/chatbot';
import type { JobTrendData, UserGrowthData, JobsApiResponse, UsersApiResponse, ModelsApiResponse } from '@/types/api';

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

  try {
    // Use API date filtering instead of client-side filtering
    const response = await api.get<JobsApiResponse>(
      '/admin/jobs',
      {
        date_from: dateFrom,
        date_to: dateTo,
        limit: 100, // Get all jobs in date range, max 100 per page
        sort_by: 'created_at',
        sort_order: 'ASC', // Get chronological order
      }
    );

    if (!response.data || !response.data.jobs) {
      throw new Error('No jobs data received from API');
    }

    const jobs = response.data.jobs;

    // Aggregate jobs by date
    const jobsByDate: Record<string, { count: number; completed: number; failed: number }> = {};
    
    dates.forEach(date => {
      jobsByDate[date] = { count: 0, completed: 0, failed: 0 };
    });

    jobs.forEach(job => {
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
  } catch (error) {
    console.error('ERROR: Failed to fetch jobs for trend:', error);
    // Return empty data on error
    return dates.map(date => ({
      date,
      count: 0,
      completed: 0,
      failed: 0,
    }));
  }
};

// Fetch users for growth trend
const fetchUsersForGrowth = async (): Promise<UserGrowthData[]> => {
  const dates = getLast7Days();
  const dateFrom = dates[0];
  const dateTo = dates[dates.length - 1];

  try {
    // Try API date filtering first
    const response = await api.get<UsersApiResponse>(
      '/admin/users',
      {
        date_from: dateFrom,
        date_to: dateTo,
        limit: 100,
      }
    );

    if (!response.data) {
      throw new Error('No users data received from API');
    }

    // Handle both possible response structures: data as array or data.users as array
    const users = Array.isArray(response.data) ? response.data : response.data.users || [];

    // Aggregate users by date
    const usersByDate: Record<string, number> = {};
    dates.forEach(date => {
      usersByDate[date] = 0;
    });

    users.forEach(user => {
      const userDate = user.created_at.split('T')[0];
      if (usersByDate[userDate] !== undefined) {
        usersByDate[userDate]++;
      }
    });

    return dates.map(date => ({
      date,
      count: usersByDate[date],
    }));
  } catch (error) {
    console.error('ERROR: Failed to fetch users for growth:', error);
    // Return empty data on error
    return dates.map(date => ({
      date,
      count: 0,
    }));
  }
};

// Fetch top models
const fetchTopModels = async (): Promise<ModelStats> => {
  try {
    const response = await api.get<ModelsApiResponse>('/admin/chatbot/models');

    if (!response.data || !response.data.models) {
      throw new Error('No models data received from API');
    }

    const models = response.data.models;
    const totalUsage = models.reduce((sum, model) => sum + model.usageCount, 0);
    const freeModelUsage = models.filter(model => model.isFreeModel).reduce((sum, model) => sum + model.usageCount, 0);
    const paidModelUsage = totalUsage - freeModelUsage;
    const freeModelPercentage = totalUsage > 0 ? ((freeModelUsage / totalUsage) * 100).toFixed(1) + '%' : '0.0%';
    
    return {
      summary: {
        totalModels: models.length,
        totalUsage,
        freeModelUsage,
        freeModelPercentage,
        paidModelUsage,
      },
      models: models.sort((a, b) => b.usageCount - a.usageCount), // Sort by usage count descending
    };
  } catch (error) {
    console.error('ERROR: Failed to fetch top models:', error);
    // Return empty data on error
    return {
      summary: {
        totalModels: 0,
        totalUsage: 0,
        freeModelUsage: 0,
        freeModelPercentage: '0.0%',
        paidModelUsage: 0,
      },
      models: [],
    };
  }
};

// Fetch recent jobs with user info
const fetchRecentJobs = async () => {
  try {
    const response = await api.get<JobsApiResponse>(
      '/admin/jobs',
      {
        page: 1,
        limit: 10,
        sort_by: 'created_at',
        sort_order: 'DESC',
      }
    );

    if (!response.data || !response.data.jobs) {
      throw new Error('No jobs data received from API');
    }

    return response.data.jobs;
  } catch (error) {
    console.error('ERROR: Failed to fetch recent jobs:', error);
    // Return empty array on error
    return [];
  }
};

// Hook for job trend data
export const useJobTrend = () => {
  return useQuery({
    queryKey: ['dashboard', 'jobTrend'],
    queryFn: fetchJobsForTrend,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for user growth data
export const useUserGrowth = () => {
  return useQuery({
    queryKey: ['dashboard', 'userGrowth'],
    queryFn: fetchUsersForGrowth,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for top models
export const useTopModels = () => {
  return useQuery({
    queryKey: ['dashboard', 'topModels'],
    queryFn: fetchTopModels,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for recent jobs
export const useRecentJobs = () => {
  return useQuery({
    queryKey: ['dashboard', 'recentJobs'],
    queryFn: fetchRecentJobs,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

