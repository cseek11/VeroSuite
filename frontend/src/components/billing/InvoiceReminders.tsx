/**
 * InvoiceReminders Component
 * 
 * Dedicated UI for managing invoice reminders.
 * Enhanced version with better organization and bulk operations.
 * 
 * Features:
 * - View all reminders
 * - Send individual reminders
 * - Bulk reminder operations
 * - Reminder scheduling
 * - Reminder history
 */

import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Heading, Text } from '@/components/ui';
import {
  Mail,
  Send,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Loader2,
  Clock,
  FileText,
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import type { Invoice } from '@/types/enhanced-types';

interface ReminderHistory {
  id: string;
  invoice_id: string;
  invoice_number: string;
  customer_name: string;
  sent_at: string;
  reminder_type: 'email' | 'sms' | 'letter';
  status: 'sent' | 'failed' | 'pending';
  message?: string;
}

interface InvoiceRemindersProps {
  onReminderSent?: () => void;
}

export default function InvoiceReminders({ onReminderSent }: InvoiceRemindersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'email' | 'sms' | 'letter'>('all');
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [showBulkDialog, setShowBulkDialog] = useState(false);

  const queryClient = useQueryClient();

  // Fetch overdue invoices
  const { data: overdueInvoices = [], isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ['billing', 'overdue-invoices'],
    queryFn: () => billing.getOverdueInvoices(),
    onError: (error: unknown) => {
      logger.error('Failed to fetch overdue invoices', error, 'InvoiceReminders');
      toast.error('Failed to load overdue invoices. Please try again.');
    },
  });

  // Fetch reminder history
  const { data: reminderHistory = [], isLoading: historyLoading } = useQuery<ReminderHistory[]>({
    queryKey: ['billing', 'reminder-history'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/billing/reminder-history');
      // return response.json();
      
      // Mock data for now
      return [
        {
          id: '1',
          invoice_id: 'inv-1',
          invoice_number: 'INV-001',
          customer_name: 'Acme Corporation',
          sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          reminder_type: 'email',
          status: 'sent',
          message: 'Payment reminder for overdue invoice',
        },
      ];
    },
    onError: (error: unknown) => {
      logger.error('Failed to fetch reminder history', error, 'InvoiceReminders');
    },
  });

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    let filtered = overdueInvoices;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice =>
        invoice.invoice_number?.toLowerCase().includes(searchLower) ||
        invoice.accounts?.name?.toLowerCase().includes(searchLower) ||
        invoice.id.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [overdueInvoices, searchTerm]);

  // Filter reminder history
  const filteredHistory = useMemo(() => {
    let filtered = reminderHistory;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(reminder => reminder.reminder_type === filterType);
    }

    return filtered;
  }, [reminderHistory, filterType]);

  const handleSelectInvoice = (invoiceId: string) => {
    const newSelection = new Set(selectedInvoices);
    if (newSelection.has(invoiceId)) {
      newSelection.delete(invoiceId);
    } else {
      newSelection.add(invoiceId);
    }
    setSelectedInvoices(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedInvoices.size === filteredInvoices.length) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(filteredInvoices.map(inv => inv.id)));
    }
  };

  const handleSendReminder = async (invoiceId: string) => {
    try {
      logger.debug('Sending reminder for invoice', { invoiceId }, 'InvoiceReminders');
      
      const result = await billing.sendInvoiceReminder([invoiceId]);
      
      if (result.successful > 0) {
        toast.success('Reminder sent successfully');
        logger.info('Reminder sent successfully', { invoiceId, result }, 'InvoiceReminders');
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['billing', 'reminder-history'] });
        queryClient.invalidateQueries({ queryKey: ['billing', 'overdue-invoices'] });
        
        if (onReminderSent) {
          onReminderSent();
        }
      } else {
        const errorMsg = result.results?.[0]?.error || 'Failed to send reminder';
        toast.error(errorMsg);
        logger.error('Failed to send reminder', { invoiceId, result }, 'InvoiceReminders');
      }
    } catch (error) {
      logger.error('Error sending reminder', error, 'InvoiceReminders');
      toast.error('Failed to send reminder. Please try again.');
    }
  };

  const handleSendBulkReminders = async () => {
    if (selectedInvoices.size === 0) {
      toast.error('Please select at least one invoice');
      return;
    }

    const invoiceIds = Array.from(selectedInvoices);
    
    try {
      logger.debug('Sending bulk reminders', { count: invoiceIds.length }, 'InvoiceReminders');
      
      const result = await billing.sendInvoiceReminder(invoiceIds);
      
      if (result.successful > 0) {
        toast.success(`Reminders sent to ${result.successful} customer${result.successful !== 1 ? 's' : ''}`);
        logger.info('Bulk reminders sent successfully', { count: result.successful, total: result.total }, 'InvoiceReminders');
        
        // Clear selection
        setSelectedInvoices(new Set());
        setShowBulkDialog(false);
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['billing', 'reminder-history'] });
        queryClient.invalidateQueries({ queryKey: ['billing', 'overdue-invoices'] });
        
        if (onReminderSent) {
          onReminderSent();
        }
      } else {
        const errorMsg = result.results?.[0]?.error || 'Failed to send reminders';
        toast.error(`Failed to send reminders: ${errorMsg}`);
        logger.error('Failed to send bulk reminders', { result }, 'InvoiceReminders');
      }
    } catch (error) {
      logger.error('Error sending bulk reminders', error, 'InvoiceReminders');
      toast.error('Failed to send reminders. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = now.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="space-y-6">
      {/* Overdue Invoices Section */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Heading level={3} className="font-semibold flex items-center">
                <Mail className="w-6 h-6 mr-2 text-purple-600" />
                Invoice Reminders
              </Heading>
              <Text variant="small" className="text-gray-600 mt-2">
                Send reminders for overdue invoices
              </Text>
            </div>
            {selectedInvoices.size > 0 && (
              <Button
                variant="primary"
                icon={Send}
                onClick={() => setShowBulkDialog(true)}
              >
                Send Bulk Reminders ({selectedInvoices.size})
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Invoices List */}
          {invoicesLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Loading overdue invoices...</span>
            </div>
          )}

          {!invoicesLoading && filteredInvoices.length === 0 && (
            <Card className="bg-gray-50 border-gray-200">
              <div className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <Text className="text-gray-600 font-medium">
                  No overdue invoices
                </Text>
                <Text variant="small" className="text-gray-500 mt-2">
                  All invoices are up to date!
                </Text>
              </div>
            </Card>
          )}

          {!invoicesLoading && filteredInvoices.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <Text variant="body" className="font-medium">
                  {filteredInvoices.length} overdue invoice{filteredInvoices.length !== 1 ? 's' : ''}
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedInvoices.size === filteredInvoices.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              <div className="space-y-3">
                {filteredInvoices.map((invoice) => {
                  const isSelected = selectedInvoices.has(invoice.id);
                  const daysOverdue = getDaysOverdue(invoice.due_date);
                  
                  return (
                    <Card
                      key={invoice.id}
                      className={`border-2 transition-colors ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectInvoice(invoice.id)}
                              className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Heading level={4} className="font-semibold">
                                  {invoice.invoice_number || `Invoice ${invoice.id.slice(0, 8)}`}
                                </Heading>
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                                  {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                                </span>
                              </div>
                              <Text variant="body" className="text-gray-700 mb-2">
                                {invoice.accounts?.name || 'Unknown Customer'}
                              </Text>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Due: {formatDate(invoice.due_date)}
                                </div>
                                <div className="flex items-center">
                                  <FileText className="w-4 h-4 mr-1" />
                                  Amount: {formatCurrency(invoice.total_amount)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              icon={Send}
                              onClick={() => handleSendReminder(invoice.id)}
                            >
                              Send Reminder
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Reminder History Section */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="font-semibold flex items-center">
              <Clock className="w-6 h-6 mr-2 text-purple-600" />
              Reminder History
            </Heading>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'email' | 'sms' | 'letter')}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All Types</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="letter">Letter</option>
              </select>
            </div>
          </div>

          {historyLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Loading reminder history...</span>
            </div>
          )}

          {!historyLoading && filteredHistory.length === 0 && (
            <Card className="bg-gray-50 border-gray-200">
              <div className="p-6 text-center">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <Text className="text-gray-600 font-medium">
                  No reminder history
                </Text>
                <Text variant="small" className="text-gray-500 mt-2">
                  Reminders you send will appear here
                </Text>
              </div>
            </Card>
          )}

          {!historyLoading && filteredHistory.length > 0 && (
            <div className="space-y-3">
              {filteredHistory.map((reminder) => (
                <Card key={reminder.id} className="border border-gray-200">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Heading level={4} className="font-semibold">
                            {reminder.invoice_number}
                          </Heading>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              reminder.status === 'sent'
                                ? 'bg-green-100 text-green-800'
                                : reminder.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {reminder.status}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                            {reminder.reminder_type}
                          </span>
                        </div>
                        <Text variant="body" className="text-gray-700 mb-2">
                          {reminder.customer_name}
                        </Text>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Sent: {formatDate(reminder.sent_at)}
                          </div>
                          {reminder.message && (
                            <Text variant="small" className="text-gray-500">
                              {reminder.message}
                            </Text>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Bulk Reminder Dialog */}
      {showBulkDialog && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white p-6 max-w-md">
            <Heading level={3} className="font-semibold mb-4">
              Send Bulk Reminders
            </Heading>
            <Text className="mb-4">
              Are you sure you want to send reminders for {selectedInvoices.size} invoice{selectedInvoices.size !== 1 ? 's' : ''}?
            </Text>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowBulkDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSendBulkReminders}
                className="flex-1"
              >
                Send Reminders
              </Button>
            </div>
          </Card>
        </Card>
      )}
    </div>
  );
}


