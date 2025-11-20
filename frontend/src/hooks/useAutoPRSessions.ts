import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

// Types
export interface ScoreBreakdown {
  tests?: number;
  bug_fix?: number;
  docs?: number;
  performance?: number;
  security?: number;
  penalties?: number;
}

export interface FileScore {
  score: number;
  breakdown: ScoreBreakdown;
  notes?: string;
}

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
  breakdown?: ScoreBreakdown;
  file_scores?: Record<string, FileScore>;
  metadata?: {
    pr?: string;
    computed_at?: string;
    session_id?: string;
  };
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

      // Fetch from API endpoint
      // TODO: Replace with actual API endpoint when backend is ready
      // For now, try to fetch from local session state files or API
      try {
        const response = await fetch('/api/sessions');
        if (!response.ok) {
          // If API not available, return empty data (will show "No sessions" message)
          setSessions({
            active_sessions: {},
            completed_sessions: [],
          });
          return;
        }
        const data = await response.json();
        setSessions(data);
      } catch (apiError) {
        // API endpoint not available yet - return empty data
        // This allows the component to load and show "No sessions" message
        setSessions({
          active_sessions: {},
          completed_sessions: [],
        });
      }
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

