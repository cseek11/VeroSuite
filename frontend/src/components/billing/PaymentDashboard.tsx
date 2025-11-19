import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Heading, Text } from '@/components/ui';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Download,
  Filter,
  Loader2,
  BarChart3,
  Receipt,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

export default function PaymentDashboard() {
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Fetch payment tracking data
  const { data: trackingData, isLoading: isLoadingTracking, error: trackingError, refetch: refetchTracking } = useQuery({
    queryKey: ['billing', 'payment-tracking', startDate, endDate],
    queryFn: () => billing.getPaymentTracking(startDate, endDate),
    onError: (error: unknown) => {
      logger.error('Failed to fetch payment tracking data', error, 'PaymentDashboard');
      toast.error('Failed to load payment tracking data. Please try again.');
    },
  });

  // Fetch payment analytics
  const { data: analyticsData, isLoading: isLoadingAnalytics, error: analyticsError } = useQuery({
    queryKey: ['payment-analytics', startDate, endDate],
    queryFn: () => billing.getPaymentAnalytics(startDate, endDate),
    onError: (error: unknown) => {
      logger.error('Failed to fetch payment analytics', error, 'PaymentDashboard');
      toast.error('Failed to load payment analytics. Please try again.');
    },
  });

  // Fetch AR summary
  const { data: arSummary, isLoading: isLoadingAR } = useQuery({
    queryKey: ['billing', 'ar-summary'],
    queryFn: () => billing.getARSummary(),
  });

  // Prepare chart data from daily trends - MUST be called before early returns (Rules of Hooks)
  const chartData = useMemo(() => {
    if (!trackingData?.dailyTrends) {
      return [];
    }
    return Object.entries(trackingData.dailyTrends)
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Number(amount),
        fullDate: date
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  }, [trackingData?.dailyTrends]);

  // Prepare payment method breakdown data
  const paymentMethodData = useMemo(() => {
    if (!analyticsData?.paymentMethodBreakdown) {
      return [];
    }
    return Object.entries(analyticsData.paymentMethodBreakdown).map(([name, value]) => ({
      name,
      value: Number(value)
    }));
  }, [analyticsData?.paymentMethodBreakdown]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleExportCSV = () => {
    try {
      const headers = ['Date', 'Total Payments', 'Average Payment', 'Payment Count', 'Success Rate'];
      const rows = chartData.map((item) => [
        item.fullDate,
        formatCurrency(item.amount),
        trackingData?.summary ? formatCurrency(trackingData.summary.averagePayment) : 'N/A',
        trackingData?.summary?.paymentCount?.toString() || '0',
        analyticsData?.summary ? `${analyticsData.summary.successRate.toFixed(1)}%` : 'N/A'
      ]);

      const csvContent = [
        'Payment Dashboard Report',
        `Generated: ${new Date().toLocaleDateString()}`,
        `Date Range: ${formatDate(startDate)} - ${formatDate(endDate)}`,
        '',
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Payment-Dashboard-${startDate}-${endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.debug('Payment Dashboard CSV exported', { startDate, endDate }, 'PaymentDashboard');
      toast.success('Payment dashboard report exported successfully');
    } catch (error) {
      logger.error('Failed to export Payment Dashboard CSV', error, 'PaymentDashboard');
      toast.error('Failed to export report. Please try again.');
    }
  };

  // Early returns MUST come after all hooks (Rules of Hooks)
  const isLoading = isLoadingTracking || isLoadingAnalytics || isLoadingAR;
  const hasError = trackingError || analyticsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Loading payment dashboard...</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <Card>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <Text>Failed to load payment dashboard data. Please try again.</Text>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} className="font-bold text-gray-900">
            Payment Dashboard
          </Heading>
          <Text className="text-gray-600 mt-1">
            Comprehensive payment metrics and analytics overview
          </Text>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" onClick={() => { refetchTracking(); }}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Date Filters */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <Text className="font-medium">Date Range:</Text>
            </div>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40"
            />
            <Text>to</Text>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40"
            />
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-green-700 font-medium text-sm">Total Payments</Text>
                <Heading level={2} className="text-green-900 font-bold mt-1">
                  {trackingData?.summary ? formatCurrency(trackingData.summary.totalAmount) : '$0.00'}
                </Heading>
                <Text className="text-green-600 text-xs mt-1">
                  {trackingData?.summary?.paymentCount || 0} transaction{trackingData?.summary?.paymentCount !== 1 ? 's' : ''}
                </Text>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-blue-700 font-medium text-sm">Average Payment</Text>
                <Heading level={2} className="text-blue-900 font-bold mt-1">
                  {trackingData?.summary ? formatCurrency(trackingData.summary.averagePayment) : '$0.00'}
                </Heading>
                <Text className="text-blue-600 text-xs mt-1">
                  Per transaction
                </Text>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-purple-700 font-medium text-sm">Success Rate</Text>
                <Heading level={2} className="text-purple-900 font-bold mt-1">
                  {analyticsData?.summary ? `${analyticsData.summary.successRate.toFixed(1)}%` : '0%'}
                </Heading>
                <Text className="text-purple-600 text-xs mt-1">
                  Payment success
                </Text>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-orange-700 font-medium text-sm">Total AR</Text>
                <Heading level={2} className="text-orange-900 font-bold mt-1">
                  {arSummary ? formatCurrency(arSummary.totalAR) : '$0.00'}
                </Heading>
                <Text className="text-orange-600 text-xs mt-1">
                  Outstanding receivables
                </Text>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Receipt className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Trends Chart */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Heading level={3} className="font-semibold">
                Payment Trends
              </Heading>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            {chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px'
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6', r: 4 }}
                      name="Daily Payments"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <Text className="text-gray-500">No payment data available</Text>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Method Breakdown */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Heading level={3} className="font-semibold">
                Payment Methods
              </Heading>
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
            {paymentMethodData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <Text className="text-gray-500">No payment method data available</Text>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Payments Summary */}
      {trackingData?.payments && trackingData.payments.length > 0 && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Heading level={3} className="font-semibold">
                Recent Payments
              </Heading>
              <Button variant="outline" size="sm" icon={Download} onClick={handleExportCSV}>
                Export
              </Button>
            </div>
            <div className="space-y-3">
              {trackingData.payments.slice(0, 10).map((payment: unknown) => {
                const p = payment as {
                  id?: string | number;
                  payment_date?: string;
                  amount?: number | string;
                  Invoice?: {
                    invoice_number?: string;
                    accounts?: { name?: string };
                  };
                };
                return (
                  <div
                    key={p.id || Math.random()}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <Text className="font-semibold">
                            {p.Invoice?.accounts?.name || 'Unknown Customer'}
                          </Text>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <span>Invoice: {p.Invoice?.invoice_number || 'N/A'}</span>
                            <span>•</span>
                            <span>{p.payment_date ? formatDate(p.payment_date) : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Text className="font-bold text-lg text-green-800">
                          {formatCurrency(Number(p.amount || 0))}
                        </Text>
                      </div>
                    </div>
                  </div>
                );
              })}
              {trackingData.payments.length > 10 && (
                <div className="text-center pt-4">
                  <Text className="text-gray-500 text-sm">
                    Showing 10 of {trackingData.payments.length} payments
                  </Text>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}



