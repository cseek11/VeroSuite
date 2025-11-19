/**
 * GlobalSearch Component Tests
 * 
 * Tests for the global search component including:
 * - Keyboard shortcut (Ctrl+K / Cmd+K)
 * - Search functionality across multiple entity types
 * - Results grouping and display
 * - Keyboard navigation
 * - Result selection and navigation
 * - Loading and error states
 * - Accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import GlobalSearch from '../GlobalSearch';
import { enhancedApi } from '@/lib/enhanced-api';
import { createMockAccount } from '@/test/utils/testHelpers';
import type { Account, WorkOrder, Job } from '@/types/enhanced-types';

// Mock enhanced-api
vi.mock('@/lib/enhanced-api', () => ({
  enhancedApi: {
    customers: {
      getAll: vi.fn(),
    },
    workOrders: {
      getAll: vi.fn(),
    },
    jobs: {
      getAll: vi.fn(),
    },
  },
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock trace propagation
vi.mock('@/lib/trace-propagation', () => ({
  getOrCreateTraceContext: vi.fn(() => ({
    traceId: 'test-trace-id',
    spanId: 'test-span-id',
    requestId: 'test-request-id',
  })),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  );
};

describe('GlobalSearch', () => {
  const mockCustomers: Account[] = [
    createMockAccount({
      id: 'customer-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-1000',
      address: '123 Main St',
    }),
    createMockAccount({
      id: 'customer-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-555-2000',
      address: '456 Business Ave',
    }),
  ];

  const mockWorkOrders: WorkOrder[] = [
    {
      id: 'wo-1',
      wo_number: 'WO-001',
      description: 'Fix plumbing',
      status: 'open',
      customer_id: 'customer-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as WorkOrder,
    {
      id: 'wo-2',
      wo_number: 'WO-002',
      description: 'Install HVAC',
      status: 'in_progress',
      customer_id: 'customer-2',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as WorkOrder,
  ];

  const mockJobs: Job[] = [
    {
      id: 'job-1',
      work_order_id: 'wo-1',
      technician_id: 'tech-1',
      scheduled_date: new Date().toISOString(),
      status: 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Job,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (enhancedApi.customers.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (enhancedApi.workOrders.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (enhancedApi.jobs.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Keyboard Shortcut', () => {
    it('should open search dialog when Ctrl+K is pressed', async () => {
      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Dialog should not be visible initially
      expect(screen.queryByPlaceholderText(/search customers/i)).not.toBeInTheDocument();

      // Simulate Ctrl+K
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });
    });

    it('should open search dialog when Cmd+K is pressed (Mac)', async () => {
      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Simulate Cmd+K
      fireEvent.keyDown(document, { key: 'k', metaKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should search customers when typing', async () => {
      (enhancedApi.customers.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockCustomers);

      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Open dialog
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });

      // Type search term
      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'john' } });

      // Wait for debounce
      await waitFor(
        () => {
          expect(enhancedApi.customers.getAll).toHaveBeenCalledWith({ search: 'john' });
        },
        { timeout: 500 }
      );
    });

    it('should search multiple entity types simultaneously', async () => {
      (enhancedApi.customers.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockCustomers);
      (enhancedApi.workOrders.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockWorkOrders);
      (enhancedApi.jobs.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockJobs);

      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Open dialog
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });

      // Type search term
      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'test' } });

      // Wait for debounce and API calls
      await waitFor(
        () => {
          expect(enhancedApi.customers.getAll).toHaveBeenCalled();
          expect(enhancedApi.workOrders.getAll).toHaveBeenCalled();
          expect(enhancedApi.jobs.getAll).toHaveBeenCalled();
        },
        { timeout: 500 }
      );
    });

    it('should not search if query is less than 2 characters', async () => {
      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Open dialog
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });

      // Type single character
      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'j' } });

      // Wait a bit to ensure no API calls
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(enhancedApi.customers.getAll).not.toHaveBeenCalled();
    });
  });

  describe('Results Display', () => {
    it('should display grouped results by entity type', async () => {
      (enhancedApi.customers.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockCustomers);
      (enhancedApi.workOrders.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockWorkOrders);

      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Open dialog
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });

      // Type search term
      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'test' } });

      // Wait for results
      await waitFor(
        () => {
          expect(screen.getByText(/customers/i)).toBeInTheDocument();
          expect(screen.getByText(/work orders/i)).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it('should show loading state while searching', async () => {
      (enhancedApi.customers.getAll as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      );

      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Open dialog
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });

      // Type search term
      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'test' } });

      // Should show loading
      await waitFor(() => {
        expect(screen.getByText(/searching/i)).toBeInTheDocument();
      });
    });

    it('should show empty state when no results found', async () => {
      (enhancedApi.customers.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);
      (enhancedApi.workOrders.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);
      (enhancedApi.jobs.getAll as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Open dialog
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });

      // Type search term
      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'nonexistent' } });

      // Wait for empty state
      await waitFor(
        () => {
          expect(screen.getByText(/no results found/i)).toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });

  describe('Keyboard Navigation', () => {
    it('should navigate results with arrow keys', async () => {
      (enhancedApi.customers.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockCustomers);

      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Open dialog
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });

      // Type search term
      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'john' } });

      // Wait for results
      await waitFor(
        () => {
          expect(screen.getByText('John Doe')).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      // Press arrow down
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      // First result should be selected (highlighted)
      const firstResult = screen.getByText('John Doe').closest('button');
      expect(firstResult).toHaveClass('bg-purple-50');
    });

    it('should close dialog with Escape key', async () => {
      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Open dialog
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/search customers/i);

      // Press Escape
      fireEvent.keyDown(input, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/search customers/i)).not.toBeInTheDocument();
      });
    });

    it('should select result with Enter key', async () => {
      (enhancedApi.customers.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockCustomers);

      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Open dialog
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });

      // Type search term
      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'john' } });

      // Wait for results
      await waitFor(
        () => {
          expect(screen.getByText('John Doe')).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      // Press Enter
      fireEvent.keyDown(input, { key: 'Enter' });

      // Should navigate to customer detail page
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/customers/customer-1');
      });
    });
  });

  describe('Result Selection', () => {
    it('should navigate to result when clicked', async () => {
      (enhancedApi.customers.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockCustomers);

      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Open dialog
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });

      // Type search term
      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'john' } });

      // Wait for results
      await waitFor(
        () => {
          expect(screen.getByText('John Doe')).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      // Click result
      const resultButton = screen.getByText('John Doe').closest('button');
      if (resultButton) {
        fireEvent.click(resultButton);
      }

      // Should navigate to customer detail page
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/customers/customer-1');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Open dialog
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        const input = screen.getByPlaceholderText(/search customers/i);
        expect(input).toHaveAttribute('aria-label', 'Global search');
        expect(input).toHaveAttribute('aria-autocomplete', 'list');
      });
    });

    it('should have proper role attributes', async () => {
      (enhancedApi.customers.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockCustomers);

      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Open dialog
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });

      // Type search term
      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'john' } });

      // Wait for results
      await waitFor(
        () => {
          const resultsContainer = screen.getByRole('listbox');
          expect(resultsContainer).toHaveAttribute('aria-label', 'Search results');
        },
        { timeout: 1000 }
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      (enhancedApi.customers.getAll as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('API Error')
      );

      render(
        <TestWrapper>
          <GlobalSearch />
        </TestWrapper>
      );

      // Open dialog
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
      });

      // Type search term
      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'test' } });

      // Should not crash, just show empty state
      await waitFor(
        () => {
          // Component should still be functional
          expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      consoleError.mockRestore();
    });
  });
});

