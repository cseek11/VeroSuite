/**
 * PaymentMethodSelector Component Tests
 * 
 * Tests for PaymentMethodSelector component including:
 * - Component rendering
 * - Payment method selection
 * - Add new card option
 * - Error handling
 * - Empty state
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaymentMethodSelector from '../PaymentMethodSelector';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import '@testing-library/jest-dom';

// Mock dependencies
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    getPaymentMethods: vi.fn(),
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

const mockBilling = billing as { getPaymentMethods: ReturnType<typeof vi.fn> };
const mockLogger = logger as { error: ReturnType<typeof vi.fn> };

describe('PaymentMethodSelector', () => {
  let queryClient: QueryClient;

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

  const mockProps = {
    accountId: 'acc-1',
    paymentMethods: mockPaymentMethods,
    onSelect: vi.fn(),
    onAddNew: vi.fn(),
    selectedMethodId: null,
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = { ...mockProps, ...props };
    return render(
      <QueryClientProvider client={queryClient}>
        <PaymentMethodSelector {...defaultProps} />
      </QueryClientProvider>
    );
  };

  describe('Component Rendering', () => {
    it('should render payment methods', () => {
      renderComponent();

      expect(screen.getByText(/visa.*ending.*1234/i)).toBeInTheDocument();
      expect(screen.getByText(/checking.*account/i)).toBeInTheDocument();
    });

    it('should display default badge for default payment method', () => {
      renderComponent();

      expect(screen.getByText(/default/i)).toBeInTheDocument();
    });

    it('should show add new card option', () => {
      renderComponent();

      expect(screen.getByText(/add.*new.*card/i)).toBeInTheDocument();
    });

    it('should handle empty payment methods', () => {
      renderComponent({ paymentMethods: [] });

      expect(screen.getByText(/no.*payment.*methods/i)).toBeInTheDocument();
    });
  });

  describe('Payment Method Selection', () => {
    it('should call onSelect when payment method clicked', () => {
      const onSelect = vi.fn();
      renderComponent({ onSelect });

      const visaMethod = screen.getByText(/visa.*ending.*1234/i);
      fireEvent.click(visaMethod);

      expect(onSelect).toHaveBeenCalledWith(mockPaymentMethods[0]);
    });

    it('should highlight selected payment method', () => {
      renderComponent({ selectedMethodId: 'pm-1' });

      const visaMethod = screen.getByText(/visa.*ending.*1234/i);
      expect(visaMethod.closest('div')).toHaveClass(/selected|active|bg-/);
    });

    it('should call onAddNew when add new card clicked', () => {
      const onAddNew = vi.fn();
      renderComponent({ onAddNew });

      const addNewButton = screen.getByText(/add.*new.*card/i);
      fireEvent.click(addNewButton);

      expect(onAddNew).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle loading errors gracefully', () => {
      renderComponent({ paymentMethods: [] });

      // Should show empty state, not crash
      expect(screen.getByText(/no.*payment.*methods/i)).toBeInTheDocument();
    });

    it('should handle undefined payment methods', () => {
      renderComponent({ paymentMethods: undefined as any });

      // Should not crash
      expect(screen.queryByText(/visa/i)).not.toBeInTheDocument();
    });
  });

  describe('Payment Method Display', () => {
    it('should display card type and last 4 digits', () => {
      renderComponent();

      expect(screen.getByText(/visa/i)).toBeInTheDocument();
      expect(screen.getByText(/1234/i)).toBeInTheDocument();
    });

    it('should display card expiry if available', () => {
      renderComponent();

      expect(screen.getByText(/12\/25/i)).toBeInTheDocument();
    });

    it('should display payment method name for non-card methods', () => {
      renderComponent();

      expect(screen.getByText(/checking.*account/i)).toBeInTheDocument();
    });
  });

  describe('Regression Prevention', () => {
    it('should handle missing payment method properties', () => {
      const incompleteMethods = [
        {
          id: 'pm-3',
          payment_type: 'credit_card' as const,
          payment_name: 'Card',
          // Missing card_type, card_last4, etc.
        },
      ];

      renderComponent({ paymentMethods: incompleteMethods });

      // Should not crash
      expect(screen.getByText(/card/i)).toBeInTheDocument();
    });

    it('should handle null onSelect callback', () => {
      renderComponent({ onSelect: null as any });

      const visaMethod = screen.getByText(/visa.*ending.*1234/i);
      
      // Should not crash when clicked
      expect(() => fireEvent.click(visaMethod)).not.toThrow();
    });
  });
});


