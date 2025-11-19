/**
 * ARManagement Component Tests
 *
 * Tests for the ARManagement component including:
 * - Component rendering
 * - Data loading states
 * - Error handling
 * - Regression prevention for React Hooks violations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ARManagement from '../ARManagement';
import { billing } from '@/lib/enhanced-api';

// Mock the billing API
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    getARSummary: vi.fn(),
  },
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
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

describe('ARManagement', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ARManagement />
      </QueryClientProvider>
    );
  };

  const mockARSummary = {
    totalAR: 100000,
    totalCustomers: 10,
    totalInvoices: 25,
    agingBuckets: {
      '0-30': 50000,
      '31-60': 30000,
      '61-90': 15000,
      '90+': 5000,
    },
    customerAR: [
      {
        customerId: 'cust-1',
        customerName: 'Customer 1',
        totalAR: 50000,
        invoices: [
          { invoiceId: 'inv-1', daysPastDue: 15, balanceDue: 50000 },
        ],
      },
    ],
  };

  describe('Regression Prevention: REACT_HOOKS_ORDER_VIOLATION - 2025-11-16', () => {
    // Pattern: REACT_HOOKS_ORDER_VIOLATION (see docs/error-patterns.md)
    // Test ensures hooks are called in the same order on every render

    it('should not crash when transitioning from loading to data state', async () => {
      // This test prevents regression of the bug where useMemo was called
      // after early returns, causing "Rendered more hooks than during the previous render"
      
      // Start with loading state
      vi.mocked(billing.getARSummary).mockImplementation(
        () => new Promise(() => {}) // Never resolves - keeps loading
      );

      const { rerender } = renderComponent();

      // Component should render loading state
      expect(screen.getByText(/loading ar data/i)).toBeInTheDocument();

      // Now simulate data loading
      vi.mocked(billing.getARSummary).mockResolvedValue(mockARSummary);

      // Force re-render with new data
      rerender(
        <QueryClientProvider client={queryClient}>
          <ARManagement />
        </QueryClientProvider>
      );

      // Component should render without hook order violation
      // If hooks are in wrong order, React will throw error
      await waitFor(() => {
        expect(screen.queryByText(/loading ar data/i)).not.toBeInTheDocument();
      });

      // Should render data without crashing
      expect(screen.getByText(/customer 1/i)).toBeInTheDocument();
    });

    it('should not crash when transitioning from error to data state', async () => {
      // Regression test: Component should handle error -> data transition
      // without hook order violations

      // Start with error state
      vi.mocked(billing.getARSummary).mockRejectedValue(
        new Error('Network error')
      );

      const { rerender } = renderComponent();

      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText(/failed to load ar data/i)).toBeInTheDocument();
      });

      // Now simulate successful data load
      vi.mocked(billing.getARSummary).mockResolvedValue(mockARSummary);

      // Force re-render
      rerender(
        <QueryClientProvider client={queryClient}>
          <ARManagement />
        </QueryClientProvider>
      );

      // Should transition to data state without hook violation
      await waitFor(() => {
        expect(screen.queryByText(/failed to load ar data/i)).not.toBeInTheDocument();
      });

      // Should render data
      expect(screen.getByText(/customer 1/i)).toBeInTheDocument();
    });

    it('should call all hooks before early returns', () => {
      // Regression test: Verify hooks are called unconditionally
      // This test ensures useMemo is called even when data is undefined

      vi.mocked(billing.getARSummary).mockResolvedValue(undefined as any);

      // Should not crash - hooks should be called before early return
      expect(() => {
        renderComponent();
      }).not.toThrow();

      // Component should handle undefined data gracefully
      expect(screen.queryByText(/loading ar data/i)).not.toBeInTheDocument();
    });

    it('should handle undefined customerAR in useMemo', async () => {
      // Regression test: useMemo should handle undefined data with guard
      const summaryWithoutCustomers = {
        ...mockARSummary,
        customerAR: undefined,
      };

      vi.mocked(billing.getARSummary).mockResolvedValue(summaryWithoutCustomers as any);

      // Should not crash - useMemo should return empty array
      renderComponent();

      await waitFor(() => {
        expect(screen.queryByText(/loading ar data/i)).not.toBeInTheDocument();
      });

      // Component should render without crashing
      expect(screen.getByText(/\$100,000.00/i)).toBeInTheDocument();
    });
  });

  describe('Rendering', () => {
    it('should render loading state', () => {
      vi.mocked(billing.getARSummary).mockImplementation(
        () => new Promise(() => {})
      );

      renderComponent();

      expect(screen.getByText(/loading ar data/i)).toBeInTheDocument();
    });

    it('should render error state', async () => {
      vi.mocked(billing.getARSummary).mockRejectedValue(
        new Error('Failed to load')
      );

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/failed to load ar data/i)).toBeInTheDocument();
      });
    });

    it('should render AR summary data', async () => {
      vi.mocked(billing.getARSummary).mockResolvedValue(mockARSummary);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/customer 1/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/\$100,000.00/i)).toBeInTheDocument();
    });
  });
});




