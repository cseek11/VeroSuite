import React, { useState, useEffect } from 'react';
import { usePerformanceMonitor } from '@/lib/performance';
import { useLogger, logger } from '@/lib/logger';
import { Card, Typography } from '@/components/ui/EnhancedUI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity, AlertTriangle, Clock, Database, Users, Zap } from 'lucide-react';

interface MonitoringDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function MonitoringDashboard({ isVisible, onClose }: MonitoringDashboardProps) {
  const [activeTab, setActiveTab] = useState<'performance' | 'logs' | 'errors'>('performance');
  const [logs, setLogs] = useState<any[]>([]);
  const [logFilter, setLogFilter] = useState<'all' | 'error' | 'warn' | 'info'>('all');
  const [timeRange, setTimeRange] = useState<number>(5 * 60 * 1000); // 5 minutes

  const { getPerformanceSummary, getMetrics } = usePerformanceMonitor();
  const { logUserAction } = useLogger();

  useEffect(() => {
    if (isVisible) {
      logUserAction('opened_monitoring_dashboard');
      updateData();
      const interval = setInterval(updateData, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isVisible, logFilter, timeRange]);

  const updateData = () => {
    const performanceData = getPerformanceSummary();
    const recentLogs = logger.getLogs({ 
      timeRange, 
      level: logFilter === 'all' ? undefined : 
        logFilter === 'error' ? 3 : 
        logFilter === 'warn' ? 2 : 1 
    });
    setLogs(recentLogs);
  };

  const performanceData = getPerformanceSummary();
  const recentMetrics = getMetrics({ timeRange });

  // Prepare chart data
  const apiCallData = recentMetrics
    .filter(m => m.endpoint)
    .reduce((acc, metric) => {
      const endpoint = metric.endpoint.split('/').pop() || 'unknown';
      if (!acc[endpoint]) {
        acc[endpoint] = { endpoint, calls: 0, avgDuration: 0, errors: 0 };
      }
      acc[endpoint].calls++;
      acc[endpoint].avgDuration = (acc[endpoint].avgDuration + metric.duration) / 2;
      if (metric.status >= 400) acc[endpoint].errors++;
      return acc;
    }, {} as Record<string, any>);

  const chartData = Object.values(apiCallData);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-7xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-blue-600" />
            <Typography variant="h3">Monitoring Dashboard</Typography>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-6 py-3 ${activeTab === 'performance' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-3 ${activeTab === 'logs' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Logs
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`px-6 py-3 ${activeTab === 'errors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Errors
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto h-full">
          {activeTab === 'performance' && (
            <div className="space-y-6">
              {/* Performance Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Database className="h-8 w-8 text-blue-500" />
                    <div>
                      <Typography variant="h4">{performanceData.apiCalls.total}</Typography>
                      <Typography variant="body2" className="text-gray-600">API Calls</Typography>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-8 w-8 text-green-500" />
                    <div>
                      <Typography variant="h4">{Math.round(performanceData.apiCalls.average)}ms</Typography>
                      <Typography variant="body2" className="text-gray-600">Avg Response</Typography>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                    <div>
                      <Typography variant="h4">{performanceData.apiCalls.failedCalls}</Typography>
                      <Typography variant="body2" className="text-gray-600">Failed Calls</Typography>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-8 w-8 text-yellow-500" />
                    <div>
                      <Typography variant="h4">{performanceData.apiCalls.slowCalls}</Typography>
                      <Typography variant="body2" className="text-gray-600">Slow Calls</Typography>
                    </div>
                  </div>
                </Card>
              </div>

              {/* API Performance Chart */}
              <Card className="p-4">
                <Typography variant="h4" className="mb-4">API Performance</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="endpoint" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calls" fill="#3B82F6" name="Calls" />
                    <Bar dataKey="errors" fill="#EF4444" name="Errors" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Time Range Filter */}
              <div className="flex space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(Number(e.target.value))}
                  className="border rounded px-3 py-1"
                >
                  <option value={60 * 1000}>Last Minute</option>
                  <option value={5 * 60 * 1000}>Last 5 Minutes</option>
                  <option value={15 * 60 * 1000}>Last 15 Minutes</option>
                  <option value={60 * 60 * 1000}>Last Hour</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              {/* Log Filters */}
              <div className="flex space-x-4">
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value as any)}
                  className="border rounded px-3 py-1"
                >
                  <option value="all">All Levels</option>
                  <option value="error">Errors Only</option>
                  <option value="warn">Warnings & Errors</option>
                  <option value="info">Info & Above</option>
                </select>
                
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(Number(e.target.value))}
                  className="border rounded px-3 py-1"
                >
                  <option value={60 * 1000}>Last Minute</option>
                  <option value={5 * 60 * 1000}>Last 5 Minutes</option>
                  <option value={15 * 60 * 1000}>Last 15 Minutes</option>
                  <option value={60 * 60 * 1000}>Last Hour</option>
                </select>
              </div>

              {/* Logs Table */}
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
                {logs.map((log, index) => (
                  <div key={index} className="border-b py-2 last:border-b-0">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.level === 0 ? 'bg-gray-100 text-gray-600' :
                        log.level === 1 ? 'bg-blue-100 text-blue-600' :
                        log.level === 2 ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {log.level === 0 ? 'DEBUG' : log.level === 1 ? 'INFO' : log.level === 2 ? 'WARN' : 'ERROR'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-sm font-medium">{log.message}</span>
                    </div>
                    {log.context && (
                      <div className="mt-1 text-xs text-gray-600">
                        {Object.entries(log.context).map(([key, value]) => (
                          <span key={key} className="mr-4">
                            {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'errors' && (
            <div className="space-y-4">
              <Typography variant="h4">Error Summary</Typography>
              
              {/* Error Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <Typography variant="h4" className="text-red-600">
                    {logs.filter(log => log.level >= 3).length}
                  </Typography>
                  <Typography variant="body2">Total Errors</Typography>
                </Card>
                
                <Card className="p-4">
                  <Typography variant="h4" className="text-yellow-600">
                    {logs.filter(log => log.level === 2).length}
                  </Typography>
                  <Typography variant="body2">Warnings</Typography>
                </Card>
                
                <Card className="p-4">
                  <Typography variant="h4" className="text-blue-600">
                    {performanceData.apiCalls.failedCalls}
                  </Typography>
                  <Typography variant="body2">Failed API Calls</Typography>
                </Card>
              </div>

              {/* Recent Errors */}
              <Card className="p-4">
                <Typography variant="h4" className="mb-4">Recent Errors</Typography>
                <div className="space-y-2 max-h-64 overflow-auto">
                  {logs
                    .filter(log => log.level >= 3)
                    .slice(0, 10)
                    .map((log, index) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                        <div className="text-sm font-medium">{log.message}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                        {log.error && (
                          <div className="text-xs text-red-600 mt-1">
                            {log.error.message}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
