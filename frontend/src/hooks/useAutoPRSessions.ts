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
 * Hook for fetching Auto-PR session data from the backend API
 * 
 * API endpoint: GET /api/v1/sessions
 * Returns: SessionData from the session state files
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

      const response = await fetch('/api/v1/sessions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in.');
        } else if (response.status === 404) {
          // API endpoint not found - backend might not be running
          throw new Error('API endpoint not found. Please ensure the backend server is running.');
        } else {
          throw new Error(`Failed to fetch sessions: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      setSessions(data);
      logger.info('Session data loaded successfully', {
        activeCount: Object.keys(data.active_sessions || {}).length,
        completedCount: (data.completed_sessions || []).length,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sessions';
      logger.error('Failed to fetch session data', { error: errorMessage });
      setError(errorMessage);
      
      // Set empty data on error to allow UI to show error message
      setSessions({
        active_sessions: {},
        completed_sessions: [],
      });
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
      const response = await fetch(`/api/v1/sessions/${sessionId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in.');
        } else if (response.status === 404) {
          throw new Error(`Session with ID ${sessionId} not found.`);
        } else {
          throw new Error(`Failed to complete session: ${response.status} ${response.statusText}`);
        }
      }

      logger.info('Session completed successfully', { sessionId });
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

