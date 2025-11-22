// React import removed - not needed with React 17+
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui';
import {
  DollarSign,
  Download,
  FileText,
  Loader2,
  BarChart3,
  Users
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import jsPDF from 'jspdf';

export default function ARAgingReport() {
  const { data: arSummary, isLoading, error } = useQuery({
    queryKey: ['billing', 'ar-summary'],
    queryFn: () => billing.getARSummary(),
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
    if (!arSummary) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = margin;

    // Title
    doc.setFontSize(18);
    doc.text('AR Aging Report', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    // Date
    doc.setFontSize(10);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      yPos,
      { align: 'center' }
    );
    yPos += 15;

    // Summary
    doc.setFontSize(14);
    doc.text('SUMMARY', margin, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.text(`Total AR: ${formatCurrency(arSummary.totalAR)}`, margin + 5, yPos);
    yPos += 6;
    doc.text(`Total Customers: ${arSummary.totalCustomers}`, margin + 5, yPos);
    yPos += 6;
    doc.text(`Total Invoices: ${arSummary.totalInvoices}`, margin + 5, yPos);
    yPos += 10;

    // Aging Buckets
    doc.setFontSize(14);
    doc.text('AGING BUCKETS', margin, yPos);
    yPos += 8;
    doc.setFontSize(10);
    arSummary.agingBuckets.forEach((bucket) => {
      doc.text(
        `${bucket.bucket === '90+' ? '90+' : bucket.bucket} Days: ${formatCurrency(bucket.amount)}`,
        margin + 5,
        yPos
      );
      yPos += 6;
    });
    yPos += 5;

    // Customer AR
    if (arSummary.customerAR && arSummary.customerAR.length > 0) {
      doc.setFontSize(14);
      doc.text('CUSTOMER AR BREAKDOWN', margin, yPos);
      yPos += 8;
      doc.setFontSize(10);

      arSummary.customerAR.slice(0, 20).forEach((customer: any) => {
        if (yPos > pageWidth - 20) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(`${customer.customerName}: ${formatCurrency(customer.totalAR)}`, margin + 5, yPos);
        yPos += 6;
      });
    }

    doc.save(`AR-Aging-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    logger.debug('AR Aging report exported', {}, 'ARAgingReport');
  };

  const handleExportCSV = () => {
    if (!arSummary) return;

    const csv = [
      ['AR Aging Report'],
      [`Generated: ${new Date().toLocaleDateString()}`],
      [],
      ['Summary'],
      ['Total AR', arSummary.totalAR.toFixed(2)],
      ['Total Customers', arSummary.totalCustomers.toString()],
      ['Total Invoices', arSummary.totalInvoices.toString()],
      [],
      ['Aging Buckets'],
      ['Bucket', 'Amount'],
      ...arSummary.agingBuckets.map((bucket) => [
        bucket.bucket === '90+' ? '90+' : `${bucket.bucket} Days`,
        bucket.amount.toFixed(2)
      ]),
      [],
      ['Customer AR Breakdown'],
      ['Customer', 'Total AR'],
      ...arSummary.customerAR.map((customer: any) => [
        customer.customerName,
        customer.totalAR.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AR-Aging-Report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Loading AR aging data...</span>
      </div>
    );
  }

  if (error || !arSummary) {
    return (
      <Card>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <Text>Failed to load AR aging data. Please try again.</Text>
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
            AR Aging Report
          </Heading>
          <Text className="text-gray-600 mt-1">
            Accounts receivable aging analysis
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-purple-700 font-medium text-sm">Total AR</Text>
                <Heading level={2} className="text-purple-900 font-bold mt-1">
                  {formatCurrency(arSummary.totalAR)}
                </Heading>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-blue-700 font-medium text-sm">Customers</Text>
                <Heading level={2} className="text-blue-900 font-bold mt-1">
                  {arSummary.totalCustomers}
                </Heading>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-green-700 font-medium text-sm">Invoices</Text>
                <Heading level={2} className="text-green-900 font-bold mt-1">
                  {arSummary.totalInvoices}
                </Heading>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Aging Buckets */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="font-semibold">
              Aging Buckets
            </Heading>
            <Button variant="outline" size="sm" icon={BarChart3}>
              View Chart
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {arSummary.agingBuckets.map((bucket) => (
              <div
                key={bucket}
                className={`border-2 rounded-lg p-4 ${
                  bucket === '0-30'
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : bucket === '31-60'
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    : bucket === '61-90'
                    ? 'bg-orange-50 border-orange-200 text-orange-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {bucket === '90+' ? '90+ Days' : `${bucket} Days`}
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(Number(amount))}
                </div>
                <div className="text-xs mt-1 opacity-75">
                  {arSummary.totalAR > 0
                    ? `${(((amount as number) / arSummary.totalAR) * 100).toFixed(1)}%`
                    : '0%'} of total AR
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Customer AR Table */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="font-semibold">
              Customer AR Breakdown
            </Heading>
          </div>

          {arSummary.customerAR.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <Text className="text-gray-500 mb-2">No outstanding receivables</Text>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Total AR</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Invoices</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Oldest (Days)</th>
                  </tr>
                </thead>
                <tbody>
                  {arSummary.customerAR.map((customer: any) => (
                    <tr key={customer.customerId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{customer.customerName}</td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {formatCurrency(customer.totalAR)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {customer.invoices.length}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {Math.max(...customer.invoices.map((inv: any) => inv.daysPastDue))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}





