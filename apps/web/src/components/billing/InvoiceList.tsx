import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  Heading,
  Text,
} from '@/components/ui';
import {
  Search,
  Eye,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpDown,
  Filter,
  X,
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { Invoice } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
import { toast } from '@/utils/toast';
import { trackInvoiceView, trackInvoiceSearch, trackInvoiceFilter } from '@/lib/billing-analytics';
import { InvoiceListSkeleton } from './BillingSkeletons';

export type InvoiceStatusFilter = 'all' | 'draft' | 'sent' | 'paid' | 'overdue';
export type SortField = 'issue_date' | 'due_date' | 'total_amount' | 'status' | 'invoice_number';
export type SortDirection = 'asc' | 'desc';

interface InvoiceListProps {
  customerId?: string;
  onInvoiceSelect?: (invoice: Invoice) => void;
  onInvoicePay?: (invoice: Invoice) => void;
  showActions?: boolean;
  className?: string;
}

export default function InvoiceList({
  customerId,
  onInvoiceSelect,
  onInvoicePay,
  showActions = true,
  className = '',
}: InvoiceListProps) {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('due_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRangeStart, setDateRangeStart] = useState<string>('');
  const [dateRangeEnd, setDateRangeEnd] = useState<string>('');

  // Fetch invoices
  const { data: invoicesData, isLoading, error, refetch } = useQuery<Invoice[]>({
    queryKey: ['billing', 'invoices', customerId || 'all'],
    queryFn: () => billing.getInvoices(customerId),
  });

  const invoices: Invoice[] = Array.isArray(invoicesData) ? invoicesData : [];

  // Handle query errors
  if (error) {
    logger.error('Failed to fetch invoices', error as Record<string, any>, 'InvoiceList');
    toast.error('Failed to load invoices. Please try again.');
  }

  // Filter and sort invoices
  const filteredAndSortedInvoices = useMemo(() => {
    // Guard against undefined invoices array
    if (!Array.isArray(invoices)) {
      logger.warn('Invoices data is not an array', { invoices }, 'InvoiceList');
      return [];
    }

    let filtered = [...invoices];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice =>
        invoice.invoice_number.toLowerCase().includes(searchLower) ||
        invoice.accounts?.name?.toLowerCase().includes(searchLower) ||
        invoice.total_amount.toString().includes(searchTerm) ||
        invoice.InvoiceItem?.some((item: { description?: string }) => 
          item.description?.toLowerCase().includes(searchLower)
        ) ||
        (invoice.notes && invoice.notes.toLowerCase().includes(searchLower))
      );
    }

    // Apply date range filter
    if (dateRangeStart) {
      const startDate = new Date(dateRangeStart);
      filtered = filtered.filter(invoice => 
        new Date(invoice.issue_date) >= startDate
      );
    }
    if (dateRangeEnd) {
      const endDate = new Date(dateRangeEnd);
      endDate.setHours(23, 59, 59, 999); // Include entire end date
      filtered = filtered.filter(invoice => 
        new Date(invoice.issue_date) <= endDate
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'issue_date':
          aValue = new Date(a.issue_date).getTime();
          bValue = new Date(b.issue_date).getTime();
          break;
        case 'due_date':
          aValue = new Date(a.due_date).getTime();
          bValue = new Date(b.due_date).getTime();
          break;
        case 'total_amount':
          aValue = Number(a.total_amount);
          bValue = Number(b.total_amount);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'invoice_number':
          aValue = a.invoice_number;
          bValue = b.invoice_number;
          break;
        default:
          return 0;
      }

      if (aValue === bValue) return 0;
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [invoices, statusFilter, searchTerm, sortField, sortDirection, dateRangeStart, dateRangeEnd]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'sent':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'sent':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = invoices.length;
    const draft = invoices.filter((inv: Invoice) => inv.status === 'draft').length;
    const sent = invoices.filter((inv: Invoice) => inv.status === 'sent').length;
    const paid = invoices.filter((inv: Invoice) => inv.status === 'paid').length;
    const overdue = invoices.filter((inv: Invoice) => inv.status === 'overdue').length;
    const totalAmount = invoices.reduce((sum: number, inv: Invoice) => sum + Number(inv.total_amount), 0);
    const paidAmount = invoices.filter((inv: Invoice) => inv.status === 'paid')
      .reduce((sum: number, inv: Invoice) => sum + Number(inv.total_amount), 0);
    const outstandingAmount = invoices.filter((inv: Invoice) => 
      inv.status === 'sent' || inv.status === 'overdue'
    ).reduce((sum, inv) => sum + Number(inv.total_amount), 0);

    return {
      total,
      draft,
      sent,
      paid,
      overdue,
      totalAmount,
      paidAmount,
      outstandingAmount,
    };
  }, [invoices]);

  // Track search
  useEffect(() => {
    if (searchTerm) {
      trackInvoiceSearch(searchTerm, { statusFilter, dateRangeStart, dateRangeEnd });
    }
  }, [searchTerm, statusFilter, dateRangeStart, dateRangeEnd]);

  // Track filter changes
  useEffect(() => {
    if (statusFilter !== 'all') {
      trackInvoiceFilter('status', statusFilter);
    }
  }, [statusFilter]);

  if (isLoading) {
    return <InvoiceListSkeleton />;
  }

  if (error) {
    return (
      <Card className={className}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Heading level={4} className="text-red-800 mb-1">
            Error loading invoices
          </Heading>
          <Text variant="body" className="text-red-700">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </Text>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-3"
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  const statusOptions = [
    { value: 'all', label: 'All Invoices' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
  ];

  return (
    <div className={className}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">
                Total Invoices
              </Text>
              <Heading level={4} className="mt-1">
                {stats.total}
              </Heading>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">
                Outstanding
              </Text>
              <Heading level={4} className="mt-1 text-orange-600">
                {formatCurrency(stats.outstandingAmount)}
              </Heading>
            </div>
            <DollarSign className="w-8 h-8 text-orange-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">
                Paid
              </Text>
              <Heading level={4} className="mt-1 text-green-600">
                {formatCurrency(stats.paidAmount)}
              </Heading>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">
                Overdue
              </Text>
              <Heading level={4} className="mt-1 text-red-600">
                {stats.overdue}
              </Heading>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Heading level={3}>Invoices</Heading>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={Filter}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide Filters' : 'Filters'}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by invoice number, customer, amount, or description..."
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value as InvoiceStatusFilter)}
                  options={statusOptions}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Input
                  type="date"
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDateRangeStart('');
                    setDateRangeEnd('');
                    setStatusFilter('all');
                    setSearchTerm('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {/* Sort Controls */}
          <div className="flex items-center space-x-2 mt-4">
            <Text variant="small" className="text-gray-600">
              Sort by:
            </Text>
            {(['issue_date', 'due_date', 'total_amount', 'status'] as SortField[]).map((field) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  sortField === field
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                {sortField === field && (
                  <ArrowUpDown className="w-3 h-3 inline-block ml-1" />
                )}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Invoice List */}
      <Card>
        <div className="p-4">
          {filteredAndSortedInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Heading level={4} className="text-gray-600 mb-2">
                No invoices found
              </Heading>
              <Text variant="body" className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || dateRangeStart || dateRangeEnd
                  ? 'Try adjusting your filters'
                  : 'No invoices available'}
              </Text>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Heading level={4} className="font-semibold">
                              {invoice.invoice_number}
                            </Heading>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(invoice.status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <Text variant="body" className="text-gray-600 mt-1">
                            {invoice.accounts?.name || 'Unknown Customer'}
                          </Text>
                          {/* Note: invoice.accounts is a simplified type without address fields */}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Text variant="small" className="text-gray-600">
                            Issue Date
                          </Text>
                          <div className="font-medium flex items-center mt-1">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {formatDate(invoice.issue_date)}
                          </div>
                        </div>
                        <div>
                          <Text variant="small" className="text-gray-600">
                            Due Date
                          </Text>
                          <div className="font-medium flex items-center mt-1">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {formatDate(invoice.due_date)}
                          </div>
                        </div>
                        <div>
                          <Text variant="small" className="text-gray-600">
                            Amount
                          </Text>
                          <div className="font-medium flex items-center mt-1">
                            <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                            {formatCurrency(Number(invoice.total_amount))}
                          </div>
                        </div>
                        <div>
                          <Text variant="small" className="text-gray-600">
                            Items
                          </Text>
                          <div className="font-medium mt-1">
                            {invoice.InvoiceItem?.length || 0} item(s)
                          </div>
                        </div>
                      </div>
                    </div>

                    {showActions && (
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Eye}
                          onClick={() => {
                            trackInvoiceView(invoice.id, customerId);
                            onInvoiceSelect?.(invoice);
                          }}
                        >
                          View
                        </Button>
                        {(invoice.status === 'sent' || invoice.status === 'overdue') && onInvoicePay && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onInvoicePay(invoice)}
                          >
                            Pay
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

