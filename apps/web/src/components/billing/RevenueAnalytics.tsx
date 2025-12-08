import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Heading, Text } from '@/components/ui';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  Filter,
  Loader2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import type { RevenueAnalytics as RevenueAnalyticsType } from '@/types/enhanced-types';

interface RevenueAnalyticsProps {
  startDate?: string;
  endDate?: string;
}

export default function RevenueAnalytics({
  startDate: propStartDate,
  endDate: propEndDate,
}: RevenueAnalyticsProps) {
  const [startDate, setStartDate] = useState<string>(
    propStartDate ||
      new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!
  );
  const [endDate, setEndDate] = useState<string>(
    propEndDate || new Date().toISOString().split('T')[0]!
  );
  const [_activeView, _setActiveView] = useState<'overview' | 'trends' | 'breakdown'>('overview');

  const { data: revenueData, isLoading, error, refetch } = useQuery<RevenueAnalyticsType>({
    queryKey: ['billing', 'revenue-analytics', startDate, endDate],
    queryFn: () => billing.getRevenueAnalytics(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!revenueData?.monthlyRevenue) return [];
    return revenueData.monthlyRevenue.map((item) => ({
      month: item.month,
      revenue: Number(item.revenue || 0),
      formattedRevenue: formatCurrency(Number(item.revenue || 0)),
    }));
  }, [revenueData]);

  const handleExport = () => {
    if (!revenueData) {
      const errorMsg = `Cannot export revenue analytics: No data available for period ${startDate} to ${endDate}. Please wait for data to load or adjust the date range.`;
      logger.warn(errorMsg, { startDate, endDate }, 'RevenueAnalytics');
      toast.error('No data to export. Please wait for data to load or adjust the date range.');
      return;
    }

    try {
      // Create CSV content
      const csvRows = [
        ['Revenue Analytics Report'],
        [`Period: ${startDate} to ${endDate}`],
        [''],
        ['Metric', 'Value'],
        ['Total Revenue', formatCurrency(revenueData.totalRevenue || 0)],
        ['Growth Rate', `${formatPercentage(revenueData.growthRate || 0)}`],
        [''],
        ['Monthly Revenue'],
        ['Month', 'Revenue'],
        ...(revenueData.monthlyRevenue || []).map((item) => [
          item.month,
          formatCurrency(Number(item.revenue || 0)),
        ]),
      ];

      const csvContent = csvRows.map((row) => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue-analytics-${startDate}-to-${endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Revenue analytics exported successfully');
      logger.debug('Revenue analytics exported', { startDate, endDate, rowCount: csvRows.length }, 'RevenueAnalytics');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(
        `Failed to export revenue analytics CSV for period ${startDate} to ${endDate}. ${errorMessage}. Please check browser download permissions and try again.`,
        error,
        'RevenueAnalytics'
      );
      toast.error(
        `Failed to export revenue analytics. ${errorMessage}. Please check your browser settings and try again.`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Loading revenue analytics...</span>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(
      `Failed to load revenue analytics for period ${startDate} to ${endDate}. ${errorMessage}. This may be due to network issues, invalid date range, or server errors.`,
      error,
      'RevenueAnalytics'
    );
    return (
      <Card>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <Text className="font-semibold text-red-900">Failed to load revenue analytics</Text>
                <Text className="text-sm text-red-700 mt-1">
                  {errorMessage}. Please check your date range and network connection, then try again.
                </Text>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (!revenueData) {
    return null;
  }

  const { totalRevenue, growthRate, monthlyRevenue } = revenueData;
  const isPositiveGrowth = (growthRate || 0) >= 0;

  return (
    <div className="space-y-6">
      {/* Header with Date Range */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Heading level={3} className="font-semibold flex items-center">
                <DollarSign className="w-6 h-6 mr-2 text-purple-600" />
                Revenue Analytics
              </Heading>
              <Text variant="small" className="text-gray-600 mt-1">
                Track revenue trends and performance metrics
              </Text>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" icon={Download} onClick={handleExport}>
                Export
              </Button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Text variant="small" className="font-medium text-gray-700 mb-2 block">
                Start Date
              </Text>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Text variant="small" className="font-medium text-gray-700 mb-2 block">
                End Date
              </Text>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="primary" onClick={() => refetch()} className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filter
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small" className="text-gray-500">
                  Total Revenue
                </Text>
                <Heading level={2} className="mt-2 text-gray-900">
                  {formatCurrency(totalRevenue || 0)}
                </Heading>
                <Text variant="small" className="text-gray-600 mt-1">
                  {startDate} to {endDate}
                </Text>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small" className="text-gray-500">
                  Growth Rate
                </Text>
                <Heading
                  level={2}
                  className={`mt-2 ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}
                >
                  {formatPercentage(growthRate || 0)}
                </Heading>
                <div className="flex items-center mt-1">
                  {isPositiveGrowth ? (
                    <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <Text
                    variant="small"
                    className={isPositiveGrowth ? 'text-green-600' : 'text-red-600'}
                  >
                    {isPositiveGrowth ? 'Increased' : 'Decreased'} from previous period
                  </Text>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${isPositiveGrowth ? 'bg-green-100' : 'bg-red-100'}`}>
                {isPositiveGrowth ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small" className="text-gray-500">
                  Average Monthly Revenue
                </Text>
                <Heading level={2} className="mt-2 text-gray-900">
                  {formatCurrency(
                    monthlyRevenue && monthlyRevenue.length > 0
                      ? (totalRevenue || 0) / monthlyRevenue.length
                      : 0
                  )}
                </Heading>
                <Text variant="small" className="text-gray-600 mt-1">
                  {monthlyRevenue?.length || 0} months
                </Text>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <Card>
          <div className="p-6">
            <Heading level={4} className="font-semibold mb-4">
              Monthly Revenue Trend
            </Heading>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    name="Revenue"
                    dot={{ fill: '#7c3aed', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <Text>No revenue data available for the selected period</Text>
              </div>
            )}
          </div>
        </Card>

        {/* Monthly Revenue Bar Chart */}
        <Card>
          <div className="p-6">
            <Heading level={4} className="font-semibold mb-4">
              Monthly Revenue Comparison
            </Heading>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#7c3aed" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <Text>No revenue data available for the selected period</Text>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Monthly Revenue Table */}
      {monthlyRevenue && monthlyRevenue.length > 0 && (
        <Card>
          <div className="p-6">
            <Heading level={4} className="font-semibold mb-4">
              Monthly Revenue Breakdown
            </Heading>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyRevenue.map((item, index: number) => {
                    const revenue = Number(item.revenue || 0);
                    const percentage = totalRevenue ? (revenue / totalRevenue) * 100 : 0;
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{item.month}</td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          {formatCurrency(revenue)}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-600">
                          {percentage.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-semibold">
                    <td className="py-3 px-4 text-gray-900">Total</td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {formatCurrency(totalRevenue || 0)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">100%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

