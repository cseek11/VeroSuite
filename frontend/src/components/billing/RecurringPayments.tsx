import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Heading, Text } from '@/components/ui';
import {
  CreditCard,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Info
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

interface RecurringPayment {
  subscriptionId: string;
  customerId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  metadata: {
    invoiceId?: string;
    accountId?: string;
    tenantId?: string;
  };
}

interface CreateRecurringPaymentForm {
  invoice_id: string;
  interval: 'monthly' | 'quarterly' | 'yearly' | 'weekly';
  amount: number;
  start_date?: string;
  end_date?: string;
  payment_count?: number;
}

export default function RecurringPayments() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [_selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [formData, setFormData] = useState<CreateRecurringPaymentForm>({
    invoice_id: '',
    interval: 'monthly',
    amount: 0,
  });

  const queryClient = useQueryClient();

  // Fetch invoices for dropdown
  const { data: invoices = [] } = useQuery({
    queryKey: ['billing', 'invoices', 'admin'],
    queryFn: () => billing.getInvoices(),
  });

  // Mock data for recurring payments - in production, this would come from an API
  const { data: recurringPayments = [], isLoading } = useQuery({
    queryKey: ['billing', 'recurring-payments'],
    queryFn: async () => {
      // TODO: Replace with actual API call when endpoint is available
      // For now, return empty array
      return [];
    },
  });

  const createRecurringPaymentMutation = useMutation({
    mutationFn: async (data: CreateRecurringPaymentForm) => {
      return billing.createRecurringPayment(data.invoice_id, data);
    },
    onSuccess: () => {
      toast.success('Recurring payment created successfully');
      setShowCreateForm(false);
      setFormData({ invoice_id: '', interval: 'monthly', amount: 0 });
      queryClient.invalidateQueries({ queryKey: ['billing', 'recurring-payments'] });
    },
    onError: (error: Error) => {
      logger.error('Failed to create recurring payment', error, 'RecurringPayments');
      toast.error(`Failed to create recurring payment: ${error.message}`);
    },
  });

  const cancelRecurringPaymentMutation = useMutation({
    mutationFn: async ({ subscriptionId, immediately }: { subscriptionId: string; immediately: boolean }) => {
      return billing.cancelRecurringPayment(subscriptionId, immediately);
    },
    onSuccess: () => {
      toast.success('Recurring payment canceled successfully');
      queryClient.invalidateQueries({ queryKey: ['billing', 'recurring-payments'] });
    },
    onError: (error: Error) => {
      logger.error('Failed to cancel recurring payment', error, 'RecurringPayments');
      toast.error(`Failed to cancel recurring payment: ${error.message}`);
    },
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

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
      active: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
      canceled: { color: 'bg-red-100 text-red-800', icon: <X className="w-4 h-4" /> },
      past_due: { color: 'bg-orange-100 text-orange-800', icon: <AlertCircle className="w-4 h-4" /> },
      trialing: { color: 'bg-blue-100 text-blue-800', icon: <Info className="w-4 h-4" /> },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: <Info className="w-4 h-4" /> };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const handleCreate = () => {
    if (!formData.invoice_id || !formData.amount || formData.amount <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    createRecurringPaymentMutation.mutate(formData);
  };

  const handleCancel = (subscriptionId: string, immediately: boolean = false) => {
    if (window.confirm(`Are you sure you want to ${immediately ? 'immediately cancel' : 'cancel at period end'} this recurring payment?`)) {
      cancelRecurringPaymentMutation.mutate({ subscriptionId, immediately });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Loading recurring payments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2}>Recurring Payments</Heading>
          <Text variant="small" className="text-gray-500 mt-1">
            Manage subscription-based recurring payments
          </Text>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setShowCreateForm(true);
            setSelectedInvoiceId('');
          }}
        >
          Create Recurring Payment
        </Button>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Heading level={3}>Create Recurring Payment</Heading>
              <Button
                variant="ghost"
                icon={X}
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ invoice_id: '', interval: 'monthly', amount: 0 });
                }}
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.invoice_id}
                  onChange={(e) => {
                    const invoiceId = e.target.value;
                    setFormData({ ...formData, invoice_id: invoiceId });
                    const invoice = invoices.find((inv: any) => inv.id === invoiceId);
                    if (invoice) {
                      setFormData({ ...formData, invoice_id: invoiceId, amount: Number(invoice.total_amount) });
                    }
                  }}
                >
                  <option value="">Select an invoice</option>
                  {invoices
                    .filter((inv: any) => inv.status !== 'paid')
                    .map((invoice: any) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.invoice_number} - {formatCurrency(Number(invoice.total_amount))}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Interval
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.interval}
                  onChange={(e) => setFormData({ ...formData, interval: e.target.value as any })}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount per Payment
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.5"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  onClick={handleCreate}
                  disabled={createRecurringPaymentMutation.isPending}
                  icon={createRecurringPaymentMutation.isPending ? Loader2 : Plus}
                >
                  {createRecurringPaymentMutation.isPending ? 'Creating...' : 'Create Recurring Payment'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({ invoice_id: '', interval: 'monthly', amount: 0 });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recurring Payments List */}
      {recurringPayments.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Heading level={3} className="text-gray-500 mb-2">
              No Recurring Payments
            </Heading>
            <Text variant="small" className="text-gray-400 mb-6">
              Create your first recurring payment to get started
            </Text>
            <Button variant="primary" icon={Plus} onClick={() => setShowCreateForm(true)}>
              Create Recurring Payment
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {recurringPayments.map((payment: RecurringPayment) => (
            <Card key={payment.subscriptionId}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <Heading level={4}>Subscription {payment.subscriptionId.slice(0, 8)}...</Heading>
                      <Text variant="small" className="text-gray-500">
                        Invoice: {payment.metadata.invoiceId || 'N/A'}
                      </Text>
                    </div>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Text variant="small" className="text-gray-500">
                      Current Period Start
                    </Text>
                    <Text className="font-medium">{formatDate(payment.currentPeriodStart)}</Text>
                  </div>
                  <div>
                    <Text variant="small" className="text-gray-500">
                      Current Period End
                    </Text>
                    <Text className="font-medium">{formatDate(payment.currentPeriodEnd)}</Text>
                  </div>
                  <div>
                    <Text variant="small" className="text-gray-500">
                      Status
                    </Text>
                    <Text className="font-medium">{payment.status}</Text>
                  </div>
                  {payment.canceledAt && (
                    <div>
                      <Text variant="small" className="text-gray-500">
                        Canceled At
                      </Text>
                      <Text className="font-medium">{formatDate(payment.canceledAt)}</Text>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {payment.cancelAtPeriodEnd && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                        Will cancel at period end
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {payment.status === 'active' && !payment.cancelAtPeriodEnd && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={X}
                          onClick={() => handleCancel(payment.subscriptionId, false)}
                        >
                          Cancel at Period End
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleCancel(payment.subscriptionId, true)}
                        >
                          Cancel Immediately
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

