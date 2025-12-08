/**
 * WorkOrderForm Technicians Integration Tests
 * 
 * Tests to ensure technicians load correctly in the work order form dropdown
 * and catch bugs like technicians not populating
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import WorkOrderForm from '../WorkOrderForm';
import { enhancedApi } from '@/lib/enhanced-api';

// Mock enhancedApi
vi.mock('@/lib/enhanced-api', () => ({
  enhancedApi: {
    technicians: {
      list: vi.fn(),
    },
  },
}));

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

describe('WorkOrderForm - Technicians Loading', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Technicians API Call', () => {
    it('should call technicians.list() on mount', async () => {
      (enhancedApi.technicians.list as ReturnType<typeof vi.fn>).mockResolvedValue([
        { id: 'tech-1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
      ]);

      render(
        <TestWrapper>
          <WorkOrderForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(enhancedApi.technicians.list).toHaveBeenCalled();
      });
    });

    it('should handle successful technicians load', async () => {
      const mockTechnicians = [
        { id: 'tech-1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
        { id: 'tech-2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
      ];

      (enhancedApi.technicians.list as ReturnType<typeof vi.fn>).mockResolvedValue(mockTechnicians);

      render(
        <TestWrapper>
          <WorkOrderForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(enhancedApi.technicians.list).toHaveBeenCalled();
      });

      const technicianSelect = screen.getByLabelText(/assigned technician/i);
      expect(technicianSelect).toBeInTheDocument();
      expect(technicianSelect).not.toBeDisabled();

      // Check that technicians are available in dropdown
      await waitFor(() => {
        expect(technicianSelect).not.toHaveTextContent(/loading technicians/i);
      });
    });

    it('should handle API error gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      (enhancedApi.technicians.list as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Failed to fetch technicians')
      );

      render(
        <TestWrapper>
          <WorkOrderForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(enhancedApi.technicians.list).toHaveBeenCalled();
      });

      // Should show "Select technician" (not "Loading...")
      const technicianSelect = screen.getByLabelText(/assigned technician/i);
      await waitFor(() => {
        expect(technicianSelect).not.toHaveTextContent(/loading technicians/i);
      });

      consoleError.mockRestore();
    });

    it('should handle empty technicians array', async () => {
      (enhancedApi.technicians.list as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      render(
        <TestWrapper>
          <WorkOrderForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(enhancedApi.technicians.list).toHaveBeenCalled();
      });

      const technicianSelect = screen.getByLabelText(/assigned technician/i);
      await waitFor(() => {
        expect(technicianSelect).not.toHaveTextContent(/loading technicians/i);
        expect(technicianSelect).toHaveTextContent(/select technician/i);
      });
    });

    it('should handle paginated response format', async () => {
      const mockPaginatedResponse = {
        data: [
          { id: 'tech-1', first_name: 'John', last_name: 'Doe' },
        ],
        meta: { total: 1, page: 1, limit: 20 },
      };

      (enhancedApi.technicians.list as ReturnType<typeof vi.fn>).mockResolvedValue(mockPaginatedResponse);

      render(
        <TestWrapper>
          <WorkOrderForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(enhancedApi.technicians.list).toHaveBeenCalled();
      });

      // The component should extract data from paginated response
      const technicianSelect = screen.getByLabelText(/assigned technician/i);
      await waitFor(() => {
        expect(technicianSelect).not.toHaveTextContent(/loading technicians/i);
      });
    });

    it('should handle 404 error (missing version prefix bug)', async () => {
      const error = new Error('Cannot GET /api/technicians');
      (enhancedApi.technicians.list as ReturnType<typeof vi.fn>).mockRejectedValue(error);

      render(
        <TestWrapper>
          <WorkOrderForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(enhancedApi.technicians.list).toHaveBeenCalled();
      });

      // Should handle error gracefully and show empty dropdown
      const technicianSelect = screen.getByLabelText(/assigned technician/i);
      await waitFor(() => {
        expect(technicianSelect).not.toHaveTextContent(/loading technicians/i);
      });
    });
  });

  describe('Dropdown Population', () => {
    it('should populate dropdown with technician names', async () => {
      const mockTechnicians = [
        { id: 'tech-1', first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
        { id: 'tech-2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' },
      ];

      (enhancedApi.technicians.list as ReturnType<typeof vi.fn>).mockResolvedValue(mockTechnicians);

      render(
        <TestWrapper>
          <WorkOrderForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(enhancedApi.technicians.list).toHaveBeenCalled();
      });

      const technicianSelect = screen.getByLabelText(/assigned technician/i) as HTMLSelectElement;
      
      await waitFor(() => {
        // Should have options for technicians
        const options = Array.from(technicianSelect.options);
        expect(options.length).toBeGreaterThan(1); // More than just "Select technician"
      });
    });

    it('should show loading state while fetching', () => {
      (enhancedApi.technicians.list as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(
        <TestWrapper>
          <WorkOrderForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      const technicianSelect = screen.getByLabelText(/assigned technician/i);
      expect(technicianSelect).toBeDisabled();
      expect(technicianSelect).toHaveTextContent(/loading technicians/i);
    });
  });
});

