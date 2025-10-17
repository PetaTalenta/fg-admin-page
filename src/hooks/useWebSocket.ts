/**
 * WebSocket Hook
 * Custom hook for managing WebSocket connections
 */

import { useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import {
  initializeWebSocket,
  disconnectWebSocket,
  subscribe,
  unsubscribe,
} from '@/lib/websocket';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  channels?: string[];
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
}

export const useWebSocket = (
  options: UseWebSocketOptions = {}
): UseWebSocketReturn => {
  const { autoConnect = false, channels = [] } = options;
  const wsEnabled = process.env.NEXT_PUBLIC_WS_ENABLED !== 'false';
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempted, setConnectionAttempted] = useState(false);

  const connect = useCallback(() => {
    if (!wsEnabled) {
      console.log('[WebSocket] WebSocket disabled via environment variable');
      return;
    }

    if (connectionAttempted) return; // Prevent multiple connection attempts

    const ws = initializeWebSocket();
    setSocket(ws);
    setIsConnected(ws.connected);
    setConnectionAttempted(true);

    ws.off('connect');
    ws.off('disconnect');

    ws.on('connect', () => {
      setIsConnected(true);
      // Auto-subscribe to channels
      channels.forEach((channel) => subscribe(channel));
    });

    ws.on('disconnect', () => {
      setIsConnected(false);
    });
  }, [channels, connectionAttempted, wsEnabled]);

  const disconnect = useCallback(() => {
    disconnectWebSocket();
    setSocket(null);
    setIsConnected(false);
    setConnectionAttempted(false);
  }, []);

  const subscribeChannel = useCallback((channel: string) => {
    subscribe(channel);
  }, []);

  const unsubscribeChannel = useCallback((channel: string) => {
    unsubscribe(channel);
  }, []);

  useEffect(() => {
    setConnectionAttempted(false); // Reset on autoConnect change
  }, [autoConnect]);

  useEffect(() => {
    if (autoConnect && wsEnabled && !connectionAttempted) {
      connect();
    }

    return () => {
      if (autoConnect) {
        disconnect();
        setConnectionAttempted(false);
      }
    };
  }, [autoConnect, connectionAttempted, wsEnabled]);

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    subscribe: subscribeChannel,
    unsubscribe: unsubscribeChannel,
  };
};

