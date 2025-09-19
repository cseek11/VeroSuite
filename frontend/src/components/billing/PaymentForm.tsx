import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Typography,
  Button,
  Input,
  Alert
} from '@/components/ui/EnhancedUI';
import {
  CreditCard,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Calendar,
  DollarSign,
  User,
  Mail
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { Invoice, PaymentMethod } from '@/types/enhanced-types';

interface PaymentFormProps {
  invoice: Invoice;
  paymentMethods: PaymentMethod[];
  onSuccess: () => void;
  onCancel: () => void;
}

interface StripeElements {
  card: any;
  elements: any;
  stripe: any;
}

export default function PaymentForm({ invoice, paymentMethods, onSuccess, onCancel }: PaymentFormProps) {
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [useNewCard, setUseNewCard] = useState(false);
  const [stripeElements, setStripeElements] = useState<StripeElements | null>(null);
  const [cardError, setCardError] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string>('');
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);

  const queryClient = useQueryClient();

  // Create Stripe Payment Intent
  const createPaymentIntentMutation = useMutation({
    mutationFn: (invoiceId: string) => billing.createStripePaymentIntent(invoiceId),
    onSuccess: (data) => {
      console.log('Payment intent created:', data);
      initializeStripe(data.clientSecret);
    },
    onError: (error) => {
      console.error('Failed to create payment intent:', error);
      setPaymentError('Failed to initialize payment. Please try again.');
    }
  });

  // Process Payment
  const processPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      if (useNewCard && stripeElements) {
        // Process with Stripe
        const { error, paymentIntent } = await stripeElements.stripe.confirmCardPayment(
          paymentData.clientSecret,
          {
            payment_method: {
              card: stripeElements.card,
              billing_details: {
                name: invoice.accounts?.name || '',
                email: invoice.accounts?.email || '',
              },
            }
          }
        );

        if (error) {
          throw new Error(error.message);
        }

        return paymentIntent;
      } else {
        // Process with existing payment method
        return billing.processPayment(invoice.id, {
          invoice_id: invoice.id,
          payment_method_id: selectedPaymentMethod?.id || '',
          amount: Number(invoice.total_amount),
          payment_date: new Date().toISOString(),
          notes: 'Online payment'
        });
      }
    },
    onSuccess: () => {
      setPaymentStep('success');
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      setTimeout(() => {
        onSuccess();
      }, 2000);
    },
    onError: (error: any) => {
      console.error('Payment failed:', error);
      setPaymentError(error.message || 'Payment failed. Please try again.');
      setPaymentStep('details');
    }
  });

  const initializeStripe = async (clientSecret: string) => {
    setIsLoadingStripe(true);
    try {
      // Note: In a real implementation, you would load Stripe.js here
      // For now, we'll simulate the Stripe initialization
      console.log('Initializing Stripe with client secret:', clientSecret);
      
      // Simulated Stripe elements - in real implementation:
      // const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
      // const elements = stripe.elements();
      // const card = elements.create('card');
      
      setStripeElements({
        stripe: { confirmCardPayment: () => Promise.resolve({ paymentIntent: { status: 'succeeded' } }) },
        elements: {},
        card: {}
      });
      
      setPaymentStep('details');
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      setPaymentError('Failed to load payment form. Please try again.');
    } finally {
      setIsLoadingStripe(false);
    }
  };

  const handlePaymentMethodSelect = (method: PaymentMethod | 'new') => {
    if (method === 'new') {
      setUseNewCard(true);
      setSelectedPaymentMethod(null);
      createPaymentIntentMutation.mutate(invoice.id);
    } else {
      setUseNewCard(false);
      setSelectedPaymentMethod(method);
      setPaymentStep('details');
    }
  };

  const handleSubmitPayment = async () => {
    setPaymentError('');
    setPaymentStep('processing');
    
    try {
      if (useNewCard) {
        // Process new card payment
        await processPaymentMutation.mutateAsync({
          clientSecret: 'simulated-client-secret' // In real implementation, this comes from payment intent
        });
      } else {
        // Process with existing payment method
        await processPaymentMutation.mutateAsync({});
      }
    } catch (error) {
      // Error handled in mutation
    }
  };

  const renderPaymentMethodSelection = () => (
    <Card>
      <div className="p-6">
        <Typography variant="h3" className="font-semibold mb-6">
          Select Payment Method
        </Typography>

        <div className="space-y-4">
          {/* Existing Payment Methods */}
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 cursor-pointer transition-colors"
              onClick={() => handlePaymentMethodSelect(method)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium">
                      {method.payment_name || `${method.card_type} ending in ${method.card_last4}`}
                    </div>
                    {method.card_expiry && (
                      <div className="text-sm text-gray-600">
                        Expires {method.card_expiry}
                      </div>
                    )}
                  </div>
                </div>
                {method.is_default && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    Default
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Add New Card Option */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-purple-400 cursor-pointer transition-colors"
            onClick={() => handlePaymentMethodSelect('new')}
          >
            <div className="flex items-center justify-center space-x-3 text-gray-600">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Pay with new card</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={onCancel} icon={ArrowLeft}>
            Cancel
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
          <Typography variant="h4" className="font-semibold mb-4 text-purple-800">
            Payment Summary
          </Typography>
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
            <Typography variant="h3" className="font-semibold">
              Payment Details
            </Typography>
            <div className="flex items-center text-green-600 text-sm">
              <Shield className="w-4 h-4 mr-1" />
              Secure Payment
            </div>
          </div>

          {paymentError && (
            <Alert type="error" className="mb-6">
              {paymentError}
            </Alert>
          )}

          {useNewCard ? (
            <div className="space-y-4">
              {isLoadingStripe ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600 mr-2" />
                  <span>Loading secure payment form...</span>
                </div>
              ) : (
                <>
                  {/* Simulated Stripe Card Element */}
                  <div className="border border-gray-300 rounded-lg p-4 bg-white">
                    <div className="text-sm text-gray-600 mb-2">Card Information</div>
                    <div className="bg-gray-50 p-3 rounded border text-center text-gray-500">
                      [Stripe Card Element would be mounted here]
                      <div className="text-xs mt-1">
                        Secure card input powered by Stripe
                      </div>
                    </div>
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
              disabled={isLoadingStripe || (useNewCard && !stripeElements)}
              icon={CreditCard}
              className="px-8"
            >
              Pay ${Number(invoice.total_amount).toFixed(2)}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderProcessing = () => (
    <Card>
      <div className="p-12 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
        <Typography variant="h3" className="font-semibold mb-2">
          Processing Payment
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Please wait while we process your payment. Do not close this window.
        </Typography>
      </div>
    </Card>
  );

  const renderSuccess = () => (
    <Card>
      <div className="p-12 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <Typography variant="h2" className="font-bold text-green-800 mb-2">
          Payment Successful!
        </Typography>
        <Typography variant="h4" className="text-gray-700 mb-4">
          Your payment of ${Number(invoice.total_amount).toFixed(2)} has been processed
        </Typography>
        <Typography variant="body2" className="text-gray-600 mb-6">
          You will receive a confirmation email shortly. Thank you for your payment!
        </Typography>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left max-w-md mx-auto">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice:</span>
              <span className="font-medium">{invoice.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${Number(invoice.total_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {paymentStep === 'method' && renderPaymentMethodSelection()}
      {paymentStep === 'details' && renderPaymentDetails()}
      {paymentStep === 'processing' && renderProcessing()}
      {paymentStep === 'success' && renderSuccess()}
    </div>
  );
}