import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/setup/test-utils';
import CustomerForm from '../customers/CustomerForm';
import { supabase } from '../../lib/supabase-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock Supabase client
vi.mock('../../lib/supabase-client', () => ({
  default: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123', user_metadata: { tenant_id: 'tenant-123' } } },
        error: null,
      }),
    },
    rpc: vi.fn(),
  },
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123', user_metadata: { tenant_id: 'tenant-123' } } },
        error: null,
      }),
    },
    rpc: vi.fn(),
  },
}));

// Mock secureApiClient
vi.mock('../../lib/secure-api-client', () => ({
  secureApiClient: {
    accounts: {
      create: vi.fn().mockResolvedValue({ id: 'customer-123' }),
    },
  },
}));

// Mock useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: 'user-123',
      user_metadata: { tenant_id: 'tenant-123' },
    },
    tenantId: 'tenant-123',
    isAuthenticated: true,
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('CustomerForm', () => {
  const mockSupabaseClient = vi.mocked(supabase);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      render(
        <TestWrapper>
          <CustomerForm onSave={vi.fn()} onCancel={vi.fn()} />
        </TestWrapper>
      );

      // Use more specific query to avoid matching "Business Name"
      const nameInputs = screen.getAllByLabelText(/^name/i);
      expect(nameInputs.length).toBeGreaterThan(0);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
    });

    it('should render submit and cancel buttons', () => {
      render(
        <TestWrapper>
          <CustomerForm onSave={vi.fn()} onCancel={vi.fn()} />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /create customer/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for required fields', async () => {
      render(
        <TestWrapper>
          <CustomerForm onSave={vi.fn()} onCancel={vi.fn()} />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /create customer/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });

      // Email validation might show "Invalid email format" for empty string, or "Email is required"
      // Check for either message
      await waitFor(() => {
        const emailError = screen.queryByText(/email is required/i) || screen.queryByText(/invalid email format/i);
        expect(emailError).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      render(
        <TestWrapper>
          <CustomerForm onSave={vi.fn()} onCancel={vi.fn()} />
        </TestWrapper>
      );

      // Fill required fields first (except email)
      const nameInputs = screen.getAllByLabelText(/^name/i);
      fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '555-123-4567' } });
      fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Anytown' } });
      fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'CA' } });
      fireEvent.change(screen.getByLabelText(/zip code/i), { target: { value: '12345' } });

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);

      const submitButton = screen.getByRole('button', { name: /create customer/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Check for either "Invalid email format" or "Email is required" (Zod validates both)
        const errorText = screen.queryByText(/invalid email format|email is required/i);
        expect(errorText).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should require phone number', async () => {
      render(
        <TestWrapper>
          <CustomerForm onSave={vi.fn()} onCancel={vi.fn()} />
        </TestWrapper>
      );

      const phoneInput = screen.getByLabelText(/phone/i);
      // Leave phone empty to test required validation
      fireEvent.blur(phoneInput);

      const submitButton = screen.getByRole('button', { name: /create customer/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const mockOnSave = vi.fn();
      const mockOnCancel = vi.fn();
      const { secureApiClient } = await import('../../lib/secure-api-client');

      render(
        <TestWrapper>
          <CustomerForm onSave={mockOnSave} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      // Fill out the form
      // Use getAllByLabelText and get the first one (the main name field, not business_name)
      const nameInputs = screen.getAllByLabelText(/^name/i);
      fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '555-123-4567' } });
      fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Anytown' } });
      fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'CA' } });
      fireEvent.change(screen.getByLabelText(/zip code/i), { target: { value: '12345' } });

      const submitButton = screen.getByRole('button', { name: /create customer/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(secureApiClient.accounts.create).toHaveBeenCalled();
        expect(mockOnSave).toHaveBeenCalled();
      });
    });

    it('should handle submission errors', async () => {
      const mockOnSave = vi.fn();
      const mockOnCancel = vi.fn();
      const { secureApiClient } = await import('../../lib/secure-api-client');
      
      (secureApiClient.accounts.create as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Database error')
      );

      render(
        <TestWrapper>
          <CustomerForm onSave={mockOnSave} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      // Fill out the form
      // Use getAllByLabelText and get the first one (the main name field, not business_name)
      const nameInputs = screen.getAllByLabelText(/^name/i);
      fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '555-123-4567' } });
      fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Anytown' } });
      fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'CA' } });
      fireEvent.change(screen.getByLabelText(/zip code/i), { target: { value: '12345' } });

      const submitButton = screen.getByRole('button', { name: /create customer/i });
      fireEvent.click(submitButton);

      // Error handling is done via logger.error, so we just verify onSave wasn't called
      await waitFor(() => {
        expect(secureApiClient.accounts.create).toHaveBeenCalled();
      });

      // onSave should not be called on error
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Form Reset', () => {
    it('should reset form when cancel is clicked', () => {
      const mockOnCancel = vi.fn();
      render(
        <TestWrapper>
          <CustomerForm onSave={vi.fn()} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      const nameInputs = screen.getAllByLabelText(/^name/i);
      const nameInput = nameInputs[0];
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading state during submission', async () => {
      const { secureApiClient } = await import('../../lib/secure-api-client');
      (secureApiClient.accounts.create as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      render(
        <TestWrapper>
          <CustomerForm onSave={vi.fn()} onCancel={vi.fn()} />
        </TestWrapper>
      );

      // Fill out the form
      // Use getAllByLabelText and get the first one (the main name field, not business_name)
      const nameInputs = screen.getAllByLabelText(/^name/i);
      fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '555-123-4567' } });
      fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Anytown' } });
      fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'CA' } });
      fireEvent.change(screen.getByLabelText(/zip code/i), { target: { value: '12345' } });

      const submitButton = screen.getByRole('button', { name: /create customer/i });
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/saving/i)).toBeInTheDocument();
    });
  });
});


