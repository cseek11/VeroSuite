/**
 * CustomerDetail Component Tests
 * 
 * Tests for the CustomerDetail component including:
 * - Data display
 * - Edit functionality
 * - Related data display
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import CustomerDetail from '../CustomerDetail';

// Mock Supabase
vi.mock('@/lib/supabase-client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: 'account-1',
          name: 'Test Customer',
          email: 'test@example.com',
          phone: '+1-555-0000',
          account_type: 'residential',
          status: 'active',
          customer_profiles: [],
          customer_contacts: [],
        },
        error: null,
      }),
    })),
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

describe('CustomerDetail', () => {
  const mockOnBack = vi.fn();
  const mockOnEdit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render customer details', async () => {
      render(
        <TestWrapper>
          <CustomerDetail
            customerId="account-1"
            onBack={mockOnBack}
            onEdit={mockOnEdit}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Customer')).toBeInTheDocument();
      });
    });

    it('should show loading state', async () => {
      const { supabase } = await import('@/lib/supabase-client');
      (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(
          () => new Promise(() => {}) // Never resolves
        ),
      });

      render(
        <TestWrapper>
          <CustomerDetail
            customerId="account-1"
            onBack={mockOnBack}
            onEdit={mockOnEdit}
          />
        </TestWrapper>
      );

      // Loading spinner doesn't have role="status", check for spinner element
      expect(screen.getByTestId('loader2-icon')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should call onBack when back button is clicked', async () => {
      render(
        <TestWrapper>
          <CustomerDetail
            customerId="account-1"
            onBack={mockOnBack}
            onEdit={mockOnEdit}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Customer')).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: /back|arrow/i });
      fireEvent.click(backButton);

      expect(mockOnBack).toHaveBeenCalled();
    });

    it('should call onEdit when edit button is clicked', async () => {
      render(
        <TestWrapper>
          <CustomerDetail
            customerId="account-1"
            onBack={mockOnBack}
            onEdit={mockOnEdit}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Customer')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalled();
    });
  });
});

