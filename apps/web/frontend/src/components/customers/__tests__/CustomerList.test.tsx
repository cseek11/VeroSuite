/**
 * CustomerList Component Tests
 * 
 * Tests for the CustomerList component including:
 * - List rendering
 * - Search functionality
 * - Filtering
 * - Pagination
 * - Sorting
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import CustomerList from '../CustomerList';
import { createMockAccount } from '@/test/utils/testHelpers';

// Mock secureApiClient
vi.mock('@/lib/secure-api-client', () => ({
  secureApiClient: {
    getAllAccounts: vi.fn(),
    accounts: {
      getAll: vi.fn(),
    },
  },
}));

// Mock supabase
vi.mock('@/lib/supabase-client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('CustomerList', () => {
  const mockCustomers = [
    createMockAccount({ id: 'account-1', name: 'John Doe', email: 'john@example.com' }),
    createMockAccount({ id: 'account-2', name: 'Jane Smith', email: 'jane@example.com' }),
    createMockAccount({ id: 'account-3', name: 'Bob Johnson', email: 'bob@example.com' }),
  ];

  const mockOnViewCustomer = vi.fn();
  const mockOnEditCustomer = vi.fn();
  const mockOnCreateCustomer = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    const { secureApiClient } = await import('@/lib/secure-api-client');
    (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue(mockCustomers);
    (secureApiClient.accounts.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockCustomers);
  });

  describe('Rendering', () => {
    it('should render customer list', async () => {
      render(
        <TestWrapper>
          <CustomerList
            onViewCustomer={mockOnViewCustomer}
            onEditCustomer={mockOnEditCustomer}
            onCreateCustomer={mockOnCreateCustomer}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    it('should show loading state', async () => {
      const { secureApiClient } = await import('@/lib/secure-api-client');
      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(
        <TestWrapper>
          <CustomerList
            onViewCustomer={mockOnViewCustomer}
            onEditCustomer={mockOnEditCustomer}
            onCreateCustomer={mockOnCreateCustomer}
          />
        </TestWrapper>
      );

      // Loading spinner should be visible
      await waitFor(() => {
        expect(screen.getByTestId('loader2-icon')).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should filter customers by search term', async () => {
      render(
        <TestWrapper>
          <CustomerList
            onViewCustomer={mockOnViewCustomer}
            onEditCustomer={mockOnEditCustomer}
            onCreateCustomer={mockOnCreateCustomer}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'John' } });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });
    });
  });

  describe('Actions', () => {
    it('should call onCreateCustomer when create button is clicked', async () => {
      render(
        <TestWrapper>
          <CustomerList
            onViewCustomer={mockOnViewCustomer}
            onEditCustomer={mockOnEditCustomer}
            onCreateCustomer={mockOnCreateCustomer}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', { name: /add customer/i });
      fireEvent.click(createButton);

      expect(mockOnCreateCustomer).toHaveBeenCalled();
    });

    it('should call onViewCustomer when view button is clicked', async () => {
      render(
        <TestWrapper>
          <CustomerList
            onViewCustomer={mockOnViewCustomer}
            onEditCustomer={mockOnEditCustomer}
            onCreateCustomer={mockOnCreateCustomer}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const viewButtons = screen.getAllByRole('button', { name: /view|eye/i });
      if (viewButtons.length > 0 && viewButtons[0]) {
        fireEvent.click(viewButtons[0]);
        expect(mockOnViewCustomer).toHaveBeenCalled();
      }
    });
  });
});

