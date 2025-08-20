import React from 'react';
import { Users, TrendingUp, ShoppingCart, Eye } from 'lucide-react';
import { DashboardMetric } from '@/types';
import Card from '@/components/ui/Card';

interface DashboardMetricsProps {
  metrics: DashboardMetric[];
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <div className="flex items-center">
            <div 
              className="p-3 rounded-full bg-opacity-20"
              style={{ backgroundColor: metric.color }}
            >
              {(() => {
                const IconComponent = metric.icon;
                return <IconComponent className="w-6 h-6" />;
              })()}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              {metric.change !== undefined && (
                <div className="flex items-center mt-1">
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-500 mr-1 transform rotate-180" />
                  )}
                  <span 
                    className={`text-sm font-medium ${
                      metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;
