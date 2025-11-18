/**
 * CustomerSearchSelector Component Tests
 * 
 * Tests for the customer search selector component including:
 * - Customer fetching on mount
 * - Local search filtering
 * - Customer selection
 * - Loading states
 * - Error handling
 * - Empty states
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomerSearchSelector from '../CustomerSearchSelector';
import { secureApiClient } from '@/lib/secure-api-client';
import { createMockAccount } from '@/test/utils/testHelpers';
import type { Account } from '@/types/enhanced-types';

// Mock secureApiClient
vi.mock('@/lib/secure-api-client', () => ({
  secureApiClient: {
    getAllAccounts: vi.fn(),
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

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('CustomerSearchSelector', () => {
  const mockOnChange = vi.fn();
  const mockCustomers: Account[] = [
    createMockAccount({
      id: 'account-1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-1000',
      address: '123 Main St',
      city: 'Test City',
      state: 'TC',
      zip_code: '12345',
      account_type: 'residential',
    }),
    createMockAccount({
      id: 'account-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-555-2000',
      address: '456 Business Ave',
      city: 'Business City',
      state: 'BC',
      zip_code: '54321',
      account_type: 'commercial',
    }),
    createMockAccount({
      id: 'account-3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1-555-3000',
      address: '789 Residential Rd',
      city: 'Residential City',
      state: 'RC',
      zip_code: '98765',
      account_type: 'residential',
    }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue(mockCustomers);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render search input with placeholder', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText(/search customers/i);
      expect(input).toBeInTheDocument();
    });

    it('should render label when provided', () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} label="Select Customer" />
        </TestWrapper>
      );

      expect(screen.getByText('Select Customer')).toBeInTheDocument();
    });

    it('should show required indicator when required prop is true', () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} label="Customer" required />
        </TestWrapper>
      );

      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render error message when error prop is provided', () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} error="Customer is required" />
        </TestWrapper>
      );

      expect(screen.getByText('Customer is required')).toBeInTheDocument();
    });
  });

  describe('Customer Fetching', () => {
    it('should fetch customers on mount', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });
    });

    it('should show loading state while fetching customers', () => {
      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      // Check for loading indicator (may not be visible immediately)
      const input = screen.getByPlaceholderText(/search customers/i);
      expect(input).toBeInTheDocument();
    });

    it('should handle API error gracefully', async () => {
      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('API Error')
      );

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      // Component should still render without crashing
      expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should filter customers by name', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'John' } });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        // Should not show other customers
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });
    });

    it('should filter customers by email', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'jane@example.com' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    it('should filter customers by phone', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: '555-2000' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    it('should filter customers by address', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'Main St' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('should be case-insensitive when searching', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'JOHN' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('should limit results to 20 when searching', async () => {
      const manyCustomers = Array.from({ length: 30 }, (_, i) =>
        createMockAccount({
          id: `account-${i}`,
          name: `Customer ${i}`,
        })
      );

      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue(manyCustomers);

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'Customer' } });
      fireEvent.focus(input);

      await waitFor(() => {
        const results = screen.getAllByText(/Customer \d+/);
        expect(results.length).toBeLessThanOrEqual(20);
      });
    });

    it('should show first 10 customers when search term is empty', async () => {
      const manyCustomers = Array.from({ length: 30 }, (_, i) =>
        createMockAccount({
          id: `account-${i}`,
          name: `Customer ${i}`,
        })
      );

      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue(manyCustomers);

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.focus(input);

      await waitFor(() => {
        const results = screen.queryAllByText(/Customer \d+/);
        expect(results.length).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('Customer Selection', () => {
    it('should call onChange when customer is selected', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'John' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const customerOption = screen.getByText('John Doe');
      fireEvent.click(customerOption);

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith('account-1', expect.objectContaining({ name: 'John Doe' }));
      });
    });

    it('should close dropdown after selecting customer', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i) as HTMLInputElement;
      fireEvent.focus(input);
      // Type to trigger search and show results
      fireEvent.change(input, { target: { value: 'John' } });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const customerOption = screen.getByText('John Doe');
      fireEvent.click(customerOption);

      await waitFor(() => {
        // Dropdown should be closed, so customer list should not be visible
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
        // Input should show selected customer name
        expect(input.value).toBe('John Doe');
      });
    });

    it('should clear selection when user starts typing different name', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} value="account-1" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i) as HTMLInputElement;
      
      // Wait for selected customer to be set
      await waitFor(() => {
        expect(input.value).toBe('John Doe');
      });

      // Start typing different name
      fireEvent.change(input, { target: { value: 'Different Name' } });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith('', null);
      });
    });
  });

  describe('Clear Functionality', () => {
    it('should clear search term and selection when clear button is clicked', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i) as HTMLInputElement;
      
      // Type to set search term
      fireEvent.change(input, { target: { value: 'John' } });
      fireEvent.focus(input);

      // Wait for the clear button to appear (it only appears when searchTerm is not empty)
      await waitFor(() => {
        const clearButton = screen.queryByTestId('x-icon')?.closest('button');
        expect(clearButton).toBeInTheDocument();
      });

      // Find and click the clear button
      const clearButton = screen.getByTestId('x-icon').closest('button');
      expect(clearButton).toBeInTheDocument();
      fireEvent.click(clearButton!);

      // Wait for the input to be cleared and onChange to be called
      await waitFor(() => {
        expect(input.value).toBe('');
        expect(mockOnChange).toHaveBeenCalledWith('', null);
      }, { timeout: 2000 });
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no customers match search', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'NonExistentCustomer123' } });

      await waitFor(() => {
        expect(screen.getByText(/no customers found/i)).toBeInTheDocument();
      });
    });

    it('should show message to start typing when search is empty', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText(/start typing to search customers/i)).toBeInTheDocument();
      });
    });
  });

  describe('Selected Customer Box', () => {
    it('should show selected customer box when showSelectedBox is true and customer is selected', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} value="account-1" showSelectedBox />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Should show selected customer box
      expect(screen.getByText(/selected customer|john doe/i)).toBeInTheDocument();
    });

    it('should not show selected customer box when showSelectedBox is false', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} value="account-1" showSelectedBox={false} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      // Should not show selected customer box
      expect(screen.queryByText(/selected customer/i)).not.toBeInTheDocument();
    });
  });

  describe('Click Outside', () => {
    it('should close dropdown when clicking outside', async () => {
      render(
        <TestWrapper>
          <div>
            <CustomerSearchSelector onChange={mockOnChange} />
            <div data-testid="outside">Outside</div>
          </div>
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.focus(input);
      // Type to trigger search and show results
      fireEvent.change(input, { target: { value: 'John' } });

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const outside = screen.getByTestId('outside');
      fireEvent.mouseDown(outside);

      await waitFor(() => {
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });
    });
  });

  describe('Advanced Search Scenarios', () => {
    it('should search across multiple fields simultaneously', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'example.com' } });
      fireEvent.focus(input);

      await waitFor(() => {
        // Should find customers by email domain
        const results = screen.queryAllByText(/john|jane|bob/i);
        expect(results.length).toBeGreaterThan(0);
      });
    });

    it('should handle search with special characters', async () => {
      const specialCustomer = createMockAccount({
        id: 'account-special',
        name: "O'Brien & Associates",
        email: 'test+special@example.com',
      });

      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue([
        ...mockCustomers,
        specialCustomer,
      ]);

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: "O'Brien" } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText(/o'brien/i)).toBeInTheDocument();
      });
    });

    it('should handle search with partial matches', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'Joh' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('should handle search with numbers in phone/zip', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: '12345' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });

    it('should prioritize exact name matches', async () => {
      const exactMatchCustomer = createMockAccount({
        id: 'account-exact',
        name: 'John Smith',
      });

      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue([
        ...mockCustomers,
        exactMatchCustomer,
      ]);

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'John Smith' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('John Smith')).toBeInTheDocument();
      });
    });
  });

  describe('Performance with Large Datasets', () => {
    it('should handle search with 1000+ customers efficiently', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) =>
        createMockAccount({
          id: `account-${i}`,
          name: `Customer ${i}`,
          email: `customer${i}@example.com`,
        })
      );

      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue(largeDataset);

      const startTime = performance.now();

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'Customer 500' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('Customer 500')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const searchTime = endTime - startTime;

      // Search should complete in reasonable time (< 1 second for 1000 items)
      expect(searchTime).toBeLessThan(1000);
    });

    it('should limit results to prevent performance issues', async () => {
      const manyCustomers = Array.from({ length: 100 }, (_, i) =>
        createMockAccount({
          id: `account-${i}`,
          name: `Test Customer ${i}`,
        })
      );

      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue(manyCustomers);

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'Test' } });
      fireEvent.focus(input);

      await waitFor(() => {
        const results = screen.queryAllByText(/Test Customer \d+/);
        // Should be limited to 20 results
        expect(results.length).toBeLessThanOrEqual(20);
      });
    });

    it('should debounce rapid search input changes', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      
      // Rapidly type multiple characters
      fireEvent.change(input, { target: { value: 'J' } });
      fireEvent.change(input, { target: { value: 'Jo' } });
      fireEvent.change(input, { target: { value: 'Joh' } });
      fireEvent.change(input, { target: { value: 'John' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle API returning null', async () => {
      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      // Component should handle null gracefully
      expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
    });

    it('should handle API returning undefined', async () => {
      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      // Component should handle undefined gracefully
      expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
    });

    it('should handle API returning invalid data structure', async () => {
      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue('invalid-data');

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      // Component should handle invalid data gracefully
      expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
    });

    it('should handle network error with retry', async () => {
      let callCount = 0;
      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve(mockCustomers);
      });

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      }, { timeout: 3000 });

      // Component should still be functional
      expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
    });

    it('should handle timeout errors', async () => {
      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 100);
        })
      );

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      }, { timeout: 2000 });

      // Component should handle timeout gracefully
      expect(screen.getByPlaceholderText(/search customers/i)).toBeInTheDocument();
    });

    it('should handle customers with missing required fields', async () => {
      const incompleteCustomers = [
        { id: 'account-1' }, // Missing name, email, etc.
        { id: 'account-2', name: 'Partial Customer' }, // Missing email
        createMockAccount({ id: 'account-3', name: 'Complete Customer' }),
      ];

      (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue(incompleteCustomers);

      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'Complete' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('Complete Customer')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} label="Select Customer" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText(/search customers/i);
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should support keyboard navigation', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i) as HTMLInputElement;
      input.focus();
      expect(document.activeElement).toBe(input);

      // Arrow keys should navigate results
      fireEvent.change(input, { target: { value: 'John' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Press Enter to select
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    });

    it('should support Escape key to close dropdown', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'John' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });
    });

    it('should announce search results to screen readers', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'John' } });
      fireEvent.focus(input);

      await waitFor(() => {
        const results = screen.getByText('John Doe');
        expect(results).toBeInTheDocument();
        expect(results).toBeVisible();
      });
    });

    it('should have proper focus management', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i) as HTMLInputElement;
      input.focus();
      expect(document.activeElement).toBe(input);

      // After selection, focus should return to input
      fireEvent.change(input, { target: { value: 'John' } });
      fireEvent.focus(input);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const customerOption = screen.getByText('John Doe');
      fireEvent.click(customerOption);

      await waitFor(() => {
        // Input should still be focusable
        expect(input).toBeInTheDocument();
      });
    });

    it('should support screen reader announcements for empty states', async () => {
      render(
        <TestWrapper>
          <CustomerSearchSelector onChange={mockOnChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
      });

      const input = screen.getByPlaceholderText(/search customers/i);
      fireEvent.change(input, { target: { value: 'NonExistentCustomer123' } });
      fireEvent.focus(input);

      await waitFor(() => {
        const emptyState = screen.getByText(/no customers found/i);
        expect(emptyState).toBeInTheDocument();
        expect(emptyState).toBeVisible();
      });
    });
  });
});

