// Job Types
export type JobStatus = 'queue' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface Job {
  id: string;
  job_id: string;
  user_id: string;
  status: JobStatus;
  result_id?: string | null;
  error_message?: string | null;
  completed_at?: string | null;
  assessment_name: string;
  priority: number;
  retry_count: number;
  max_retries: number;
  processing_started_at?: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export interface JobStats {
  overview: {
    total: number;
    queued: number;
    processing: number;
    completed: number;
    failed: number;
    successRate: number;
    avgProcessingTimeMinutes: string;
  };
}

export interface JobResult {
  id: string;
  user_id: string;
  test_data: Record<string, unknown>;
  test_result: Record<string, unknown>;
  raw_responses: Record<string, unknown>;
  is_public: boolean;
  chatbot_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobResultsResponse {
  job: {
    id: string;
    job_id: string;
    status: JobStatus;
    assessment_name: string;
    completed_at?: string | null;
  };
  result: JobResult;
}

export interface JobsListResponse {
  jobs: Job[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface JobFilters {
  page?: number;
  limit?: number;
  status?: JobStatus;
  user_id?: string;
  assessment_name?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: 'created_at' | 'updated_at' | 'completed_at' | 'status' | 'priority';
  sort_order?: 'ASC' | 'DESC';
}

