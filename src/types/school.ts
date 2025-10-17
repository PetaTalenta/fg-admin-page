// School Types
export interface School {
  id: number;
  name: string;
  address?: string;
  city?: string;
  province?: string;
  created_at: string;
}

export interface SchoolDetailResponse {
  id: number;
  name: string;
  address?: string;
  city?: string;
  province?: string;
  created_at: string;
  userCount?: number;
}

export interface SchoolsListResponse {
  schools: School[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateSchoolRequest {
  name: string;
  address?: string;
  city?: string;
  province?: string;
}

export interface UpdateSchoolRequest {
  name?: string;
  address?: string;
  city?: string;
  province?: string;
}

export interface SchoolFilters {
  page?: number;
  limit?: number;
  search?: string;
}

