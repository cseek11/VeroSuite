/**
 * Work Orders Integration Tests
 * 
 * Integration tests for work order creation flow with customer/technician selection
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import WorkOrderForm from '@/components/work-orders/WorkOrderForm';
import { createMockAccount, createMockTechnician } from '@/test/utils/testHelpers';
import { enhancedApi } from '@/lib/enhanced-api';
import { secureApiClient } from '@/lib/secure-api-client';

// Mock APIs
vi.mock('@/lib/enhanced-api', () => ({
  enhancedApi: {
    technicians: {
      list: vi.fn(),
    },
  },
}));

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

describe('Work Orders Integration', () => {
  const mockCustomers = [
    createMockAccount({ id: 'account-1', name: 'Test Customer' }),
  ];

  const mockTechnicians = [
    createMockTechnician({ id: 'tech-1', user: { first_name: 'John', last_name: 'Doe' } }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (enhancedApi.technicians.list as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockTechnicians.map((tech) => ({
        id: tech.id,
        user_id: tech.user_id,
        email: tech.user?.email,
        first_name: tech.user?.first_name,
        last_name: tech.user?.last_name,
        status: 'active',
      }))
    );
    (secureApiClient.getAllAccounts as ReturnType<typeof vi.fn>).mockResolvedValue(mockCustomers);
  });

  it('should create work order with customer and technician', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <WorkOrderForm onSubmit={mockOnSubmit} onCancel={vi.fn()} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(enhancedApi.technicians.list).toHaveBeenCalled();
    });

    // Select customer
    const customerInput = screen.getByTestId('customer-search-input');
    fireEvent.change(customerInput, { target: { value: 'Test Customer' } });

    await waitFor(() => {
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });

    // Fill description
    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Integration test work order' } });

    // Select technician
    const technicianSelect = screen.getByLabelText(/assigned technician/i);
    await waitFor(() => {
      expect(technicianSelect).not.toBeDisabled();
    });
    fireEvent.change(technicianSelect, { target: { value: 'tech-1' } });

    // Submit
    const submitButton = screen.getByRole('button', { name: /create.*work.*order/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          customer_id: 'account-1',
          assigned_to: 'tech-1',
          description: 'Integration test work order',
        })
      );
    });
  });
});

