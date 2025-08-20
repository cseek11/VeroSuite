import React from 'react';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface ChartProps {
  data: ChartData[];
  type: 'line' | 'bar' | 'area' | 'pie';
  title?: string;
  height?: number;
  width?: number;
  className?: string;
  color?: string;
  showGrid?: boolean;
  showLegend?: boolean;
}

const Chart: React.FC<ChartProps> = ({
  data,
  type,
  title,
  height = 300,
  width,
  className = '',
  color = '#8b5cf6',
  showGrid = true,
  showLegend = true
}) => {
  // Simple chart implementation using SVG
  // In a real app, you'd use Recharts or Chart.js
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  const chartWidth = width || 600;
  const chartHeight = height;
  const padding = 40;
  const innerWidth = chartWidth - 2 * padding;
  const innerHeight = chartHeight - 2 * padding;

  const renderLineChart = () => {
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * innerWidth;
      const y = padding + innerHeight - ((d.value - minValue) / range) * innerHeight;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={chartWidth} height={chartHeight} className={className}>
        {title && (
          <text x={chartWidth / 2} y={20} textAnchor="middle" className="text-sm font-medium fill-gray-700">
            {title}
          </text>
        )}
        
        {showGrid && (
          <g className="stroke-gray-200">
            {[...Array(5)].map((_, i) => {
              const y = padding + (i / 4) * innerHeight;
              return (
                <line key={i} x1={padding} y1={y} x2={chartWidth - padding} y2={y} />
              );
            })}
          </g>
        )}
        
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
        />
        
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * innerWidth;
          const y = padding + innerHeight - ((d.value - minValue) / range) * innerHeight;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill={color}
              className="hover:r-6 transition-all"
            />
          );
        })}
      </svg>
    );
  };

  const renderBarChart = () => {
    const barWidth = innerWidth / data.length;
    
    return (
      <svg width={chartWidth} height={chartHeight} className={className}>
        {title && (
          <text x={chartWidth / 2} y={20} textAnchor="middle" className="text-sm font-medium fill-gray-700">
            {title}
          </text>
        )}
        
        {showGrid && (
          <g className="stroke-gray-200">
            {[...Array(5)].map((_, i) => {
              const y = padding + (i / 4) * innerHeight;
              return (
                <line key={i} x1={padding} y1={y} x2={chartWidth - padding} y2={y} />
              );
            })}
          </g>
        )}
        
        {data.map((d, i) => {
          const barHeight = ((d.value - minValue) / range) * innerHeight;
          const x = padding + i * barWidth + barWidth * 0.1;
          const y = padding + innerHeight - barHeight;
          const width = barWidth * 0.8;
          
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={width}
              height={barHeight}
              fill={color}
              className="hover:opacity-80 transition-opacity"
            />
          );
        })}
      </svg>
    );
  };

  const renderPieChart = () => {
    const radius = Math.min(innerWidth, innerHeight) / 2 - 20;
    const centerX = chartWidth / 2;
    const centerY = chartHeight / 2;
    
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = 0;
    
    return (
      <svg width={chartWidth} height={chartHeight} className={className}>
        {title && (
          <text x={chartWidth / 2} y={20} textAnchor="middle" className="text-sm font-medium fill-gray-700">
            {title}
          </text>
        )}
        
        {data.map((d, i) => {
          const sliceAngle = (d.value / total) * 2 * Math.PI;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;
          
          const x1 = centerX + radius * Math.cos(startAngle);
          const y1 = centerY + radius * Math.sin(startAngle);
          const x2 = centerX + radius * Math.cos(endAngle);
          const y2 = centerY + radius * Math.sin(endAngle);
          
          const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');
          
          currentAngle = endAngle;
          
          return (
            <path
              key={i}
              d={pathData}
              fill={`hsl(${(i * 360) / data.length}, 70%, 60%)`}
              className="hover:opacity-80 transition-opacity"
            />
          );
        })}
      </svg>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart();
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderLineChart();
    }
  };

  return (
    <div className="w-full">
      {renderChart()}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {data.map((d, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: type === 'pie' ? `hsl(${(i * 360) / data.length}, 70%, 60%)` : color }}
              />
              <span className="text-sm text-gray-600">{d.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chart;
