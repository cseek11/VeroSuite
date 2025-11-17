/**
 * RecurringPayments Component Tests
 * Tests for recurring payment UI flow
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RecurringPayments from '../RecurringPayments';
import { billing } from '@/lib/enhanced-api';
import '@testing-library/jest-dom';

// Mock the API
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    getInvoices: vi.fn(),
    createRecurringPayment: vi.fn(),
    getRecurringPayment: vi.fn(),
    cancelRecurringPayment: vi.fn(),
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
  },
}));

describe('RecurringPayments E2E Tests', () => {
  let queryClient: QueryClient;

  const mockInvoices = [
    {
      id: 'invoice-1',
      invoice_number: 'INV-001',
      total_amount: 100.00,
      status: 'sent',
    },
    {
      id: 'invoice-2',
      invoice_number: 'INV-002',
      total_amount: 200.00,
      status: 'overdue',
    },
  ];

  const mockRecurringPayments = [
    {
      subscriptionId: 'sub_1234567890',
      customerId: 'cus_1234567890',
      status: 'active',
      currentPeriodStart: '2025-01-01T00:00:00Z',
      currentPeriodEnd: '2025-02-01T00:00:00Z',
      cancelAtPeriodEnd: false,
      metadata: {
        invoiceId: 'invoice-1',
        accountId: 'account-1',
        tenantId: 'tenant-1',
      },
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
    (billing.getInvoices as any).mockResolvedValue(mockInvoices);
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <RecurringPayments />
      </QueryClientProvider>
    );
  };

  describe('Initial Render', () => {
    it('should display recurring payments header', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Recurring Payments')).toBeInTheDocument();
      });

      expect(screen.getByText('Manage subscription-based recurring payments')).toBeInTheDocument();
    });

    it('should display create button', async () => {
      renderComponent();

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /create recurring payment/i });
        expect(createButton).toBeInTheDocument();
      });
    });

    it('should show empty state when no recurring payments', async () => {
      (billing.getInvoices as any).mockResolvedValue(mockInvoices);
      
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('No Recurring Payments')).toBeInTheDocument();
      });
    });
  });

  describe('Create Recurring Payment Flow', () => {
    it('should open create form when create button is clicked', async () => {
      renderComponent();

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /create recurring payment/i });
        fireEvent.click(createButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Create Recurring Payment')).toBeInTheDocument();
        expect(screen.getByLabelText(/invoice/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/payment interval/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/amount per payment/i)).toBeInTheDocument();
      });
    });

    it('should populate amount when invoice is selected', async () => {
      renderComponent();

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /create recurring payment/i });
        fireEvent.click(createButton);
      });

      await waitFor(() => {
        const invoiceSelect = screen.getByLabelText(/invoice/i);
        fireEvent.change(invoiceSelect, { target: { value: 'invoice-1' } });
      });

      await waitFor(() => {
        const amountInput = screen.getByLabelText(/amount per payment/i) as HTMLInputElement;
        expect(amountInput.value).toBe('100');
      });
    });

    it('should create recurring payment successfully', async () => {
      (billing.createRecurringPayment as any).mockResolvedValue({
        subscriptionId: 'sub_new_123',
        status: 'active',
      });

      renderComponent();

      // Open form
      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /create recurring payment/i });
        fireEvent.click(createButton);
      });

      // Fill form
      await waitFor(() => {
        const invoiceSelect = screen.getByLabelText(/invoice/i);
        fireEvent.change(invoiceSelect, { target: { value: 'invoice-1' } });
      });

      await waitFor(() => {
        const intervalSelect = screen.getByLabelText(/payment interval/i);
        fireEvent.change(intervalSelect, { target: { value: 'monthly' } });
      });

      // Submit
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /create recurring payment/i });
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(billing.createRecurringPayment).toHaveBeenCalledWith(
          'invoice-1',
          expect.objectContaining({
            invoice_id: 'invoice-1',
            interval: 'monthly',
            amount: 100,
          })
        );
      });
    });

    it('should show error if required fields are missing', async () => {
      renderComponent();

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /create recurring payment/i });
        fireEvent.click(createButton);
      });

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /create recurring payment/i });
        fireEvent.click(submitButton);
      });

      // Should not call API
      expect(billing.createRecurringPayment).not.toHaveBeenCalled();
    });
  });

  describe('Cancel Recurring Payment Flow', () => {
    beforeEach(() => {
      // Mock query to return recurring payments
      queryClient.setQueryData(['billing', 'recurring-payments'], mockRecurringPayments);
    });

    it('should display recurring payments list', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/subscription sub_1234567890/i)).toBeInTheDocument();
      });
    });

    it('should show cancel buttons for active subscriptions', async () => {
      renderComponent();

      await waitFor(() => {
        const cancelButtons = screen.getAllByRole('button', { name: /cancel/i });
        expect(cancelButtons.length).toBeGreaterThan(0);
      });
    });

    it('should cancel subscription at period end', async () => {
      (billing.cancelRecurringPayment as any).mockResolvedValue({
        subscriptionId: 'sub_1234567890',
        status: 'active',
        cancelAtPeriodEnd: true,
      });

      // Mock window.confirm
      window.confirm = vi.fn(() => true);

      renderComponent();

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancel at period end/i });
        fireEvent.click(cancelButton);
      });

      await waitFor(() => {
        expect(billing.cancelRecurringPayment).toHaveBeenCalledWith('sub_1234567890', false);
      });
    });

    it('should cancel subscription immediately', async () => {
      (billing.cancelRecurringPayment as any).mockResolvedValue({
        subscriptionId: 'sub_1234567890',
        status: 'canceled',
      });

      window.confirm = vi.fn(() => true);

      renderComponent();

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancel immediately/i });
        fireEvent.click(cancelButton);
      });

      await waitFor(() => {
        expect(billing.cancelRecurringPayment).toHaveBeenCalledWith('sub_1234567890', true);
      });
    });

    it('should not cancel if user cancels confirmation', async () => {
      window.confirm = vi.fn(() => false);

      renderComponent();

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancel at period end/i });
        fireEvent.click(cancelButton);
      });

      expect(billing.cancelRecurringPayment).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      (billing.createRecurringPayment as any).mockRejectedValue(
        new Error('Failed to create recurring payment')
      );

      renderComponent();

      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /create recurring payment/i });
        fireEvent.click(createButton);
      });

      await waitFor(() => {
        const invoiceSelect = screen.getByLabelText(/invoice/i);
        fireEvent.change(invoiceSelect, { target: { value: 'invoice-1' } });
      });

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /create recurring payment/i });
        fireEvent.click(submitButton);
      });

      // Error should be logged
      await waitFor(() => {
        expect(billing.createRecurringPayment).toHaveBeenCalled();
      });
    });
  });
});

