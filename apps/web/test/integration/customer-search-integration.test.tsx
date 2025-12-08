/**
 * Customer Search Integration Tests
 * 
 * Integration tests for customer search flow, API → component
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import CustomerSearchSelector from '@/components/ui/CustomerSearchSelector';
import { secureApiClient } from '@/lib/secure-api-client';
import { createMockAccount } from '@/test/utils/testHelpers';

// Mock secureApiClient
vi.mock('@/lib/secure-api-client', () => ({
  secureApiClient: {
    getAllAccounts: vi.fn(),
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

describe('Customer Search Integration', () => {
  const mockCustomers = [
    createMockAccount({ id: 'account-1', name: 'John Doe', email: 'john@example.com' }),
    createMockAccount({ id: 'account-2', name: 'Jane Smith', email: 'jane@example.com' }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue(mockCustomers);
  });

  it('should fetch customers from API and display in search', async () => {
    const mockOnChange = vi.fn();

    render(
      <TestWrapper>
        <CustomerSearchSelector onChange={mockOnChange} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText(/search customers/i);
    fireEvent.focus(searchInput);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should filter customers by search term', async () => {
    const mockOnChange = vi.fn();

    render(
      <TestWrapper>
        <CustomerSearchSelector onChange={mockOnChange} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText(/search customers/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    fireEvent.focus(searchInput);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('should call onChange when customer is selected', async () => {
    const mockOnChange = vi.fn();

    render(
      <TestWrapper>
        <CustomerSearchSelector onChange={mockOnChange} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(secureApiClient.getAllAccounts).toHaveBeenCalled();
    });

    const searchInput = screen.getByPlaceholderText(/search customers/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    fireEvent.focus(searchInput);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const customerOption = screen.getByText('John Doe');
    fireEvent.click(customerOption);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('account-1', expect.objectContaining({ name: 'John Doe' }));
    });
  });
});

