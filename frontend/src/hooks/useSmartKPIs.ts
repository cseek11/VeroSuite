import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { SmartKPI, KPIConfig, KPIData, KPITrend, EnhancedDashboardMetric } from '@/types/smart-kpis';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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

export const useSmartKPIs = () => {
  const [selectedKPI, setSelectedKPI] = useState<SmartKPI | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<any>(null);
  
  const queryClient = useQueryClient();
  const { token, tenantId } = useAuthStore();

  // Fetch KPI configurations
  const { data: kpiConfigs = [], isLoading: configsLoading } = useQuery({
    queryKey: ['smart-kpis', 'configs', tenantId],
    queryFn: async () => {
      if (!token || !tenantId) return [];
      
      const response = await fetch(`${API_BASE_URL}/kpis`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch KPI configs: ${response.statusText}`);
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!token && !!tenantId,
  });

  // Fetch real-time KPI data
  const { data: kpiData = [], isLoading: dataLoading } = useQuery({
    queryKey: ['smart-kpis', 'data', tenantId],
    queryFn: async () => {
      if (!token || !tenantId) return [];
      
      const response = await fetch(`${API_BASE_URL}/kpis/data/current`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch KPI data: ${response.statusText}`);
      }
      
      return response.json();
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes instead of 30 seconds
    staleTime: 2 * 60 * 1000, // 2 minutes stale time to reduce requests
    enabled: !!token && !!tenantId,
  });

  // Fetch KPI trends - disabled temporarily due to API issues
  const { data: kpiTrends = [], isLoading: trendsLoading } = useQuery({
    queryKey: ['smart-kpis', 'trends', tenantId],
    queryFn: async () => {
      if (!token || !tenantId) return [];
      
      const response = await fetch(`${API_BASE_URL}/kpis/trends?period=24h`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Log the error but don't throw to prevent retries
        console.warn(`KPI trends API unavailable (${response.status}): Using fallback data`);
        return [];
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry failed requests
    enabled: false, // Temporarily disable until API is fixed
  });

  // Update KPI configuration
  const updateKPIConfig = useMutation({
    mutationFn: async (config: Partial<KPIConfig>) => {
      // TODO: Implement real API call
      console.log('Updating KPI config:', config);
      return config;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smart-kpis', 'configs'] });
    },
  });

  // Get KPI status based on threshold
  const getKPIStatus = useCallback((value: number, threshold: { green: number; yellow: number; red: number }): 'green' | 'yellow' | 'red' => {
    // Safety check for undefined threshold
    if (!threshold || typeof threshold.green !== 'number') {
      return 'yellow'; // Default to yellow if threshold is invalid
    }
    
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
    
    try {
      if (!token || !kpi.id) {
        // Fallback to mock data if no token
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
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/kpis/${kpi.id}/drill-down`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(kpi.drillDown.filters || {})
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch drill-down data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setDrillDownData(data);
    } catch (error) {
      console.error('Error fetching drill-down data:', error);
      // Fallback to mock data on error
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
    }
  }, [token]);

  // Convert Smart KPI to Enhanced Dashboard Metric
  const convertToEnhancedMetric = useCallback((kpi: SmartKPI): EnhancedDashboardMetric => {
    // Provide default threshold if undefined
    const threshold = kpi.threshold || { green: 80, yellow: 60, red: 40 };
    const status = getKPIStatus(kpi.value, threshold);
    const statusColor = getStatusColor(status);
    
    return {
      title: kpi.metric,
      value: threshold.unit ? `${kpi.value}${threshold.unit}` : kpi.value.toString(),
      change: kpi.trendValue,
      changeType: kpi.trend === 'up' ? 'increase' : kpi.trend === 'down' ? 'decrease' : undefined,
      icon: () => null, // Will be replaced with proper icon in component
      color: statusColor,
      threshold: threshold,
      drillDown: kpi.drillDown,
      realTime: kpi.realTime,
      category: kpi.category,
      trend: kpi.trend,
      trendValue: kpi.trendValue,
      lastUpdated: kpi.lastUpdated
    };
  }, [getKPIStatus, getStatusColor]);

  // Process and combine KPI configs with data
  const processedKPIs = useMemo(() => {
    if (!kpiConfigs.length) return [];
    
    return kpiConfigs.map(config => {
      const data = kpiData.find(d => d.metric === config.name);
      const trend = kpiTrends.find(t => t.metric === config.name);
      
      return {
        id: config.id,
        metric: config.name,
        value: data?.value || 0,
        threshold: config.threshold,
        drillDown: config.drillDown,
        trend: trend?.trend || 'stable',
        trendValue: trend?.trendValue || 0,
        lastUpdated: data?.timestamp || new Date().toISOString(),
        category: config.category,
        realTime: config.realTime
      };
    });
  }, [kpiConfigs, kpiData, kpiTrends]);

  // Get enhanced metrics for dashboard
  const enhancedMetrics = (processedKPIs && processedKPIs.length > 0) ? processedKPIs.map(convertToEnhancedMetric) : [];

  // Debug logging (remove in production)
  // console.log('useSmartKPIs - kpiData:', kpiData);
  // console.log('useSmartKPIs - enhancedMetrics:', enhancedMetrics);
  // console.log('useSmartKPIs - isLoading:', configsLoading || dataLoading || trendsLoading);

  return {
    // Data
    kpiConfigs,
    kpiData: processedKPIs,
    kpiTrends,
    enhancedMetrics,
    
    // Loading states
    isLoading: configsLoading || dataLoading || trendsLoading,
    
    // Actions
    updateKPIConfig,
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
