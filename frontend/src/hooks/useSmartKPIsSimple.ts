import { useState, useCallback } from 'react';
import { SmartKPI, EnhancedDashboardMetric } from '@/types/smart-kpis';
import { logger } from '@/utils/logger';

// Mock data for development - will be replaced with real API calls
const mockKPIData: SmartKPI[] = [
  {
    id: 'jobs-completed',
    metric: 'Jobs Completed Today',
    value: 45,
    threshold: { green: 40, yellow: 30, red: 20 },
    trend: 'up',
    trendValue: 12,
    lastUpdated: new Date().toISOString(),
    category: 'operational',
    realTime: true,
    drillDown: {
      endpoint: '/api/jobs/completed',
      filters: { date: 'today', status: 'completed' },
      title: 'Completed Jobs Details',
      description: 'View detailed breakdown of completed jobs'
    }
  },
  {
    id: 'revenue',
    metric: 'Daily Revenue',
    value: 12500,
    threshold: { green: 10000, yellow: 7500, red: 5000, unit: 'USD' },
    trend: 'up',
    trendValue: 8,
    lastUpdated: new Date().toISOString(),
    category: 'financial',
    realTime: true,
    drillDown: {
      endpoint: '/api/financial/revenue',
      filters: { period: 'daily' },
      title: 'Revenue Breakdown',
      description: 'Detailed revenue analysis by service type'
    }
  },
  {
    id: 'customer-satisfaction',
    metric: 'Customer Satisfaction',
    value: 4.2,
    threshold: { green: 4.0, yellow: 3.5, red: 3.0, unit: 'stars' },
    trend: 'stable',
    trendValue: 0,
    lastUpdated: new Date().toISOString(),
    category: 'customer',
    realTime: false,
    drillDown: {
      endpoint: '/api/customers/satisfaction',
      filters: { period: 'monthly' },
      title: 'Customer Feedback',
      description: 'Detailed customer satisfaction metrics'
    }
  },
  {
    id: 'cancellations',
    metric: 'Cancellation Rate',
    value: 5.2,
    threshold: { green: 3, yellow: 7, red: 10, unit: '%' },
    trend: 'down',
    trendValue: -2,
    lastUpdated: new Date().toISOString(),
    category: 'operational',
    realTime: true
  }
];

export const useSmartKPIsSimple = () => {
  const [selectedKPI, setSelectedKPI] = useState<SmartKPI | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<any>(null);

  // Get KPI status based on threshold
  const getKPIStatus = useCallback((value: number, threshold: { green: number; yellow: number; red: number }): 'green' | 'yellow' | 'red' => {
    if (value >= threshold.green) return 'green';
    if (value >= threshold.yellow) return 'yellow';
    return 'red';
  }, []);

  // Get status color
  const getStatusColor = useCallback((status: 'green' | 'yellow' | 'red'): string => {
    switch (status) {
      case 'green': return '#10B981'; // green-500
      case 'yellow': return '#F59E0B'; // amber-500
      case 'red': return '#EF4444'; // red-500
      default: return '#6B7280'; // gray-500
    }
  }, []);

  // Handle drill-down
  const handleDrillDown = useCallback(async (kpi: SmartKPI) => {
    if (!kpi.drillDown) return;
    
    setSelectedKPI(kpi);
    setIsDrillDownOpen(true);
    
    // Mock data for now
    setDrillDownData({
      title: kpi.drillDown.title,
      description: kpi.drillDown.description,
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: Math.floor(Math.random() * 1000),
        date: new Date(Date.now() - i * 86400000).toISOString()
      }))
    });
  }, []);

  // Convert Smart KPI to Enhanced Dashboard Metric
  const convertToEnhancedMetric = useCallback((kpi: SmartKPI): EnhancedDashboardMetric => {
    const status = getKPIStatus(kpi.value, kpi.threshold);
    const statusColor = getStatusColor(status);
    
    return {
      title: kpi.metric,
      value: kpi.threshold.unit ? `${kpi.value}${kpi.threshold.unit}` : kpi.value.toString(),
      change: kpi.trendValue,
      changeType: kpi.trend === 'up' ? 'increase' : kpi.trend === 'down' ? 'decrease' : undefined,
      icon: () => null, // Will be replaced with proper icon in component
      color: statusColor,
      threshold: kpi.threshold,
      drillDown: kpi.drillDown,
      realTime: kpi.realTime,
      category: kpi.category,
      trend: kpi.trend,
      trendValue: kpi.trendValue,
      lastUpdated: kpi.lastUpdated
    };
  }, [getKPIStatus, getStatusColor]);

  // Get enhanced metrics for dashboard
  const enhancedMetrics = mockKPIData.map(convertToEnhancedMetric);

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    logger.debug('useSmartKPIsSimple - mockKPIData', { mockKPIData }, 'useSmartKPIsSimple');
    logger.debug('useSmartKPIsSimple - enhancedMetrics', { enhancedMetrics }, 'useSmartKPIsSimple');
  }

  return {
    // Data
    kpiConfigs: mockKPIData,
    kpiData: mockKPIData,
    kpiTrends: [],
    enhancedMetrics,
    
    // Loading states
    isLoading: false,
    
    // Actions
    updateKPIConfig: async () => {},
    handleDrillDown,
    
    // Drill-down state
    selectedKPI,
    isDrillDownOpen,
    setIsDrillDownOpen,
    drillDownData,
    
    // Utilities
    getKPIStatus,
    getStatusColor,
    convertToEnhancedMetric
  };
};
