import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Heading,
  Text,
  Badge,
} from '@/components/ui';
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Shield,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { PaymentMethod } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

interface SavedPaymentMethodsProps {
  accountId: string;
  onSelect?: (method: PaymentMethod) => void;
}

// Form validation schema
const paymentMethodSchema = z.object({
  payment_type: z.enum(['credit_card', 'debit_card', 'ach', 'check', 'cash', 'cod'], {
    required_error: 'Payment type is required',
  }),
  payment_name: z.string().min(1, 'Payment method name is required').optional(),
  account_number: z.string().optional(),
  routing_number: z.string().optional(),
  card_type: z.string().optional(),
  card_last4: z.string().optional(),
  card_expiry: z.string().optional(),
});

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

export default function SavedPaymentMethods({
  accountId,
  onSelect,
}: SavedPaymentMethodsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [_deletingMethod, setDeletingMethod] = useState<PaymentMethod | null>(null);
  const queryClient = useQueryClient();

  // Fetch payment methods
  const {
    data: paymentMethods = [],
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['billing', 'payment-methods', accountId],
    queryFn: () => billing.getPaymentMethods(accountId),
    enabled: !!accountId,
  });

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      payment_type: 'credit_card',
    },
  });

  const paymentType = watch('payment_type');

  // Create payment method mutation
  const createMutation = useMutation({
    mutationFn: (data: PaymentMethodFormData) => {
      return billing.createPaymentMethod({
        account_id: accountId,
        payment_type: data.payment_type,
        payment_name: data.payment_name,
        account_number: data.account_number,
        routing_number: data.routing_number,
        card_type: data.card_type,
        card_last4: data.card_last4,
        card_expiry: data.card_expiry,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods'] });
      toast.success('Payment method added successfully');
      setShowAddDialog(false);
      reset();
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(
        `Failed to create payment method for account ${accountId}. ${errorMessage}. This may be due to invalid payment details, network issues, or Stripe API errors. Please verify the payment information and try again.`,
        error,
        'SavedPaymentMethods'
      );
      toast.error(
        `Failed to add payment method. ${errorMessage}. Please check your payment details and try again.`
      );
    },
  });

  // Delete payment method mutation
  const deleteMutation = useMutation({
    mutationFn: (methodId: string) => billing.deletePaymentMethod(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods'] });
      toast.success('Payment method deleted successfully');
      setDeletingMethod(null);
    },
    onError: (error: unknown, variables: string) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(
        `Failed to delete payment method ${variables} for account ${accountId}. ${errorMessage}. This may be due to the payment method being in use, network issues, or permission errors.`,
        error,
        'SavedPaymentMethods'
      );
      toast.error(
        `Failed to delete payment method. ${errorMessage}. Please ensure the payment method is not in use and try again.`
      );
    },
  });

  const handleAdd = () => {
    setEditingMethod(null);
    reset({
      payment_type: 'credit_card',
    });
    setShowAddDialog(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    reset({
      payment_type: method.payment_type || 'credit_card',
      payment_name: method.payment_name || '',
      account_number: method.account_number || '',
      routing_number: method.routing_number || '',
      card_type: method.card_type || '',
      card_last4: method.card_last4 || '',
      card_expiry: method.card_expiry || '',
    });
    setShowAddDialog(true);
  };

  const handleDelete = (method: PaymentMethod) => {
    if (
      window.confirm(
        `Are you sure you want to delete this payment method? This action cannot be undone.`
      )
    ) {
      deleteMutation.mutate(method.id);
    }
  };

  const onSubmit = async (data: PaymentMethodFormData) => {
    try {
      await createMutation.mutateAsync(data);
    } catch (error) {
      // Error is handled by mutation
    }
  };

  const getPaymentMethodDisplay = (method: PaymentMethod) => {
    if (method.payment_name) {
      return method.payment_name;
    }
    if (method.card_type && method.card_last4) {
      return `${method.card_type} ending in ${method.card_last4}`;
    }
    if (method.payment_type) {
      return method.payment_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return 'Payment Method';
  };

  const getPaymentTypeColor = (type: string): 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (type?.toLowerCase()) {
      case 'credit_card':
      case 'debit_card':
        return 'info';
      case 'ach':
        return 'success';
      case 'check':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin mr-2" />
            <Text variant="small" className="text-gray-500">
              Loading payment methods...
            </Text>
          </div>
        </div>
      </Card>
    );
  }

  if (fetchError) {
    const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
    logger.error(
      `Failed to load payment methods for account ${accountId}. ${errorMessage}. This may be due to network issues, authentication problems, or server errors. Please check your connection and try again.`,
      fetchError,
      'SavedPaymentMethods'
    );
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center p-4 border border-red-200 rounded-lg bg-red-50">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <Text variant="small" className="font-semibold text-red-900">
                Failed to load payment methods
              </Text>
              <Text variant="small" className="text-red-700 mt-1">
                {errorMessage}. Please check your connection and try again.
              </Text>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Heading level={4} className="font-semibold flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                Saved Payment Methods
              </Heading>
              <Text variant="small" className="text-gray-600 mt-1">
                Manage your payment methods for quick checkout
              </Text>
            </div>
            <Button variant="primary" onClick={handleAdd} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Method
            </Button>
          </div>

          {paymentMethods.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <Text variant="body" className="text-gray-600 mb-2">
                No payment methods saved
              </Text>
              <Text variant="small" className="text-gray-500 mb-4">
                Add a payment method to speed up future payments
              </Text>
              <Button variant="primary" onClick={handleAdd} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Text variant="body" className="font-semibold">
                          {getPaymentMethodDisplay(method)}
                        </Text>
                        {method.payment_type && (
                          <Badge variant={getPaymentTypeColor(method.payment_type)}>
                            {method.payment_type
                              .replace('_', ' ')
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        {method.card_expiry && (
                          <Text variant="small" className="text-gray-600">
                            Expires {method.card_expiry}
                          </Text>
                        )}
                        {method.card_last4 && (
                          <Text variant="small" className="text-gray-500 font-mono">
                            •••• {method.card_last4}
                          </Text>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {onSelect && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelect(method)}
                      >
                        Use
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(method)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(method)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center text-green-600 text-sm">
              <Shield className="w-4 h-4 mr-2" />
              <Text variant="small" className="text-green-600">
                Your payment information is securely encrypted and stored
              </Text>
            </div>
          </div>
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Text variant="small" className="font-medium text-gray-700 mb-2 block">
                Payment Type <span className="text-red-500">*</span>
              </Text>
              <Controller
                name="payment_type"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="ach">ACH (Bank Transfer)</option>
                    <option value="check">Check</option>
                    <option value="cash">Cash</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                )}
              />
              {errors.payment_type && (
                <Text variant="small" className="text-red-600 mt-1">
                  {errors.payment_type.message}
                </Text>
              )}
            </div>

            <Controller
              name="payment_name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Payment Method Name"
                  placeholder="e.g., My Business Credit Card"
                  error={errors.payment_name?.message}
                />
              )}
            />

            {(paymentType === 'credit_card' || paymentType === 'debit_card') && (
              <>
                <Controller
                  name="card_type"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Card Type"
                      placeholder="e.g., Visa, Mastercard"
                      error={errors.card_type?.message}
                    />
                  )}
                />

                <Controller
                  name="card_last4"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Last 4 Digits"
                      placeholder="1234"
                      maxLength={4}
                      error={errors.card_last4?.message}
                    />
                  )}
                />

                <Controller
                  name="card_expiry"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Expiry Date"
                      placeholder="MM/YY"
                      error={errors.card_expiry?.message}
                    />
                  )}
                />
              </>
            )}

            {paymentType === 'ach' && (
              <>
                <Controller
                  name="account_number"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Account Number"
                      placeholder="Account number"
                      error={errors.account_number?.message}
                    />
                  )}
                />

                <Controller
                  name="routing_number"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Routing Number"
                      placeholder="Routing number"
                      error={errors.routing_number?.message}
                    />
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  reset();
                  setEditingMethod(null);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingMethod ? (
                  'Update Method'
                ) : (
                  'Add Method'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

