import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Heading,
  Text,
} from '@/components/ui';
import {
  History,
  DollarSign,
  Calendar,
  CheckCircle,
  FileText,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  X,
  CreditCard,
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import type { Payment } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import { PaymentHistorySkeleton } from './BillingSkeletons';

interface CustomerPaymentHistoryProps {
  customerId: string;
  onInvoiceClick?: (invoiceId: string) => void;
  className?: string;
}

type SortField = 'payment_date' | 'amount' | 'invoice_number';
type SortDirection = 'asc' | 'desc';

export default function CustomerPaymentHistory({
  customerId,
  onInvoiceClick,
  className = '',
}: CustomerPaymentHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('payment_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [dateRangeStart, setDateRangeStart] = useState<string>('');
  const [dateRangeEnd, setDateRangeEnd] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all payments for customer
  const { data: payments = [], isLoading, error } = useQuery<Payment[]>({
    queryKey: ['billing', 'payments', customerId],
    queryFn: () => billing.getPayments(),
    enabled: !!customerId,
  });

  // Filter and sort payments
  const filteredAndSortedPayments = useMemo(() => {
    // Guard against undefined payments array
    if (!Array.isArray(payments)) {
      logger.warn('Payments data is not an array', { payments }, 'CustomerPaymentHistory');
      return [];
    }

    let filtered = [...payments];

    // Filter by customer (if needed - payments should already be filtered by backend)
    // But we'll keep this for safety
    filtered = filtered.filter(payment => 
      payment.Invoice?.id || true // Include all if invoice exists
    );

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.Invoice?.invoice_number?.toLowerCase().includes(searchLower) ||
        payment.reference_number?.toLowerCase().includes(searchLower) ||
        payment.amount.toString().includes(searchTerm) ||
        payment.payment_methods?.payment_name?.toLowerCase().includes(searchLower) ||
        payment.notes?.toLowerCase().includes(searchLower)
      );
    }

    // Apply date range filter
    if (dateRangeStart) {
      const startDate = new Date(dateRangeStart);
      filtered = filtered.filter(payment => 
        new Date(payment.payment_date) >= startDate
      );
    }
    if (dateRangeEnd) {
      const endDate = new Date(dateRangeEnd);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(payment => 
        new Date(payment.payment_date) <= endDate
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'payment_date':
          aValue = new Date(a.payment_date).getTime();
          bValue = new Date(b.payment_date).getTime();
          break;
        case 'amount':
          aValue = Number(a.amount);
          bValue = Number(b.amount);
          break;
        case 'invoice_number':
          aValue = a.Invoice?.invoice_number || '';
          bValue = b.Invoice?.invoice_number || '';
          break;
        default:
          return 0;
      }

      if (aValue === bValue) return 0;
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [payments, searchTerm, sortField, sortDirection, dateRangeStart, dateRangeEnd]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Helper function for date formatting (currently unused, kept for potential future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = payments.length;
    const totalAmount = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const thisMonth = payments.filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && 
             paymentDate.getFullYear() === now.getFullYear();
    });
    const thisMonthAmount = thisMonth.reduce((sum, payment) => sum + Number(payment.amount), 0);

    return {
      total,
      totalAmount,
      thisMonth: thisMonth.length,
      thisMonthAmount,
    };
  }, [payments]);

  if (isLoading) {
    return <PaymentHistorySkeleton />;
  }

  if (error) {
    return (
      <Card className={className}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Heading level={4} className="text-red-800 mb-1">
            Error loading payment history
          </Heading>
          <Text variant="body" className="text-red-700">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">
                Total Payments
              </Text>
              <Heading level={4} className="mt-1">
                {stats.total}
              </Heading>
            </div>
            <History className="w-8 h-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">
                Total Paid
              </Text>
              <Heading level={4} className="mt-1 text-green-600">
                {formatCurrency(stats.totalAmount)}
              </Heading>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text variant="small" className="text-gray-600">
                This Month
              </Text>
              <Heading level={4} className="mt-1 text-purple-600">
                {formatCurrency(stats.thisMonthAmount)}
              </Heading>
              <Text variant="small" className="text-gray-500 mt-1">
                {stats.thisMonth} payment{stats.thisMonth !== 1 ? 's' : ''}
              </Text>
            </div>
            <Calendar className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Heading level={3} className="flex items-center">
              <History className="w-5 h-5 mr-2" />
              Payment History
            </Heading>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={Filter}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide Filters' : 'Filters'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Download}
                onClick={() => {
                  toast.info('Export functionality coming soon');
                }}
              >
                Export
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by invoice number, reference number, or amount..."
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
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
            {(['payment_date', 'amount', 'invoice_number'] as SortField[]).map((field) => (
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

      {/* Payment List */}
      <Card>
        <div className="p-4">
          {filteredAndSortedPayments.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Heading level={4} className="text-gray-600 mb-2">
                No payments found
              </Heading>
              <Text variant="body" className="text-gray-500">
                {searchTerm || dateRangeStart || dateRangeEnd
                  ? 'Try adjusting your filters'
                  : 'No payment history available'}
              </Text>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Heading level={4} className="font-semibold text-green-600">
                            {formatCurrency(Number(payment.amount))}
                          </Heading>
                          {payment.Invoice && (
                            <button
                              onClick={() => onInvoiceClick?.(payment.Invoice.id)}
                              className="flex items-center space-x-1 text-sm text-purple-600 hover:text-purple-700 hover:underline"
                            >
                              <FileText className="w-4 h-4" />
                              <span>Invoice {payment.Invoice.invoice_number}</span>
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDateTime(payment.payment_date)}</span>
                          </div>
                          {payment.payment_methods && (
                            <div className="flex items-center">
                              <CreditCard className="w-4 h-4 mr-2" />
                              <span>
                                {payment.payment_methods.payment_name || 
                                 payment.payment_methods.payment_type}
                              </span>
                            </div>
                          )}
                          {payment.reference_number && (
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              <span>Ref: {payment.reference_number}</span>
                            </div>
                          )}
                        </div>
                        {payment.notes && (
                          <Text variant="small" className="text-gray-500 mt-2">
                            {payment.notes}
                          </Text>
                        )}
                      </div>
                    </div>
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

