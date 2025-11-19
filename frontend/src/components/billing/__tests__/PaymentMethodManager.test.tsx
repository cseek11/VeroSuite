/**
 * PaymentMethodManager Component Tests
 *
 * Tests for the PaymentMethodManager component including:
 * - Component rendering
 * - CRUD operations
 * - Form validation
 * - Error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaymentMethodManager from '../PaymentMethodManager';
import { billing } from '@/lib/enhanced-api';
import '@testing-library/jest-dom';

// Mock the API
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    getPaymentMethods: vi.fn(),
    createPaymentMethod: vi.fn(),
    deletePaymentMethod: vi.fn(),
  },
}));

// Mock toast
vi.mock('@/utils/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('PaymentMethodManager', () => {
  let queryClient: QueryClient;

  const mockPaymentMethods = [
    {
      id: 'pm-1',
      tenant_id: 'tenant-1',
      account_id: 'acc-1',
      payment_type: 'credit_card' as const,
      payment_name: 'Visa ending in 1234',
      card_type: 'visa',
      card_last4: '1234',
      card_expiry: '12/25',
      is_default: true,
      is_active: true,
      created_at: '2025-01-01',
    },
    {
      id: 'pm-2',
      tenant_id: 'tenant-1',
      account_id: 'acc-1',
      payment_type: 'ach' as const,
      payment_name: 'Checking Account',
      account_number: '1234567890',
      routing_number: '987654321',
      is_default: false,
      is_active: true,
      created_at: '2025-01-02',
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
    (billing.getPaymentMethods as any).mockResolvedValue(mockPaymentMethods);
    (billing.createPaymentMethod as any).mockResolvedValue(mockPaymentMethods[0]);
    (billing.deletePaymentMethod as any).mockResolvedValue(undefined);
  });

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <PaymentMethodManager customerId="customer-1" {...props} />
      </QueryClientProvider>
    );
  };

  describe('Initial Render', () => {
    it('should render loading state initially', () => {
      (billing.getPaymentMethods as any).mockImplementation(() => new Promise(() => {}));
      renderComponent();

      expect(screen.getByText('Loading payment methods...')).toBeInTheDocument();
    });

    it('should render payment methods after loading', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Visa ending in 1234')).toBeInTheDocument();
        expect(screen.getByText('Checking Account')).toBeInTheDocument();
      });
    });

    it('should display empty state when no payment methods', async () => {
      (billing.getPaymentMethods as any).mockResolvedValue([]);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('No payment methods')).toBeInTheDocument();
        expect(screen.getByText('Add a payment method to make payments faster')).toBeInTheDocument();
      });
    });
  });

  describe('Add Payment Method', () => {
    it('should open add modal when button clicked', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Add Payment Method')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add Payment Method');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Add Payment Method')).toBeInTheDocument();
        expect(screen.getByLabelText(/payment type/i)).toBeInTheDocument();
      });
    });

    it('should validate required fields', async () => {
      renderComponent();

      await waitFor(() => {
        const addButton = screen.getByText('Add Payment Method');
        fireEvent.click(addButton);
      });

      await waitFor(() => {
        const submitButton = screen.getByText('Save Payment Method');
        fireEvent.click(submitButton);
      });

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/please enter a payment method name/i)).toBeInTheDocument();
      });
    });

    it('should create credit card payment method', async () => {
      renderComponent();

      await waitFor(() => {
        const addButton = screen.getByText('Add Payment Method');
        fireEvent.click(addButton);
      });

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/payment method name/i);
        fireEvent.change(nameInput, { target: { value: 'Mastercard ending in 5678' } });

        const last4Input = screen.getByLabelText(/last 4 digits/i);
        fireEvent.change(last4Input, { target: { value: '5678' } });

        const submitButton = screen.getByText('Save Payment Method');
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(billing.createPaymentMethod).toHaveBeenCalled();
      });
    });

    it('should validate ACH payment method fields', async () => {
      renderComponent();

      await waitFor(() => {
        const addButton = screen.getByText('Add Payment Method');
        fireEvent.click(addButton);
      });

      await waitFor(() => {
        const typeSelect = screen.getByLabelText(/payment type/i);
        fireEvent.change(typeSelect, { target: { value: 'ach' } });

        const submitButton = screen.getByText('Save Payment Method');
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/please enter account and routing numbers/i)).toBeInTheDocument();
      });
    });
  });

  describe('Delete Payment Method', () => {
    it('should confirm before deleting', async () => {
      window.confirm = vi.fn(() => true);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Visa ending in 1234')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      expect(window.confirm).toHaveBeenCalled();
    });

    it('should delete payment method when confirmed', async () => {
      window.confirm = vi.fn(() => true);
      renderComponent();

      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);
      });

      await waitFor(() => {
        expect(billing.deletePaymentMethod).toHaveBeenCalledWith('pm-1');
      });
    });

    it('should not delete when confirmation cancelled', async () => {
      window.confirm = vi.fn(() => false);
      renderComponent();

      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);
      });

      expect(billing.deletePaymentMethod).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should display error when fetch fails', async () => {
      (billing.getPaymentMethods as any).mockRejectedValue(new Error('API Error'));
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Error loading payment methods')).toBeInTheDocument();
        expect(screen.getByText('API Error')).toBeInTheDocument();
      });
    });

    it('should handle create errors', async () => {
      (billing.createPaymentMethod as any).mockRejectedValue(new Error('Create Error'));
      renderComponent();

      await waitFor(() => {
        const addButton = screen.getByText('Add Payment Method');
        fireEvent.click(addButton);
      });

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/payment method name/i);
        fireEvent.change(nameInput, { target: { value: 'Test Card' } });

        const last4Input = screen.getByLabelText(/last 4 digits/i);
        fireEvent.change(last4Input, { target: { value: '1234' } });

        const submitButton = screen.getByText('Save Payment Method');
        fireEvent.click(submitButton);
      });

      // Should show error toast (mocked)
      await waitFor(() => {
        expect(billing.createPaymentMethod).toHaveBeenCalled();
      });
    });
  });

  describe('Payment Method Display', () => {
    it('should show default badge for default payment method', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Default')).toBeInTheDocument();
      });
    });

    it('should format card number correctly', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/**** **** **** 1234/)).toBeInTheDocument();
      });
    });

    it('should call onPaymentMethodSelected when use button clicked', async () => {
      const onPaymentMethodSelected = vi.fn();
      renderComponent({ onPaymentMethodSelected });

      await waitFor(() => {
        const useButtons = screen.getAllByText('Use');
        fireEvent.click(useButtons[0]);
        expect(onPaymentMethodSelected).toHaveBeenCalledWith(mockPaymentMethods[0]);
      });
    });
  });
});





