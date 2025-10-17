/**
 * Real-time Alerts Hook
 * Hook for receiving real-time system alerts via WebSocket
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from './useWebSocket';

interface Alert {
  id: string;
  type: 'system' | 'job' | 'user' | 'chat' | 'performance' | 'security';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

interface UseRealTimeAlertsReturn {
  isConnected: boolean;
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Alert) => void;
  updateAlert: (alert: Alert) => void;
  clearAlerts: () => void;
}

export const useRealTimeAlerts = (): UseRealTimeAlertsReturn => {
  const queryClient = useQueryClient();
  const channels = useMemo(() => ['alerts', 'system'], []);
  const { socket, isConnected, connect } = useWebSocket({
    autoConnect: false, // Temporarily disabled
    channels,
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback((alert: Alert) => {
    setAlerts((prev) => [alert, ...prev].slice(0, 50)); // Keep last 50 alerts
  }, []);

  const updateAlert = useCallback((updatedAlert: Alert) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === updatedAlert.id ? updatedAlert : alert
      )
    );
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const handleNewAlert = useCallback(
    (alert: Alert) => {
      addAlert(alert);
      // Invalidate alerts query
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      
      // Show notification
      if (typeof window !== 'undefined') {
        console.log('[Real-time] New alert:', alert);
      }
    },
    [addAlert, queryClient]
  );

  const handleAlertUpdate = useCallback(
    (alert: Alert) => {
      updateAlert(alert);
      // Invalidate alerts query
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    [updateAlert, queryClient]
  );

  useEffect(() => {
    if (!socket || !isConnected) {
      connect();
      return;
    }

    // Subscribe to events
    socket.on('alert:new', handleNewAlert);
    socket.on('alert:update', handleAlertUpdate);

    // Cleanup
    return () => {
      socket.off('alert:new', handleNewAlert);
      socket.off('alert:update', handleAlertUpdate);
    };
  }, [socket, isConnected, connect, handleNewAlert, handleAlertUpdate]);

  const unreadCount = alerts.filter((alert) => alert.status === 'active').length;

  return {
    isConnected,
    alerts,
    unreadCount,
    addAlert,
    updateAlert,
    clearAlerts,
  };
};

