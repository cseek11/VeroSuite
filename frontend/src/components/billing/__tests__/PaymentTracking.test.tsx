/**
 * PaymentTracking Component Tests
 * 
 * Tests for PaymentTracking component including:
 * - Component rendering
 * - Hook order compliance (REACT_HOOKS_ORDER_VIOLATION prevention)
 * - Error handling
 * - Data loading states
 * - CSV export functionality
 * 
 * Regression Prevention: REACT_HOOKS_ORDER_VIOLATION - 2025-11-16
 * Pattern: REACT_HOOKS_ORDER_VIOLATION (see docs/error-patterns.md)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaymentTracking from '../PaymentTracking';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

// Mock dependencies
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    getPaymentTracking: vi.fn(),
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

// Type assertions for mocked functions
const mockBilling = billing as { getPaymentTracking: ReturnType<typeof vi.fn> };
const mockLogger = logger as { error: ReturnType<typeof vi.fn>; debug: ReturnType<typeof vi.fn>; info: ReturnType<typeof vi.fn>; warn: ReturnType<typeof vi.fn> };
const mockToast = toast as { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn>; info: ReturnType<typeof vi.fn> };

describe('PaymentTracking', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <PaymentTracking />
      </QueryClientProvider>
    );
  };

  const mockTrackingData = {
    payments: [
      {
        id: 1,
        payment_date: '2025-01-15',
        amount: 1000,
        reference_number: 'REF-001',
        notes: 'Test payment',
        Invoice: {
          invoice_number: 'INV-001',
          accounts: { name: 'Test Customer' },
        },
        payment_methods: {
          payment_name: 'Credit Card',
        },
      },
    ],
    summary: {
      totalAmount: 1000,
      paymentCount: 1,
      averagePayment: 1000,
    },
    dailyTrends: {
      '2025-01-15': 1000,
    },
  };

  describe('Component Rendering', () => {
    it('should render loading state', () => {
      vi.mocked(billing.getPaymentTracking).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderComponent();

      expect(screen.getByText(/loading payment tracking data/i)).toBeInTheDocument();
    });

    it('should render error state', async () => {
      vi.mocked(billing.getPaymentTracking).mockRejectedValue(new Error('API Error'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/failed to load payment tracking data/i)).toBeInTheDocument();
      });
    });

    it('should render payment tracking data', async () => {
      vi.mocked(billing.getPaymentTracking).mockResolvedValue(mockTrackingData);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
        expect(screen.getByText(/test customer/i)).toBeInTheDocument();
      });
    });
  });

  describe('Regression Prevention: REACT_HOOKS_ORDER_VIOLATION - 2025-11-16', () => {
    // Pattern: REACT_HOOKS_ORDER_VIOLATION (see docs/error-patterns.md)
    // This test prevents regression of the bug where useMemo was called
    // after early returns, causing "Rendered more hooks than during the previous render"

    it('should call all hooks before early returns', async () => {
      // Start with loading state
      vi.mocked(billing.getPaymentTracking).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockTrackingData), 100))
      );

      const { rerender } = renderComponent();

      // Component should render loading state without crashing
      expect(screen.getByText(/loading payment tracking data/i)).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
      });

      // If hooks are in wrong order, React will throw error
      // This test verifies hooks are called in correct order on every render
      expect(() => {
        rerender(
          <QueryClientProvider client={queryClient}>
            <PaymentTracking />
          </QueryClientProvider>
        );
      }).not.toThrow();
    });

    it('should handle hook order correctly when transitioning from loading to loaded', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(billing.getPaymentTracking).mockReturnValue(promise as any);

      renderComponent();

      // Should be in loading state
      expect(screen.getByText(/loading payment tracking data/i)).toBeInTheDocument();

      // Resolve the promise to trigger data load
      resolvePromise!(mockTrackingData);

      // Should transition to loaded state without hook order errors
      await waitFor(() => {
        expect(screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
      }, { timeout: 2000 });

      // No React hooks warnings should occur
      expect(mockLogger.error).not.toHaveBeenCalledWith(
        expect.stringContaining('hooks'),
        expect.anything(),
        expect.anything()
      );
    });

    it('should handle hook order correctly when transitioning from loaded to error', async () => {
      // Start with successful data
      vi.mocked(billing.getPaymentTracking).mockResolvedValueOnce(mockTrackingData);

      const { rerender } = renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
      });

      // Change to error state
      vi.mocked(billing.getPaymentTracking).mockRejectedValueOnce(new Error('API Error'));

      // Create new query client to trigger new query
      queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });

      rerender(
        <QueryClientProvider client={queryClient}>
          <PaymentTracking />
        </QueryClientProvider>
      );

      // Should handle error state without hook order errors
      await waitFor(() => {
        expect(screen.getByText(/failed to load payment tracking data/i)).toBeInTheDocument();
      });

      // No React hooks warnings should occur
      expect(mockLogger.error).not.toHaveBeenCalledWith(
        expect.stringContaining('hooks'),
        expect.anything(),
        expect.anything()
      );
    });
  });

  describe('Error Handling', () => {
    it('should log errors when API call fails', async () => {
      const error = new Error('API Error');
      vi.mocked(billing.getPaymentTracking).mockRejectedValue(error);

      renderComponent();

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Failed to fetch payment tracking data',
          error,
          'PaymentTracking'
        );
      });

      expect(mockToast.error).toHaveBeenCalledWith(
        'Failed to load payment tracking data. Please try again.'
      );
    });

    it('should handle CSV export errors', async () => {
      vi.mocked(billing.getPaymentTracking).mockResolvedValue(mockTrackingData);

      // Mock URL.createObjectURL to throw error
      const originalCreateObjectURL = URL.createObjectURL;
      URL.createObjectURL = vi.fn(() => {
        throw new Error('Blob error');
      }) as any;

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
      });

      const exportButton = screen.getByText(/export csv/i);
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Failed to export Payment Tracking CSV',
          expect.any(Error),
          'PaymentTracking'
        );
      });

      expect(mockToast.error).toHaveBeenCalledWith(
        'Failed to export report. Please try again.'
      );

      // Restore
      URL.createObjectURL = originalCreateObjectURL;
    });
  });

  describe('Data Processing', () => {
    it('should process chart data correctly', async () => {
      vi.mocked(billing.getPaymentTracking).mockResolvedValue(mockTrackingData);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
      });

      // Chart should render without errors
      // (We can't easily test chart rendering, but we can verify no errors)
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should handle empty dailyTrends', async () => {
      const dataWithoutTrends = {
        ...mockTrackingData,
        dailyTrends: {},
      };

      vi.mocked(billing.getPaymentTracking).mockResolvedValue(dataWithoutTrends);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
      });

      // Should not crash with empty trends
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should handle undefined trackingData safely', async () => {
      // useMemo should handle undefined data with guard
      vi.mocked(billing.getPaymentTracking).mockResolvedValue(null as any);

      renderComponent();

      await waitFor(() => {
        // Should render null or error state, not crash
        expect(screen.queryByText(/payment tracking & reconciliation/i)).not.toBeInTheDocument();
      });

      // Should not throw hook order errors
      expect(mockLogger.error).not.toHaveBeenCalledWith(
        expect.stringContaining('hooks'),
        expect.anything(),
        expect.anything()
      );
    });
  });

  describe('CSV Export', () => {
    it('should export CSV successfully', async () => {
      vi.mocked(billing.getPaymentTracking).mockResolvedValue(mockTrackingData);

      // Mock URL.createObjectURL and document methods
      const mockCreateObjectURL = vi.fn(() => 'blob:url');
      const mockRevokeObjectURL = vi.fn();
      const mockClick = vi.fn();
      const mockRemoveChild = vi.fn();
      const mockAppendChild = vi.fn((element: any) => {
        element.click = mockClick;
        return element;
      });

      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      document.createElement = vi.fn(() => ({
        href: '',
        download: '',
        click: mockClick,
      })) as any;
      document.body.appendChild = mockAppendChild;
      document.body.removeChild = mockRemoveChild;

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/payment tracking & reconciliation/i)).toBeInTheDocument();
      });

      const exportButton = screen.getByText(/export csv/i);
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(mockLogger.debug).toHaveBeenCalledWith(
          'Payment Tracking CSV exported',
          expect.objectContaining({
            startDate: expect.any(String),
            endDate: expect.any(String),
          }),
          'PaymentTracking'
        );
      });

      expect(mockToast.success).toHaveBeenCalledWith(
        'Payment tracking report exported successfully'
      );
    });
  });
});

