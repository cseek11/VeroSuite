import { useState, useMemo, useEffect, type ChangeEvent } from 'react';
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Download,
  Filter,
  Loader2,
  BarChart3,
  Receipt,
  CheckCircle
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import type { PaymentTrackingData } from '@/types/api.types';
import type { Payment } from '@/types/enhanced-types';

export default function PaymentTracking() {
  const [startDate, setStartDate] = useState<string>(() =>
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || ''
  );
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0] || '');


  const defaultTrackingData: PaymentTrackingData = {
    dailyTrends: {},
    payments: [],
    summary: {
      totalAmount: 0,
      paymentCount: 0,
      averagePayment: 0
    }
  };

  const handleDateChange =
    (setter: (value: string) => void) =>
    (value: string | ChangeEvent<HTMLInputElement>) => {
      if (typeof value === 'string') {
        setter(value);
        return;
      }
      setter(value?.target?.value ?? '');
    };

  const {
    data = defaultTrackingData,
    isLoading,
    error,
    refetch
  } = useQuery<PaymentTrackingData>({
    queryKey: ['billing', 'payment-tracking', startDate ?? '', endDate ?? ''],
    queryFn: async (): Promise<PaymentTrackingData> => {
      const result = await billing.getPaymentTracking(startDate ?? '', endDate ?? '');
      return result as PaymentTrackingData;
    },
    initialData: defaultTrackingData,
    placeholderData: defaultTrackingData
  });

  useEffect(() => {
    if (error) {
      logger.error('Failed to fetch payment tracking data', error, 'PaymentTracking');
      toast.error('Failed to load payment tracking data. Please try again.');
    }
  }, [error]);

  // Prepare chart data from daily trends - MUST be called before early returns (Rules of Hooks)
  const chartData = useMemo(() => {
    if (!data?.dailyTrends) {
      return [];
    }
    return Object.entries(data.dailyTrends)
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Number(amount),
        fullDate: date
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  }, [data?.dailyTrends]);

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

  // Early returns MUST come after all hooks (Rules of Hooks)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Loading payment tracking data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <Text>Failed to load payment tracking data. Please try again.</Text>
          </div>
        </div>
      </Card>
    );
  }

  const trackingData = data ?? defaultTrackingData;
  const payments: Payment[] = (trackingData.payments ?? []) as Payment[];
  const summary = trackingData.summary ?? defaultTrackingData.summary;

  const handleExportCSV = () => {
    try {
      const headers = ['Date', 'Customer', 'Invoice', 'Amount', 'Payment Method', 'Reference Number', 'Notes'];
      const rows = payments.map((payment: unknown) => {
        const p = payment as {
          payment_date?: string;
          amount?: number | string;
          reference_number?: string;
          notes?: string;
          Invoice?: {
            invoice_number?: string;
            accounts?: { name?: string };
          };
          payment_methods?: {
            payment_name?: string;
          };
        };
        return [
          p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'N/A',
          p.Invoice?.accounts?.name || 'Unknown',
          p.Invoice?.invoice_number || 'N/A',
          formatCurrency(Number(p.amount || 0)),
          p.payment_methods?.payment_name || 'N/A',
          p.reference_number || 'N/A',
          p.notes || ''
        ];
      });

      const csvContent = [
        'Payment Tracking Report',
        `Generated: ${new Date().toLocaleDateString()}`,
        `Date Range: ${formatDate(startDate)} - ${formatDate(endDate)}`,
        `Total Amount: ${formatCurrency(summary.totalAmount)}`,
        `Payment Count: ${summary.paymentCount}`,
        `Average Payment: ${formatCurrency(summary.averagePayment)}`,
        '',
        headers.join(','),
        ...rows.map((row: (string | number)[]) =>
          row.map((cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Payment-Tracking-${startDate}-${endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.debug('Payment Tracking CSV exported', { startDate, endDate }, 'PaymentTracking');
      toast.success('Payment tracking report exported successfully');
    } catch (error) {
      logger.error('Failed to export Payment Tracking CSV', error, 'PaymentTracking');
      toast.error('Failed to export report. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} className="font-bold text-gray-900">
            Payment Tracking & Reconciliation
          </Heading>
          <Text className="text-gray-600 mt-1">
            Monitor payment trends and reconcile transactions
          </Text>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" onClick={() => refetch()}>
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
              onChange={handleDateChange(setStartDate)}
              className="w-40"
            />
            <Text>to</Text>
            <Input
              type="date"
              value={endDate}
              onChange={handleDateChange(setEndDate)}
              className="w-40"
            />
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-green-700 font-medium text-sm">Total Payments</Text>
                <Heading level={2} className="text-green-900 font-bold mt-1">
                  {formatCurrency(summary.totalAmount)}
                </Heading>
                <Text className="text-green-600 text-xs mt-1">
                  {summary.paymentCount} transaction{summary.paymentCount !== 1 ? 's' : ''}
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
                  {formatCurrency(summary.averagePayment)}
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
                <Text className="text-purple-700 font-medium text-sm">Payment Count</Text>
                <Heading level={2} className="text-purple-900 font-bold mt-1">
                  {summary.paymentCount}
                </Heading>
                <Text className="text-purple-600 text-xs mt-1">
                  In selected period
                </Text>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Receipt className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Trends Chart */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="font-semibold">
              Payment Trends
            </Heading>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BarChart3 className="w-4 h-4" />
              <span>{Object.keys(trackingData?.dailyTrends || {}).length} days of data</span>
            </div>
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
                <Text className="text-gray-500">No payment data available for selected date range</Text>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Payment Distribution Chart */}
      {payments.length > 0 && (
        <Card>
          <div className="p-6">
            <Heading level={3} className="font-semibold mb-6">
              Payment Distribution
            </Heading>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                  <Bar dataKey="amount" fill="#8b5cf6" name="Daily Payments" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Payments */}
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

          {payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <Text className="text-gray-500 mb-2">No payments found</Text>
              <Text className="text-gray-400 text-sm">Try adjusting the date range.</Text>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.slice(0, 20).map((payment: unknown) => {
                const p = payment as {
                  id?: string | number;
                  payment_date?: string;
                  amount?: number | string;
                  reference_number?: string;
                  notes?: string;
                  Invoice?: {
                    invoice_number?: string;
                    accounts?: { name?: string };
                  };
                  payment_methods?: {
                    payment_name?: string;
                  };
                };
                return (
                <div
                  key={p.id || Math.random()}
                  className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
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
                            {p.payment_methods && (
                              <>
                                <span>•</span>
                                <span className="flex items-center">
                                  <CreditCard className="w-3 h-3 mr-1" />
                                  {p.payment_methods.payment_name || 'Payment Method'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Text className="font-bold text-lg text-green-800">
                        {formatCurrency(Number(p.amount || 0))}
                      </Text>
                      {p.reference_number && (
                        <Text className="text-xs text-gray-500">
                          Ref: {p.reference_number}
                        </Text>
                      )}
                    </div>
                  </div>
                  {p.notes && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <Text className="text-sm text-gray-600">{p.notes}</Text>
                    </div>
                  )}
                </div>
              );
              })}
              {payments.length > 20 && (
                <div className="text-center pt-4">
                  <Text className="text-gray-500 text-sm">
                    Showing 20 of {payments.length} payments
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

