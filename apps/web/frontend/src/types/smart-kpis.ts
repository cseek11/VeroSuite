// Smart KPI Types for Enhanced Dashboard Metrics
export interface KPIThreshold {
  green: number;
  yellow: number;
  red: number;
  unit?: string;
}

export interface DrillDownConfig {
  endpoint: string;
  filters: Record<string, any>;
  title: string;
  description?: string;
}

export interface SmartKPI {
  id: string;
  metric: string;
  value: number;
  threshold: KPIThreshold;
  drillDown?: DrillDownConfig;
  trend: 'up' | 'down' | 'stable';
  trendValue?: number;
  lastUpdated: string;
  category: 'financial' | 'operational' | 'customer' | 'compliance';
  realTime?: boolean;
}

export interface EnhancedDashboardMetric {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: React.ComponentType<any>;
  color: string;
  // Smart KPI enhancements
  threshold?: KPIThreshold;
  drillDown?: DrillDownConfig;
  realTime?: boolean;
  category?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  lastUpdated?: string;
}

export interface KPIConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  threshold: KPIThreshold;
  drillDown?: DrillDownConfig;
  realTime: boolean;
  enabled: boolean;
  tenantId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface KPIData {
  metric: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface KPITrend {
  metric: string;
  values: Array<{
    timestamp: string;
    value: number;
  }>;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  period: string;
}
