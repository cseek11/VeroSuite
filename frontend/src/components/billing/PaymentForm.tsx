import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loadStripe, PaymentIntent, type StripeCardElementChangeEvent } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui';
import {
  CreditCard,
  Shield,
  Lock,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Info,
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { Invoice, PaymentMethod } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import PaymentMethodSelector from './PaymentMethodSelector';
import PaymentConfirmation from './PaymentConfirmation';

interface PaymentFormProps {
  invoice: Invoice;
  paymentMethods: PaymentMethod[];
  onSuccess: () => void;
  onCancel: () => void;
}

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Inner component that uses Stripe hooks
function PaymentFormInner({ 
  invoice, 
  paymentMethods: _paymentMethods, 
  onSuccess, 
  onCancel,
  clientSecret 
}: PaymentFormProps & { clientSecret: string | null }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [useNewCard, setUseNewCard] = useState(false);
  const [cardError, setCardError] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [showRetry, setShowRetry] = useState(false);

  const queryClient = useQueryClient();
  const lastErrorMessage = lastError?.message ?? '';

  // Process Payment
  const processPaymentMutation = useMutation({
    mutationFn: async () => {
      if (useNewCard && stripe && elements && clientSecret) {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card element not found');
        }

        // Confirm payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: invoice.accounts?.name || '',
              email: invoice.accounts?.email || '',
            },
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        // Store payment intent for confirmation screen
        setPaymentIntent(paymentIntent);
        return paymentIntent;
      } else if (selectedPaymentMethod) {
        // Process with existing payment method
        return billing.processPayment(invoice.id, {
          invoice_id: invoice.id,
          payment_method_id: selectedPaymentMethod.id,
          amount: Number(invoice.total_amount),
          payment_date: new Date().toISOString(),
          notes: 'Online payment'
        });
      } else {
        throw new Error('No payment method selected');
      }
    },
    onSuccess: async (result) => {
      // If Stripe payment, verify status and show success
      if (useNewCard && result && typeof result === 'object' && 'id' in result) {
        const intent = result as PaymentIntent;
        setPaymentIntent(intent);
        
        // Verify payment status from Stripe
        try {
          const status = await billing.getStripePaymentStatus(intent.id);
          logger.debug('Payment status verified', { status: status.status, id: intent.id }, 'PaymentForm');
        } catch (error) {
          logger.warn('Could not verify payment status', error as Record<string, any> | undefined, 'PaymentForm');
          // Continue anyway - payment was confirmed by Stripe
        }
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['billing'] });
        setPaymentStep('success');
      } else {
        // Non-Stripe payment - show success immediately
        setPaymentStep('success');
        queryClient.invalidateQueries({ queryKey: ['billing'] });
      }
      
      // Auto-close after showing success for a bit (user can close manually)
      // Removed auto-close to let user review confirmation
    },
      onError: (error: unknown) => {
        logger.error('Payment failed', error, 'PaymentForm');
        const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
        setPaymentError(errorMessage);
        setLastError(error instanceof Error ? error : new Error(errorMessage));
        const newRetryCount = retryCount + 1;
        setRetryCount(newRetryCount);
        setShowRetry(newRetryCount < 3); // Allow up to 3 retries
        setPaymentStep('details');
        setIsProcessing(false);
        
        // Show toast notification
        toast.error(errorMessage);
      }
  });

  const handlePaymentMethodSelect = (method: PaymentMethod | 'new') => {
    if (method === 'new') {
      setUseNewCard(true);
      setSelectedPaymentMethod(null);
      setPaymentStep('details');
    } else {
      setUseNewCard(false);
      setSelectedPaymentMethod(method);
      setPaymentStep('details');
    }
  };

  const handleCardElementChange = (event: StripeCardElementChangeEvent) => {
    if (event.error) {
      setCardError(event.error.message || '');
      setPaymentError(''); // Clear payment error when user fixes card
    } else {
      setCardError('');
      setPaymentError(''); // Clear payment error when card is valid
    }
  };

    const handleRetryPayment = async () => {
      setPaymentError('');
      setLastError(null);
      setShowRetry(false);
      setPaymentStep('processing');
      setIsProcessing(true);

      try {
        // Reset card element if using new card
        if (useNewCard && elements) {
          const cardElement = elements.getElement(CardElement);
          if (cardElement) {
            cardElement.clear();
          }
        }

        // Wait a moment before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Retry the payment
        await processPaymentMutation.mutateAsync();
      } catch (error) {
        // Error is handled by mutation's onError
        logger.error('Retry payment failed', error, 'PaymentForm');
      }
    };

  const handleSubmitPayment = async () => {
    if (useNewCard && !clientSecret) {
      setPaymentError('Payment form is not ready. Please wait.');
      return;
    }

    // Validate card if using new card
    if (useNewCard && cardError) {
      setPaymentError('Please fix card errors before submitting.');
      return;
    }

    // Reset error states
    setPaymentError('');
    setCardError('');
    setLastError(null);
    setShowRetry(false);
    setRetryCount(0);
    setPaymentStep('processing');
    setIsProcessing(true);

    try {
      await processPaymentMutation.mutateAsync();
    } catch (error) {
      // Error is handled by mutation's onError
      logger.error('Payment submission failed', error, 'PaymentForm');
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const renderPaymentMethodSelection = () => (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Heading level={3} className="font-semibold">
            Select Payment Method
          </Heading>
          <div className="flex items-center text-green-600 text-sm">
            <Shield className="w-4 h-4 mr-1" />
            Secure
          </div>
        </div>

        {/* Use PaymentMethodSelector component */}
        <PaymentMethodSelector
          accountId={invoice.account_id}
          {...(selectedPaymentMethod?.id ? { value: selectedPaymentMethod.id } : {})}
          onChange={(method) => {
            if (method === 'new') {
              handlePaymentMethodSelect('new');
            } else if (method) {
              handlePaymentMethodSelect(method);
            }
          }}
          onAddNew={() => handlePaymentMethodSelect('new')}
          showAddNew={true}
        />

        {/* Invoice Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"> 
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount:</span>        
            <span className="text-lg font-bold text-gray-900">
              ${Number(invoice.total_amount).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={onCancel} icon={ArrowLeft}>        
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (selectedPaymentMethod || useNewCard) {
                setPaymentStep('details');
              }
            }}
            disabled={!selectedPaymentMethod && !useNewCard}
            icon={CreditCard}
          >
            Continue
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      {/* Invoice Summary */}
      <Card className="bg-purple-50 border-purple-200">
        <div className="p-6">
          <Heading level={4} className="font-semibold mb-4 text-purple-800">
            Payment Summary
          </Heading>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Invoice:</span>
              <span className="font-medium">{invoice.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Due Date:</span>
              <span className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-purple-800 border-t pt-3">
              <span>Total Amount:</span>
              <span>${Number(invoice.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Form */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="font-semibold">
              Payment Details
            </Heading>
            <div className="flex items-center text-green-600 text-sm">
              <Shield className="w-4 h-4 mr-1" />
              Secure Payment
            </div>
          </div>

          {paymentError && (
            <div className="mb-6">
              <ErrorMessage 
                message={paymentError} 
                type="error"
                {...(retryCount < 3 ? {
                  actionable: {
                    label: 'Retry Payment',
                    onClick: handleRetryPayment
                  }
                } : {})}
              />
            </div>
          )}
          {paymentError && false && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 mb-1">{paymentError}</p>
                  {lastError && (
                    <p className="text-xs text-red-600 mb-3">
                      {lastErrorMessage.includes('card') 
                        ? 'Please check your card details and try again.'
                        : lastErrorMessage.includes('network')
                        ? 'Network error. Please check your connection and try again.'
                        : 'An error occurred while processing your payment.'}
                    </p>
                  )}
                  {showRetry && retryCount < 3 && (
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRetryPayment}
                        icon={RefreshCw}
                        className="text-red-700 border-red-300 hover:bg-red-100"
                      >
                        Retry Payment
                      </Button>
                      <Text variant="small" className="text-red-600">
                        Attempt {retryCount} of 3
                      </Text>
                    </div>
                  )}
                  {retryCount >= 3 && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-start">
                        <Info className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-yellow-800 mb-1">
                            Maximum retry attempts reached
                          </p>
                          <p className="text-xs text-yellow-700">
                            Please contact support or try again later. Your card has not been charged.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {useNewCard ? (
            <div className="space-y-4">
              {!clientSecret ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="md" text="Loading secure payment form..." />
                </div>
              ) : (
                <>
                  {/* Real Stripe Card Element */}
                  <div className="border border-gray-300 rounded-lg p-4 bg-white">
                    <div className="text-sm text-gray-600 mb-2">Card Information</div>
                    <div className="py-2">
                      <CardElement
                        options={cardElementOptions}
                        onChange={handleCardElementChange}
                      />
                    </div>
                    {cardError && (
                      <div className="mt-2">
                        <ErrorMessage message={cardError} type="error" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Lock className="w-4 h-4 mr-2" />
                    Your payment information is encrypted and secure
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">
                      {selectedPaymentMethod?.payment_name || 
                       `${selectedPaymentMethod?.card_type} ending in ${selectedPaymentMethod?.card_last4}`}
                    </div>
                    <div className="text-sm text-gray-600">
                      Saved payment method
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => setPaymentStep('method')}
              icon={ArrowLeft}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitPayment}
              disabled={isProcessing || (useNewCard && (!stripe || !elements || !clientSecret || !!cardError))}
              icon={CreditCard}
              className="px-8"
            >
              {isProcessing ? 'Processing...' : `Pay $${Number(invoice.total_amount).toFixed(2)}`}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderProcessing = () => (
    <Card>
      <div className="p-4 md:p-12 text-center">
        <div className="relative inline-block mb-6">
          <LoadingSpinner size="xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        <Heading level={3} className="font-semibold mb-2 text-gray-900">
          Processing Payment
        </Heading>
        <Text variant="body" className="text-gray-600 mb-4">
          Please wait while we securely process your payment.
        </Text>
        <Text variant="small" className="text-gray-500 mb-6">
          Do not close this window or refresh the page.
        </Text>
        <div className="flex items-center justify-center gap-2 text-sm text-purple-600 mt-4">
          <Lock className="w-4 h-4" />
          <span>Your payment is being secured...</span>
        </div>
        {retryCount > 0 && (
          <div className="mt-4 text-xs text-gray-500">
            Retry attempt {retryCount}
          </div>
        )}
      </div>
    </Card>
  );

  const handleDownloadReceipt = () => {
    // Generate receipt data
    const receiptData = {
      invoiceNumber: invoice.invoice_number,
      transactionId: paymentIntent?.id || 'N/A',
      amount: Number(invoice.total_amount).toFixed(2),
      date: new Date().toLocaleDateString(),
      customer: invoice.accounts?.name || 'N/A',
    };
    
    // Create receipt text
    const receiptText = `
PAYMENT RECEIPT
================

Invoice Number: ${receiptData.invoiceNumber}
Transaction ID: ${receiptData.transactionId}
Amount Paid: $${receiptData.amount}
Payment Date: ${receiptData.date}
Customer: ${receiptData.customer}

Thank you for your payment!
    `.trim();
    
    // Create and download file
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt-${invoice.invoice_number}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    logger.debug('Receipt downloaded', { invoiceNumber: invoice.invoice_number }, 'PaymentForm');
    toast.success('Receipt downloaded');
  };

  // renderSuccess removed - now using PaymentConfirmation component

  return (
    <div className="max-w-2xl mx-auto">
      {paymentStep === 'method' && renderPaymentMethodSelection()}
      {paymentStep === 'details' && renderPaymentDetails()}
      {paymentStep === 'processing' && renderProcessing()}
      {paymentStep === 'success' && (
        <PaymentConfirmation
          invoice={invoice}
          paymentIntent={paymentIntent}
          paymentMethod={selectedPaymentMethod}
          onDownloadReceipt={handleDownloadReceipt}
          onClose={onSuccess}
        />
      )}
    </div>
  );
}

// Main component with Stripe Elements provider
export default function PaymentForm({ invoice, paymentMethods, onSuccess, onCancel }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingIntent, setIsLoadingIntent] = useState(false);
  const [error, setError] = useState<string>('');

  // Create payment intent when component mounts or when needed
  useEffect(() => {
    const createIntent = async () => {
      setIsLoadingIntent(true);
      setError('');
      try {
        const data = await billing.createStripePaymentIntent(invoice.id);
        setClientSecret(data.clientSecret);
        logger.debug('Payment intent created', { invoiceId: invoice.id }, 'PaymentForm');
      } catch (err) {
        logger.error('Failed to create payment intent', err, 'PaymentForm');
        setError('Failed to initialize payment. Please try again.');
      } finally {
        setIsLoadingIntent(false);
      }
    };

    // Only create intent if Stripe key is configured
    if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY !== 'pk_test_your_stripe_publishable_key_here') {
      createIntent();
    } else {
      setError('Stripe is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.');
    }
  }, [invoice.id]);

  if (error && !clientSecret) {
    return (
      <Card>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={onCancel} icon={ArrowLeft}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (!clientSecret && isLoadingIntent) {
    return (
      <Card>
        <div className="p-4 md:p-12 text-center">
          <LoadingSpinner size="lg" />
          <Heading level={3} className="font-semibold mb-2 mt-4">
            Initializing Payment
          </Heading>
          <Text variant="small" className="text-gray-600">
            Please wait while we set up secure payment processing...
          </Text>
        </div>
      </Card>
    );
  }

  const elementsOptions = clientSecret ? { clientSecret } : undefined;

  return (
    <Elements stripe={stripePromise} {...(elementsOptions !== undefined ? { options: elementsOptions } : {})}>
      <PaymentFormInner
        invoice={invoice}
        paymentMethods={paymentMethods}
        onSuccess={onSuccess}
        onCancel={onCancel}
        clientSecret={clientSecret}
      />
    </Elements>
  );
}
