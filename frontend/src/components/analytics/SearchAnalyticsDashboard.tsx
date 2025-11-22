import React, { useState, useEffect } from 'react';
import { useSearchAnalytics } from '../../lib/search-analytics-service';
import { logger } from '@/utils/logger';

export const SearchAnalyticsDashboard: React.FC = () => {
  const [selectedTimeRange, _setSelectedTimeRange] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [trendingSearches, setTrendingSearches] = useState<any[]>([]);

  const {
    getSearchPerformanceSummary,
    getTrendingSearches,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSearchErrorSummary: _getSearchErrorSummary,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUserSearchInsights: _getUserSearchInsights
  } = useSearchAnalytics();

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [perf, trending] = await Promise.all([
        getSearchPerformanceSummary(selectedTimeRange),
        getTrendingSearches(10)
      ]);
      setPerformanceData(perf);
      setTrendingSearches(trending);
    } catch (error) {
      logger.error('Failed to load analytics data', error, 'SearchAnalyticsDashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeRange]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Search Analytics Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Total Searches</h3>
            <p className="text-3xl font-bold text-blue-600">
              {performanceData?.total_searches || 0}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Success Rate</h3>
            <p className="text-3xl font-bold text-green-600">
              {performanceData?.success_rate ? `${(performanceData.success_rate * 100).toFixed(1)}%` : '0%'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Avg Response Time</h3>
            <p className="text-3xl font-bold text-orange-600">
              {performanceData?.avg_execution_time_ms ? `${performanceData.avg_execution_time_ms}ms` : '0ms'}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Cache Hit Rate</h3>
            <p className="text-3xl font-bold text-purple-600">
              {performanceData?.cache_hit_rate ? `${(performanceData.cache_hit_rate * 100).toFixed(1)}%` : '0%'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Trending Searches</h2>
            {trendingSearches.length > 0 ? (
              <div className="space-y-3">
                {trendingSearches.map((search, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">{search.query_text}</span>
                    <span className="text-sm text-gray-600">{search.search_count} searches</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                {isLoading ? 'Loading...' : 'No trending searches available'}
              </p>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Insights</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Unique Users:</span>
                <span className="font-semibold">{performanceData?.unique_users || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Results per Search:</span>
                <span className="font-semibold">{performanceData?.avg_results_per_search?.toFixed(1) || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAnalyticsDashboard;
