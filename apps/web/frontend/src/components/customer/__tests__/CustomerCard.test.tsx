/**
 * CustomerCard Component Tests
 * 
 * Tests for the CustomerCard component including:
 * - Card display
 * - Interactions
 * - Status indicators
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { CustomerCard } from '../CustomerCard';
import { createMockAccount } from '@/test/utils/testHelpers';

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

describe('CustomerCard', () => {
  const mockCustomer = createMockAccount({
    id: 'account-1',
    name: 'Test Customer',
    email: 'test@example.com',
    account_type: 'residential',
    status: 'active',
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOnClick = vi.fn();

  describe('Rendering', () => {
    it('should render customer card', () => {
      render(
        <TestWrapper>
          <CustomerCard
            customer={mockCustomer}
            onClick={mockOnClick}
            isSelected={false}
            densityMode="standard"
          />
        </TestWrapper>
      );

      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });

    it('should display customer email', () => {
      render(
        <TestWrapper>
          <CustomerCard
            customer={mockCustomer}
            onClick={mockOnClick}
            isSelected={false}
            densityMode="standard"
          />
        </TestWrapper>
      );

      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should display account type', () => {
      render(
        <TestWrapper>
          <CustomerCard
            customer={mockCustomer}
            onClick={mockOnClick}
            isSelected={false}
            densityMode="standard"
          />
        </TestWrapper>
      );

      expect(screen.getByText(/residential/i)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when card is clicked', () => {
      render(
        <TestWrapper>
          <CustomerCard
            customer={mockCustomer}
            onClick={mockOnClick}
            isSelected={false}
            densityMode="standard"
          />
        </TestWrapper>
      );

      const card = screen.getByText('Test Customer').closest('div');
      if (card) {
        fireEvent.click(card);
        expect(mockOnClick).toHaveBeenCalled();
      }
    });
  });
});

