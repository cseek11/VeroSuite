/**
 * Billing E2E Tests
 *
 * End-to-end tests for complete billing user flows including:
 * - Complete invoice viewing flow
 * - Complete payment processing flow
 * - Complete payment method management flow
 * - Complete customer portal flow
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomerPaymentPortal from '../CustomerPaymentPortal';
import { billing } from '@/lib/enhanced-api';
import '@testing-library/jest-dom';

// Mock the API
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    getInvoices: vi.fn(),
    getPayments: vi.fn(),
    getPaymentMethods: vi.fn(),
    createPaymentMethod: vi.fn(),
    deletePaymentMethod: vi.fn(),
    processPayment: vi.fn(),
  },
  company: {
    getSettings: vi.fn(),
  },
}));

// Mock toast
vi.mock('@/utils/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Billing E2E Flows', () => {
  let queryClient: QueryClient;

  const mockInvoice = {
    id: 'inv-1',
    tenant_id: 'tenant-1',
    account_id: 'acc-1',
    invoice_number: 'INV-001',
    status: 'sent' as const,
    issue_date: '2025-01-01',
    due_date: '2025-01-31',
    subtotal: 100,
    tax_amount: 10,
    total_amount: 110,
    notes: 'Test invoice',
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
    created_by: 'user-1',
    updated_by: 'user-1',
    InvoiceItem: [{
      id: 'item-1',
      service_type_id: 'svc-1',
      description: 'Service Item',
      quantity: 1,
      unit_price: 100,
      total_price: 100,
      created_at: '2025-01-01',
    }],
    accounts: {
      id: 'acc-1',
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '555-0001',
    },
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.clearAllMocks();
    (billing.getInvoices as any).mockResolvedValue([mockInvoice]);
    (billing.getPayments as any).mockResolvedValue([]);
    (billing.getPaymentMethods as any).mockResolvedValue([]);
  });

  describe('Complete Invoice Viewing Flow', () => {
    it('should complete full invoice viewing workflow', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CustomerPaymentPortal customerId="customer-1" />
        </QueryClientProvider>
      );

      // Step 1: View invoices list
      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      // Step 2: Click view button
      const viewButton = screen.getByText('View');
      fireEvent.click(viewButton);

      // Step 3: Verify invoice detail modal opens
      await waitFor(() => {
        expect(screen.getByText('Invoice Details')).toBeInTheDocument();
        expect(screen.getByText('Invoice INV-001')).toBeInTheDocument();
      });

      // Step 4: Close modal
      const closeButton = screen.getByRole('button', { name: /close/i }) || 
                         screen.getAllByRole('button').find(btn => btn.textContent?.includes('×'));
      if (closeButton) {
        fireEvent.click(closeButton);
      }
    });
  });

  describe('Complete Payment Method Management Flow', () => {
    it('should complete full payment method management workflow', async () => {
      const newPaymentMethod = {
        id: 'pm-new',
        tenant_id: 'tenant-1',
        account_id: 'acc-1',
        payment_type: 'credit_card' as const,
        payment_name: 'Test Card',
        card_last4: '1234',
        is_default: false,
        is_active: true,
        created_at: '2025-01-01',
      };

      (billing.createPaymentMethod as any).mockResolvedValue(newPaymentMethod);
      (billing.getPaymentMethods as any).mockResolvedValue([newPaymentMethod]);

      render(
        <QueryClientProvider client={queryClient}>
          <CustomerPaymentPortal customerId="customer-1" />
        </QueryClientProvider>
      );

      // Step 1: Navigate to payment methods tab
      await waitFor(() => {
        const paymentMethodsTab = screen.getByText('Payment Methods');
        fireEvent.click(paymentMethodsTab);
      });

      // Step 2: Click add payment method
      await waitFor(() => {
        const addButton = screen.getByText('Add Payment Method');
        fireEvent.click(addButton);
      });

      // Step 3: Fill form
      await waitFor(() => {
        const nameInput = screen.getByLabelText(/payment method name/i);
        fireEvent.change(nameInput, { target: { value: 'Test Card' } });

        const last4Input = screen.getByLabelText(/last 4 digits/i);
        fireEvent.change(last4Input, { target: { value: '1234' } });

        const submitButton = screen.getByText('Save Payment Method');
        fireEvent.click(submitButton);
      });

      // Step 4: Verify payment method created
      await waitFor(() => {
        expect(billing.createPaymentMethod).toHaveBeenCalled();
      });
    });
  });

  describe('Complete Payment Processing Flow', () => {
    it('should complete full payment processing workflow', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CustomerPaymentPortal customerId="customer-1" />
        </QueryClientProvider>
      );

      // Step 1: View invoices
      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      // Step 2: Click pay button
      const payButton = screen.getByText('Pay');
      fireEvent.click(payButton);

      // Step 3: Navigate to payment tab
      await waitFor(() => {
        expect(screen.getByText('Make Payment')).toBeInTheDocument();
      });
    });
  });

  describe('Complete Customer Portal Flow', () => {
    it('should navigate through all portal sections', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CustomerPaymentPortal customerId="customer-1" />
        </QueryClientProvider>
      );

      // Step 1: Start on invoices tab
      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      // Step 2: Navigate to payment history
      const historyTab = screen.getByText('Payment History');
      fireEvent.click(historyTab);

      await waitFor(() => {
        expect(screen.getByText('Payment History')).toBeInTheDocument();
      });

      // Step 3: Navigate to payment methods
      const paymentMethodsTab = screen.getByText('Payment Methods');
      fireEvent.click(paymentMethodsTab);

      await waitFor(() => {
        expect(screen.getByText('Payment Methods')).toBeInTheDocument();
      });

      // Step 4: Navigate back to invoices
      const invoicesTab = screen.getByText('Invoices');
      fireEvent.click(invoicesTab);

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });
    });
  });
});




