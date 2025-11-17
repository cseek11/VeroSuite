import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui';
import {
  CreditCard,
  Plus,
  CheckCircle,
  Shield,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { PaymentMethod } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';

interface PaymentMethodSelectorProps {
  accountId?: string;
  value?: string; // Selected payment method ID
  onChange: (paymentMethod: PaymentMethod | 'new' | null) => void;
  onAddNew?: () => void;
  error?: string;
  required?: boolean;
  label?: string;
  showAddNew?: boolean; // Show "Add New Payment Method" option
}

export default function PaymentMethodSelector({
  accountId,
  value,
  onChange,
  onAddNew,
  error,
  required = false,
  label = 'Payment Method',
  showAddNew = true,
}: PaymentMethodSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | undefined>(value);

  // Sync internal state with value prop
  useEffect(() => {
    setSelectedId(value);
  }, [value]);

  // Fetch payment methods for the account
  const {
    data: paymentMethods = [],
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ['billing', 'payment-methods', accountId],
    queryFn: () => billing.getPaymentMethods(accountId),
    enabled: !!accountId,
  });

  const handleSelect = (method: PaymentMethod | 'new') => {
    if (method === 'new') {
      setSelectedId('new');
      onChange('new');
      if (onAddNew) {
        onAddNew();
      }
    } else {
      setSelectedId(method.id);
      onChange(method);
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

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    const type = method.payment_type?.toLowerCase() || '';
    if (type.includes('card')) {
      return <CreditCard className="w-5 h-5" />;
    }
    return <CreditCard className="w-5 h-5" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {label && (
          <Text variant="small" className="font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Text>
        )}
        <div className="flex items-center justify-center py-8 border border-gray-200 rounded-lg bg-gray-50">
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin mr-2" />
          <Text variant="small" className="text-gray-500">
            Loading payment methods...
          </Text>
        </div>
      </div>
    );
  }

  if (fetchError) {
    const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
    logger.error(
      `Failed to load payment methods for account ${accountId} in PaymentMethodSelector. ${errorMessage}. This may be due to network issues, authentication problems, or server errors. Please check your connection and try again.`,
      fetchError,
      'PaymentMethodSelector'
    );
    return (
      <div className="space-y-2">
        {label && (
          <Text variant="small" className="font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Text>
        )}
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
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <Text variant="small" className="font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Text>
      )}

      <div className="space-y-2">
        {/* Existing Payment Methods */}
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedId === method.id
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-sm'
              }`}
              onClick={() => handleSelect(method)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div
                    className={`p-2 rounded-lg ${
                      selectedId === method.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {getPaymentMethodIcon(method)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {getPaymentMethodDisplay(method)}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {method.card_expiry && (
                        <Text variant="small" className="text-gray-600">
                          Expires {method.card_expiry}
                        </Text>
                      )}
                      {method.payment_type && (
                        <Text variant="small" className="text-gray-500">
                          {method.payment_type
                            .replace('_', ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Text>
                      )}
                    </div>
                  </div>
                </div>
                {selectedId === method.id && (
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="border border-gray-200 rounded-lg p-6 text-center bg-gray-50">
            <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <Text variant="small" className="text-gray-500">
              No saved payment methods
            </Text>
          </div>
        )}

        {/* Add New Payment Method Option */}
        {showAddNew && (
          <div
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedId === 'new'
                ? 'border-purple-500 bg-purple-50 shadow-md'
                : 'border-dashed border-gray-300 hover:border-purple-300 hover:bg-purple-50'
            }`}
            onClick={() => handleSelect('new')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    selectedId === 'new'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Add New Payment Method
                  </div>
                  <Text variant="small" className="text-gray-500">
                    Add a credit card or other payment method
                  </Text>
                </div>
              </div>
              {selectedId === 'new' && (
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
              )}
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center justify-center pt-2">
          <div className="flex items-center text-green-600 text-xs">
            <Shield className="w-3 h-3 mr-1" />
            <Text variant="small" className="text-green-600">
              Secure payment processing
            </Text>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Text variant="small" className="text-red-600 mt-1">
          {error}
        </Text>
      )}
    </div>
  );
}

