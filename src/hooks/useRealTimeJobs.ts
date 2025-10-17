/**
 * Real-time Jobs Hook
 * Hook for receiving real-time job updates via WebSocket
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from './useWebSocket';
import type { JobStats, Job } from '@/types/job';

interface JobUpdate {
  event: 'created' | 'updated' | 'completed' | 'failed';
  job: Job;
  timestamp: string;
}

interface JobAlert {
  type: 'high_failure_rate' | 'queue_overflow' | 'processing_timeout';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

interface UseRealTimeJobsReturn {
  isConnected: boolean;
  latestUpdate: JobUpdate | null;
  latestAlert: JobAlert | null;
  stats: JobStats | null;
}

export const useRealTimeJobs = (): UseRealTimeJobsReturn => {
  const queryClient = useQueryClient();
  const channels = useMemo(() => ['jobs'], []);
  const { socket, isConnected, connect } = useWebSocket({
    autoConnect: false, // Temporarily disabled
    channels,
  });

  const [latestUpdate, setLatestUpdate] = useState<JobUpdate | null>(null);
  const [latestAlert, setLatestAlert] = useState<JobAlert | null>(null);
  const [stats, setStats] = useState<JobStats | null>(null);

  const handleJobStats = useCallback(
    (data: JobStats) => {
      setStats(data);
      // Invalidate job stats query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['jobStats'] });
    },
    [queryClient]
  );

  const handleJobUpdate = useCallback(
    (update: JobUpdate) => {
      setLatestUpdate(update);
      // Invalidate jobs list query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      
      // Show toast notification
      if (typeof window !== 'undefined') {
        console.log('[Real-time] Job update:', update);
      }
    },
    [queryClient]
  );

  const handleJobAlert = useCallback((alert: JobAlert) => {
    setLatestAlert(alert);
    // Show alert banner
    if (typeof window !== 'undefined') {
      console.warn('[Real-time] Job alert:', alert);
    }
  }, []);

  useEffect(() => {
    if (!socket || !isConnected) {
      connect();
      return;
    }

    // Subscribe to events
    socket.on('job-stats', handleJobStats);
    socket.on('job-update', handleJobUpdate);
    socket.on('job-alert', handleJobAlert);

    // Request initial stats
    socket.emit('request:job-stats');

    // Cleanup
    return () => {
      socket.off('job-stats', handleJobStats);
      socket.off('job-update', handleJobUpdate);
      socket.off('job-alert', handleJobAlert);
    };
  }, [socket, isConnected, connect, handleJobStats, handleJobUpdate, handleJobAlert]);

  return {
    isConnected,
    latestUpdate,
    latestAlert,
    stats,
  };
};

