import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Heading, Text } from '@/components/ui';
import {
  DollarSign,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  Calendar,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

interface ReconciliationRecord {
  id: string;
  date: string;
  amount: number;
  invoiceNumber?: string;
  customerName?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  status: 'matched' | 'unmatched' | 'disputed';
  notes?: string;
}

export default function ReconciliationTools() {
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'matched' | 'unmatched' | 'disputed'>('all');
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());

  // Fetch payment tracking data for reconciliation
  const { data: trackingData, isLoading, error, refetch } = useQuery({
    queryKey: ['billing', 'payment-tracking', startDate, endDate],
    queryFn: () => billing.getPaymentTracking(startDate, endDate),
    onError: (error: unknown) => {
      logger.error('Failed to fetch payment tracking data', error, 'ReconciliationTools');
      toast.error('Failed to load payment data. Please try again.');
    },
  });

  // Convert payment data to reconciliation records
  const reconciliationRecords = useMemo(() => {
    if (!trackingData?.payments) {
      return [];
    }

    return trackingData.payments.map((payment: unknown) => {
      const p = payment as {
        id?: string;
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

      return {
        id: p.id || Math.random().toString(),
        date: p.payment_date || '',
        amount: Number(p.amount || 0),
        invoiceNumber: p.Invoice?.invoice_number,
        customerName: p.Invoice?.accounts?.name,
        paymentMethod: p.payment_methods?.payment_name,
        referenceNumber: p.reference_number,
        status: 'matched' as const, // Simplified - would need actual reconciliation logic
        notes: p.notes
      } as ReconciliationRecord;
    });
  }, [trackingData?.payments]);

  // Filter and search records
  const filteredRecords = useMemo(() => {
    let filtered = [...reconciliationRecords];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.invoiceNumber?.toLowerCase().includes(searchLower) ||
        record.customerName?.toLowerCase().includes(searchLower) ||
        record.referenceNumber?.toLowerCase().includes(searchLower) ||
        record.paymentMethod?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    return filtered;
  }, [reconciliationRecords, searchTerm, statusFilter]);

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

  const toggleRecordSelection = (recordId: string) => {
    const newSelection = new Set(selectedRecords);
    if (newSelection.has(recordId)) {
      newSelection.delete(recordId);
    } else {
      newSelection.add(recordId);
    }
    setSelectedRecords(newSelection);
  };

  const selectAll = () => {
    setSelectedRecords(new Set(filteredRecords.map(r => r.id)));
  };

  const clearSelection = () => {
    setSelectedRecords(new Set());
  };

  const handleExportCSV = () => {
    try {
      const headers = ['Date', 'Amount', 'Invoice', 'Customer', 'Payment Method', 'Reference', 'Status', 'Notes'];
      const rows = filteredRecords.map(record => [
        formatDate(record.date),
        formatCurrency(record.amount),
        record.invoiceNumber || 'N/A',
        record.customerName || 'N/A',
        record.paymentMethod || 'N/A',
        record.referenceNumber || 'N/A',
        record.status,
        record.notes || ''
      ]);

      const csvContent = [
        'Payment Reconciliation Report',
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
      a.download = `Payment-Reconciliation-${startDate}-${endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.debug('Reconciliation CSV exported', { startDate, endDate }, 'ReconciliationTools');
      toast.success('Reconciliation report exported successfully');
    } catch (error) {
      logger.error('Failed to export Reconciliation CSV', error, 'ReconciliationTools');
      toast.error('Failed to export report. Please try again.');
    }
  };

  const handleBulkReconcile = () => {
    if (selectedRecords.size === 0) {
      toast.error('Please select records to reconcile');
      return;
    }

    // TODO: Implement bulk reconciliation logic
    toast.success(`Reconciling ${selectedRecords.size} records...`);
    logger.debug('Bulk reconciliation initiated', { recordCount: selectedRecords.size }, 'ReconciliationTools');
  };

  // Calculate summary statistics
  const summary = useMemo(() => {
    const total = filteredRecords.length;
    const matched = filteredRecords.filter(r => r.status === 'matched').length;
    const unmatched = filteredRecords.filter(r => r.status === 'unmatched').length;
    const disputed = filteredRecords.filter(r => r.status === 'disputed').length;
    const totalAmount = filteredRecords.reduce((sum, r) => sum + r.amount, 0);

    return {
      total,
      matched,
      unmatched,
      disputed,
      totalAmount
    };
  }, [filteredRecords]);

  // Early returns MUST come after all hooks (Rules of Hooks)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Loading reconciliation data...</span>
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
              <Text>Failed to load reconciliation data. Please try again.</Text>
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
            Payment Reconciliation Tools
          </Heading>
          <Text className="text-gray-600 mt-1">
            Reconcile payments and match transactions
          </Text>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" icon={RefreshCw} onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-blue-700 font-medium text-sm">Total Records</Text>
                <Heading level={2} className="text-blue-900 font-bold mt-1">
                  {summary.total}
                </Heading>
                <Text className="text-blue-600 text-xs mt-1">
                  {formatCurrency(summary.totalAmount)} total
                </Text>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-green-700 font-medium text-sm">Matched</Text>
                <Heading level={2} className="text-green-900 font-bold mt-1">
                  {summary.matched}
                </Heading>
                <Text className="text-green-600 text-xs mt-1">
                  {summary.total > 0 ? `${((summary.matched / summary.total) * 100).toFixed(1)}%` : '0%'}
                </Text>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-yellow-700 font-medium text-sm">Unmatched</Text>
                <Heading level={2} className="text-yellow-900 font-bold mt-1">
                  {summary.unmatched}
                </Heading>
                <Text className="text-yellow-600 text-xs mt-1">
                  Requires attention
                </Text>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-red-700 font-medium text-sm">Disputed</Text>
                <Heading level={2} className="text-red-900 font-bold mt-1">
                  {summary.disputed}
                </Heading>
                <Text className="text-red-600 text-xs mt-1">
                  Needs resolution
                </Text>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search invoices, customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="matched">Matched</option>
                <option value="unmatched">Unmatched</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedRecords.size > 0 && (
        <Card className="bg-purple-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <Text className="font-medium text-purple-900">
                {selectedRecords.size} record{selectedRecords.size !== 1 ? 's' : ''} selected
              </Text>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear Selection
                </Button>
                <Button variant="primary" size="sm" onClick={handleBulkReconcile}>
                  Reconcile Selected
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Reconciliation Table */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="font-semibold">
              Payment Records
            </Heading>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear Selection
              </Button>
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <Text className="text-gray-500 mb-2">No payment records found</Text>
              <Text className="text-gray-400 text-sm">Try adjusting the filters or date range.</Text>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedRecords.size === filteredRecords.length && filteredRecords.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            selectAll();
                          } else {
                            clearSelection();
                          }
                        }}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Invoice</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment Method</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reference</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        selectedRecords.has(record.id) ? 'bg-purple-50' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedRecords.has(record.id)}
                          onChange={() => toggleRecordSelection(record.id)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm">{formatDate(record.date)}</td>
                      <td className="py-3 px-4 text-sm font-semibold">{formatCurrency(record.amount)}</td>
                      <td className="py-3 px-4 text-sm">{record.invoiceNumber || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{record.customerName || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{record.paymentMethod || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{record.referenceNumber || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === 'matched'
                              ? 'bg-green-100 text-green-800'
                              : record.status === 'unmatched'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {record.status}
                        </span>
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


