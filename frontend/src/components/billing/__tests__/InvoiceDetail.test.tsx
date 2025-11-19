/**
 * InvoiceDetail Component Tests
 *
 * Tests for the InvoiceDetail component including:
 * - Component rendering
 * - Payment history display
 * - PDF download functionality
 * - Error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InvoiceDetail from '../InvoiceDetail';
import { billing, company } from '@/lib/enhanced-api';
import '@testing-library/jest-dom';

// Mock the API
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    getPayments: vi.fn(),
  },
  company: {
    getSettings: vi.fn(),
  },
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('InvoiceDetail', () => {
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
    notes: 'Test invoice notes',
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
    created_by: 'user-1',
    updated_by: 'user-1',
    InvoiceItem: [
      {
        id: 'item-1',
        service_type_id: 'svc-1',
        description: 'Service Item 1',
        quantity: 2,
        unit_price: 50,
        total_price: 100,
        created_at: '2025-01-01',
      },
    ],
    accounts: {
      id: 'acc-1',
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '555-0001',
      address: '123 Main St',
      city: 'Test City',
      state: 'TS',
      zip_code: '12345',
    },
  };

  const mockPayments = [
    {
      id: 'pay-1',
      tenant_id: 'tenant-1',
      invoice_id: 'inv-1',
      payment_method_id: 'pm-1',
      amount: 50,
      payment_date: '2025-01-15',
      reference_number: 'REF-001',
      notes: 'Partial payment',
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
        status: 'sent',
      },
    },
  ];

  const mockCompanySettings = {
    invoice_logo_url: 'https://example.com/logo.png',
    company_name: 'Test Company',
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.clearAllMocks();
    (billing.getPayments as any).mockResolvedValue(mockPayments);
    (company.getSettings as any).mockResolvedValue(mockCompanySettings);
  });

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <InvoiceDetail invoice={mockInvoice} {...props} />
      </QueryClientProvider>
    );
  };

  describe('Initial Render', () => {
    it('should render invoice details', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Invoice INV-001')).toBeInTheDocument();
        expect(screen.getByText('Test Customer')).toBeInTheDocument();
        expect(screen.getByText('$110.00')).toBeInTheDocument();
      });
    });

    it('should display invoice items', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Service Item 1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument(); // Quantity
        expect(screen.getByText('$50.00')).toBeInTheDocument(); // Unit price
      });
    });

    it('should display customer information', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Bill To')).toBeInTheDocument();
        expect(screen.getByText('Test Customer')).toBeInTheDocument();
        expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });
    });
  });

  describe('Payment History', () => {
    it('should display payment history when payments exist', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Payment History')).toBeInTheDocument();
        expect(screen.getByText('$50.00')).toBeInTheDocument();
        expect(screen.getByText(/REF-001/)).toBeInTheDocument();
      });
    });

    it('should calculate remaining balance correctly', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Remaining Balance')).toBeInTheDocument();
        expect(screen.getByText('$60.00')).toBeInTheDocument(); // 110 - 50
      });
    });

    it('should not display payment history when no payments', async () => {
      (billing.getPayments as any).mockResolvedValue([]);
      renderComponent();

      await waitFor(() => {
        expect(screen.queryByText('Payment History')).not.toBeInTheDocument();
      });
    });
  });

  describe('Status Display', () => {
    it('should display correct status for sent invoice', () => {
      renderComponent();

      expect(screen.getByText('Sent')).toBeInTheDocument();
    });

    it('should display correct status for paid invoice', () => {
      const paidInvoice = { ...mockInvoice, status: 'paid' as const };
      render(<QueryClientProvider client={queryClient}>
        <InvoiceDetail invoice={paidInvoice} />
      </QueryClientProvider>);

      expect(screen.getByText('Paid')).toBeInTheDocument();
    });

    it('should display correct status for overdue invoice', () => {
      const overdueInvoice = { ...mockInvoice, status: 'overdue' as const };
      render(<QueryClientProvider client={queryClient}>
        <InvoiceDetail invoice={overdueInvoice} />
      </QueryClientProvider>);

      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onPayNow when pay button clicked', async () => {
      const onPayNow = vi.fn();
      renderComponent({ onPayNow });

      await waitFor(() => {
        const payButton = screen.getByText('Pay Now');
        fireEvent.click(payButton);
        expect(onPayNow).toHaveBeenCalled();
      });
    });

    it('should call onDownloadPDF when download button clicked', async () => {
      const onDownloadPDF = vi.fn();
      renderComponent({ onDownloadPDF });

      await waitFor(() => {
        const downloadButton = screen.getByText('Download PDF');
        fireEvent.click(downloadButton);
        expect(onDownloadPDF).toHaveBeenCalled();
      });
    });

    it('should not show pay button for paid invoices', () => {
      const paidInvoice = { ...mockInvoice, status: 'paid' as const };
      render(<QueryClientProvider client={queryClient}>
        <InvoiceDetail invoice={paidInvoice} />
      </QueryClientProvider>);

      expect(screen.queryByText('Pay Now')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      (billing.getPayments as any).mockRejectedValue(new Error('API Error'));
      renderComponent();

      await waitFor(() => {
        // Component should still render invoice details
        expect(screen.getByText('Invoice INV-001')).toBeInTheDocument();
      });
    });

    it('should handle missing company settings', async () => {
      (company.getSettings as any).mockResolvedValue(null);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Invoice INV-001')).toBeInTheDocument();
      });
    });

    it('should handle invoices without items', () => {
      const invoiceWithoutItems = { ...mockInvoice, InvoiceItem: [] };
      render(<QueryClientProvider client={queryClient}>
        <InvoiceDetail invoice={invoiceWithoutItems} />
      </QueryClientProvider>);

      expect(screen.getByText('No items found')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle invoices without customer address', () => {
      const invoiceWithoutAddress = {
        ...mockInvoice,
        accounts: {
          ...mockInvoice.accounts,
          address: undefined,
          city: undefined,
        },
      };
      render(<QueryClientProvider client={queryClient}>
        <InvoiceDetail invoice={invoiceWithoutAddress} />
      </QueryClientProvider>);

      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });

    it('should handle invoices without notes', () => {
      const invoiceWithoutNotes = { ...mockInvoice, notes: undefined };
      render(<QueryClientProvider client={queryClient}>
        <InvoiceDetail invoice={invoiceWithoutNotes} />
      </QueryClientProvider>);

      expect(screen.queryByText('Notes')).not.toBeInTheDocument();
    });
  });
});




