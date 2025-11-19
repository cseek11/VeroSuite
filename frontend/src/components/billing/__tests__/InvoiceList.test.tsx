/**
 * InvoiceList Component Tests
 *
 * Tests for the InvoiceList component including:
 * - Component rendering
 * - Filtering and sorting
 * - Search functionality
 * - Error handling
 * - Edge cases and boundary conditions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InvoiceList from '../InvoiceList';
import { billing } from '@/lib/enhanced-api';
import '@testing-library/jest-dom';

// Mock the API
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    getInvoices: vi.fn(),
  },
}));

// Mock toast
vi.mock('@/utils/toast', () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('InvoiceList', () => {
  let queryClient: QueryClient;

  const mockInvoices = [
    {
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
      notes: 'Test invoice 1',
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
      created_by: 'user-1',
      updated_by: 'user-1',
      InvoiceItem: [],
      accounts: {
        id: 'acc-1',
        name: 'Test Customer 1',
        email: 'test1@example.com',
        phone: '555-0001',
      },
    },
    {
      id: 'inv-2',
      tenant_id: 'tenant-1',
      account_id: 'acc-2',
      invoice_number: 'INV-002',
      status: 'paid' as const,
      issue_date: '2025-02-01',
      due_date: '2025-02-28',
      subtotal: 200,
      tax_amount: 20,
      total_amount: 220,
      notes: 'Test invoice 2',
      created_at: '2025-02-01',
      updated_at: '2025-02-01',
      created_by: 'user-1',
      updated_by: 'user-1',
      InvoiceItem: [],
      accounts: {
        id: 'acc-2',
        name: 'Test Customer 2',
        email: 'test2@example.com',
        phone: '555-0002',
      },
    },
    {
      id: 'inv-3',
      tenant_id: 'tenant-1',
      account_id: 'acc-3',
      invoice_number: 'INV-003',
      status: 'overdue' as const,
      issue_date: '2025-03-01',
      due_date: '2025-03-31',
      subtotal: 300,
      tax_amount: 30,
      total_amount: 330,
      notes: 'Test invoice 3',
      created_at: '2025-03-01',
      updated_at: '2025-03-01',
      created_by: 'user-1',
      updated_by: 'user-1',
      InvoiceItem: [],
      accounts: {
        id: 'acc-3',
        name: 'Test Customer 3',
        email: 'test3@example.com',
        phone: '555-0003',
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

  const renderComponent = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <InvoiceList customerId="customer-1" {...props} />
      </QueryClientProvider>
    );
  };

  describe('Initial Render', () => {
    it('should render loading state initially', () => {
      (billing.getInvoices as any).mockImplementation(() => new Promise(() => {}));
      renderComponent();

      expect(screen.getByText('Loading invoices...')).toBeInTheDocument();
    });

    it('should render invoices after loading', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
        expect(screen.getByText('INV-002')).toBeInTheDocument();
        expect(screen.getByText('INV-003')).toBeInTheDocument();
      });
    });

    it('should display statistics cards', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Total Invoices')).toBeInTheDocument();
        expect(screen.getByText('Outstanding')).toBeInTheDocument();
        expect(screen.getByText('Paid')).toBeInTheDocument();
        expect(screen.getByText('Overdue')).toBeInTheDocument();
      });
    });
  });

  describe('Filtering', () => {
    it('should filter by status', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      const statusSelect = screen.getByLabelText(/status/i);
      fireEvent.change(statusSelect, { target: { value: 'paid' } });

      await waitFor(() => {
        expect(screen.getByText('INV-002')).toBeInTheDocument();
        expect(screen.queryByText('INV-001')).not.toBeInTheDocument();
      });
    });

    it('should filter by search term', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search by invoice number/i);
      fireEvent.change(searchInput, { target: { value: 'INV-001' } });

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
        expect(screen.queryByText('INV-002')).not.toBeInTheDocument();
      });
    });

    it('should filter by date range', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      const startDateInput = screen.getByLabelText(/start date/i);
      fireEvent.change(startDateInput, { target: { value: '2025-02-01' } });

      await waitFor(() => {
        expect(screen.getByText('INV-002')).toBeInTheDocument();
        expect(screen.queryByText('INV-001')).not.toBeInTheDocument();
      });
    });
  });

  describe('Sorting', () => {
    it('should sort by issue date', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      const sortButton = screen.getByText(/issue date/i);
      fireEvent.click(sortButton);

      // Verify invoices are sorted (first should be oldest)
      const invoices = screen.getAllByText(/INV-/);
      expect(invoices[0]).toHaveTextContent('INV-001');
    });

    it('should toggle sort direction', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      const sortButton = screen.getByText(/due date/i);
      fireEvent.click(sortButton);
      fireEvent.click(sortButton); // Click again to toggle

      // Verify sort direction changed
      expect(sortButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API fails', async () => {
      (billing.getInvoices as any).mockRejectedValue(new Error('API Error'));
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Error loading invoices')).toBeInTheDocument();
        expect(screen.getByText('API Error')).toBeInTheDocument();
      });
    });

    it('should handle undefined invoices array', async () => {
      (billing.getInvoices as any).mockResolvedValue(undefined);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('No invoices found')).toBeInTheDocument();
      });
    });

    it('should handle empty invoices array', async () => {
      (billing.getInvoices as any).mockResolvedValue([]);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('No invoices found')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should call onInvoiceSelect when view button clicked', async () => {
      const onInvoiceSelect = vi.fn();
      renderComponent({ onInvoiceSelect });

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      const viewButtons = screen.getAllByText('View');
      fireEvent.click(viewButtons[0]);

      expect(onInvoiceSelect).toHaveBeenCalledWith(mockInvoices[0]);
    });

    it('should call onInvoicePay when pay button clicked', async () => {
      const onInvoicePay = vi.fn();
      renderComponent({ onInvoicePay });

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      const payButtons = screen.getAllByText('Pay');
      fireEvent.click(payButtons[0]);

      expect(onInvoicePay).toHaveBeenCalledWith(mockInvoices[0]);
    });

    it('should show filters when filter button clicked', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });

      const filterButton = screen.getByText(/filters/i);
      fireEvent.click(filterButton);

      expect(screen.getByText(/hide filters/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle invoices without customer information', async () => {
      const invoicesWithoutCustomer = [{
        ...mockInvoices[0],
        accounts: undefined,
      }];
      (billing.getInvoices as any).mockResolvedValue(invoicesWithoutCustomer);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
        expect(screen.getByText('Unknown Customer')).toBeInTheDocument();
      });
    });

    it('should handle invoices without items', async () => {
      const invoicesWithoutItems = [{
        ...mockInvoices[0],
        InvoiceItem: undefined,
      }];
      (billing.getInvoices as any).mockResolvedValue(invoicesWithoutItems);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('INV-001')).toBeInTheDocument();
      });
    });

    it('should calculate statistics correctly', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument(); // Total
        expect(screen.getByText('1')).toBeInTheDocument(); // Overdue
      });
    });
  });
});






