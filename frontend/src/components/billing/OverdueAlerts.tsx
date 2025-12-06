import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Heading, Text } from '@/components/ui';
import {
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Loader2,
  Send,
  Download,
  FileText,
  CheckCircle,
  Search,
  Filter,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { useDialog } from '@/hooks/useDialog';
import { toast } from '@/utils/toast';

type SortField = 'invoice_number' | 'customerName' | 'balanceDue' | 'daysPastDue' | 'due_date';
type SortDirection = 'asc' | 'desc';
type OverdueFilter = 'all' | '0-30' | '31-60' | '61-90' | '90+';

export default function OverdueAlerts() {
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [overdueFilter, setOverdueFilter] = useState<OverdueFilter>('all');
  const [sortField, setSortField] = useState<SortField>('daysPastDue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const { data: overdueInvoices, isLoading, error, refetch } = useQuery({
    queryKey: ['billing', 'overdue-invoices'],
    queryFn: () => billing.getOverdueInvoices(),
  });

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

  const toggleInvoiceSelection = (invoiceId: string) => {
    const newSelection = new Set(selectedInvoices);
    if (newSelection.has(invoiceId)) {
      newSelection.delete(invoiceId);
    } else {
      newSelection.add(invoiceId);
    }
    setSelectedInvoices(newSelection);
  };

  const selectAll = () => {
    if (filteredAndSortedInvoices && filteredAndSortedInvoices.length > 0) {
      setSelectedInvoices(new Set(filteredAndSortedInvoices.map((inv: any) => inv.id)));
    }
  };

  const selectByFilter = (filter: OverdueFilter) => {
    const invoicesToSelect = filteredAndSortedInvoices.filter((inv: any) => {
      if (filter === 'all') return true;
      switch (filter) {
        case '0-30':
          return inv.daysPastDue >= 0 && inv.daysPastDue <= 30;
        case '31-60':
          return inv.daysPastDue >= 31 && inv.daysPastDue <= 60;
        case '61-90':
          return inv.daysPastDue >= 61 && inv.daysPastDue <= 90;
        case '90+':
          return inv.daysPastDue > 90;
        default:
          return false;
      }
    });
    setSelectedInvoices(new Set(invoicesToSelect.map((inv: any) => inv.id)));
  };

  const clearSelection = () => {
    setSelectedInvoices(new Set());
  };

  const { showAlert, showConfirm, DialogComponents } = useDialog();

  const handleSendReminder = async (invoiceId: string) => {
    logger.debug('Sending reminder for invoice', { invoiceId }, 'OverdueAlerts');
    
    try {
      const result = await billing.sendInvoiceReminder([invoiceId]);
      
      if (result.successful > 0) {
        toast.success('Reminder sent successfully');
        logger.info('Reminder sent successfully', { invoiceId, result }, 'OverdueAlerts');
      } else {
        const errorMsg = result.results?.[0]?.error || 'Failed to send reminder';
        toast.error(errorMsg);
        logger.error('Failed to send reminder', { invoiceId, result }, 'OverdueAlerts');
      }
    } catch (error) {
      logger.error('Error sending reminder', error, 'OverdueAlerts');
      toast.error('Failed to send reminder. Please try again.');
    }
  };

  const handleSendBulkReminders = async () => {
    try {
      if (selectedInvoices.size === 0) {
        try {
          await showAlert({
            title: 'No Selection',
            message: 'Please select at least one invoice',
            type: 'warning',
          });
        } catch (error) {
          logger.error('Failed to display no selection alert', error, 'OverdueAlerts');
          throw error;
        }
        return;
      }
      
      let confirmed = false;
      try {
        confirmed = await showConfirm({
          title: 'Send Bulk Reminders',
          message: `Are you sure you want to send reminders for ${selectedInvoices.size} invoice${selectedInvoices.size !== 1 ? 's' : ''}?`,
        });
      } catch (error) {
        logger.error('Failed to show confirmation dialog for bulk reminders', error, 'OverdueAlerts');
        throw error;
      }
  
      if (!confirmed) return;
  
      logger.debug('Sending bulk reminders', { count: selectedInvoices.size }, 'OverdueAlerts');
      
      const invoiceIds = Array.from(selectedInvoices);
      let result;
      try {
        result = await billing.sendInvoiceReminder(invoiceIds);
      } catch (error) {
        logger.error('Failed to send invoice reminders', error, 'OverdueAlerts');
        throw error;
      }
      
      if (result.successful > 0) {
        toast.success(`Reminders sent to ${result.successful} customer${result.successful !== 1 ? 's' : ''}`);
        logger.info('Bulk reminders sent successfully', { count: result.successful, total: result.total }, 'OverdueAlerts');
        
        // Show detailed results if there were any failures
        if (result.failed > 0) {
          const failedResults = result.results.filter((r: any) => !r.success);
          const errorMessages = failedResults.map((r: any) => r.error || 'Unknown error').join(', ');
          try {
            await showAlert({
              title: 'Partial Success',
              message: `${result.successful} reminder${result.successful !== 1 ? 's' : ''} sent successfully. ${result.failed} failed: ${errorMessages}`,
              type: 'warning',
            });
          } catch (error) {
            logger.error('Failed to show partial success alert', error, 'OverdueAlerts');
            throw error;
          }
        }
        
        // Clear selection after successful send
        setSelectedInvoices(new Set());
      } else {
        const errorMsg = result.results?.[0]?.error || 'Failed to send reminders';
        toast.error(`Failed to send reminders: ${errorMsg}`);
        logger.error('Failed to send bulk reminders', { result }, 'OverdueAlerts');
      }
    } catch (error) {
      logger.error('Error sending bulk reminders', error, 'OverdueAlerts');
      toast.error('Failed to send reminders. Please try again.');
      throw error;
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = ['Invoice Number', 'Customer', 'Email', 'Phone', 'Due Date', 'Days Overdue', 'Balance Due'];
      const rows = filteredAndSortedInvoices.map((inv: any) => [
        inv.invoice_number,
        inv.accounts?.name || 'Unknown',
        inv.accounts?.email || 'N/A',
        inv.accounts?.phone || 'N/A',
        formatDate(inv.due_date),
        inv.daysPastDue.toString(),
        formatCurrency(inv.balanceDue)
      ]);

      const csvContent = [
        'Overdue Invoices Report',
        `Generated: ${new Date().toLocaleDateString()}`,
        `Total Overdue: ${formatCurrency(totalOverdue)}`,
        `Total Invoices: ${filteredAndSortedInvoices.length}`,
        `Critical (90+ days): ${criticalOverdue.length}`,
        '',
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Overdue-Invoices-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.debug('Overdue Invoices CSV exported', {}, 'OverdueAlerts');
      toast.success('Overdue invoices report exported successfully');
    } catch (error) {
      logger.error('Failed to export Overdue Invoices CSV', error, 'OverdueAlerts');
      toast.error('Failed to export report. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <>
        <DialogComponents />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-3 text-gray-600">Loading overdue invoices...</span>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DialogComponents />
        <Card>
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <Text>Failed to load overdue invoices. Please try again.</Text>
            </div>
          </div>
        </Card>
      </>
    );
  }

  if (!overdueInvoices || overdueInvoices.length === 0) {
    return (
      <>
        <DialogComponents />
        <Card>
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <Heading level={2} className="font-semibold text-gray-900 mb-2">
              No Overdue Invoices
            </Heading>
            <Text className="text-gray-600">
              All invoices are up to date. Great job!
            </Text>
          </div>
        </Card>
      </>
    );
  }

  // Filter and sort overdue invoices
  const filteredAndSortedInvoices = useMemo(() => {
    let filtered = [...overdueInvoices];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((inv: any) =>
        inv.invoice_number.toLowerCase().includes(searchLower) ||
        inv.accounts?.name?.toLowerCase().includes(searchLower) ||
        inv.accounts?.email?.toLowerCase().includes(searchLower)
      );
    }

    // Apply overdue filter
    if (overdueFilter !== 'all') {
      filtered = filtered.filter((inv: any) => {
        switch (overdueFilter) {
          case '0-30':
            return inv.daysPastDue >= 0 && inv.daysPastDue <= 30;
          case '31-60':
            return inv.daysPastDue >= 31 && inv.daysPastDue <= 60;
          case '61-90':
            return inv.daysPastDue >= 61 && inv.daysPastDue <= 90;
          case '90+':
            return inv.daysPastDue > 90;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a: any, b: any) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'invoice_number':
          aValue = a.invoice_number.toLowerCase();
          bValue = b.invoice_number.toLowerCase();
          break;
        case 'customerName':
          aValue = (a.accounts?.name || '').toLowerCase();
          bValue = (b.accounts?.name || '').toLowerCase();
          break;
        case 'balanceDue':
          aValue = a.balanceDue;
          bValue = b.balanceDue;
          break;
        case 'daysPastDue':
          aValue = a.daysPastDue;
          bValue = b.daysPastDue;
          break;
        case 'due_date':
          aValue = new Date(a.due_date).getTime();
          bValue = new Date(b.due_date).getTime();
          break;
        default:
          return 0;
      }

      if (aValue === bValue) return 0;
      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [overdueInvoices, searchTerm, overdueFilter, sortField, sortDirection]);

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

  const totalOverdue = filteredAndSortedInvoices.reduce((sum: number, inv: any) => sum + inv.balanceDue, 0);
  const criticalOverdue = filteredAndSortedInvoices.filter((inv: any) => inv.daysPastDue > 90);

  return (
    <>
      <DialogComponents />
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} className="font-bold text-gray-900">
            Overdue Account Alerts
          </Heading>
          <Text className="text-gray-600 mt-1">
            Manage and send reminders for overdue invoices
          </Text>
        </div>
        <div className="flex space-x-2">
          {selectedInvoices.size > 0 && (
            <>
              <Button variant="outline" onClick={clearSelection}>
                Clear Selection ({selectedInvoices.size})
              </Button>
              <Button variant="primary" icon={Send} onClick={handleSendBulkReminders}>
                Send Bulk Reminders
              </Button>
            </>
          )}
          <Button variant="outline" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-red-700 font-medium text-sm">Total Overdue</Text>
                <Heading level={2} className="text-red-900 font-bold mt-1">
                  {formatCurrency(totalOverdue)}
                </Heading>
                <Text className="text-red-600 text-xs mt-1">
                  {overdueInvoices.length} invoice{overdueInvoices.length !== 1 ? 's' : ''}
                </Text>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-orange-700 font-medium text-sm">Critical (90+ days)</Text>
                <Heading level={2} className="text-orange-900 font-bold mt-1">
                  {criticalOverdue.length}
                </Heading>
                <Text className="text-orange-600 text-xs mt-1">
                  Require immediate attention
                </Text>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-yellow-700 font-medium text-sm">Avg Days Overdue</Text>
                <Heading level={2} className="text-yellow-900 font-bold mt-1">
                  {Math.round(
                    overdueInvoices.reduce((sum: number, inv: any) => sum + inv.daysPastDue, 0) /
                    overdueInvoices.length
                  )}
                </Heading>
                <Text className="text-yellow-600 text-xs mt-1">
                  Days past due date
                </Text>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Overdue Invoices List */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="font-semibold">
              Overdue Invoices
            </Heading>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={Filter}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide Filters' : 'Filters'}
              </Button>
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
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
                placeholder="Search invoices, customers..."
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
                  {/* Overdue Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Days Overdue
                    </label>
                    <select
                      value={overdueFilter}
                      onChange={(e) => setOverdueFilter(e.target.value as OverdueFilter)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Overdue</option>
                      <option value="0-30">0-30 Days</option>
                      <option value="31-60">31-60 Days</option>
                      <option value="61-90">61-90 Days</option>
                      <option value="90+">90+ Days (Critical)</option>
                    </select>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sort By
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {([
                        { field: 'daysPastDue' as SortField, label: 'Days Overdue' },
                        { field: 'balanceDue' as SortField, label: 'Balance' },
                        { field: 'customerName' as SortField, label: 'Customer' },
                        { field: 'invoice_number' as SortField, label: 'Invoice #' },
                        { field: 'due_date' as SortField, label: 'Due Date' },
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

                {/* Quick Select Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Select
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectByFilter('90+')}
                    >
                      Select Critical (90+)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectByFilter('61-90')}
                    >
                      Select 61-90 Days
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => selectByFilter('31-60')}
                    >
                      Select 31-60 Days
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          {filteredAndSortedInvoices.length !== overdueInvoices.length && (
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredAndSortedInvoices.length} of {overdueInvoices.length} overdue invoices
            </div>
          )}

          <div className="space-y-3">
            {filteredAndSortedInvoices.map((invoice: any) => (
              <div
                key={invoice.id}
                className={`border rounded-lg p-4 hover:border-purple-300 transition-colors ${
                  selectedInvoices.has(invoice.id) ? 'border-purple-500 bg-purple-50' : ''
                } ${
                  invoice.daysPastDue > 90 ? 'border-red-300 bg-red-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedInvoices.has(invoice.id)}
                      onChange={() => toggleInvoiceSelection(invoice.id)}
                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Heading level={4} className="font-semibold">
                          {invoice.invoice_number}
                        </Heading>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          invoice.daysPastDue > 90
                            ? 'bg-red-100 text-red-800'
                            : invoice.daysPastDue > 60
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.daysPastDue} days overdue
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="font-medium">{invoice.accounts?.name || 'Unknown Customer'}</span>
                          {invoice.accounts?.email && (
                            <span className="text-gray-600 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {invoice.accounts.email}
                            </span>
                          )}
                          {invoice.accounts?.phone && (
                            <span className="text-gray-600 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {invoice.accounts.phone}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Due: {formatDate(invoice.due_date)}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            Balance: {formatCurrency(invoice.balanceDue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Send}
                      onClick={() => handleSendReminder(invoice.id)}
                    >
                      Send Reminder
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={FileText}
                      onClick={() => {
                        // TODO: Open invoice details
                        logger.debug('View invoice', { invoiceId: invoice.id }, 'OverdueAlerts');
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
    </>
  );
}

