/**
 * WebSocket Client for Real-time Updates
 * Connects to Admin Service WebSocket for real-time monitoring
 */

import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.futureguide.id/api';

let socket: Socket | null = null;

/**
 * Initialize WebSocket connection
 */
export const initializeWebSocket = (): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  const token = Cookies.get('admin_token');
  console.log('[WebSocket] Initializing connection, token present:', !!token);

  socket = io(WS_URL, {
    path: '/admin/socket.io',
    auth: {
      token: token || '',
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    timeout: 20000, // 20 second timeout
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('[WebSocket] Connected to server');
  });

  socket.on('disconnect', (reason) => {
    console.log('[WebSocket] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[WebSocket] Connection error:', error.message);
    console.error('[WebSocket] This is expected if WebSocket server is not running. App will work without real-time updates.');
  });

  socket.on('error', (error) => {
    console.error('[WebSocket] Error:', error);
    console.error('[WebSocket] WebSocket functionality will be disabled.');
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log(`[WebSocket] Reconnected after ${attemptNumber} attempts`);
  });

  socket.on('reconnect_error', (error) => {
    console.error('[WebSocket] Reconnection error:', error.message);
  });

  socket.on('reconnect_failed', () => {
    console.error('[WebSocket] Reconnection failed after all attempts');
  });

  return socket;
};

/**
 * Get current WebSocket instance
 */
export const getWebSocket = (): Socket | null => {
  return socket;
};

/**
 * Disconnect WebSocket
 */
export const disconnectWebSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Subscribe to a channel
 */
export const subscribe = (channel: string): void => {
  if (socket && socket.connected) {
    socket.emit(`subscribe:${channel}`);
    console.log(`[WebSocket] Subscribed to ${channel}`);
  }
};

/**
 * Unsubscribe from a channel
 */
export const unsubscribe = (channel: string): void => {
  if (socket && socket.connected) {
    socket.emit(`unsubscribe:${channel}`);
    console.log(`[WebSocket] Unsubscribed from ${channel}`);
  }
};

/**
 * Check if WebSocket is connected
 */
export const isConnected = (): boolean => {
  return socket?.connected || false;
};

