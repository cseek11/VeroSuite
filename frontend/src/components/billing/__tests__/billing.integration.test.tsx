/**
 * Billing Components Integration Tests
 *
 * Tests for integration between billing components including:
 * - InvoiceList -> InvoiceDetail flow
 * - CustomerPaymentPortal -> PaymentMethodManager flow
 * - Payment processing flow
 * - Data consistency across components
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InvoiceList from '../InvoiceList';
import InvoiceDetail from '../InvoiceDetail';
import PaymentMethodManager from '../PaymentMethodManager';
import CustomerPaymentHistory from '../CustomerPaymentHistory';
import CustomerPaymentPortal from '../CustomerPaymentPortal';
import { billing, company } from '@/lib/enhanced-api';
import '@testing-library/jest-dom';

// Mock the API
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    getInvoices: vi.fn(),
    getPayments: vi.fn(),
    getPaymentMethods: vi.fn(),
    createPaymentMethod: vi.fn(),
    deletePaymentMethod: vi.fn(),
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
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Billing Components Integration', () => {
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

  const mockPayment = {
    id: 'pay-1',
    tenant_id: 'tenant-1',
    invoice_id: 'inv-1',
    payment_method_id: 'pm-1',
    amount: 110,
    payment_date: '2025-01-15',
    reference_number: 'REF-001',
    created_at: '2025-01-15',
    created_by: 'user-1',
    payment_methods: {
      id: 'pm-1',
      payment_type: 'credit_card' as const,
      payment_name: 'Visa ending in 1234',
    },
    Invoice: {
      id: 'inv-1',
      invoice_number: 'INV-001',
      total_amount: 110,
      status: 'paid',
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
    (billing.getPayments as any).mockResolvedValue([mockPayment]);
    (billing.getPaymentMethods as any).mockResolvedValue([]);
    (company.getSettings as any).mockResolvedValue({});
  });

  describe('InvoiceList -> InvoiceDetail Flow', () => {
    it('should navigate from invoice list to detail view', async () => {
      const onInvoiceSelect = vi.fn();
      render(
        <QueryClientProvider client={queryClient}>
          <InvoiceList customerId="customer-1" onInvoiceSelect={onInvoiceSelect} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      const viewButton = screen.getByText('View');
      fireEvent.click(viewButton);

      expect(onInvoiceSelect).toHaveBeenCalledWith(mockInvoice);
    });

    it('should display invoice detail with correct data', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <InvoiceDetail invoice={mockInvoice} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Invoice INV-001')).toBeInTheDocument();
        expect(screen.getByText('Test Customer')).toBeInTheDocument();
        expect(screen.getByText('$110.00')).toBeInTheDocument();
      });
    });
  });

  describe('CustomerPaymentPortal Integration', () => {
    it('should display all tabs correctly', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CustomerPaymentPortal customerId="customer-1" />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Invoices')).toBeInTheDocument();
        expect(screen.getByText('Make Payment')).toBeInTheDocument();
        expect(screen.getByText('Payment History')).toBeInTheDocument();
        expect(screen.getByText('Payment Methods')).toBeInTheDocument();
      });
    });

    it('should switch between tabs', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CustomerPaymentPortal customerId="customer-1" />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      const historyTab = screen.getByText('Payment History');
      fireEvent.click(historyTab);

      await waitFor(() => {
        expect(screen.getByText('$110.00')).toBeInTheDocument();
      });
    });
  });

  describe('Payment Method Management Integration', () => {
    it('should create and display new payment method', async () => {
      const newPaymentMethod = {
        id: 'pm-new',
        tenant_id: 'tenant-1',
        account_id: 'acc-1',
        payment_type: 'credit_card' as const,
        payment_name: 'New Card',
        card_last4: '5678',
        is_default: false,
        is_active: true,
        created_at: '2025-01-01',
      };

      (billing.createPaymentMethod as any).mockResolvedValue(newPaymentMethod);
      (billing.getPaymentMethods as any).mockResolvedValue([newPaymentMethod]);

      render(
        <QueryClientProvider client={queryClient}>
          <PaymentMethodManager customerId="customer-1" />
        </QueryClientProvider>
      );

      await waitFor(() => {
        const addButton = screen.getByText('Add Payment Method');
        fireEvent.click(addButton);
      });

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/payment method name/i);
        fireEvent.change(nameInput, { target: { value: 'New Card' } });

        const last4Input = screen.getByLabelText(/last 4 digits/i);
        fireEvent.change(last4Input, { target: { value: '5678' } });

        const submitButton = screen.getByText('Save Payment Method');
        fireEvent.click(submitButton);
      });

      await waitFor(() => {
        expect(billing.createPaymentMethod).toHaveBeenCalled();
      });
    });
  });

  describe('Payment History Integration', () => {
    it('should display payment history with invoice links', async () => {
      const onInvoiceClick = vi.fn();
      render(
        <QueryClientProvider client={queryClient}>
          <CustomerPaymentHistory customerId="customer-1" onInvoiceClick={onInvoiceClick} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Invoice INV-001')).toBeInTheDocument();
      });

      const invoiceLink = screen.getByText('Invoice INV-001');
      fireEvent.click(invoiceLink);

      expect(onInvoiceClick).toHaveBeenCalledWith('inv-1');
    });

    it('should calculate statistics correctly', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CustomerPaymentHistory customerId="customer-1" />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument(); // Total payments
        expect(screen.getByText('$110.00')).toBeInTheDocument(); // Total paid
      });
    });
  });

  describe('Data Consistency', () => {
    it('should maintain consistent invoice data across components', async () => {
      const onInvoiceSelect = vi.fn();
      render(
        <QueryClientProvider client={queryClient}>
          <InvoiceList customerId="customer-1" onInvoiceSelect={onInvoiceSelect} />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      const viewButton = screen.getByText('View');
      fireEvent.click(viewButton);

      const selectedInvoice = onInvoiceSelect.mock.calls[0][0];
      expect(selectedInvoice.invoice_number).toBe('INV-001');
      expect(selectedInvoice.total_amount).toBe(110);
    });

    it('should sync payment data between components', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <CustomerPaymentHistory customerId="customer-1" />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('$110.00')).toBeInTheDocument();
      });

      // Verify payment data is consistent
      expect(billing.getPayments).toHaveBeenCalled();
    });
  });
});












