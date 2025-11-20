import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle,
  Clock,
  GitPullRequest,
  TrendingUp,
  PlayCircle,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useAutoPRSessions, type Session } from '@/hooks/useAutoPRSessions';

// Types
interface SessionData {
  active_sessions: Record<string, Session>;
  completed_sessions: Session[];
}

interface Stats {
  totalSessions: number;
  activeSessions: number;
  avgSessionDuration: number;
  avgPRsPerSession: number;
  completionRate: number;
}

const AutoPRSessionManager: React.FC = () => {
  const { sessions, loading, error, completeSession } = useAutoPRSessions();
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    activeSessions: 0,
    avgSessionDuration: 0,
    avgPRsPerSession: 0,
    completionRate: 0,
  });
  const [view, setView] = useState<'dashboard' | 'analytics'>('dashboard');

  // Calculate stats when sessions change
  useEffect(() => {
    calculateStats(sessions);
  }, [sessions]);

  const calculateStats = (data: SessionData) => {
    const active = Object.keys(data.active_sessions).length;
    const completed = data.completed_sessions.length;
    const total = active + completed;

    const avgDuration =
      completed > 0
        ? data.completed_sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / completed
        : 0;

    const avgPRs =
      completed > 0
        ? data.completed_sessions.reduce((sum, s) => sum + s.prs.length, 0) / completed
        : 0;

    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    setStats({
      totalSessions: total,
      activeSessions: active,
      avgSessionDuration: avgDuration,
      avgPRsPerSession: avgPRs,
      completionRate,
    });
  };

  const getSessionStatus = (session: Session): 'active' | 'warning' | 'idle' => {
    if (!session.last_activity) return 'idle';
    const lastActivity = new Date(session.last_activity);
    const minutesSinceActivity = (Date.now() - lastActivity.getTime()) / 60000;
    if (minutesSinceActivity > 30) return 'idle';
    if (minutesSinceActivity > 15) return 'warning';
    return 'active';
  };

  const formatDuration = (start: string, end?: string): string => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const minutes = Math.floor((endDate.getTime() - startDate.getTime()) / 60000);

    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleCompleteSession = async (sessionId: string) => {
    try {
      await completeSession(sessionId);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSessions}</p>
            </div>
            <Activity className="text-blue-500" size={32} />
          </div>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeSessions}</p>
            </div>
            <PlayCircle className="text-green-500" size={32} />
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.avgSessionDuration.toFixed(0)}m
              </p>
            </div>
            <Clock className="text-purple-500" size={32} />
          </div>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.completionRate.toFixed(0)}%
              </p>
            </div>
            <TrendingUp className="text-orange-500" size={32} />
          </div>
        </Card>
      </div>

      {/* Active Sessions */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <PlayCircle size={24} className="text-green-500" />
            Active Sessions
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {Object.entries(sessions.active_sessions).map(([id, session]) => {
            const status = getSessionStatus(session);
            const statusColors = {
              active: 'bg-green-100 text-green-800',
              warning: 'bg-yellow-100 text-yellow-800',
              idle: 'bg-gray-100 text-gray-800',
            };

            return (
              <div key={id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">{id}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status]}`}
                      >
                        {status}
                      </span>
                      <span className="text-sm text-gray-600">by {session.author}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <GitPullRequest size={16} />
                        {session.prs.length} PRs: {session.prs.join(', ')}
                      </span>
                      <span>{session.total_files_changed} files</span>
                      <span>{session.test_files_added} tests</span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {formatDuration(session.started)}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleCompleteSession(id)}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Complete
                  </Button>
                </div>
              </div>
            );
          })}
          {Object.keys(sessions.active_sessions).length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">No active sessions</div>
          )}
        </div>
      </Card>

      {/* Recent Completed Sessions */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle size={24} className="text-green-500" />
            Recently Completed
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {sessions.completed_sessions.slice(0, 5).map((session) => (
            <div key={session.session_id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">{session.session_id}</span>
                    <span className="text-sm text-gray-600">by {session.author}</span>
                    {session.final_score !== undefined && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        Score: {session.final_score}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <GitPullRequest size={16} />
                      {session.prs.length} PRs
                    </span>
                    <span>{session.total_files_changed} files</span>
                    <span>{session.test_files_added} tests</span>
                    {session.completed && (
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {formatDuration(session.started, session.completed)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {sessions.completed_sessions.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">No completed sessions</div>
          )}
        </div>
      </Card>
    </div>
  );

  const AnalyticsView = () => {
    const sessionsByAuthor = [...sessions.completed_sessions].reduce(
      (acc, session) => {
        if (!acc[session.author]) {
          acc[session.author] = { count: 0, totalScore: 0, totalPRs: 0 };
        }
        acc[session.author].count++;
        acc[session.author].totalScore += session.final_score || 0;
        acc[session.author].totalPRs += session.prs.length;
        return acc;
      },
      {} as Record<string, { count: number; totalScore: number; totalPRs: number }>,
    );

    return (
      <div className="space-y-6">
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Author Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total PRs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Avg Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    PRs/Session
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(sessionsByAuthor).map(([author, data]) => (
                  <tr key={author} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{author}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{data.count}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{data.totalPRs}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(data.totalScore / data.count).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(data.totalPRs / data.count).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GitPullRequest size={28} className="text-blue-600" />
              Auto-PR Session Manager
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setView('dashboard')}
                className={`px-4 py-2 rounded ${
                  view === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`px-4 py-2 rounded ${
                  view === 'analytics'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' ? <DashboardView /> : <AnalyticsView />}
      </div>
    </div>
  );
};

export default AutoPRSessionManager;

