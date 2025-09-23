import React from 'react';
import { SmartKPI } from '@/types/smart-kpis';
import Card from '@/components/ui/Card';

// Mock data directly in component for testing
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
  }
];

const SmartKPIDebug: React.FC = () => {
  return (
    <Card title="Smart KPI Debug">
      <div className="space-y-4">
        <div className="bg-green-100 border border-green-300 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">✅ Smart KPI Debug Component</h3>
          <p className="text-green-700">This component is rendering correctly!</p>
          <p className="text-green-700">Mock data count: {mockKPIData.length}</p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Mock KPI Data:</h3>
          <div className="space-y-2">
            {mockKPIData.map((kpi, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded border">
                <div className="font-medium">{kpi.metric}</div>
                <div className="text-sm text-gray-600">Value: {kpi.value}</div>
                <div className="text-sm text-gray-600">Category: {kpi.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SmartKPIDebug;
