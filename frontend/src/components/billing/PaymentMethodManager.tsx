import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Heading,
  Text,
} from '@/components/ui';
import {
  CreditCard,
  Plus,
  Trash2,
  Loader2,
  Shield,
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { PaymentMethod } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import { trackPaymentMethodAdded, trackPaymentMethodDeleted } from '@/lib/billing-analytics';
import { PaymentMethodSkeleton } from './BillingSkeletons';

interface PaymentMethodManagerProps {
  customerId: string;
  onPaymentMethodSelected?: (paymentMethod: PaymentMethod) => void;
  className?: string;
}

export default function PaymentMethodManager({
  customerId,
  onPaymentMethodSelected,
  className = '',
}: PaymentMethodManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    payment_type: 'credit_card' as PaymentMethod['payment_type'],
    payment_name: '',
    card_type: '',
    card_last4: '',
    card_expiry: '',
    account_number: '',
    routing_number: '',
    is_default: false,
  });

  const queryClient = useQueryClient();

  // Fetch payment methods
  const { data: paymentMethods = [], isLoading, error } = useQuery({
    queryKey: ['billing', 'payment-methods', customerId],
    queryFn: () => billing.getPaymentMethods(customerId),
    enabled: !!customerId,
    onError: (error: unknown) => {
      logger.error('Failed to fetch payment methods', error, 'PaymentMethodManager');
      toast.error('Failed to load payment methods. Please try again.');
    },
  });

  // Create payment method mutation
  const createMutation = useMutation({
    mutationFn: (data: { account_id: string; payment_type: string; payment_name: string; [key: string]: unknown }) => billing.createPaymentMethod({
      account_id: customerId,
      ...data,
    }),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods'] });
      setShowAddModal(false);
      resetForm();
      toast.success('Payment method added successfully');
      logger.info('Payment method created', { customerId }, 'PaymentMethodManager');
      trackPaymentMethodAdded(formData.payment_type, customerId);
    },
    onError: (error: unknown) => {
      logger.error('Failed to create payment method', error, 'PaymentMethodManager');
      toast.error('Failed to add payment method. Please try again.');
    },
  });

  // Delete payment method mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => billing.deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods'] });
      toast.success('Payment method deleted successfully');
      logger.info('Payment method deleted', { customerId }, 'PaymentMethodManager');
    },
    onError: (error: unknown) => {
      logger.error('Failed to delete payment method', error, 'PaymentMethodManager');
      toast.error('Failed to delete payment method. Please try again.');
    },
  });

  const resetForm = () => {
    setFormData({
      payment_type: 'credit_card',
      payment_name: '',
      card_type: '',
      card_last4: '',
      card_expiry: '',
      account_number: '',
      routing_number: '',
      is_default: false,
    });
    setEditingMethod(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form
      if (!formData.payment_name) {
        toast.error('Please enter a payment method name');
        return;
      }

      if (formData.payment_type === 'credit_card' && !formData.card_last4) {
        toast.error('Please enter the last 4 digits of the card');
        return;
      }

      if (formData.payment_type === 'ach' && (!formData.account_number || !formData.routing_number)) {
        toast.error('Please enter account and routing numbers for ACH');
        return;
      }

      await createMutation.mutateAsync(formData);
    } catch (error: unknown) {
      logger.error('Form submission error', error, 'PaymentMethodManager');
    }
  };

  const handleDelete = async (paymentMethod: PaymentMethod) => {
    if (!window.confirm(`Are you sure you want to delete ${paymentMethod.payment_name || 'this payment method'}?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(paymentMethod.id);
      trackPaymentMethodDeleted(paymentMethod.id, customerId);
    } catch (error: unknown) {
      logger.error('Delete error', error, 'PaymentMethodManager');
    }
  };

  const getPaymentTypeIcon = (type: PaymentMethod['payment_type']) => {
    switch (type) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="w-5 h-5" />;
      case 'ach':
        return <Shield className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentTypeLabel = (type: PaymentMethod['payment_type']) => {
    switch (type) {
      case 'credit_card':
        return 'Credit Card';
      case 'debit_card':
        return 'Debit Card';
      case 'ach':
        return 'ACH';
      case 'check':
        return 'Check';
      case 'cash':
        return 'Cash';
      case 'cod':
        return 'COD';
      default:
        return type;
    }
  };

  const formatCardNumber = (last4: string) => {
    if (!last4) return '****';
    return `**** **** **** ${last4}`;
  };

  if (isLoading) {
    return <PaymentMethodSkeleton />;
  }

  if (error) {
    return (
      <Card className={className}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Heading level={4} className="text-red-800 mb-1">
            Error loading payment methods
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
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3}>Payment Methods</Heading>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
            >
              Add Payment Method
            </Button>
          </div>

          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Heading level={4} className="text-gray-600 mb-2">
                No payment methods
              </Heading>
              <Text variant="body" className="text-gray-500 mb-4">
                Add a payment method to make payments faster
              </Text>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
              >
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    method.is_default
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`p-3 rounded-lg ${
                        method.is_default ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        {getPaymentTypeIcon(method.payment_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Heading level={4} className="font-semibold">
                            {method.payment_name || getPaymentTypeLabel(method.payment_type)}
                          </Heading>
                          {method.is_default && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              Default
                            </span>
                          )}
                          {!method.is_active && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="mt-1 space-y-1">
                          <Text variant="small" className="text-gray-600">
                            {getPaymentTypeLabel(method.payment_type)}
                          </Text>
                          {method.card_last4 && (
                            <Text variant="small" className="text-gray-600">
                              {formatCardNumber(method.card_last4)}
                            </Text>
                          )}
                          {method.card_expiry && (
                            <Text variant="small" className="text-gray-600">
                              Expires: {method.card_expiry}
                            </Text>
                          )}
                          {method.account_number && (
                            <Text variant="small" className="text-gray-600">
                              Account: ****{method.account_number.slice(-4)}
                            </Text>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {onPaymentMethodSelected && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPaymentMethodSelected(method)}
                        >
                          Use
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(method)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit Payment Method Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type *
                </label>
                <Select
                  value={formData.payment_type}
                  onChange={(e) => setFormData({ ...formData, payment_type: e.target.value as PaymentMethod['payment_type'] })}
                  options={[
                    { value: 'credit_card', label: 'Credit Card' },
                    { value: 'debit_card', label: 'Debit Card' },
                    { value: 'ach', label: 'ACH' },
                    { value: 'check', label: 'Check' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method Name *
                </label>
                <Input
                  type="text"
                  value={formData.payment_name}
                  onChange={(e) => setFormData({ ...formData, payment_name: e.target.value })}
                  placeholder="e.g., Visa ending in 1234"
                  required
                />
              </div>

              {formData.payment_type === 'credit_card' || formData.payment_type === 'debit_card' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Type
                    </label>
                    <Select
                      value={formData.card_type}
                      onChange={(e) => setFormData({ ...formData, card_type: e.target.value })}
                      options={[
                        { value: 'visa', label: 'Visa' },
                        { value: 'mastercard', label: 'Mastercard' },
                        { value: 'amex', label: 'American Express' },
                        { value: 'discover', label: 'Discover' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last 4 Digits *
                    </label>
                    <Input
                      type="text"
                      value={formData.card_last4}
                      onChange={(e) => setFormData({ ...formData, card_last4: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      placeholder="1234"
                      maxLength={4}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date (MM/YY)
                    </label>
                    <Input
                      type="text"
                      value={formData.card_expiry}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const formatted = value.length >= 2 
                          ? `${value.slice(0, 2)}/${value.slice(2, 4)}`
                          : value;
                        setFormData({ ...formData, card_expiry: formatted });
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                </>
              ) : formData.payment_type === 'ach' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number *
                    </label>
                    <Input
                      type="text"
                      value={formData.account_number}
                      onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                      placeholder="Account number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Routing Number *
                    </label>
                    <Input
                      type="text"
                      value={formData.routing_number}
                      onChange={(e) => setFormData({ ...formData, routing_number: e.target.value.replace(/\D/g, '').slice(0, 9) })}
                      placeholder="Routing number"
                      maxLength={9}
                      required
                    />
                  </div>
                </>
              ) : null}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                  Set as default payment method
                </label>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Payment Method'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

