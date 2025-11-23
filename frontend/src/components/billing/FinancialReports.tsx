import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/CRMComponents';
import { Heading, Text } from '@/components/ui';
import {
  FileText,
  Download,
  Loader2,
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import jsPDF from 'jspdf';

type ReportType =
  | 'ar-summary'
  | 'revenue-analytics'
  | 'payment-analytics'
  | 'overdue-invoices'
  | 'financial-summary';

type ExportFormat = 'pdf' | 'csv' | 'excel';

interface FinancialReportsProps {
  onReportGenerated?: (reportType: ReportType, format: ExportFormat) => void;
}

export default function FinancialReports({ onReportGenerated }: FinancialReportsProps) {
  const [reportType, setReportType] = useState<ReportType>('financial-summary');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]!
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch data for reports
  const { data: arSummary, isLoading: arLoading } = useQuery({
    queryKey: ['billing', 'ar-summary'],
    queryFn: () => billing.getARSummary(),
    enabled: reportType === 'ar-summary' || reportType === 'financial-summary',
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['billing', 'revenue-analytics', startDate, endDate],
    queryFn: () => billing.getRevenueAnalytics(startDate, endDate),
    enabled:
      (reportType === 'revenue-analytics' || reportType === 'financial-summary') &&
      !!startDate &&
      !!endDate,
  });

  const { data: paymentAnalytics, isLoading: paymentLoading } = useQuery({
    queryKey: ['billing', 'payment-analytics', startDate, endDate],
    queryFn: () => billing.getPaymentAnalytics(startDate, endDate),
    enabled:
      (reportType === 'payment-analytics' || reportType === 'financial-summary') &&
      !!startDate &&
      !!endDate,
  });

  const { data: overdueInvoices, isLoading: overdueLoading } = useQuery({
    queryKey: ['billing', 'overdue-invoices'],
    queryFn: () => billing.getOverdueInvoices(),
    enabled: reportType === 'overdue-invoices' || reportType === 'financial-summary',
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const _formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

    const generatePDF = async (content: string, filename: string) => {
      try {
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const maxWidth = pageWidth - 2 * margin;

        // Split content into lines
        const lines = pdf.splitTextToSize(content, maxWidth);
        let y = margin;
        const lineHeight = 7;

        pdf.setFontSize(16);
        pdf.text('Financial Report', margin, y);
        y += lineHeight * 2;

        pdf.setFontSize(10);
        pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
        y += lineHeight * 2;

        pdf.setFontSize(12);
        for (const line of lines) {
          if (y > pageHeight - margin) {
            pdf.addPage();
            y = margin;
          }
          pdf.text(line, margin, y);
          y += lineHeight;
        }

        pdf.save(filename);
        toast.success('PDF report generated successfully');
        logger.debug('PDF report generated', { filename }, 'FinancialReports');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(
          `Failed to generate PDF report "${filename}". ${errorMessage}. Please check browser permissions and try again.`,
          error,
          'FinancialReports'
        );
        toast.error(
          `Failed to generate PDF report. ${errorMessage}. Please try again or use CSV export as an alternative.`
        );
      }
    };

    const generateCSV = (data: any[], filename: string) => {
      try {
        if (!data || data.length === 0) {
          const errorMsg = `Cannot export CSV: No data available for ${reportType} report. Please ensure data is loaded before exporting.`;
          logger.warn(errorMsg, { reportType, filename }, 'FinancialReports');
          toast.error('No data to export. Please ensure the report has data before exporting.');
          return;
        }

        const headers = Object.keys(data[0]);
        const csvRows = [
          headers.join(','),
          ...data.map((row) =>
            headers
              .map((header) => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',')
                  ? `"${value}"`
                  : value;
              })
              .join(',')
          ),
        ];

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('CSV report exported successfully');
        logger.debug('CSV report exported', { filename, rowCount: data.length }, 'FinancialReports');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(
          `Failed to export CSV report "${filename}" for ${reportType}. ${errorMessage}. Please check browser download permissions and try again.`,
          error,
          'FinancialReports'
        );
        toast.error(
          `Failed to export CSV report. ${errorMessage}. Please try again or contact support if the issue persists.`
        );
      }
    };

  const handleExport = async (format: ExportFormat) => {
    setIsGenerating(true);
    try {
      let content = '';
      let filename = '';
      let csvData: any[] = [];

      switch (reportType) {
        case 'ar-summary':
          if (!arSummary) {
            const errorMsg = 'Cannot export AR summary: Data not loaded. Please wait for data to load or refresh the page.';
            logger.warn(errorMsg, { reportType, format }, 'FinancialReports');
            toast.error('AR summary data not available. Please wait for data to load or refresh the page.');
            setIsGenerating(false);
            return;
          }
          content = `Accounts Receivable Summary\n\n`;
          content += `Total AR: ${formatCurrency(arSummary.totalAR || 0)}\n`;
          content += `Total Customers: ${arSummary.totalCustomers || 0}\n`;
          content += `Total Invoices: ${arSummary.totalInvoices || 0}\n\n`;
          content += `Aging Buckets:\n`;
          if (arSummary.agingBuckets) {
            Object.entries(arSummary.agingBuckets).forEach(([bucket, amount]) => {
              content += `${bucket}: ${formatCurrency(Number(amount || 0))}\n`;
            });
          }
          filename = `ar-summary-${new Date().toISOString().split('T')[0]}.${format}`;
          break;

        case 'revenue-analytics':
          if (!revenueData) {
            const errorMsg = `Cannot export revenue analytics: Data not loaded for period ${startDate} to ${endDate}. Please wait for data to load or adjust the date range.`;
            logger.warn(errorMsg, { reportType, format, startDate, endDate }, 'FinancialReports');
            toast.error('Revenue analytics data not available. Please wait for data to load or adjust the date range.');
            setIsGenerating(false);
            return;
          }
          content = `Revenue Analytics Report\n\n`;
          content += `Period: ${startDate} to ${endDate}\n\n`;
          content += `Total Revenue: ${formatCurrency(revenueData.totalRevenue || 0)}\n`;
          content += `Growth Rate: ${revenueData.growthRate?.toFixed(1) || 0}%\n\n`;
          content += `Monthly Revenue:\n`;
          if (revenueData.monthlyRevenue) {
            revenueData.monthlyRevenue.forEach((item: any) => {
              content += `${item.month}: ${formatCurrency(Number(item.revenue || 0))}\n`;
            });
          }
          filename = `revenue-analytics-${startDate}-to-${endDate}.${format}`;
          csvData = (revenueData.monthlyRevenue || []).map((item: any) => ({
            month: item.month,
            revenue: formatCurrency(Number(item.revenue || 0)),
          }));
          break;

        case 'payment-analytics':
          if (!paymentAnalytics) {
            const errorMsg = `Cannot export payment analytics: Data not loaded for period ${startDate} to ${endDate}. Please wait for data to load or adjust the date range.`;
            logger.warn(errorMsg, { reportType, format, startDate, endDate }, 'FinancialReports');
            toast.error('Payment analytics data not available. Please wait for data to load or adjust the date range.');
            setIsGenerating(false);
            return;
          }
          content = `Payment Analytics Report\n\n`;
          content += `Period: ${startDate} to ${endDate}\n\n`;
          if (paymentAnalytics.summary) {
            content += `Total Payments: ${paymentAnalytics.summary.totalPayments || 0}\n`;
            content += `Total Amount: ${formatCurrency(paymentAnalytics.summary.totalAmount || 0)}\n`;
            content += `Success Rate: ${paymentAnalytics.summary.successRate?.toFixed(1) || 0}%\n\n`;
          }
          filename = `payment-analytics-${startDate}-to-${endDate}.${format}`;
          break;

        case 'overdue-invoices':
          if (!overdueInvoices || overdueInvoices.length === 0) {
            const errorMsg = 'Cannot export overdue invoices: No overdue invoices found. This may indicate all invoices are current.';
            logger.info(errorMsg, { reportType, format }, 'FinancialReports');
            toast.info('No overdue invoices to export. All invoices appear to be current.');
            setIsGenerating(false);
            return;
          }
          content = `Overdue Invoices Report\n\n`;
          content += `Total Overdue: ${overdueInvoices.length} invoices\n\n`;
          overdueInvoices.forEach((invoice: any) => {
            content += `${invoice.invoice_number || 'N/A'}: ${formatCurrency(
              Number(invoice.balanceDue || 0)
            )} - ${invoice.daysPastDue || 0} days overdue\n`;
          });
          filename = `overdue-invoices-${new Date().toISOString().split('T')[0]}.${format}`;
          csvData = overdueInvoices.map((invoice: any) => ({
            invoice_number: invoice.invoice_number,
            customer: invoice.customerName || 'N/A',
            balance_due: formatCurrency(Number(invoice.balanceDue || 0)),
            days_past_due: invoice.daysPastDue || 0,
            due_date: invoice.due_date || 'N/A',
          }));
          break;

        case 'financial-summary':
          content = `Financial Summary Report\n\n`;
          content += `Generated: ${new Date().toLocaleString()}\n`;
          content += `Period: ${startDate} to ${endDate}\n\n`;
          content += `=== Accounts Receivable ===\n`;
          if (arSummary) {
            content += `Total AR: ${formatCurrency(arSummary.totalAR || 0)}\n`;
            content += `Total Customers: ${arSummary.totalCustomers || 0}\n`;
          }
          content += `\n=== Revenue ===\n`;
          if (revenueData) {
            content += `Total Revenue: ${formatCurrency(revenueData.totalRevenue || 0)}\n`;
            content += `Growth Rate: ${revenueData.growthRate?.toFixed(1) || 0}%\n`;
          }
          content += `\n=== Overdue Invoices ===\n`;
          if (overdueInvoices) {
            content += `Total Overdue: ${overdueInvoices.length} invoices\n`;
          }
          filename = `financial-summary-${startDate}-to-${endDate}.${format}`;
          break;
      }

      if (format === 'pdf') {
        await generatePDF(content, filename);
      } else if (format === 'csv') {
        if (csvData.length > 0) {
          generateCSV(csvData, filename);
        } else {
          // Generate CSV from content
          const csvContent = content.split('\n').join('\n');
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success('CSV report exported successfully');
        }
      } else {
        // Excel format - export as CSV (browser limitation)
        generateCSV(csvData.length > 0 ? csvData : [{ content }], filename.replace('.excel', '.csv'));
      }

      if (onReportGenerated) {
        onReportGenerated(reportType, format);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(
        `Failed to generate ${reportType} report as ${format.toUpperCase()}. ${errorMessage}. Please check your browser settings and try again. If the issue persists, try a different export format.`,
        error,
        'FinancialReports'
      );
      toast.error(
        `Failed to generate ${format.toUpperCase()} report. ${errorMessage}. Please try again or use a different export format.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const isLoading =
    arLoading || revenueLoading || paymentLoading || overdueLoading || isGenerating;

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Heading level={3} className="font-semibold flex items-center">
                <FileText className="w-6 h-6 mr-2 text-purple-600" />
                Financial Reports
              </Heading>
              <Text variant="small" className="text-gray-600 mt-1">
                Generate and export financial reports
              </Text>
            </div>
          </div>

          {/* Report Configuration */}
          <div className="space-y-4">
            <div>
              <Text variant="small" className="font-medium text-gray-700 mb-2 block">
                Report Type
              </Text>
              <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial-summary">Financial Summary</SelectItem>
                  <SelectItem value="ar-summary">AR Summary</SelectItem>
                  <SelectItem value="revenue-analytics">Revenue Analytics</SelectItem>
                  <SelectItem value="payment-analytics">Payment Analytics</SelectItem>
                  <SelectItem value="overdue-invoices">Overdue Invoices</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(reportType === 'revenue-analytics' ||
              reportType === 'payment-analytics' ||
              reportType === 'financial-summary') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            )}

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                variant="primary"
                icon={Download}
                onClick={() => handleExport('pdf')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Export PDF
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                icon={Download}
                onClick={() => handleExport('csv')}
                disabled={isLoading}
              >
                Export CSV
              </Button>
              <Button
                variant="outline"
                icon={Download}
                onClick={() => handleExport('excel')}
                disabled={isLoading}
              >
                Export Excel
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Report Preview */}
      <Card>
        <div className="p-6">
          <Heading level={4} className="font-semibold mb-4">
            Report Preview
          </Heading>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600 mr-2" />
              <Text>Loading report data...</Text>
            </div>
          ) : (
            <div className="space-y-4">
              {reportType === 'ar-summary' && arSummary && (
                <div className="space-y-2">
                  <Text variant="body" className="font-semibold">
                    Total AR: {formatCurrency(arSummary.totalAR || 0)}
                  </Text>
                  <Text variant="small" className="text-gray-600">
                    {arSummary.totalCustomers || 0} customers, {arSummary.totalInvoices || 0}{' '}
                    invoices
                  </Text>
                </div>
              )}

              {reportType === 'revenue-analytics' && revenueData && (
                <div className="space-y-2">
                  <Text variant="body" className="font-semibold">
                    Total Revenue: {formatCurrency(revenueData.totalRevenue || 0)}
                  </Text>
                  <Text variant="small" className="text-gray-600">
                    Growth Rate: {revenueData.growthRate?.toFixed(1) || 0}%
                  </Text>
                </div>
              )}

              {reportType === 'overdue-invoices' && overdueInvoices && (
                <div className="space-y-2">
                  <Text variant="body" className="font-semibold">
                    {overdueInvoices.length} overdue invoices
                  </Text>
                </div>
              )}

              {reportType === 'financial-summary' && (
                <div className="space-y-4">
                  {arSummary && (
                    <div>
                      <Text variant="body" className="font-semibold">
                        AR: {formatCurrency(arSummary.totalAR || 0)}
                      </Text>
                      <Text variant="small" className="text-gray-600">
                        {arSummary.totalCustomers || 0} customers
                      </Text>
                    </div>
                  )}
                  {revenueData && (
                    <div>
                      <Text variant="body" className="font-semibold">
                        Revenue: {formatCurrency(revenueData.totalRevenue || 0)}
                      </Text>
                      <Text variant="small" className="text-gray-600">
                        Growth: {revenueData.growthRate?.toFixed(1) || 0}%
                      </Text>
                    </div>
                  )}
                  {overdueInvoices && (
                    <div>
                      <Text variant="body" className="font-semibold">
                        Overdue: {overdueInvoices.length} invoices
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

