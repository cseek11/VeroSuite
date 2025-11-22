import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Heading, Text } from '@/components/ui';
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Users,
  FileText,
  Download,
  Eye,
  Loader2,
  BarChart3,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import type { ARSummary, ARInvoice } from '@/types/enhanced-types';

type SortField = 'customerName' | 'totalAR' | 'invoiceCount' | 'oldestDays';
type SortDirection = 'asc' | 'desc';
type AgingFilter = 'all' | '0-30' | '31-60' | '61-90' | '90+';

export default function ARManagement() {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [agingFilter, setAgingFilter] = useState<AgingFilter>('all');
  const [sortField, setSortField] = useState<SortField>('totalAR');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const { data: arSummary, isLoading, error, refetch } = useQuery<ARSummary>({
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

  const getAgingColor = (bucket: string) => {
    switch (bucket) {
      case '0-30':
        return 'bg-green-50 border-green-200 text-green-800';
      case '31-60':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case '61-90':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case '90+':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Filter and sort customer AR
  // CRITICAL: This hook MUST be called before any early returns to comply with React's Rules of Hooks
  // Pattern: REACT_HOOKS_ORDER_VIOLATION (see docs/error-patterns.md)
  const filteredAndSortedCustomerAR = useMemo(() => {
    // Guard: Handle case when data is not yet available
    if (!arSummary?.customerAR) {
      return [];
    }

    let filtered = [...arSummary.customerAR];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(customer =>
        customer.customerName.toLowerCase().includes(searchLower) ||
        customer.customerId.toLowerCase().includes(searchLower)
      );
    }

    // Apply aging filter
    if (agingFilter !== 'all') {
      filtered = filtered.filter(customer => {
        const oldestDays = Math.max(...customer.invoices.map((inv: ARInvoice) => inv.daysPastDue || 0));
        switch (agingFilter) {
          case '0-30':
            return oldestDays >= 0 && oldestDays <= 30;
          case '31-60':
            return oldestDays >= 31 && oldestDays <= 60;
          case '61-90':
            return oldestDays >= 61 && oldestDays <= 90;
          case '90+':
            return oldestDays > 90;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'customerName':
          aValue = a.customerName.toLowerCase();
          bValue = b.customerName.toLowerCase();
          break;
        case 'totalAR':
          aValue = a.totalAR;
          bValue = b.totalAR;
          break;
        case 'invoiceCount':
          aValue = a.invoices.length;
          bValue = b.invoices.length;
          break;
        case 'oldestDays':
          aValue = Math.max(...a.invoices.map((inv: ARInvoice) => inv.daysPastDue || 0));
          bValue = Math.max(...b.invoices.map((inv: ARInvoice) => inv.daysPastDue || 0));
          break;
        default:
          return 0;
      }

      if (aValue === bValue) return 0;
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [arSummary?.customerAR, searchTerm, agingFilter, sortField, sortDirection]);

  // Early returns AFTER all hooks are called
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Loading AR data...</span>
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(
      'Failed to load AR summary data. This may be due to network issues, authentication problems, or server errors. Please check your connection and try again.',
      error,
      'ARManagement'
    );
    return (
      <Card>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <Text className="font-semibold text-red-900">Failed to load AR data</Text>
                <Text className="text-sm text-red-700 mt-1">
                  {errorMessage}. Please check your connection and try again.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!arSummary) {
    return null;
  }

  const { totalAR, agingBuckets, customerAR, totalCustomers, totalInvoices } = arSummary;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="w-4 h-4 text-purple-600" />
      : <ArrowDown className="w-4 h-4 text-purple-600" />;
  };

  const handleExportCSV = () => {
    try {
      const headers = ['Customer Name', 'Customer ID', 'Total AR', 'Invoice Count', 'Oldest Days Overdue'];
      const rows = filteredAndSortedCustomerAR.map(customer => [
        customer.customerName,
        customer.customerId,
        formatCurrency(customer.totalAR),
        customer.invoices.length.toString(),
        Math.max(...customer.invoices.map((inv: ARInvoice) => inv.daysPastDue || 0)).toString()
      ]);

      const csvContent = [
        'AR Management Report',
        `Generated: ${new Date().toLocaleDateString()}`,
        `Total AR: ${formatCurrency(totalAR)}`,
        `Total Customers: ${totalCustomers}`,
        '',
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AR-Management-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.debug('AR Management CSV exported', {}, 'ARManagement');
      toast.success('AR Management report exported successfully');
    } catch (error) {
      logger.error('Failed to export AR Management CSV', error, 'ARManagement');
      toast.error('Failed to export report. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} className="font-bold text-gray-900">
            Accounts Receivable Management
          </Heading>
          <Text className="text-gray-600 mt-1">
            Track and manage outstanding receivables
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-purple-700 font-medium text-sm">Total AR</Text>
                <Heading level={2} className="text-purple-900 font-bold mt-1">
                  {formatCurrency(totalAR)}
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
                  {totalCustomers}
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
                  {totalInvoices}
                </Heading>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-orange-700 font-medium text-sm">Avg per Customer</Text>
                <Heading level={2} className="text-orange-900 font-bold mt-1">
                  {formatCurrency(totalCustomers > 0 ? totalAR / totalCustomers : 0)}
                </Heading>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
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
              AR Aging Analysis
            </Heading>
            <Button variant="outline" size="sm" icon={BarChart3}>
              View Chart
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(agingBuckets).map(([bucket, amount]) => (
              <div
                key={bucket}
                className={`border-2 rounded-lg p-4 ${getAgingColor(bucket)}`}
              >
                <div className="text-sm font-medium mb-1">
                  {bucket === '90+' ? '90+ Days' : `${bucket} Days`}
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(amount)}
                </div>
                <div className="text-xs mt-1 opacity-75">
                  {totalAR > 0 ? `${((amount / totalAR) * 100).toFixed(1)}%` : '0%'} of total AR
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Customer AR List */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="font-semibold">
              Customer AR Breakdown
            </Heading>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={Filter}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide Filters' : 'Filters'}
              </Button>
              <Button variant="outline" size="sm" icon={Download} onClick={handleExportCSV}>
                Export
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Aging Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aging Bucket
                    </label>
                    <select
                      value={agingFilter}
                      onChange={(e) => setAgingFilter(e.target.value as AgingFilter)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Aging Buckets</option>
                      <option value="0-30">0-30 Days</option>
                      <option value="31-60">31-60 Days</option>
                      <option value="61-90">61-90 Days</option>
                      <option value="90+">90+ Days</option>
                    </select>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort By
                    </label>
                    <div className="flex gap-2">
                      {([
                        { field: 'totalAR' as SortField, label: 'Total AR' },
                        { field: 'customerName' as SortField, label: 'Customer Name' },
                        { field: 'invoiceCount' as SortField, label: 'Invoice Count' },
                        { field: 'oldestDays' as SortField, label: 'Oldest Days' },
                      ]).map(({ field, label }) => (
                        <button
                          key={field}
                          onClick={() => handleSort(field)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            sortField === field
                              ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                          }`}
                        >
                          {label}
                          {getSortIcon(field)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          {filteredAndSortedCustomerAR.length !== customerAR.length && (
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredAndSortedCustomerAR.length} of {customerAR.length} customers
            </div>
          )}

          {filteredAndSortedCustomerAR.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <Text className="text-gray-500 mb-2">No outstanding receivables</Text>
              <Text className="text-gray-400 text-sm">All invoices have been paid.</Text>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedCustomerAR.map((customer) => (
                <div
                  key={customer.customerId}
                  className={`border rounded-lg p-4 hover:border-purple-300 transition-colors ${
                    selectedCustomer === customer.customerId ? 'border-purple-500 bg-purple-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Heading level={4} className="font-semibold">
                          {customer.customerName}
                        </Heading>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                          {formatCurrency(customer.totalAR)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {customer.invoices.length} invoice{customer.invoices.length !== 1 ? 's' : ''} • 
                        {' '}Oldest: {Math.max(...customer.invoices.map((inv: ARInvoice) => inv.daysPastDue))} days overdue
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Eye}
                        onClick={() => setSelectedCustomer(
                          selectedCustomer === customer.customerId ? null : customer.customerId
                        )}
                      >
                        {selectedCustomer === customer.customerId ? 'Hide' : 'View'}
                      </Button>
                    </div>
                  </div>

                  {selectedCustomer === customer.customerId && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="space-y-2">
                        {customer.invoices.map((invoice: ARInvoice) => (
                          <div
                            key={invoice.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <Text className="font-medium">{invoice.invoice_number}</Text>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  invoice.daysPastDue > 90
                                    ? 'bg-red-100 text-red-800'
                                    : invoice.daysPastDue > 60
                                    ? 'bg-orange-100 text-orange-800'
                                    : invoice.daysPastDue > 30
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {invoice.daysPastDue} days
                                </span>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                Due: {new Date(invoice.due_date).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">{formatCurrency(invoice.balanceDue)}</div>
                              <div className="text-xs text-gray-600">
                                of {formatCurrency(Number(invoice.total_amount))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}





