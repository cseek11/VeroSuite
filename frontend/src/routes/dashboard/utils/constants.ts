import { DashboardMetric } from '../types/dashboard.types';
// Re-export card constants for convenience
export { CARD_CONSTANTS } from './cardConstants';

export const KPI_DATA_STORAGE_KEY = 'vero_kpi_data_v1';
export const AUTO_CREATE_FROM_USER_KPIS = false;

export const mockMetrics: DashboardMetric[] = [
  {
    title: 'Total Customers',
    value: '2,143',
    icon: 'Users' as any,
    color: '#3B82F6',
    change: 12,
    changeType: 'increase'
  },
  {
    title: 'Active Jobs',
    value: '47',
    icon: 'Calendar' as any,
    color: '#10B981',
    change: 8,
    changeType: 'increase'
  },
  {
    title: 'Revenue',
    value: '$45,230',
    icon: 'TrendingUp' as any,
    color: '#8B5CF6',
    change: 15,
    changeType: 'increase'
  },
  {
    title: 'Technicians',
    value: '12',
    icon: 'Users' as any,
    color: '#F59E0B',
    change: 2,
    changeType: 'increase'
  }
];

export const defaultCardSizes: Record<string, { width: number; height: number }> = {
  'jobs-calendar': { width: 300, height: 220 },
  'recent-activity': { width: 260, height: 200 },
  'customer-search': { width: 260, height: 160 },
  'reports': { width: 280, height: 180 },
  'technician-dispatch': { width: 400, height: 500 },
  'invoices': { width: 400, height: 500 },
  'availability-manager': { width: 400, height: 600 },
  'quick-actions': { width: 260, height: 160 },
  'kpi-builder': { width: 320, height: 240 },
  'predictive-analytics': { width: 300, height: 200 },
  'auto-layout': { width: 280, height: 180 },
  'routing': { width: 320, height: 240 },
  'team-overview': { width: 300, height: 200 },
  'financial-summary': { width: 280, height: 180 }
};

export const availableKpiFields = [
  { id: 'jobs_completed', name: 'Jobs Completed', type: 'number' as const, table: 'jobs', column: 'status', aggregation: 'count' as const },
  { id: 'revenue_total', name: 'Total Revenue', type: 'number' as const, table: 'invoices', column: 'amount', aggregation: 'sum' as const },
  { id: 'customer_count', name: 'Customer Count', type: 'number' as const, table: 'customers', column: 'id', aggregation: 'count' as const },
  { id: 'avg_rating', name: 'Average Rating', type: 'number' as const, table: 'reviews', column: 'rating', aggregation: 'avg' as const },
  { id: 'completion_rate', name: 'Completion Rate', type: 'number' as const, table: 'jobs', column: 'status', aggregation: 'count' as const }
];
