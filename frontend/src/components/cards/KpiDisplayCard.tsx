import React from 'react';
import { Tooltip } from '@/components/ui/Tooltip';

interface KpiDisplayCardProps {
  cardId?: string | undefined;
  kpiData: Record<string, any>;
}

const KpiDisplayCard: React.FC<KpiDisplayCardProps> = ({ cardId, kpiData }) => {
  const kpi = cardId ? kpiData[cardId] : null;
  
  if (!kpi) {
    return (
      <div className="p-4 text-gray-600 text-center">
        <p>No KPI data available</p>
        <p className="text-xs text-gray-400 mt-2">Card ID: {cardId}</p>
        <p className="text-xs text-gray-400">Available KPI IDs: {Object.keys(kpiData).join(', ')}</p>
      </div>
    );
  }

  // Generate stable mock KPI value based on card ID (so it doesn't change when moving cards)
  const getStableValue = (cardId: string) => {
    let hash = 0;
    for (let i = 0; i < cardId.length; i++) {
      const char = cardId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100;
  };
  
  const mockValue = getStableValue(cardId || 'default');
  const getThresholdColor = (value: number, threshold: any) => {
    if (value >= threshold.green) return 'text-green-600';
    if (value >= threshold.yellow) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Generate stable mock chart data based on card ID
  const generateChartData = (baseValue: number, cardId: string) => {
    // Generate a stable seed based on card ID for consistent data
    let seed = 0;
    for (let i = 0; i < cardId.length; i++) {
      seed = ((seed << 5) - seed + cardId.charCodeAt(i)) & 0xffffffff;
    }
    
    // Simple pseudo-random number generator using the seed
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    // Use a fixed base date to ensure consistent chart dates
    const baseDate = new Date('2024-01-01');
    
    const data = [];
    for (let i = 0; i < 7; i++) {
      data.push({
        date: new Date(baseDate.getTime() + (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.max(0, baseValue + Math.sin(i) * 10 + (seededRandom() - 0.5) * 5)
      });
    }
    return data;
  };

  const chartData = generateChartData(mockValue, cardId || 'default');

  // Render different chart types based on KPI configuration
  const renderChart = () => {
    const chartType = kpi.chart?.type || 'line';
    
    switch (chartType) {
      case 'number':
        return null; // No chart for number type
      
      case 'gauge':
        return (
          <div className="h-16 w-full flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" className="overflow-visible">
              {/* Gauge background */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Gauge progress */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={getThresholdColor(mockValue, kpi.threshold).replace('text-', '#').replace('-600', '')}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(mockValue / 100) * 314} 314`}
                transform="rotate(-90 60 60)"
              />
              {/* Center text */}
              <text
                x="60"
                y="65"
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#374151"
              >
                {mockValue}{kpi.threshold?.unit || '%'}
              </text>
            </svg>
          </div>
        );
      
      case 'bar':
        return (
          <div className="h-16 w-full">
            <svg width="100%" height="100%" viewBox="0 0 200 60" className="overflow-visible">
              <rect width="200" height="60" fill="#f8fafc" rx="4" />
              {chartData.map((point, index) => {
                const x = (index / (chartData.length - 1)) * 180 + 10;
                const barHeight = (point.value / 100) * 40;
                const y = 50 - barHeight;
                return (
                  <rect
                    key={index}
                    x={x - 4}
                    y={y}
                    width="8"
                    height={barHeight}
                    fill="#3b82f6"
                    rx="2"
                  />
                );
              })}
              {/* X-axis labels */}
              {chartData.map((point, index) => {
                const x = (index / (chartData.length - 1)) * 180 + 10;
                return (
                  <text
                    key={index}
                    x={x}
                    y="58"
                    textAnchor="middle"
                    fontSize="8"
                    fill="#6b7280"
                  >
                    {point.date.split(' ')[1]}
                  </text>
                );
              })}
            </svg>
          </div>
        );
      
      case 'line':
      default:
        return (
          <div className="h-16 w-full">
            <svg width="100%" height="100%" viewBox="0 0 200 60" className="overflow-visible">
              {/* Chart background */}
              <rect width="200" height="60" fill="#f8fafc" rx="4" />
              
              {/* Chart line */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points={chartData.map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 180 + 10;
                  const y = 50 - (point.value / 100) * 40;
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              {/* Data points */}
              {chartData.map((point, index) => {
                const x = (index / (chartData.length - 1)) * 180 + 10;
                const y = 50 - (point.value / 100) * 40;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#3b82f6"
                  />
                );
              })}
              
              {/* X-axis labels */}
              {chartData.map((point, index) => {
                const x = (index / (chartData.length - 1)) * 180 + 10;
                return (
                  <text
                    key={index}
                    x={x}
                    y="58"
                    textAnchor="middle"
                    fontSize="8"
                    fill="#6b7280"
                  >
                    {point.date.split(' ')[1]}
                  </text>
                );
              })}
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="p-4">
      {/* Description */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-4">{kpi.description}</p>
      </div>

      {/* Chart - positioned right after description */}
      {(kpi.chart?.type || 'line') !== 'number' && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2">
            {(kpi.chart?.type || 'line') === 'gauge' ? 'Performance Gauge' : '7-Day Trend'}
          </div>
          {renderChart()}
        </div>
      )}
      
      {/* KPI Content with darker background */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3 relative">
        {/* KPI Value Display with themed tooltip for thresholds */}
        <div className="text-center mb-4">
          <Tooltip
            content={
              kpi.threshold ? (
                <div className="space-y-2">
                  <div className="font-semibold text-white">Performance Thresholds</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Green: ≥{kpi.threshold.green}{kpi.threshold.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Yellow: ≥{kpi.threshold.yellow}{kpi.threshold.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Red: &lt;{kpi.threshold.yellow}{kpi.threshold.unit}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>No thresholds configured</div>
              )
            }
            side="right"
            delayDuration={200}
            forceSide={true}
            className="z-30"
          >
            <div 
              className={`text-3xl font-bold ${getThresholdColor(mockValue, kpi.threshold)} cursor-help transition-colors hover:opacity-80`}
            >
              {mockValue}{kpi.threshold?.unit || '%'}
            </div>
          </Tooltip>
          <div className="text-sm text-gray-500">Current Value</div>
        </div>
        
        {/* Status */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Status:</span>
          <span className={`text-sm px-2 py-1 rounded ${
            kpi.enabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {kpi.enabled ? (kpi.realTime ? 'Live View' : 'Active') : 'Disabled'}
          </span>
        </div>

        {/* Real-time indicator */}
        {kpi.realTime && (
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Real-time updates
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiDisplayCard;
