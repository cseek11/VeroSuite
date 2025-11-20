import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

// Types
export interface Session {
  session_id: string;
  author: string;
  started: string;
  last_activity?: string;
  completed?: string;
  prs: string[];
  total_files_changed: number;
  test_files_added: number;
  status?: 'active' | 'idle' | 'warning';
  final_score?: number;
  duration_minutes?: number;
}

export interface SessionData {
  active_sessions: Record<string, Session>;
  completed_sessions: Session[];
}

/**
 * Hook for fetching Auto-PR session data
 * 
 * TODO: Replace mock data with actual API call
 * The API endpoint should be: GET /api/sessions
 * It should return SessionData from the session state file
 */
export const useAutoPRSessions = () => {
  const [sessions, setSessions] = useState<SessionData>({
    active_sessions: {},
    completed_sessions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Implement actual API call
      // const response = await fetch('/api/sessions');
      // if (!response.ok) throw new Error('Failed to fetch sessions');
      // const data = await response.json();
      // setSessions(data);

      // Mock data for now (for development/testing)
      // TODO: Replace with actual API call: const response = await fetch('/api/sessions');
      const now = new Date();
      const mockData: SessionData = {
        active_sessions: {
          'user1-20251119-1430': {
            session_id: 'user1-20251119-1430',
            author: 'alice',
            started: new Date(now.getTime() - 25 * 60000).toISOString(),
            last_activity: new Date(now.getTime() - 5 * 60000).toISOString(),
            prs: ['#326', '#327', '#328'],
            total_files_changed: 12,
            test_files_added: 2,
            status: 'active',
          },
        },
        completed_sessions: [
          {
            session_id: 'user1-20251119-1200',
            author: 'alice',
            started: new Date(now.getTime() - 180 * 60000).toISOString(),
            completed: new Date(now.getTime() - 120 * 60000).toISOString(),
            prs: ['#320', '#321', '#322', '#323'],
            total_files_changed: 24,
            test_files_added: 3,
            final_score: 5.5,
            duration_minutes: 60,
          },
        ],
      };
      setSessions(mockData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sessions';
      logger.error('Failed to fetch session data', { error: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const completeSession = async (sessionId: string) => {
    try {
      // TODO: Implement API call
      // await fetch(`/api/sessions/${sessionId}/complete`, { method: 'POST' });
      logger.info('Completing session', { sessionId });
      await fetchSessions(); // Reload after completion
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete session';
      logger.error('Failed to complete session', { error: errorMessage, sessionId });
      throw new Error(errorMessage);
    }
  };

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions,
    completeSession,
  };
};

