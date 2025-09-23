import React from 'react';
import { X, TrendingUp, TrendingDown, Calendar, Users, DollarSign } from 'lucide-react';
import { SmartKPI } from '@/types/smart-kpis';

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: SmartKPI | null;
  data: any;
}

const DrillDownModal: React.FC<DrillDownModalProps> = ({ isOpen, onClose, kpi, data }) => {
  if (!isOpen || !kpi) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'operational':
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'customer':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'compliance':
        return <Calendar className="w-5 h-5 text-orange-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
      default:
        return null;
    }
  };

  const formatValue = (value: number, unit?: string) => {
    if (unit === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    if (unit === 'stars') {
      return `${value.toFixed(1)} ⭐`;
    }
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getCategoryIcon(kpi.category)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{kpi.metric}</h2>
              <p className="text-sm text-gray-500">{kpi.drillDown?.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* KPI Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Current Value</span>
                {getTrendIcon(kpi.trend)}
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatValue(kpi.value, kpi.threshold.unit)}
              </p>
              {kpi.trendValue !== undefined && (
                <p className={`text-sm mt-1 ${
                  kpi.trend === 'up' ? 'text-green-600' : 
                  kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {kpi.trendValue > 0 ? '+' : ''}{kpi.trendValue}% from last period
                </p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <span className="text-sm font-medium text-gray-600">Threshold Status</span>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Good</span>
                  <span className="text-xs font-medium text-green-600">
                    ≥{formatValue(kpi.threshold.green, kpi.threshold.unit)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Warning</span>
                  <span className="text-xs font-medium text-yellow-600">
                    ≥{formatValue(kpi.threshold.yellow, kpi.threshold.unit)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Critical</span>
                  <span className="text-xs font-medium text-red-600">
                    &lt;{formatValue(kpi.threshold.yellow, kpi.threshold.unit)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <span className="text-sm font-medium text-gray-600">Last Updated</span>
              <p className="text-sm text-gray-900 mt-1">
                {new Date(kpi.lastUpdated).toLocaleString()}
              </p>
              {kpi.realTime && (
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">Real-time</span>
                </div>
              )}
            </div>
          </div>

          {/* Drill-down Data */}
          {data && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Data</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {data.data && data.data.length > 0 && Object.keys(data.data[0]).map((key) => (
                          <th
                            key={key}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.data && data.data.map((item: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(item).map((value: any, valueIndex: number) => (
                            <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {typeof value === 'string' && value.includes('T') && value.includes('Z') 
                                ? new Date(value).toLocaleDateString()
                                : value
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* No data state */}
          {!data && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <TrendingUp className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-500">
                Detailed data for this KPI is not currently available.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Close
          </button>
          <button
            onClick={() => {
              // TODO: Implement export functionality
              console.log('Export KPI data');
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrillDownModal;
