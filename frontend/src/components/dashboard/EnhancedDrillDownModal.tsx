import React, { useState, useMemo } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Users, 
  DollarSign,
  Filter,
  Search,
  Download,
  ArrowLeft,
  Home,
  BarChart3,
  Table,
  Grid3X3,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { SmartKPI } from '@/types/smart-kpis';
import { useDrillDown, DrillDownFilter } from '@/hooks/useDrillDown';
import { 
  exportToCSV, 
  exportToExcel, 
  exportToPDF, 
  ExportData, 
  ExportOptions 
} from '@/utils/exportUtils';
import { cn } from '@/lib/utils';

interface EnhancedDrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: SmartKPI | null;
  data: any[];
  onDataRequest?: (level: string, filters?: Record<string, any>) => Promise<any[]>;
}

const EnhancedDrillDownModal: React.FC<EnhancedDrillDownModalProps> = ({ 
  isOpen, 
  onClose, 
  kpi, 
  data,
  onDataRequest 
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const drillDown = useDrillDown({
    initialData: data,
    onDataChange: (newData) => {
      console.log('Data changed:', newData.length, 'records');
    },
    onLevelChange: (level) => {
      console.log('Level changed:', level.name);
    }
  });

  // Available filters for the current KPI
  const availableFilters: DrillDownFilter[] = useMemo(() => {
    if (!kpi || !data.length) return [];

    const sampleRecord = data[0];
    const filters: DrillDownFilter[] = [];

    // Add filters based on data structure
    Object.keys(sampleRecord).forEach(key => {
      const value = sampleRecord[key];
      
      if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
        filters.push({
          id: `filter-${key}`,
          field: key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          type: 'date'
        });
      } else if (typeof value === 'number') {
        filters.push({
          id: `filter-${key}`,
          field: key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          type: 'range'
        });
      } else if (typeof value === 'string' && value.length < 50) {
        // Get unique values for select filter
        const uniqueValues = [...new Set(data.map(item => item[key]))].slice(0, 20);
        filters.push({
          id: `filter-${key}`,
          field: key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          type: uniqueValues.length <= 10 ? 'select' : 'text',
          options: uniqueValues.length <= 10 ? uniqueValues : undefined
        });
      }
    });

    return filters;
  }, [kpi, data]);

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

  const handleDrillDown = async (row: any, field: string) => {
    if (!onDataRequest) return;

    setIsLoading(true);
    try {
      const newData = await onDataRequest(field, { parentId: row.id || row[field] });
      drillDown.addLevel({
        name: `${field}: ${row[field]}`,
        data: newData,
        filters: {}
      });
    } catch (error) {
      console.error('Failed to load drill-down data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (!kpi || !drillDown.currentData.length) return;

    const exportData: ExportData = {
      title: `${kpi.metric} - ${drillDown.currentLevel?.name || 'Root'}`,
      level: drillDown.currentLevel!,
      data: drillDown.currentData,
      filters: drillDown.state.filters.reduce((acc, filter) => {
        if (filter.value !== undefined) {
          acc[filter.label] = filter.value;
        }
        return acc;
      }, {} as Record<string, any>),
      metadata: {
        exportedAt: new Date().toISOString(),
        exportedBy: 'User', // You might want to get this from auth context
        totalRecords: drillDown.currentLevel?.data.length || 0,
        filteredRecords: drillDown.currentData.length
      }
    };

    const options: ExportOptions = {
      format,
      includeFilters: true,
      includeMetadata: true,
      filename: `${kpi.metric}_${drillDown.currentLevel?.name || 'Root'}_${new Date().toISOString().split('T')[0]}`
    };

    try {
      switch (format) {
        case 'csv':
          exportToCSV(exportData, options);
          break;
        case 'excel':
          exportToExcel(exportData, options);
          break;
        case 'pdf':
          exportToPDF(exportData, options);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    // You might want to reload the current level data here
  };

  if (!isOpen || !kpi) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getCategoryIcon(kpi.category)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{kpi.metric}</h2>
              <p className="text-sm text-gray-500">
                {drillDown.breadcrumb.join(' › ')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={drillDown.goBack}
              disabled={!drillDown.canGoBack}
              className={cn(
                "flex items-center space-x-1 px-3 py-1 rounded-md transition-colors",
                drillDown.canGoBack
                  ? "text-gray-600 hover:bg-gray-200"
                  : "text-gray-400 cursor-not-allowed"
              )}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={drillDown.goToRoot}
              className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Root</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={drillDown.state.searchTerm}
                onChange={(e) => drillDown.setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
            </div>

            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center space-x-1 px-3 py-2 rounded-md transition-colors",
                showFilters
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-gray-200"
              )}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {drillDown.levelStats?.filterCount > 0 && (
                <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5">
                  {drillDown.levelStats.filterCount}
                </span>
              )}
            </button>

            {/* View Mode */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => drillDown.setViewMode('table')}
                className={cn(
                  "p-2 transition-colors",
                  drillDown.state.viewMode === 'table'
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                title="Table View"
              >
                <Table className="w-4 h-4" />
              </button>
              <button
                onClick={() => drillDown.setViewMode('chart')}
                className={cn(
                  "p-2 transition-colors border-l border-gray-300",
                  drillDown.state.viewMode === 'chart'
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                title="Chart View"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => drillDown.setViewMode('cards')}
                className={cn(
                  "p-2 transition-colors border-l border-gray-300 rounded-r-md",
                  drillDown.state.viewMode === 'cards'
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                title="Cards View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            {/* Export */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => {
                      handleExport('csv');
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => {
                      handleExport('excel');
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => {
                      handleExport('pdf');
                      setShowExportMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors rounded-b-md"
                  >
                    Export as PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableFilters.map(filter => (
                <div key={filter.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {filter.label}
                  </label>
                  {filter.type === 'select' && (
                    <select
                      value={filter.value || ''}
                      onChange={(e) => drillDown.updateFilter(filter.id, e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">All</option>
                      {filter.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  {filter.type === 'text' && (
                    <input
                      type="text"
                      value={filter.value || ''}
                      onChange={(e) => drillDown.updateFilter(filter.id, e.target.value || undefined)}
                      placeholder={`Filter by ${filter.label.toLowerCase()}...`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  )}
                  {filter.type === 'date' && (
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={filter.value?.start || ''}
                        onChange={(e) => drillDown.updateFilter(filter.id, {
                          ...filter.value,
                          start: e.target.value
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="date"
                        value={filter.value?.end || ''}
                        onChange={(e) => drillDown.updateFilter(filter.id, {
                          ...filter.value,
                          end: e.target.value
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}
                  {filter.type === 'range' && (
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filter.value?.min || ''}
                        onChange={(e) => drillDown.updateFilter(filter.id, {
                          ...filter.value,
                          min: e.target.value ? Number(e.target.value) : undefined
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filter.value?.max || ''}
                        onChange={(e) => drillDown.updateFilter(filter.id, {
                          ...filter.value,
                          max: e.target.value ? Number(e.target.value) : undefined
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={drillDown.clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-300px)]">
          {/* Statistics */}
          {drillDown.levelStats && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div>
                    <span className="text-sm font-medium text-blue-700">Total Records</span>
                    <p className="text-2xl font-bold text-blue-900">{drillDown.levelStats.total}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-blue-700">Filtered Records</span>
                    <p className="text-2xl font-bold text-blue-900">{drillDown.levelStats.filtered}</p>
                  </div>
                  {drillDown.levelStats.filterCount > 0 && (
                    <div>
                      <span className="text-sm font-medium text-blue-700">Active Filters</span>
                      <p className="text-2xl font-bold text-blue-900">{drillDown.levelStats.filterCount}</p>
                    </div>
                  )}
                </div>
                {drillDown.levelStats.filteredOut > 0 && (
                  <div className="text-sm text-blue-600">
                    {drillDown.levelStats.filteredOut} records filtered out
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Data Display */}
          {drillDown.currentData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No data available</p>
            </div>
          ) : (
            <div>
              {drillDown.state.viewMode === 'table' && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(drillDown.currentData[0] || {}).map(header => (
                            <th
                              key={header}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                const newOrder = drillDown.state.sortBy === header && drillDown.state.sortOrder === 'asc' ? 'desc' : 'asc';
                                drillDown.setSorting(header, newOrder);
                              }}
                            >
                              {header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              {drillDown.state.sortBy === header && (
                                <span className="ml-1">
                                  {drillDown.state.sortOrder === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </th>
                          ))}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {drillDown.currentData.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {Object.entries(row).map(([key, value]) => (
                              <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {typeof value === 'number' && key.toLowerCase().includes('amount') ? 
                                  formatValue(value, 'USD') : 
                                  String(value || '')
                                }
                              </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => handleDrillDown(row, 'customer')}
                                className="text-purple-600 hover:text-purple-900 transition-colors"
                              >
                                Drill Down
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {drillDown.state.viewMode === 'chart' && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-500 text-center">Chart view not yet implemented</p>
                </div>
              )}

              {drillDown.state.viewMode === 'cards' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {drillDown.currentData.map((row, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      {Object.entries(row).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="mb-2">
                          <span className="text-sm font-medium text-gray-600">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                          </span>
                          <p className="text-sm text-gray-900">
                            {typeof value === 'number' && key.toLowerCase().includes('amount') ? 
                              formatValue(value, 'USD') : 
                              String(value || '')
                            }
                          </p>
                        </div>
                      ))}
                      <button
                        onClick={() => handleDrillDown(row, 'customer')}
                        className="mt-3 text-purple-600 hover:text-purple-900 text-sm transition-colors"
                      >
                        Drill Down →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDrillDownModal;
