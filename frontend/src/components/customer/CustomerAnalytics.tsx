import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { Button, Typography } from '@/components/ui';

interface CustomerAnalyticsProps {
  customerId: string;
}

const CustomerAnalytics: React.FC<CustomerAnalyticsProps> = ({ customerId }) => {
  const [timeRange, setTimeRange] = useState('1year');

  const analytics = {
    lifetimeValue: 8500.00,
    avgSpendPerYear: 2125.00,
    serviceFrequency: 'Quarterly',
    commonIssues: ['Ants', 'Spiders', 'Rodents'],
    totalServices: 24,
    lastService: '2023-12-15',
    nextService: '2024-01-15',
    satisfactionScore: 4.8
  };

  const trends = [
    { metric: 'Service Requests', value: '+15%', trend: 'up', period: 'vs last year' },
    { metric: 'Average Ticket', value: '+8%', trend: 'up', period: 'vs last year' },
    { metric: 'Response Time', value: '-12%', trend: 'down', period: 'vs last year' },
    { metric: 'Customer Satisfaction', value: '+5%', trend: 'up', period: 'vs last year' }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h3" className="text-lg font-semibold text-gray-900">
          Analytics & Insights
        </Typography>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last Year
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Lifetime Value</p>
              <p className="text-xl font-semibold text-gray-900">${analytics.lifetimeValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-xl font-semibold text-gray-900">{analytics.totalServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Spend/Year</p>
              <p className="text-xl font-semibold text-gray-900">${analytics.avgSpendPerYear.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Satisfaction</p>
              <p className="text-xl font-semibold text-gray-900">{analytics.satisfactionScore}/5.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trends */}
      <div className="bg-white rounded-lg p-4 border border-gray-200/50">
        <h4 className="font-medium text-gray-900 mb-4">Performance Trends</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trends.map((trend, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{trend.metric}</p>
                <p className="text-sm text-gray-600">{trend.period}</p>
              </div>
              <div className="flex items-center gap-2">
                {trend.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`font-semibold ${trend.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200/50">
          <h4 className="font-medium text-gray-900 mb-3">Service Frequency</h4>
          <p className="text-2xl font-semibold text-gray-900">{analytics.serviceFrequency}</p>
          <p className="text-sm text-gray-600">Next service: {new Date(analytics.nextService).toLocaleDateString()}</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200/50">
          <h4 className="font-medium text-gray-900 mb-3">Common Issues</h4>
          <div className="space-y-2">
            {analytics.commonIssues.map((issue, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">{issue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalytics;
