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
      try {
        const response = await fetch('/api/sessions');
        if (!response.ok) {
          throw new Error('API endpoint not available');
        }
        const data = await response.json();
        setSessions(data);
      } catch (apiError) {
        // API endpoint not available - try to read from reward_scores.json for development
        // This allows testing the UI with real PR score data
        try {
          const scoresResponse = await fetch('/docs/metrics/reward_scores.json');
          if (scoresResponse.ok) {
            const scoresData = await scoresResponse.json();
            // Transform reward scores into session format for testing
            const testSessions: SessionData = {
              active_sessions: {},
              completed_sessions: scoresData.scores
                ?.slice(0, 5)
                .map((score: any, index: number) => ({
                  session_id: `test-session-${score.pr || index}`,
                  author: 'test-user',
                  started: new Date(Date.now() - (index + 1) * 60 * 60 * 1000).toISOString(),
                  completed: new Date(Date.now() - index * 60 * 60 * 1000).toISOString(),
                  prs: [`#${score.pr || index}`],
                  total_files_changed: Object.keys(score.file_scores || {}).length,
                  test_files_added: 0,
                  final_score: score.score,
                  duration_minutes: 30,
                  breakdown: score.breakdown,
                  file_scores: score.file_scores,
                  metadata: {
                    pr: score.pr?.toString(),
                    computed_at: score.computed_at,
                  },
                })) || [],
            };
            setSessions(testSessions);
            logger.info('Loaded test data from reward_scores.json for development', {
              sessionCount: testSessions.completed_sessions.length,
            });
          } else {
            throw apiError;
          }
        } catch (fallbackError) {
          // If all else fails, return empty data
          setSessions({
            active_sessions: {},
            completed_sessions: [],
          });
          logger.warn('No session data available. API endpoint not ready and fallback failed.', {
            error: fallbackError instanceof Error ? fallbackError.message : 'Unknown error',
          });
        }
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

