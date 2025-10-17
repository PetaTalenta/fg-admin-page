import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import type { SchoolsListResponse, SchoolDetailResponse, CreateSchoolRequest, UpdateSchoolRequest, SchoolFilters, School } from '@/types/school';

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

export const useSchoolDetail = (schoolId: number | undefined) => {
  return useQuery({
    queryKey: ['school', schoolId],
    queryFn: async () => {
      if (!schoolId) throw new Error('School ID is required');
      const response = await api.get<{ success: boolean; data: SchoolDetailResponse }>(`/admin/schools/${schoolId}`);
      return response.data.data;
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSchoolRequest) => {
      const response = await api.post<{ success: boolean; data: School }>('/admin/schools', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate schools list query
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
};

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ schoolId, data }: { schoolId: number; data: UpdateSchoolRequest }) => {
      const response = await api.put<{ success: boolean; data: School }>(`/admin/schools/${schoolId}`, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate school detail query
      queryClient.invalidateQueries({ queryKey: ['school', variables.schoolId] });
      // Invalidate schools list query
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
};

export const useDeleteSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schoolId: number) => {
      const response = await api.delete<{ success: boolean }>(`/admin/schools/${schoolId}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate schools list query
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
};

