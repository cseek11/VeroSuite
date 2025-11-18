/**
 * PaymentForm Component Tests
 * 
 * Tests for PaymentForm component including:
 * - Component rendering
 * - Payment method selection
 * - Stripe Elements integration
 * - Payment processing
 * - Error handling and retry
 * - Success confirmation
 * 
 * Regression Prevention: Payment processing errors
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaymentForm from '../PaymentForm';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import '@testing-library/jest-dom';

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({
    confirmCardPayment: vi.fn(),
    elements: vi.fn(() => ({
      create: vi.fn(),
      getElement: vi.fn(),
    })),
  })),
}));

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardElement: () => <div data-testid="card-element">Card Element</div>,
  useStripe: () => ({
    confirmCardPayment: vi.fn(),
    elements: vi.fn(() => ({
      getElement: vi.fn(() => ({
        clear: vi.fn(),
      })),
    })),
  }),
  useElements: () => ({
    getElement: vi.fn(() => ({
      clear: vi.fn(),
    })),
  }),
  CardElementChangeEvent: {},
}));

// Mock dependencies
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    createStripePaymentIntent: vi.fn(),
    processPayment: vi.fn(),
  },
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('@/utils/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const mockBilling = billing as { createStripePaymentIntent: ReturnType<typeof vi.fn>; processPayment: ReturnType<typeof vi.fn> };
const mockLogger = logger as { error: ReturnType<typeof vi.fn>; debug: ReturnType<typeof vi.fn> };
const mockToast = toast as { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

describe('PaymentForm', () => {
  let queryClient: QueryClient;

  const mockInvoice = {
    id: 'inv-1',
    invoice_number: 'INV-001',
    total_amount: '1000.00',
    accounts: {
      id: 'acc-1',
      name: 'Test Customer',
      email: 'test@example.com',
    },
    status: 'sent',
    issue_date: '2025-01-01',
    due_date: '2025-01-31',
  };

  const mockPaymentMethods = [
    {
      id: 'pm-1',
      payment_type: 'credit_card' as const,
      payment_name: 'Visa ending in 1234',
      card_type: 'Visa',
      card_last4: '1234',
      card_expiry: '12/25',
      is_default: true,
    },
    {
      id: 'pm-2',
      payment_type: 'ach' as const,
      payment_name: 'Checking Account',
      is_default: false,
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
    
    // Default mock implementations
    mockBilling.createStripePaymentIntent.mockResolvedValue({
      clientSecret: 'pi_test_123',
    });
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      invoice: mockInvoice,
      paymentMethods: mockPaymentMethods,
      onSuccess: vi.fn(),
      onCancel: vi.fn(),
      ...props,
    };

    return render(
      <QueryClientProvider client={queryClient}>
        <PaymentForm {...defaultProps} />
      </QueryClientProvider>
    );
  };

  describe('Component Rendering', () => {
    it('should render payment method selection initially', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
      });
    });

    it('should display payment methods', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/visa.*ending.*1234/i)).toBeInTheDocument();
      });
    });

    it('should show loading state when creating payment intent', () => {
      mockBilling.createStripePaymentIntent.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderComponent();

      // Should show loading or payment method selection
      expect(screen.queryByText(/loading/i)).toBeInTheDocument() || 
        expect(screen.queryByText(/select.*payment.*method/i)).toBeInTheDocument();
    });

    it('should handle payment intent creation error', async () => {
      mockBilling.createStripePaymentIntent.mockRejectedValue(new Error('API Error'));

      renderComponent();

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Failed to create payment intent',
          expect.any(Error),
          'PaymentForm'
        );
      });
    });
  });

  describe('Payment Method Selection', () => {
    it('should allow selecting a saved payment method', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/visa.*ending.*1234/i)).toBeInTheDocument();
      });

      const visaMethod = screen.getByText(/visa.*ending.*1234/i);
      fireEvent.click(visaMethod);

      // Should move to details step
      await waitFor(() => {
        expect(screen.getByText(/payment.*details/i)).toBeInTheDocument();
      });
    });

    it('should allow selecting new card option', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/add.*new.*card/i)).toBeInTheDocument();
      });

      const newCardButton = screen.getByText(/add.*new.*card/i);
      fireEvent.click(newCardButton);

      // Should show card input
      await waitFor(() => {
        expect(screen.getByTestId('card-element')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error when payment fails', async () => {
      mockBilling.processPayment.mockRejectedValue(new Error('Payment failed'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
      });

      // Select payment method and try to process
      const visaMethod = screen.getByText(/visa.*ending.*1234/i);
      fireEvent.click(visaMethod);

      await waitFor(() => {
        expect(screen.getByText(/payment.*details/i)).toBeInTheDocument();
      });

      // Try to process payment
      const payButton = screen.getByText(/pay.*now/i);
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Payment failed',
          expect.any(Error),
          'PaymentForm'
        );
      });
    });

    it('should show retry button after payment failure', async () => {
      mockBilling.processPayment.mockRejectedValue(new Error('Payment failed'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
      });

      // Select payment method
      const visaMethod = screen.getByText(/visa.*ending.*1234/i);
      fireEvent.click(visaMethod);

      await waitFor(() => {
        expect(screen.getByText(/payment.*details/i)).toBeInTheDocument();
      });

      // Process payment (will fail)
      const payButton = screen.getByText(/pay.*now/i);
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(screen.getByText(/retry/i)).toBeInTheDocument();
      });
    });

    it('should limit retry attempts to 3', async () => {
      mockBilling.processPayment.mockRejectedValue(new Error('Payment failed'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
      });

      // Select payment method
      const visaMethod = screen.getByText(/visa.*ending.*1234/i);
      fireEvent.click(visaMethod);

      await waitFor(() => {
        expect(screen.getByText(/payment.*details/i)).toBeInTheDocument();
      });

      // Try to process payment multiple times
      const payButton = screen.getByText(/pay.*now/i);
      
      for (let i = 0; i < 4; i++) {
        fireEvent.click(payButton);
        await waitFor(() => {
          if (i < 3) {
            expect(screen.getByText(/retry/i)).toBeInTheDocument();
          }
        });
      }

      // After 3 retries, retry button should not appear
      await waitFor(() => {
        expect(screen.queryByText(/retry/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Payment Processing', () => {
    it('should process payment successfully with saved method', async () => {
      mockBilling.processPayment.mockResolvedValue({
        success: true,
        payment_id: 'pay-1',
      });

      const onSuccess = vi.fn();
      renderComponent({ onSuccess });

      await waitFor(() => {
        expect(screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
      });

      // Select payment method
      const visaMethod = screen.getByText(/visa.*ending.*1234/i);
      fireEvent.click(visaMethod);

      await waitFor(() => {
        expect(screen.getByText(/payment.*details/i)).toBeInTheDocument();
      });

      // Process payment
      const payButton = screen.getByText(/pay.*now/i);
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockBilling.processPayment).toHaveBeenCalled();
      });

      // Should show success screen
      await waitFor(() => {
        expect(screen.getByText(/payment.*successful/i)).toBeInTheDocument();
      });

      expect(onSuccess).toHaveBeenCalled();
    });

    it('should call onCancel when cancel button clicked', async () => {
      const onCancel = vi.fn();
      renderComponent({ onCancel });

      await waitFor(() => {
        expect(screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
      });

      const cancelButton = screen.getByText(/cancel/i);
      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalled();
    });
  });

  describe('Success Confirmation', () => {
    it('should display success screen after successful payment', async () => {
      mockBilling.processPayment.mockResolvedValue({
        success: true,
        payment_id: 'pay-1',
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
      });

      // Select payment method
      const visaMethod = screen.getByText(/visa.*ending.*1234/i);
      fireEvent.click(visaMethod);

      await waitFor(() => {
        expect(screen.getByText(/payment.*details/i)).toBeInTheDocument();
      });

      // Process payment
      const payButton = screen.getByText(/pay.*now/i);
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(screen.getByText(/payment.*successful/i)).toBeInTheDocument();
      });

      // Should show payment details
      expect(screen.getByText(/invoice.*number/i)).toBeInTheDocument();
      expect(screen.getByText('INV-001')).toBeInTheDocument();
    });
  });

  describe('Regression Prevention', () => {
    it('should handle undefined payment methods gracefully', () => {
      renderComponent({ paymentMethods: [] });

      expect(screen.getByText(/no.*payment.*methods/i)).toBeInTheDocument();
    });

    it('should handle missing invoice data gracefully', () => {
      renderComponent({ invoice: { ...mockInvoice, accounts: null } });

      expect(screen.queryByText(/select.*payment.*method/i)).toBeInTheDocument();
    });
  });

  describe('Error Scenarios', () => {
    it('should handle Stripe Elements initialization failure', async () => {
      // Mock Stripe to fail
      const mockStripe = await import('@stripe/stripe-js');
      vi.mocked(mockStripe.loadStripe).mockResolvedValue(null as any);

      renderComponent();

      await waitFor(() => {
        // Component should handle Stripe initialization failure
        expect(mockLogger.error).toHaveBeenCalled();
      });
    });

    it('should handle payment intent creation timeout', async () => {
      mockBilling.createStripePaymentIntent.mockImplementation(
        () => new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 100);
        })
      );

      renderComponent();

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Failed to create payment intent',
          expect.any(Error),
          'PaymentForm'
        );
      }, { timeout: 2000 });
    });

    it('should handle concurrent payment attempts', async () => {
      let paymentCount = 0;
      mockBilling.processPayment.mockImplementation(async () => {
        paymentCount++;
        await new Promise(resolve => setTimeout(resolve, 100));
        if (paymentCount === 1) {
          throw new Error('Payment failed');
        }
        return { success: true };
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
      });

      const visaMethod = screen.getByText(/visa.*ending.*1234/i);
      fireEvent.click(visaMethod);

      await waitFor(() => {
        expect(screen.getByText(/payment.*details/i)).toBeInTheDocument();
      });

      const payButton = screen.getByText(/pay.*now/i);
      
      // Click multiple times rapidly
      fireEvent.click(payButton);
      fireEvent.click(payButton);
      fireEvent.click(payButton);

      // Should only process once
      await waitFor(() => {
        expect(mockBilling.processPayment).toHaveBeenCalledTimes(1);
      }, { timeout: 2000 });
    });

    it('should handle invalid payment method data', async () => {
      renderComponent({ paymentMethods: [
        { id: null, payment_type: 'credit_card' as const }, // Invalid ID
        { id: 'pm-2', payment_type: null as any }, // Invalid type
      ] });

      // Component should handle invalid payment methods gracefully
      await waitFor(() => {
        expect(screen.queryByText(/select.*payment.*method/i)).toBeInTheDocument();
      });
    });

    it('should handle network disconnection during payment', async () => {
      mockBilling.processPayment.mockRejectedValue(new Error('Network error'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/select.*payment.*method/i)).toBeInTheDocument();
      });

      const visaMethod = screen.getByText(/visa.*ending.*1234/i);
      fireEvent.click(visaMethod);

      await waitFor(() => {
        expect(screen.getByText(/payment.*details/i)).toBeInTheDocument();
      });

      const payButton = screen.getByText(/pay.*now/i);
      fireEvent.click(payButton);

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Payment failed',
          expect.any(Error),
          'PaymentForm'
        );
        expect(screen.getByText(/retry/i)).toBeInTheDocument();
      });
    });
  });
});



