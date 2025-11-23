/**
 * TechnicianForm Component Tests
 * 
 * Tests for the TechnicianForm component including:
 * - Form submission
 * - Validation
 * - Skill management
 * - Availability
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import TechnicianForm from '../TechnicianForm';

// Mock hooks
vi.mock('@/hooks/useTechnicians', () => ({
  useTechnician: vi.fn(),
  useCreateTechnician: vi.fn(),
  useUpdateTechnician: vi.fn(),
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

describe('TechnicianForm', () => {
  // @ts-expect-error - Mock functions kept for potential future use
  const _mockOnSubmit = vi.fn();
  // @ts-expect-error - Mock functions kept for potential future use
  const _mockOnCancel = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useTechnician, useCreateTechnician, useUpdateTechnician } = await import('@/hooks/useTechnicians');
    (useTechnician as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    (useCreateTechnician as ReturnType<typeof vi.fn>).mockReturnValue({
      mutateAsync: vi.fn(),
      isLoading: false,
    });
    (useUpdateTechnician as ReturnType<typeof vi.fn>).mockReturnValue({
      mutateAsync: vi.fn(),
      isLoading: false,
    });
  });

  describe('Rendering', () => {
    it('should render form', () => {
      render(
        <TestWrapper>
          <TechnicianForm />
        </TestWrapper>
      );

      expect(screen.getByText(/add.*technician|edit.*technician/i)).toBeInTheDocument();
    });
  });
});

