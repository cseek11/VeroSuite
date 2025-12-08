import React, { useState } from 'react';
import { TrendingUp, ChevronDown, AlertTriangle, CheckCircle, Clock, Users, Calendar } from 'lucide-react';
import { DashboardMetric } from '@/types';
import { EnhancedDashboardMetric, SmartKPI } from '@/types/smart-kpis';
import { useSmartKPIs } from '@/hooks/useSmartKPIs';

interface DashboardMetricsProps {
  metrics: DashboardMetric[];
  enableSmartKPIs?: boolean;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics, enableSmartKPIs = false }) => {
  const [, setHoveredMetric] = useState<number | null>(null);
  const smartKPIs = useSmartKPIs();

  // Use smart KPIs if enabled, otherwise use regular metrics
  const displayMetrics = enableSmartKPIs ? 
    (smartKPIs.enhancedMetrics && smartKPIs.enhancedMetrics.length > 0 ? smartKPIs.enhancedMetrics : metrics) : 
    metrics;


  const handleDrillDown = (metric: EnhancedDashboardMetric, _index: number) => {
    if (enableSmartKPIs && metric.drillDown) {
      // Find the corresponding Smart KPI
      const smartKPI = smartKPIs.kpiData.find((kpi: SmartKPI) => kpi.metric === metric.title);
      if (smartKPI) {
        smartKPIs.handleDrillDown(smartKPI);
      }
    }
  };

  const getThresholdIndicator = (metric: EnhancedDashboardMetric) => {
    if (!metric.threshold) return null;

    const value = typeof metric.value === 'string' ? 
      parseFloat(metric.value.replace(/[^\d.-]/g, '')) : 
      Number(metric.value);

    let status: 'green' | 'yellow' | 'red' = 'green';
    if (value >= metric.threshold.green) status = 'green';
    else if (value >= metric.threshold.yellow) status = 'yellow';
    else status = 'red';

    const statusIcon = {
      green: <CheckCircle className="w-3 h-3 text-green-500" />,
      yellow: <Clock className="w-3 h-3 text-yellow-500" />,
      red: <AlertTriangle className="w-3 h-3 text-red-500" />
    };

    return (
      <div className="flex items-center space-x-0.5">
        {statusIcon[status]}
        <span className={`text-xs font-medium ${
          status === 'green' ? 'text-green-600' :
          status === 'yellow' ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {status.toUpperCase()}
        </span>
      </div>
    );
  };

  const getThresholdTooltip = (metric: EnhancedDashboardMetric) => {
    if (!metric.threshold) return null;

    return (
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Good: ≥{metric.threshold.green}{metric.threshold.unit || ''}</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span>Warning: ≥{metric.threshold.yellow}{metric.threshold.unit || ''}</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Critical: &lt;{metric.threshold.yellow}{metric.threshold.unit || ''}</span>
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2">
      {displayMetrics.map((metric: EnhancedDashboardMetric, index: number) => {
        const isEnhanced = enableSmartKPIs && 'threshold' in metric;
        const enhancedMetric = metric as EnhancedDashboardMetric;
        
        return (
          <div 
            key={index}
            className={`relative group cursor-pointer transition-all duration-200 hover:shadow-lg bg-white rounded-lg border border-gray-200 p-4 ${
              isEnhanced && enhancedMetric.drillDown ? 'hover:bg-purple-50' : ''
            }`}
            onMouseEnter={() => setHoveredMetric(index)}
            onMouseLeave={() => setHoveredMetric(null)}
            onClick={() => isEnhanced && handleDrillDown(enhancedMetric, index)}
          >
          <div className="flex items-center">
            <div 
              className="p-2 rounded-full bg-opacity-20"
              style={{ backgroundColor: metric.color }}
            >
                {isEnhanced ? (
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: metric.color }}
                  />
                ) : (
                  (() => {
                    // Map icon strings to actual components
                    const iconMap: Record<string, React.ComponentType<any>> = {
                      'Users': Users,
                      'Calendar': Calendar,
                      'TrendingUp': TrendingUp
                    };
                    
                    const iconName = typeof metric.icon === 'string' ? metric.icon : 'TrendingUp';
                    const IconComponent = iconMap[iconName] || TrendingUp;
                    return <IconComponent className="w-4 h-4" />;
                  })()
                )}
            </div>
              <div className="ml-2 flex-1">
                <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-600">{metric.title}</p>
                  {isEnhanced && getThresholdIndicator(enhancedMetric)}
                </div>
              <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                
                {/* Trend indicator */}
              {metric.change !== undefined && (
                <div className="flex items-center mt-0.5">
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : metric.changeType === 'decrease' ? (
                      <TrendingUp className="w-3 h-3 text-red-500 mr-1 transform rotate-180" />
                  ) : (
                      <div className="w-3 h-3 mr-1"></div>
                  )}
                  <span 
                    className={`text-xs font-medium ${
                        metric.changeType === 'increase' ? 'text-green-600' : 
                        metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                    }`}
                  >
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              )}

                {/* Real-time indicator */}
                {isEnhanced && enhancedMetric.realTime && (
                  <div className="flex items-center mt-0.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1"></div>
                    <span className="text-xs text-green-600 font-medium">Live</span>
                  </div>
                )}

                {/* Drill-down indicator */}
                {isEnhanced && enhancedMetric.drillDown && (
                  <div className="flex items-center mt-1 text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Click to drill down
                  </div>
                )}
              </div>
            </div>

            {/* Threshold tooltip */}
            {isEnhanced && getThresholdTooltip(enhancedMetric)}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardMetrics;
