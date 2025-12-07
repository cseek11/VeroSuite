import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Heading, Text } from '@/components/ui';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Loader2,
  BarChart3
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import jsPDF from 'jspdf';

export default function PLReport() {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const [startDate, setStartDate] = useState<string>(
    yearStart.toISOString().split('T')[0] ?? ''
  );
  const [endDate, setEndDate] = useState<string>(
    now.toISOString().split('T')[0] ?? ''
  );

  const { data: _billingAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['billing', 'analytics'],
    queryFn: () => billing.getBillingAnalytics(),
  });

  const { data: revenueAnalytics, isLoading: revenueLoading } = useQuery({
    queryKey: ['billing', 'revenue-analytics', startDate, endDate],
    queryFn: () => billing.getRevenueAnalytics(startDate, endDate),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = margin;

    // Title
    doc.setFontSize(18);
    doc.text('Profit & Loss Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Date range
    doc.setFontSize(10);
    doc.text(
      `Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
      pageWidth / 2,
      yPos,
      { align: 'center' }
    );
    yPos += 15;

    // Revenue section
    doc.setFontSize(14);
    doc.text('REVENUE', margin, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.text(`Total Revenue: ${formatCurrency(revenueAnalytics?.totalRevenue || 0)}`, margin + 5, yPos);
    yPos += 8;

    // Expenses section (placeholder - would come from expense tracking)
    doc.setFontSize(14);
    doc.text('EXPENSES', margin, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.text('Expenses: $0.00 (Expense tracking not yet implemented)', margin + 5, yPos);
    yPos += 8;

    // Net Income
    const netIncome = (revenueAnalytics?.totalRevenue || 0) - 0; // Expenses would be subtracted here
    doc.setFontSize(14);
    doc.text('NET INCOME', margin, yPos);
    yPos += 8;
    doc.setFontSize(12);
    doc.text(formatCurrency(netIncome), margin + 5, yPos);

    doc.save(`P&L-Report-${startDate}-${endDate}.pdf`);
    logger.debug('P&L report exported', { startDate, endDate }, 'PLReport');
  };

  const handleExportCSV = () => {
    const csv = [
      ['Profit & Loss Report'],
      [`Period: ${startDate} to ${endDate}`],
      [],
      ['Category', 'Amount'],
      ['Total Revenue', ((revenueAnalytics?.totalRevenue ?? 0)).toFixed(2)],
      ['Total Expenses', '0.00'],
      ['Net Income', ((revenueAnalytics?.totalRevenue ?? 0) - 0).toFixed(2)],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `P&L-Report-${startDate}-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (analyticsLoading || revenueLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Loading P&L data...</span>
      </div>
    );
  }

  const netIncome = (revenueAnalytics?.totalRevenue || 0) - 0; // Expenses placeholder

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} className="font-bold text-gray-900">
            Profit & Loss Report
          </Heading>
          <Text className="text-gray-600 mt-1">
            Financial performance overview
          </Text>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" icon={Download} onClick={handleExportPDF}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Date Filters */}
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <Text className="font-medium">Report Period:</Text>
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

      {/* P&L Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-green-700 font-medium text-sm">Total Revenue</Text>
                <Heading level={2} className="text-green-900 font-bold mt-1">
                  {formatCurrency(revenueAnalytics?.totalRevenue || 0)}
                </Heading>
                {revenueAnalytics?.growthRate !== undefined && revenueAnalytics.growthRate !== 0 && (
                  <div className={`flex items-center mt-2 text-xs ${
                    revenueAnalytics.growthRate > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {revenueAnalytics.growthRate > 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(revenueAnalytics.growthRate).toFixed(1)}% growth
                  </div>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-red-700 font-medium text-sm">Total Expenses</Text>
                <Heading level={2} className="text-red-900 font-bold mt-1">
                  {formatCurrency(0)}
                </Heading>
                <Text className="text-red-600 text-xs mt-1">
                  Expense tracking coming soon
                </Text>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className={`bg-gradient-to-br ${
          netIncome >= 0
            ? 'from-blue-50 to-cyan-50 border-blue-200'
            : 'from-orange-50 to-amber-50 border-orange-200'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className={`font-medium text-sm ${
                  netIncome >= 0 ? 'text-blue-700' : 'text-orange-700'
                }`}>
                  Net Income
                </Text>
                <Heading level={2} className={`font-bold mt-1 ${
                  netIncome >= 0 ? 'text-blue-900' : 'text-orange-900'
                }`}>
                  {formatCurrency(netIncome)}
                </Heading>
                <Text className={`text-xs mt-1 ${
                  netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  {netIncome >= 0 ? 'Profit' : 'Loss'}
                </Text>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                netIncome >= 0 ? 'bg-blue-100' : 'bg-orange-100'
              }`}>
                {netIncome >= 0 ? (
                  <TrendingUp className={`w-6 h-6 ${netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                ) : (
                  <TrendingDown className="w-6 h-6 text-orange-600" />
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Report */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="font-semibold">
              Detailed Breakdown
            </Heading>
            <Button variant="outline" size="sm" icon={BarChart3}>
              View Chart
            </Button>
          </div>

          <div className="space-y-4">
            {/* Revenue Section */}
            <div className="border-b pb-4">
              <Heading level={4} className="font-semibold text-green-800 mb-3">
                REVENUE
              </Heading>
              <div className="space-y-2 pl-4">
                <div className="flex justify-between">
                  <Text>Total Revenue</Text>
                  <Text className="font-semibold">
                    {formatCurrency(revenueAnalytics?.totalRevenue || 0)}
                  </Text>
                </div>
                {revenueAnalytics?.monthlyRevenue && revenueAnalytics.monthlyRevenue.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <Text className="text-sm font-medium text-gray-700">Monthly Breakdown:</Text>
                    {revenueAnalytics.monthlyRevenue.map((month: any) => (
                      <div key={month.month} className="flex justify-between text-sm pl-4">
                        <Text>{new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
                        <Text>{formatCurrency(month.revenue)}</Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Expenses Section */}
            <div className="border-b pb-4">
              <Heading level={4} className="font-semibold text-red-800 mb-3">
                EXPENSES
              </Heading>
              <div className="pl-4">
                <Text className="text-gray-500 italic">
                  Expense tracking will be available in a future update
                </Text>
              </div>
            </div>

            {/* Net Income */}
            <div>
              <div className="flex justify-between items-center pt-2">
                <Heading level={4} className={`font-bold ${
                  netIncome >= 0 ? 'text-blue-800' : 'text-orange-800'
                }`}>
                  NET INCOME
                </Heading>
                <Heading level={3} className={`font-bold ${
                  netIncome >= 0 ? 'text-blue-900' : 'text-orange-900'
                }`}>
                  {formatCurrency(netIncome)}
                </Heading>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

