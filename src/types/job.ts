// Job Types
export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type JobPriority = 'low' | 'normal' | 'high';

export interface Job {
  id: string;
  user_id: string;
  assessment_name: string;
  status: JobStatus;
  priority: JobPriority;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  error_message?: string;
  retry_count: number;
}

export interface JobWithUser extends Job {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export interface JobStats {
  total: number;
  queued: number;
  processing: number;
  completed: number;
  failed: number;
  cancelled: number;
  successRate: number;
  avgProcessingTimeMinutes: number;
}

export interface JobResult {
  id: string;
  job_id: string;
  test_data: any;
  test_result: any;
  raw_responses: any;
  created_at: string;
}

export interface JobDetail extends Job {
  result?: JobResult;
  processing_time_minutes?: number;
}

