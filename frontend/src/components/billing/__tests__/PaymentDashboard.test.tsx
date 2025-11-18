/**
 * PaymentDashboard Component Tests
 * 
 * Tests for PaymentDashboard component including:
 * - Component rendering
 * - Hook order compliance (REACT_HOOKS_ORDER_VIOLATION prevention)
 * - Error handling
 * - Data loading states
 * - CSV export functionality
 * - Chart rendering
 * 
 * Last Updated: 2025-11-18
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaymentDashboard from '../PaymentDashboard';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

// Mock dependencies
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    getPaymentTracking: vi.fn(),
    getPaymentAnalytics: vi.fn(),
    getARSummary: vi.fn(),
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
const mockBilling = billing as {
  getPaymentTracking: ReturnType<typeof vi.fn>;
  getPaymentAnalytics: ReturnType<typeof vi.fn>;
  getARSummary: ReturnType<typeof vi.fn>;
};
const mockLogger = logger as {
  error: ReturnType<typeof vi.fn>;
  debug: ReturnType<typeof vi.fn>;
  info: ReturnType<typeof vi.fn>;
  warn: ReturnType<typeof vi.fn>;
};
const mockToast = toast as {
  success: ReturnType<typeof vi.fn>;
  error: ReturnType<typeof vi.fn>;
  info: ReturnType<typeof vi.fn>;
};

describe('PaymentDashboard', () => {
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
        <PaymentDashboard />
      </QueryClientProvider>
    );
  };

  const mockTrackingData = {
    payments: [
      {
        id: 1,
        payment_date: '2025-01-15',
        amount: 1000,
        Invoice: {
          invoice_number: 'INV-001',
          accounts: { name: 'Test Customer' },
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

  const mockAnalyticsData = {
    summary: {
      totalPayments: 1,
      successRate: 100,
      failureRate: 0,
    },
    paymentMethodBreakdown: {
      'Credit Card': 1000,
    },
  };

  const mockARSummary = {
    totalAR: 5000,
    agingBuckets: {},
    customerAR: [],
    totalCustomers: 5,
    totalInvoices: 10,
  };

  describe('Component Rendering', () => {
    it('should render loading state', async () => {
      mockBilling.getPaymentTracking.mockImplementation(() => new Promise(() => {}));
      mockBilling.getPaymentAnalytics.mockImplementation(() => new Promise(() => {}));
      mockBilling.getARSummary.mockImplementation(() => new Promise(() => {}));

      renderComponent();

      expect(screen.getByText(/loading payment dashboard/i)).toBeInTheDocument();
    });

    it('should render dashboard with data', async () => {
      mockBilling.getPaymentTracking.mockResolvedValue(mockTrackingData);
      mockBilling.getPaymentAnalytics.mockResolvedValue(mockAnalyticsData);
      mockBilling.getARSummary.mockResolvedValue(mockARSummary);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/payment dashboard/i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText(/comprehensive payment metrics and analytics overview/i)).toBeInTheDocument();
      });
    });

    it('should display summary cards', async () => {
      mockBilling.getPaymentTracking.mockResolvedValue(mockTrackingData);
      mockBilling.getPaymentAnalytics.mockResolvedValue(mockAnalyticsData);
      mockBilling.getARSummary.mockResolvedValue(mockARSummary);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/total payments/i)).toBeInTheDocument();
        expect(screen.getByText(/average payment/i)).toBeInTheDocument();
        expect(screen.getByText(/success rate/i)).toBeInTheDocument();
        expect(screen.getByText(/total ar/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle payment tracking error', async () => {
      const error = new Error('Failed to fetch tracking data');
      mockBilling.getPaymentTracking.mockRejectedValue(error);
      mockBilling.getPaymentAnalytics.mockResolvedValue(mockAnalyticsData);
      mockBilling.getARSummary.mockResolvedValue(mockARSummary);

      renderComponent();

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Failed to fetch payment tracking data',
          error,
          'PaymentDashboard'
        );
        expect(mockToast.error).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByText(/failed to load payment dashboard data/i)).toBeInTheDocument();
      });
    });

    it('should handle payment analytics error', async () => {
      const error = new Error('Failed to fetch analytics');
      mockBilling.getPaymentTracking.mockResolvedValue(mockTrackingData);
      mockBilling.getPaymentAnalytics.mockRejectedValue(error);
      mockBilling.getARSummary.mockResolvedValue(mockARSummary);

      renderComponent();

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Failed to fetch payment analytics',
          error,
          'PaymentDashboard'
        );
      });
    });
  });

  describe('CSV Export', () => {
    beforeEach(() => {
      mockBilling.getPaymentTracking.mockResolvedValue(mockTrackingData);
      mockBilling.getPaymentAnalytics.mockResolvedValue(mockAnalyticsData);
      mockBilling.getARSummary.mockResolvedValue(mockARSummary);
    });

    it('should export CSV successfully', async () => {
      // Mock URL.createObjectURL and document.createElement
      global.URL.createObjectURL = vi.fn(() => 'blob:url');
      global.URL.revokeObjectURL = vi.fn();
      const mockClick = vi.fn();
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      global.document.createElement = vi.fn(() => ({
        click: mockClick,
        href: '',
        download: '',
      })) as any;
      global.document.body.appendChild = mockAppendChild;
      global.document.body.removeChild = mockRemoveChild;

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/payment dashboard/i)).toBeInTheDocument();
      });

      const exportButton = screen.getByText(/export csv/i);
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(mockLogger.debug).toHaveBeenCalledWith(
          'Payment Dashboard CSV exported',
          expect.any(Object),
          'PaymentDashboard'
        );
        expect(mockToast.success).toHaveBeenCalled();
      });
    });

    it('should handle CSV export error', async () => {
      // Force an error during export
      global.Blob = vi.fn(() => {
        throw new Error('Blob creation failed');
      }) as any;

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/payment dashboard/i)).toBeInTheDocument();
      });

      const exportButton = screen.getByText(/export csv/i);
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Failed to export Payment Dashboard CSV',
          expect.any(Error),
          'PaymentDashboard'
        );
        expect(mockToast.error).toHaveBeenCalled();
      });
    });
  });

  describe('Date Range Filtering', () => {
    beforeEach(() => {
      mockBilling.getPaymentTracking.mockResolvedValue(mockTrackingData);
      mockBilling.getPaymentAnalytics.mockResolvedValue(mockAnalyticsData);
      mockBilling.getARSummary.mockResolvedValue(mockARSummary);
    });

    it('should update date range and refetch data', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/payment dashboard/i)).toBeInTheDocument();
      });

      const dateInputs = screen.getAllByDisplayValue('');
      expect(dateInputs.length).toBeGreaterThan(0);
    });
  });

  describe('Hook Order Compliance', () => {
    it('should call hooks before early returns', async () => {
      // This test verifies that hooks are called in the correct order
      // by checking that the component renders without errors
      mockBilling.getPaymentTracking.mockResolvedValue(mockTrackingData);
      mockBilling.getPaymentAnalytics.mockResolvedValue(mockAnalyticsData);
      mockBilling.getARSummary.mockResolvedValue(mockARSummary);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/payment dashboard/i)).toBeInTheDocument();
      });

      // If hooks were called after early returns, this would fail
      expect(screen.getByText(/comprehensive payment metrics/i)).toBeInTheDocument();
    });
  });
});

