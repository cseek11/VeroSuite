import React, { useState } from 'react';
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
  Download,
  FileText,
  Loader2,
  AlertCircle,
  Calendar,
  Filter,
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import jsPDF from 'jspdf';

type ReportType = 'pl' | 'ar-aging';

type ExportFormat = 'csv' | 'pdf';

interface ReportExportProps {
  defaultReportType?: ReportType;
  onExportComplete?: (reportType: ReportType, format: ExportFormat) => void;
}

export default function ReportExport({
  defaultReportType = 'pl',
  onExportComplete,
}: ReportExportProps) {
  const [reportType, setReportType] = useState<ReportType>(defaultReportType);
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [asOfDate, setAsOfDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isExporting, setIsExporting] = useState(false);

  // Fetch P&L report data
  const { data: plData, isLoading: plLoading, error: plError } = useQuery({
    queryKey: ['billing', 'pl-report', startDate, endDate],
    queryFn: () => billing.getPLReport(startDate, endDate),
    enabled: reportType === 'pl' && !!startDate && !!endDate,
    onError: (error: unknown) => {
      logger.error('Failed to fetch P&L report data', error, 'ReportExport');
      toast.error('Failed to load P&L report data. Please try again.');
    },
  });

  // Fetch AR aging report data
  const { data: arAgingData, isLoading: arAgingLoading, error: arAgingError } = useQuery({
    queryKey: ['billing', 'ar-aging-report', asOfDate],
    queryFn: () => billing.getARAgingReport(asOfDate),
    enabled: reportType === 'ar-aging',
    onError: (error: unknown) => {
      logger.error('Failed to fetch AR aging report data', error, 'ReportExport');
      toast.error('Failed to load AR aging report data. Please try again.');
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      let csvContent = '';
      let filename = '';

      if (reportType === 'pl') {
        if (!plData) {
          const errorMsg = `Cannot export P&L report: No data available for period ${startDate} to ${endDate}. Please wait for data to load or adjust the date range.`;
          logger.warn(errorMsg, { startDate, endDate }, 'ReportExport');
          toast.error('P&L report data not available. Please wait for data to load or adjust the date range.');
          setIsExporting(false);
          return;
        }

        const headers = ['Month', 'Revenue', 'Expenses', 'Net Income'];
        const rows = plData.monthlyBreakdown?.map((month: any) => [
          month.month,
          formatCurrency(month.revenue || 0),
          formatCurrency(month.expenses || 0),
          formatCurrency(month.netIncome || 0),
        ]) || [];

        csvContent = [
          'Profit & Loss Report',
          `Generated: ${new Date().toLocaleDateString()}`,
          `Period: ${formatDate(startDate)} - ${formatDate(endDate)}`,
          '',
          `Total Revenue: ${formatCurrency(plData.totalRevenue || 0)}`,
          `Total Expenses: ${formatCurrency(plData.totalExpenses || 0)}`,
          `Net Income: ${formatCurrency(plData.netIncome || 0)}`,
          '',
          headers.join(','),
          ...rows.map((row: any[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
        ].join('\n');

        filename = `P&L-Report-${startDate}-${endDate}.csv`;
      } else if (reportType === 'ar-aging') {
        if (!arAgingData) {
          const errorMsg = `Cannot export AR aging report: No data available as of ${asOfDate}. Please wait for data to load.`;
          logger.warn(errorMsg, { asOfDate }, 'ReportExport');
          toast.error('AR aging report data not available. Please wait for data to load.');
          setIsExporting(false);
          return;
        }

        const headers = ['Invoice Number', 'Customer Name', 'Amount', 'Balance Due', 'Due Date', 'Days Past Due', 'Aging Bucket'];
        const rows = arAgingData.invoiceDetails?.map((invoice: any) => [
          invoice.invoiceNumber,
          invoice.customerName,
          formatCurrency(invoice.amount || 0),
          formatCurrency(invoice.balanceDue || 0),
          invoice.dueDate,
          invoice.daysPastDue?.toString() || '0',
          invoice.agingBucket,
        ]) || [];

        csvContent = [
          'AR Aging Report',
          `Generated: ${new Date().toLocaleDateString()}`,
          `As of: ${formatDate(asOfDate)}`,
          '',
          `Total AR: ${formatCurrency(arAgingData.totalAR || 0)}`,
          `Aging Buckets:`,
          `0-30 days: ${formatCurrency(arAgingData.agingBuckets?.['0-30'] || 0)}`,
          `31-60 days: ${formatCurrency(arAgingData.agingBuckets?.['31-60'] || 0)}`,
          `61-90 days: ${formatCurrency(arAgingData.agingBuckets?.['61-90'] || 0)}`,
          `90+ days: ${formatCurrency(arAgingData.agingBuckets?.['90+'] || 0)}`,
          '',
          headers.join(','),
          ...rows.map((row: any[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
        ].join('\n');

        filename = `AR-Aging-Report-${asOfDate}.csv`;
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.debug('Report exported to CSV', { reportType, filename }, 'ReportExport');
      toast.success(`${reportType === 'pl' ? 'P&L' : 'AR Aging'} report exported successfully`);
      onExportComplete?.(reportType, 'csv');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error(
        `Failed to export ${reportType === 'pl' ? 'P&L' : 'AR Aging'} report to CSV: ${errorMessage}`,
        error,
        'ReportExport'
      );
      toast.error(`Failed to export report. ${errorMessage}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = margin;

      if (reportType === 'pl') {
        if (!plData) {
          const errorMsg = `Cannot export P&L report: No data available for period ${startDate} to ${endDate}. Please wait for data to load or adjust the date range.`;
          logger.warn(errorMsg, { startDate, endDate }, 'ReportExport');
          toast.error('P&L report data not available. Please wait for data to load or adjust the date range.');
          setIsExporting(false);
          return;
        }

        // Title
        doc.setFontSize(18);
        doc.text('Profit & Loss Report', pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        // Period
        doc.setFontSize(12);
        doc.text(`Period: ${formatDate(startDate)} - ${formatDate(endDate)}`, margin, yPos);
        yPos += 8;
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
        yPos += 15;

        // Summary
        doc.setFontSize(14);
        doc.text('Summary', margin, yPos);
        yPos += 8;
        doc.setFontSize(11);
        doc.text(`Total Revenue: ${formatCurrency(plData.totalRevenue || 0)}`, margin + 5, yPos);
        yPos += 7;
        doc.text(`Total Expenses: ${formatCurrency(plData.totalExpenses || 0)}`, margin + 5, yPos);
        yPos += 7;
        doc.setFontSize(12);
        doc.text(`Net Income: ${formatCurrency(plData.netIncome || 0)}`, margin + 5, yPos);
        yPos += 15;

        // Monthly Breakdown
        if (plData.monthlyBreakdown && plData.monthlyBreakdown.length > 0) {
          doc.setFontSize(14);
          doc.text('Monthly Breakdown', margin, yPos);
          yPos += 8;
          doc.setFontSize(10);

          plData.monthlyBreakdown.forEach((month: any) => {
            if (yPos > doc.internal.pageSize.getHeight() - 30) {
              doc.addPage();
              yPos = margin;
            }
            doc.text(`${month.month}: ${formatCurrency(month.revenue || 0)}`, margin + 5, yPos);
            yPos += 6;
          });
        }

        doc.save(`P&L-Report-${startDate}-${endDate}.pdf`);
      } else if (reportType === 'ar-aging') {
        if (!arAgingData) {
          const errorMsg = `Cannot export AR aging report: No data available as of ${asOfDate}. Please wait for data to load.`;
          logger.warn(errorMsg, { asOfDate }, 'ReportExport');
          toast.error('AR aging report data not available. Please wait for data to load.');
          setIsExporting(false);
          return;
        }

        // Title
        doc.setFontSize(18);
        doc.text('AR Aging Report', pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;

        // As of date
        doc.setFontSize(12);
        doc.text(`As of: ${formatDate(asOfDate)}`, margin, yPos);
        yPos += 8;
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
        yPos += 15;

        // Summary
        doc.setFontSize(14);
        doc.text('Summary', margin, yPos);
        yPos += 8;
        doc.setFontSize(11);
        doc.text(`Total AR: ${formatCurrency(arAgingData.totalAR || 0)}`, margin + 5, yPos);
        yPos += 10;

        // Aging Buckets
        doc.setFontSize(12);
        doc.text('Aging Buckets', margin, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.text(`0-30 days: ${formatCurrency(arAgingData.agingBuckets?.['0-30'] || 0)}`, margin + 5, yPos);
        yPos += 6;
        doc.text(`31-60 days: ${formatCurrency(arAgingData.agingBuckets?.['31-60'] || 0)}`, margin + 5, yPos);
        yPos += 6;
        doc.text(`61-90 days: ${formatCurrency(arAgingData.agingBuckets?.['61-90'] || 0)}`, margin + 5, yPos);
        yPos += 6;
        doc.text(`90+ days: ${formatCurrency(arAgingData.agingBuckets?.['90+'] || 0)}`, margin + 5, yPos);
        yPos += 10;

        // Customer Breakdown (first page only, truncated)
        if (arAgingData.customerBreakdown && arAgingData.customerBreakdown.length > 0) {
          doc.setFontSize(12);
          doc.text('Top Customers', margin, yPos);
          yPos += 8;
          doc.setFontSize(10);

          arAgingData.customerBreakdown.slice(0, 10).forEach((customer: any) => {
            if (yPos > doc.internal.pageSize.getHeight() - 30) {
              doc.addPage();
              yPos = margin;
            }
            doc.text(`${customer.customerName}: ${formatCurrency(customer.totalAR || 0)}`, margin + 5, yPos);
            yPos += 6;
          });
        }

        doc.save(`AR-Aging-Report-${asOfDate}.pdf`);
      }

      logger.debug('Report exported to PDF', { reportType }, 'ReportExport');
      toast.success(`${reportType === 'pl' ? 'P&L' : 'AR Aging'} report exported successfully`);
      onExportComplete?.(reportType, 'pdf');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error(
        `Failed to export ${reportType === 'pl' ? 'P&L' : 'AR Aging'} report to PDF: ${errorMessage}`,
        error,
        'ReportExport'
      );
      toast.error(`Failed to export report. ${errorMessage}. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  const isLoading = reportType === 'pl' ? plLoading : arAgingLoading;
  const error = reportType === 'pl' ? plError : arAgingError;
  const hasData = reportType === 'pl' ? !!plData : !!arAgingData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} className="font-bold text-gray-900">
            Report Export
          </Heading>
          <Text className="text-gray-600 mt-1">
            Export financial reports in CSV or PDF format
          </Text>
        </div>
      </div>

      {/* Report Selection */}
      <Card>
        <div className="p-6">
          <div className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <Text className="font-medium text-gray-700 mb-2 block">
                Report Type
              </Text>
              <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pl">Profit & Loss (P&L)</SelectItem>
                  <SelectItem value="ar-aging">AR Aging Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filters */}
            {reportType === 'pl' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Text className="font-medium text-gray-700 mb-2 block">
                    Start Date
                  </Text>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Text className="font-medium text-gray-700 mb-2 block">
                    End Date
                  </Text>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div>
                <Text className="font-medium text-gray-700 mb-2 block">
                  As of Date
                </Text>
                <Input
                  type="date"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                />
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <Text className="text-red-900">
                    Failed to load report data. Please try again.
                  </Text>
                </div>
              </div>
            )}

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                variant="primary"
                icon={Download}
                onClick={handleExportCSV}
                disabled={isLoading || isExporting || !hasData}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Export CSV
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                icon={Download}
                onClick={handleExportPDF}
                disabled={isLoading || isExporting || !hasData}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Export PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Loading report data...</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}


