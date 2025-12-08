/**
 * CustomerInfoPanel Component Tests
 * 
 * Tests for the CustomerInfoPanel component including:
 * - Panel rendering
 * - Data display
 * - Edit functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import CustomerInfoPanel from '../CustomerInfoPanel';
import { createMockAccount } from '@/test/utils/testHelpers';

// Mock enhancedApi
vi.mock('@/lib/enhanced-api', () => ({
  enhancedApi: {
    accounts: {
      update: vi.fn().mockResolvedValue({}),
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

describe('CustomerInfoPanel', () => {
  const mockCustomer = createMockAccount({
    id: 'account-1',
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '+1-555-0000',
    account_type: 'residential',
    status: 'active',
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render customer info panel', () => {
      render(
        <TestWrapper>
          <CustomerInfoPanel customer={mockCustomer} />
        </TestWrapper>
      );

      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });

    it('should display customer contact information', () => {
      render(
        <TestWrapper>
          <CustomerInfoPanel customer={mockCustomer} />
        </TestWrapper>
      );

      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('+1-555-0000')).toBeInTheDocument();
    });
  });
});

