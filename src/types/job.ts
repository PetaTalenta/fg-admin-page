// Job Types
import type { User } from '@/types/user';

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
  user?: User;
}

export interface JobStats {
  total: number;
  queued: number;
  processing: number;
  completed: number;
  failed: number;
  cancelled: number;
  successRate?: number;
  avgProcessingTimeMinutes: number;
}

export interface JobResult {
  id: string;
  job_id: string;
  test_data: Record<string, unknown>;
  test_result: Record<string, unknown>;
  raw_responses: Record<string, unknown>;
  created_at: string;
}

export interface JobDetail extends Job {
  result?: JobResult;
  processing_time_minutes?: number;
}

