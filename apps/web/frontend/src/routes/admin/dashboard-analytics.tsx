import React, { useState, useEffect } from 'react';
import { useDashboardTelemetry } from '@/hooks/useDashboardTelemetry';

export const DashboardAnalytics: React.FC = () => {
  const { getMetrics } = useDashboardTelemetry({ enabled: true });
  const [metrics, setMetrics] = useState(getMetrics());
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  useEffect(() => {
    // Refresh metrics periodically
    const interval = setInterval(() => {
      setMetrics(getMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, [getMetrics]);

  const regionLoadStats = Object.entries(metrics.regionLoadTimes).map(([id, time]) => ({
    id,
    time
  })).sort((a, b) => b.time - a.time);

  const widgetInitStats = Object.entries(metrics.widgetInitTimes).map(([id, time]) => ({
    id,
    time
  })).sort((a, b) => b.time - a.time);

  return (
    <div className="dashboard-analytics p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard Analytics</h1>
        <div className="flex gap-2">
          {(['24h', '7d', '30d'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 mb-1">First Meaningful Paint</h3>
          <p className="text-2xl font-bold">
            {metrics.firstMeaningfulPaint
              ? `${Math.round(metrics.firstMeaningfulPaint)}ms`
              : 'N/A'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Regions Loaded</h3>
          <p className="text-2xl font-bold">{regionLoadStats.length}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Widgets Initialized</h3>
          <p className="text-2xl font-bold">{widgetInitStats.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Region Load Times</h3>
          {regionLoadStats.length === 0 ? (
            <p className="text-gray-500 text-sm">No data available</p>
          ) : (
            <div className="space-y-2">
              {regionLoadStats.slice(0, 10).map(stat => (
                <div key={stat.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">{stat.id.slice(0, 16)}...</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((stat.time / 1000) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{Math.round(stat.time)}ms</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Widget Init Times</h3>
          {widgetInitStats.length === 0 ? (
            <p className="text-gray-500 text-sm">No data available</p>
          ) : (
            <div className="space-y-2">
              {widgetInitStats.slice(0, 10).map(stat => (
                <div key={stat.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">{stat.id.slice(0, 16)}...</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${Math.min((stat.time / 500) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-16 text-right">{Math.round(stat.time)}ms</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Interaction Latencies</h3>
        {metrics.interactionLatencies.length === 0 ? (
          <p className="text-gray-500 text-sm">No interaction data available</p>
        ) : (
          <div className="space-y-2">
            {metrics.interactionLatencies.slice(-10).map((latency, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{latency.action}</span>
                <span className="font-medium">{Math.round(latency.latency)}ms</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};





