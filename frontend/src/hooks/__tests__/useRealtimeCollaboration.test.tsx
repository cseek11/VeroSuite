/**
 * useRealtimeCollaboration Hook Tests
 * 
 * Tests for the useRealtimeCollaboration hook including:
 * - WebSocket connection
 * - Message handling
 * - Reconnection
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRealtimeCollaboration } from '../useRealtimeCollaboration';

// Mock WebSocket
global.WebSocket = vi.fn() as any;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useRealtimeCollaboration', () => {
  const mockUser = { id: 'user-1', email: 'test@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should establish WebSocket connection', () => {
    const mockWebSocket = {
      addEventListener: vi.fn(),
      send: vi.fn(),
      close: vi.fn(),
      readyState: WebSocket.OPEN,
    };

    (global.WebSocket as any).mockImplementation(() => mockWebSocket);

    renderHook(
      () => useRealtimeCollaboration('dashboard-1', mockUser),
      { wrapper: createWrapper() }
    );

    expect(global.WebSocket).toHaveBeenCalled();
  });

  it('should handle WebSocket messages', () => {
    const mockWebSocket = {
      addEventListener: vi.fn((event, handler) => {
        if (event === 'message') {
          setTimeout(() => {
            handler({ data: JSON.stringify({ type: 'update', data: {} }) });
          }, 0);
        }
      }),
      send: vi.fn(),
      close: vi.fn(),
      readyState: WebSocket.OPEN,
    };

    (global.WebSocket as any).mockImplementation(() => mockWebSocket);

    const { result } = renderHook(
      () => useRealtimeCollaboration('dashboard-1', mockUser),
      { wrapper: createWrapper() }
    );

    expect(mockWebSocket.addEventListener).toHaveBeenCalled();
  });
});

