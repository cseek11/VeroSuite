/**
 * Technician List Integration Tests
 * 
 * Integration tests for technician listing flow, API → component
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import WorkOrderForm from '@/components/work-orders/WorkOrderForm';
import { enhancedApi } from '@/lib/enhanced-api';
import { createMockTechnician } from '@/test/utils/testHelpers';

// Mock enhancedApi
vi.mock('@/lib/enhanced-api', () => ({
  enhancedApi: {
    technicians: {
      list: vi.fn(),
    },
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

describe('Technician List Integration', () => {
  const mockTechnicians = [
    createMockTechnician({
      id: 'tech-1',
      user: { first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
    }),
    createMockTechnician({
      id: 'tech-2',
      user: { first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
    }),
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
  });

  it('should fetch technicians from API and display in dropdown', async () => {
    render(
      <TestWrapper>
        <WorkOrderForm onSubmit={vi.fn()} onCancel={vi.fn()} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(enhancedApi.technicians.list).toHaveBeenCalled();
    });

    const technicianSelect = screen.getByLabelText(/assigned technician/i);
    await waitFor(() => {
      expect(technicianSelect).not.toBeDisabled();
    });

    fireEvent.click(technicianSelect);

    await waitFor(() => {
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
    });
  });
});

