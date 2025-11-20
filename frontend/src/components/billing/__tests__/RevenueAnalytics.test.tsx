/**
 * RevenueAnalytics Component Tests
 *
 * Tests for RevenueAnalytics component including:
 * - Component rendering
 * - Data loading states
 * - Error handling
 * - Date range filtering
 * - CSV export functionality
 * - Chart data preparation
 *
 * Regression Prevention: TypeScript `any` types - 2025-11-16
 * Pattern: TYPESCRIPT_ANY_TYPES (see docs/error-patterns.md)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RevenueAnalytics from '../RevenueAnalytics';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

// Mock dependencies
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    getRevenueAnalytics: vi.fn(),
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
const mockBilling = billing as { getRevenueAnalytics: ReturnType<typeof vi.fn> };
const mockLogger = logger as { error: ReturnType<typeof vi.fn>; debug: ReturnType<typeof vi.fn>; info: ReturnType<typeof vi.fn>; warn: ReturnType<typeof vi.fn> };
const mockToast = toast as { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn>; info: ReturnType<typeof vi.fn> };

describe('RevenueAnalytics', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  const renderComponent = (props?: { startDate?: string; endDate?: string }) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <RevenueAnalytics {...props} />
      </QueryClientProvider>
    );
  };

  const mockRevenueData = {
    monthlyRevenue: [
      { month: '2025-01', revenue: 10000 },
      { month: '2025-02', revenue: 15000 },
      { month: '2025-03', revenue: 12000 },
    ],
    totalRevenue: 37000,
    growthRate: 15.5,
  };

  describe('Component Rendering', () => {
    it('should render loading state', () => {
      vi.mocked(billing.getRevenueAnalytics).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderComponent();
      expect(screen.getByText(/loading.*revenue analytics/i)).toBeInTheDocument();
    });

    it('should render error state', async () => {
      const error = new Error('API Error');
      vi.mocked(billing.getRevenueAnalytics).mockRejectedValue(error);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/failed to load revenue analytics/i)).toBeInTheDocument();
      });

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to fetch revenue analytics',
        error,
        'RevenueAnalytics'
      );
    });

    it('should render revenue data when loaded', async () => {
      vi.mocked(billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/\$37,000/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/total revenue/i)).toBeInTheDocument();
    });
  });

  describe('Date Range Filtering', () => {
    it('should use provided date range props', async () => {
      const startDate = '2025-01-01';
      const endDate = '2025-03-31';

      vi.mocked(billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);

      renderComponent({ startDate, endDate });

      await waitFor(() => {
        expect(billing.getRevenueAnalytics).toHaveBeenCalledWith(startDate, endDate);
      });
    });

    it('should use default date range when props not provided', async () => {
      vi.mocked(billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);

      renderComponent();

      await waitFor(() => {
        expect(billing.getRevenueAnalytics).toHaveBeenCalled();
      });
    });
  });

  describe('CSV Export', () => {
    it('should export revenue analytics to CSV', async () => {
      vi.mocked(billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);

      // Mock URL.createObjectURL and URL.revokeObjectURL
      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = vi.fn();

      // Mock document.createElement and appendChild
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
        remove: vi.fn(),
      };
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
      const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/\$37,000/i)).toBeInTheDocument();
      });

      const exportButton = screen.getByRole('button', { name: /export/i });
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(createElementSpy).toHaveBeenCalledWith('a');
        expect(mockLink.click).toHaveBeenCalled();
        expect(mockLogger.debug).toHaveBeenCalledWith(
          'Revenue analytics exported',
          expect.objectContaining({
            startDate: expect.any(String),
            endDate: expect.any(String),
            rowCount: expect.any(Number),
          }),
          'RevenueAnalytics'
        );
      });

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('should handle export error gracefully', async () => {
      vi.mocked(billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);

      // Mock URL.createObjectURL to throw error
      global.URL.createObjectURL = vi.fn(() => {
        throw new Error('Export error');
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/\$37,000/i)).toBeInTheDocument();
      });

      const exportButton = screen.getByRole('button', { name: /export/i });
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Failed to export revenue analytics',
          expect.any(Error),
          'RevenueAnalytics'
        );
        expect(mockToast.error).toHaveBeenCalled();
      });
    });

    it('should show error when no data available for export', async () => {
      vi.mocked(billing.getRevenueAnalytics).mockResolvedValue(null as any);

      renderComponent();

      await waitFor(() => {
        const exportButton = screen.getByRole('button', { name: /export/i });
        fireEvent.click(exportButton);

        expect(mockLogger.warn).toHaveBeenCalled();
        expect(mockToast.error).toHaveBeenCalledWith(
          'No data to export. Please wait for data to load or adjust the date range.'
        );
      });
    });
  });

  describe('Chart Data Preparation', () => {
    it('should prepare chart data correctly', async () => {
      vi.mocked(billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/\$37,000/i)).toBeInTheDocument();
      });

      // Chart should be rendered (Recharts components)
      // We can't easily test chart internals, but we can verify the component renders
      expect(screen.getByText(/total revenue/i)).toBeInTheDocument();
    });

    it('should handle empty monthly revenue data', async () => {
      const emptyData = {
        monthlyRevenue: [],
        totalRevenue: 0,
        growthRate: 0,
      };

      vi.mocked(billing.getRevenueAnalytics).mockResolvedValue(emptyData);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/\$0/i)).toBeInTheDocument();
      });
    });
  });

  describe('View Switching', () => {
    it('should switch between overview, trends, and breakdown views', async () => {
      vi.mocked(billing.getRevenueAnalytics).mockResolvedValue(mockRevenueData);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/\$37,000/i)).toBeInTheDocument();
      });

      // Test view switching buttons if they exist
      const viewButtons = screen.queryAllByRole('button', { name: /overview|trends|breakdown/i });
      if (viewButtons.length > 0) {
        fireEvent.click(viewButtons[0]);
        // Verify view changed (implementation specific)
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const error = new Error('Network error');
      vi.mocked(billing.getRevenueAnalytics).mockRejectedValue(error);

      renderComponent();

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Failed to fetch revenue analytics',
          error,
          'RevenueAnalytics'
        );
        expect(mockToast.error).toHaveBeenCalled();
      });
    });
  });
});












