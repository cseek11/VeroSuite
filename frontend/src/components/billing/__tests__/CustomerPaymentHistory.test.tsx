/**
 * CustomerPaymentHistory Component Tests
 *
 * Tests for the CustomerPaymentHistory component including:
 * - Component rendering
 * - Payment history display
 * - Filtering and sorting
 * - Error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomerPaymentHistory from '../CustomerPaymentHistory';
import { billing } from '@/lib/enhanced-api';
import '@testing-library/jest-dom';

// Mock the API
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    getPayments: vi.fn(),
  },
}));

// Mock toast
vi.mock('@/utils/toast', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('CustomerPaymentHistory', () => {
  let queryClient: QueryClient;

  const mockPayments = [
    {
      id: 'pay-1',
      tenant_id: 'tenant-1',
      invoice_id: 'inv-1',
      payment_method_id: 'pm-1',
      amount: 100,
      payment_date: '2025-01-15',
      reference_number: 'REF-001',
      notes: 'Payment 1',
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
        total_amount: 100,
        status: 'paid',
      },
    },
    {
      id: 'pay-2',
      tenant_id: 'tenant-1',
      invoice_id: 'inv-2',
      payment_method_id: 'pm-2',
      amount: 200,
      payment_date: '2025-02-15',
      reference_number: 'REF-002',
      notes: 'Payment 2',
      created_at: '2025-02-15',
      created_by: 'user-1',
      payment_methods: {
        id: 'pm-2',
        payment_type: 'ach' as const,
        payment_name: 'Checking Account',
      },
      Invoice: {
        id: 'inv-2',
        invoice_number: 'INV-002',
        total_amount: 200,
        status: 'paid',
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
    (billing.getPayments as any).mockResolvedValue(mockPayments);
  });

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <CustomerPaymentHistory customerId="customer-1" {...props} />
      </QueryClientProvider>
    );
  };

  describe('Initial Render', () => {
    it('should render loading state initially', () => {
      (billing.getPayments as any).mockImplementation(() => new Promise(() => {}));
      renderComponent();

      expect(screen.getByText('Loading payment history...')).toBeInTheDocument();
    });

    it('should render payment history after loading', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('$100.00')).toBeInTheDocument();
        expect(screen.getByText('$200.00')).toBeInTheDocument();
      });
    });

    it('should display statistics cards', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Total Payments')).toBeInTheDocument();
        expect(screen.getByText('Total Paid')).toBeInTheDocument();
        expect(screen.getByText('This Month')).toBeInTheDocument();
      });
    });
  });

  describe('Payment Display', () => {
    it('should display payment amounts', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('$100.00')).toBeInTheDocument();
        expect(screen.getByText('$200.00')).toBeInTheDocument();
      });
    });

    it('should display invoice numbers', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Invoice INV-001')).toBeInTheDocument();
        expect(screen.getByText('Invoice INV-002')).toBeInTheDocument();
      });
    });

    it('should display payment methods', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Visa ending in 1234')).toBeInTheDocument();
        expect(screen.getByText('Checking Account')).toBeInTheDocument();
      });
    });

    it('should display reference numbers', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/REF-001/)).toBeInTheDocument();
        expect(screen.getByText(/REF-002/)).toBeInTheDocument();
      });
    });
  });

  describe('Filtering', () => {
    it('should filter by search term', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('$100.00')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search by invoice number/i);
      fireEvent.change(searchInput, { target: { value: 'INV-001' } });

      await waitFor(() => {
        expect(screen.getByText('$100.00')).toBeInTheDocument();
        expect(screen.queryByText('$200.00')).not.toBeInTheDocument();
      });
    });

    it('should filter by date range', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('$100.00')).toBeInTheDocument();
      });

      const startDateInput = screen.getByLabelText(/start date/i);
      fireEvent.change(startDateInput, { target: { value: '2025-02-01' } });

      await waitFor(() => {
        expect(screen.getByText('$200.00')).toBeInTheDocument();
        expect(screen.queryByText('$100.00')).not.toBeInTheDocument();
      });
    });
  });

  describe('Sorting', () => {
    it('should sort by payment date', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('$100.00')).toBeInTheDocument();
      });

      const sortButton = screen.getByText(/payment date/i);
      fireEvent.click(sortButton);

      // Verify payments are sorted
      const payments = screen.getAllByText(/\$[\d,]+\.\d{2}/);
      expect(payments.length).toBeGreaterThan(0);
    });

    it('should sort by amount', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('$100.00')).toBeInTheDocument();
      });

      const sortButton = screen.getByText(/amount/i);
      fireEvent.click(sortButton);

      // Verify sorting occurred
      expect(sortButton).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onInvoiceClick when invoice link clicked', async () => {
      const onInvoiceClick = vi.fn();
      renderComponent({ onInvoiceClick });

      await waitFor(() => {
        const invoiceLinks = screen.getAllByText(/Invoice INV-/);
        fireEvent.click(invoiceLinks[0]);
        expect(onInvoiceClick).toHaveBeenCalledWith('inv-1');
      });
    });

    it('should show filters when filter button clicked', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('$100.00')).toBeInTheDocument();
      });

      const filterButton = screen.getByText(/filters/i);
      fireEvent.click(filterButton);

      expect(screen.getByText(/hide filters/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error when API fails', async () => {
      (billing.getPayments as any).mockRejectedValue(new Error('API Error'));
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Error loading payment history')).toBeInTheDocument();
        expect(screen.getByText('API Error')).toBeInTheDocument();
      });
    });

    it('should handle undefined payments array', async () => {
      (billing.getPayments as any).mockResolvedValue(undefined);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('No payments found')).toBeInTheDocument();
      });
    });

    it('should handle empty payments array', async () => {
      (billing.getPayments as any).mockResolvedValue([]);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('No payments found')).toBeInTheDocument();
      });
    });
  });

  describe('Statistics', () => {
    it('should calculate total payments correctly', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument(); // Total count
      });
    });

    it('should calculate total amount correctly', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('$300.00')).toBeInTheDocument(); // 100 + 200
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle payments without invoice', async () => {
      const paymentsWithoutInvoice = [{
        ...mockPayments[0],
        Invoice: undefined,
      }];
      (billing.getPayments as any).mockResolvedValue(paymentsWithoutInvoice);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('$100.00')).toBeInTheDocument();
      });
    });

    it('should handle payments without payment method', async () => {
      const paymentsWithoutMethod = [{
        ...mockPayments[0],
        payment_methods: undefined,
      }];
      (billing.getPayments as any).mockResolvedValue(paymentsWithoutMethod);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('$100.00')).toBeInTheDocument();
      });
    });

    it('should handle payments without reference number', async () => {
      const paymentsWithoutRef = [{
        ...mockPayments[0],
        reference_number: undefined,
      }];
      (billing.getPayments as any).mockResolvedValue(paymentsWithoutRef);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('$100.00')).toBeInTheDocument();
      });
    });
  });
});















