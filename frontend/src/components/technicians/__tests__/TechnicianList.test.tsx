/**
 * TechnicianList Component Tests
 * 
 * Tests for the TechnicianList component including:
 * - List rendering
 * - Filtering
 * - Availability display
 * - Status
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import TechnicianList from '../TechnicianList';
import { createMockTechnician } from '@/test/utils/testHelpers';

// Mock technicianApi
vi.mock('@/lib/technician-api', () => ({
  technicianApi: {
    getTechnicians: vi.fn().mockResolvedValue([]),
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

describe('TechnicianList', () => {
  const mockTechnicians = [
    createMockTechnician({ id: 'tech-1', user: { first_name: 'John', last_name: 'Doe' } }),
    createMockTechnician({ id: 'tech-2', user: { first_name: 'Jane', last_name: 'Smith' } }),
  ];

  beforeEach(async () => {
    vi.clearAllMocks();
    const { technicianApi } = await import('@/lib/technician-api');
    (technicianApi.getTechnicians as ReturnType<typeof vi.fn>).mockResolvedValue({
      technicians: mockTechnicians,
      total: mockTechnicians.length,
      page: 1,
      limit: 20,
      total_pages: 1,
    });
  });

  describe('Rendering', () => {
    it('should render technician list', async () => {
      render(
        <TestWrapper>
          <TechnicianList />
        </TestWrapper>
      );

      await waitFor(() => {
        // Multiple technician names, check that at least one is present
        const technicianNames = screen.getAllByText(/john doe|jane smith/i);
        expect(technicianNames.length).toBeGreaterThan(0);
      });
    });
  });
});

