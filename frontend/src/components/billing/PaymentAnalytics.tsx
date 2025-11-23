import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Heading, Text } from '@/components/ui';
import {
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Filter,
  CreditCard,
  BarChart3,
  PieChart
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { LineChart, Line, BarChart, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PaymentAnalyticsProps {
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
}

const COLORS = ['#7c3aed', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function PaymentAnalytics({
  startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  endDate = new Date(),
  onDateRangeChange
}: PaymentAnalyticsProps) {
  const [dateRangeStart, setDateRangeStart] = useState(
    startDate.toISOString().split('T')[0]
  );
  const [dateRangeEnd, setDateRangeEnd] = useState(
    endDate.toISOString().split('T')[0]
  );

  // Fetch payment analytics
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['payment-analytics', dateRangeStart, dateRangeEnd],
    queryFn: () => billing.getPaymentAnalytics(dateRangeStart, dateRangeEnd),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const handleDateRangeChange = () => {
    const newStartDate = new Date(dateRangeStart);
    const newEndDate = new Date(dateRangeEnd);
    if (onDateRangeChange) {
      onDateRangeChange(newStartDate, newEndDate);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Loading payment analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <Text>Failed to load payment analytics. Please try again.</Text>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!analyticsData) {
    return null;
  }

  const { summary, paymentMethodBreakdown, failureReasons, monthlyTrends } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Heading level={3}>Date Range</Heading>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={dateRangeStart}
                onChange={(e) => setDateRangeStart(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={dateRangeEnd}
                onChange={(e) => setDateRangeEnd(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleDateRangeChange} variant="primary">
                Apply Filter
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small" className="text-gray-500">
                  Total Payments
                </Text>
                <Heading level={2} className="mt-2">
                  {summary.totalPayments}
                </Heading>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small" className="text-gray-500">
                  Success Rate
                </Text>
                <Heading level={2} className="mt-2">
                  {formatPercentage(summary.successRate)}
                </Heading>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small" className="text-gray-500">
                  Total Amount
                </Text>
                <Heading level={2} className="mt-2">
                  {formatCurrency(summary.totalAmount)}
                </Heading>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small" className="text-gray-500">
                  Avg Payment
                </Text>
                <Heading level={2} className="mt-2">
                  {formatCurrency(summary.averagePaymentAmount)}
                </Heading>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Trends Chart */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3}>Payment Trends</Heading>
            <Button variant="outline" icon={Download}>
              Export
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="successful" stroke="#10b981" name="Successful" />
              <Line type="monotone" dataKey="failed" stroke="#ef4444" name="Failed" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Payment Method Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Heading level={3}>Payment Methods</Heading>
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentMethodBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ method, percentage }) => `${method}: ${formatPercentage(percentage)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {paymentMethodBreakdown.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {paymentMethodBreakdown.map((method: any, index: number) => (
                <div key={method.method} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <Text>{method.method}</Text>
                  </div>
                  <div className="flex items-center gap-4">
                    <Text variant="small" className="text-gray-500">
                      {method.count} payments
                    </Text>
                    <Text variant="small" className="font-medium">
                      {formatCurrency(method.total)}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Failure Reasons */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Heading level={3}>Failure Reasons</Heading>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </div>
            {failureReasons.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={failureReasons}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="reason" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {failureReasons.slice(0, 5).map((reason: any) => (
                    <div key={reason.reason} className="flex items-center justify-between">
                      <Text className="text-sm">{reason.reason}</Text>
                      <div className="flex items-center gap-2">
                        <Text variant="small" className="text-gray-500">
                          {formatPercentage(reason.percentage)}
                        </Text>
                        <Text variant="small" className="font-medium">
                          ({reason.count})
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <Text className="text-gray-500">No payment failures in this period</Text>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

