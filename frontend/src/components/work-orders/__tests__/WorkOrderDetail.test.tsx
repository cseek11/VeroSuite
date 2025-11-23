/**
 * WorkOrderDetail Component Tests
 * 
 * Tests for the WorkOrderDetail component including:
 * - Data display
 * - Edit mode
 * - Status updates
 * - Related data display
 * - Delete functionality
 * - Job creation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import WorkOrderDetail from '../WorkOrderDetail';
import { createMockWorkOrder } from '@/test/utils/testHelpers';
import { WorkOrderStatus } from '@/types/work-orders';

// Mock hooks
vi.mock('@/hooks/useWorkOrders', () => ({
  useWorkOrder: vi.fn(),
  useUpdateWorkOrder: vi.fn(),
  useDeleteWorkOrder: vi.fn(),
}));

vi.mock('@/hooks/useJobs', () => ({
  useCreateJob: vi.fn(),
}));

vi.mock('@/hooks/useDialog', () => {
  const React = require('react');
  return {
    useDialog: vi.fn(() => ({
      showAlert: vi.fn().mockResolvedValue(undefined),
      showConfirm: vi.fn().mockResolvedValue(true),
      DialogComponents: () => React.createElement('div', { 'data-testid': 'dialog-components' }), // Return a component function
    })),
  };
});

// Mock WorkOrderStatusManager
vi.mock('../WorkOrderStatusManager', () => {
  const React = require('react');
  return {
    default: ({ workOrder, onStatusChange }: any) => {
      // Use string literal for status to avoid import issues
      return React.createElement('div', { 'data-testid': 'work-order-status-manager' },
        React.createElement('button', {
          onClick: () => onStatusChange?.(workOrder, 'in_progress')
        }, 'Update Status')
      );
    },
  };
});

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
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

describe('WorkOrderDetail', () => {
  const mockWorkOrder = createMockWorkOrder({
    id: 'wo-1',
    work_order_number: 'WO-001',
    description: 'Test work order',
    status: WorkOrderStatus.PENDING,
  });

  beforeEach(async () => {
    vi.clearAllMocks();

    const { useWorkOrder, useUpdateWorkOrder, useDeleteWorkOrder } = await import('@/hooks/useWorkOrders');
    const { useCreateJob } = await import('@/hooks/useJobs');

    (useWorkOrder as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockWorkOrder,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    (useUpdateWorkOrder as ReturnType<typeof vi.fn>).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(mockWorkOrder),
      isLoading: false,
    });

    (useDeleteWorkOrder as ReturnType<typeof vi.fn>).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isLoading: false,
    });

    (useCreateJob as ReturnType<typeof vi.fn>).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({ id: 'job-1' }),
      isLoading: false,
    });
  });

  describe('Rendering', () => {
    it('should render work order details', async () => {
      render(
        <TestWrapper>
          <WorkOrderDetail workOrderId="wo-1" />
        </TestWrapper>
      );

      await waitFor(() => {
        // Component displays "Work Order #WO-001"
        expect(screen.getByText(/Work Order #WO-001/i)).toBeInTheDocument();
        expect(screen.getByText('Test work order')).toBeInTheDocument();
      });
    });

    it('should show loading state', async () => {
      const { useWorkOrder } = await import('@/hooks/useWorkOrders');
      (useWorkOrder as ReturnType<typeof vi.fn>).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      render(
        <TestWrapper>
          <WorkOrderDetail workOrderId="wo-1" />
        </TestWrapper>
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should show error state', async () => {
      const { useWorkOrder } = await import('@/hooks/useWorkOrders');
      (useWorkOrder as ReturnType<typeof vi.fn>).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Failed to load'),
        refetch: vi.fn(),
      });

      render(
        <TestWrapper>
          <WorkOrderDetail workOrderId="wo-1" />
        </TestWrapper>
      );

      await waitFor(() => {
        // Multiple error text elements, check for error heading
        expect(screen.getByText(/error loading work order/i)).toBeInTheDocument();
      });
    });
  });

  describe('Actions', () => {
    it('should call onEdit when edit button is clicked', async () => {
      const mockOnEdit = vi.fn();

      render(
        <TestWrapper>
          <WorkOrderDetail workOrderId="wo-1" onEdit={mockOnEdit} />
        </TestWrapper>
      );

      await waitFor(() => {
        // Component displays "Work Order #WO-001"
        expect(screen.getByText(/Work Order #WO-001/i)).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(mockWorkOrder);
    });

    it('should call onDelete when delete is confirmed', async () => {
      const mockOnDelete = vi.fn();

      render(
        <TestWrapper>
          <WorkOrderDetail workOrderId="wo-1" onDelete={mockOnDelete} />
        </TestWrapper>
      );

      await waitFor(() => {
        // Component displays "Work Order #WO-001"
        expect(screen.getByText(/Work Order #WO-001/i)).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      // Wait for delete dialog to appear and confirm deletion
      await waitFor(() => {
        // The delete dialog should show a "Delete Work Order" button
        const confirmButton = screen.queryByRole('button', { name: /delete work order/i });
        expect(confirmButton).toBeInTheDocument();
        if (confirmButton) {
          fireEvent.click(confirmButton);
        }
      }, { timeout: 2000 });

      // Wait for delete mutation to complete and onDelete to be called
      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalledWith(mockWorkOrder);
      }, { timeout: 3000 });
    });

    it('should call onStatusChange when status is updated', async () => {
      const mockOnStatusChange = vi.fn();

      render(
        <TestWrapper>
          <WorkOrderDetail workOrderId="wo-1" onStatusChange={mockOnStatusChange} />
        </TestWrapper>
      );

      await waitFor(() => {
        // Component displays "Work Order #WO-001"
        expect(screen.getByText(/Work Order #WO-001/i)).toBeInTheDocument();
      });

      // Find and click status change button from WorkOrderStatusManager mock
      const statusButton = screen.getByRole('button', { name: /update status/i });
      if (statusButton) {
        fireEvent.click(statusButton);
        await waitFor(() => {
          expect(mockOnStatusChange).toHaveBeenCalled();
        });
      }
    });
  });
});

