import React from 'react';
import { Card, Typography, Chip, ProgressBar } from '@/components/ui/EnhancedUI';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Receipt, BarChart3, Calendar } from 'lucide-react';

const FinancialSnapshot: React.FC = () => {
  // Mock data - would come from API
  const financialData = {
    currentMonth: {
      revenue: 124750,
      expenses: 89420,
      profit: 35330,
      jobsCompleted: 156,
      averageJobValue: 800,
      outstandingInvoices: 23400
    },
    previousMonth: {
      revenue: 118900,
      expenses: 85600,
      profit: 33300
    },
    yearly: {
      revenue: 1485000,
      expenses: 1072000,
      profit: 413000
    }
  };

  const revenueBreakdown = [
    { category: 'Pest Control', amount: 45600, percentage: 36.5 },
    { category: 'Termite Treatment', amount: 38900, percentage: 31.2 },
    { category: 'Inspections', amount: 23400, percentage: 18.8 },
    { category: 'Emergency Services', amount: 16850, percentage: 13.5 }
  ];

  const recentTransactions = [
    {
      id: 1,
      customer: 'ABC Corporation',
      amount: 2400,
      type: 'payment',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      customer: 'Smith Residence',
      amount: 850,
      type: 'invoice',
      date: '2024-01-14',
      status: 'pending'
    },
    {
      id: 3,
      customer: 'Downtown Mall',
      amount: 3200,
      type: 'payment',
      date: '2024-01-13',
      status: 'completed'
    },
    {
      id: 4,
      customer: 'Johnson Family',
      amount: 650,
      type: 'invoice',
      date: '2024-01-12',
      status: 'overdue'
    }
  ];

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'danger';
      default:
        return 'default';
    }
  };

  const revenueGrowth = calculateGrowth(financialData.currentMonth.revenue, financialData.previousMonth.revenue);
  const profitGrowth = calculateGrowth(financialData.currentMonth.profit, financialData.previousMonth.profit);

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <Card title="Financial Overview">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <DollarSign className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <Typography variant="h3" className="font-bold text-green-600">
              {formatCurrency(financialData.currentMonth.revenue)}
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-1">
              Monthly Revenue
            </Typography>
            <div className="flex items-center justify-center space-x-1">
              {revenueGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <Typography variant="body2" className={revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(revenueGrowth).toFixed(1)}%
              </Typography>
            </div>
          </div>

          <div className="text-center">
            <CreditCard className="mx-auto h-8 w-8 text-blue-500 mb-2" />
            <Typography variant="h3" className="font-bold text-blue-600">
              {formatCurrency(financialData.currentMonth.expenses)}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Monthly Expenses
            </Typography>
          </div>

          <div className="text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-purple-500 mb-2" />
            <Typography variant="h3" className="font-bold text-purple-600">
              {formatCurrency(financialData.currentMonth.profit)}
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-1">
              Monthly Profit
            </Typography>
            <div className="flex items-center justify-center space-x-1">
              {profitGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <Typography variant="body2" className={profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(profitGrowth).toFixed(1)}%
              </Typography>
            </div>
          </div>
        </div>
      </Card>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Revenue Breakdown">
          <div className="space-y-4">
            {revenueBreakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Typography variant="body1" className="font-medium">
                    {item.category}
                  </Typography>
                  <Typography variant="body1" className="font-bold">
                    {formatCurrency(item.amount)}
                  </Typography>
                </div>
                <ProgressBar
                  value={item.percentage}
                  color="primary"
                  showLabel
                />
                <Typography variant="caption" className="text-gray-500">
                  {item.percentage}% of total revenue
                </Typography>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Key Metrics">
          <div className="space-y-6">
            <div className="text-center">
              <BarChart3 className="mx-auto h-8 w-8 text-blue-500 mb-2" />
              <Typography variant="h3" className="font-bold text-blue-600">
                {financialData.currentMonth.jobsCompleted}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Jobs Completed This Month
              </Typography>
            </div>

            <div className="text-center">
              <DollarSign className="mx-auto h-8 w-8 text-green-500 mb-2" />
              <Typography variant="h3" className="font-bold text-green-600">
                {formatCurrency(financialData.currentMonth.averageJobValue)}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Average Job Value
              </Typography>
            </div>

            <div className="text-center">
              <Receipt className="mx-auto h-8 w-8 text-orange-500 mb-2" />
              <Typography variant="h3" className="font-bold text-orange-600">
                {formatCurrency(financialData.currentMonth.outstandingInvoices)}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Outstanding Invoices
              </Typography>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'payment' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {transaction.type === 'payment' ? (
                    <DollarSign className="h-5 w-5 text-green-600" />
                  ) : (
                    <Receipt className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <Typography variant="body1" className="font-medium">
                    {transaction.customer}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </Typography>
                </div>
              </div>

              <div className="text-right">
                <Typography variant="body1" className="font-bold">
                  {formatCurrency(transaction.amount)}
                </Typography>
                <Chip variant={getStatusColor(transaction.status) as any}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </Chip>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Yearly Summary */}
      <Card title="Yearly Summary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Calendar className="mx-auto h-8 w-8 text-blue-500 mb-2" />
            <Typography variant="h3" className="font-bold text-blue-600">
              {formatCurrency(financialData.yearly.revenue)}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Annual Revenue
            </Typography>
          </div>

          <div className="text-center">
            <CreditCard className="mx-auto h-8 w-8 text-red-500 mb-2" />
            <Typography variant="h3" className="font-bold text-red-600">
              {formatCurrency(financialData.yearly.expenses)}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Annual Expenses
            </Typography>
          </div>

          <div className="text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-green-500 mb-2" />
            <Typography variant="h3" className="font-bold text-green-600">
              {formatCurrency(financialData.yearly.profit)}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Annual Profit
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialSnapshot;

