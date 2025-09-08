import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CustomerForm } from '../customers/CustomerForm';
import { supabase } from '../../lib/supabase-client';

// Mock Supabase client
vi.mock('../../lib/supabase-client', () => ({
  supabase: {
    from: vi.fn(),
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
          <CustomerForm onSuccess={vi.fn()} />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
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
          <CustomerForm onSuccess={vi.fn()} />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /save customer/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for required fields', async () => {
      render(
        <TestWrapper>
          <CustomerForm onSuccess={vi.fn()} />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /save customer/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      render(
        <TestWrapper>
          <CustomerForm onSuccess={vi.fn()} />
        </TestWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      const submitButton = screen.getByRole('button', { name: /save customer/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('should validate phone number format', async () => {
      render(
        <TestWrapper>
          <CustomerForm onSuccess={vi.fn()} />
        </TestWrapper>
      );

      const phoneInput = screen.getByLabelText(/phone/i);
      fireEvent.change(phoneInput, { target: { value: '123' } });

      const submitButton = screen.getByRole('button', { name: /save customer/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid phone number format/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const mockOnSuccess = vi.fn();
      const mockCustomer = {
        id: 'customer-123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip_code: '12345',
        tenant_id: 'tenant-123',
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockCustomer, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} />
        </TestWrapper>
      );

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '555-123-4567' } });
      fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Anytown' } });
      fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'CA' } });
      fireEvent.change(screen.getByLabelText(/zip code/i), { target: { value: '12345' } });

      const submitButton = screen.getByRole('button', { name: /save customer/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith(mockCustomer);
      });

      expect(mockQuery.insert).toHaveBeenCalledWith({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '555-123-4567',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip_code: '12345',
        tenant_id: 'tenant-123',
      });
    });

    it('should handle submission errors', async () => {
      const mockOnSuccess = vi.fn();
      const mockError = { message: 'Database error' };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} />
        </TestWrapper>
      );

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });

      const submitButton = screen.getByRole('button', { name: /save customer/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/database error/i)).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });

  describe('Form Reset', () => {
    it('should reset form when cancel is clicked', () => {
      render(
        <TestWrapper>
          <CustomerForm onSuccess={vi.fn()} />
        </TestWrapper>
      );

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'John' } });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(firstNameInput).toHaveValue('');
    });
  });

  describe('Loading States', () => {
    it('should show loading state during submission', async () => {
      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100))),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      render(
        <TestWrapper>
          <CustomerForm onSuccess={vi.fn()} />
        </TestWrapper>
      );

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
      fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });

      const submitButton = screen.getByRole('button', { name: /save customer/i });
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/saving/i)).toBeInTheDocument();
    });
  });
});


