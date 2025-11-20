/**
 * SavedPaymentMethods Component Tests
 * 
 * Tests for SavedPaymentMethods component including:
 * - Component rendering
 * - Adding payment methods
 * - Deleting payment methods
 * - Form validation
 * - Error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SavedPaymentMethods from '../SavedPaymentMethods';
import { billing } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import '@testing-library/jest-dom';

// Mock dependencies
vi.mock('@/lib/enhanced-api', () => ({
  billing: {
    getPaymentMethods: vi.fn(),
    createPaymentMethod: vi.fn(),
    deletePaymentMethod: vi.fn(),
  },
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('@/utils/toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const mockBilling = billing as {
  getPaymentMethods: ReturnType<typeof vi.fn>;
  createPaymentMethod: ReturnType<typeof vi.fn>;
  deletePaymentMethod: ReturnType<typeof vi.fn>;
};
const mockLogger = logger as { error: ReturnType<typeof vi.fn> };
const mockToast = toast as { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

describe('SavedPaymentMethods', () => {
  let queryClient: QueryClient;

  const mockPaymentMethods = [
    {
      id: 'pm-1',
      payment_type: 'credit_card' as const,
      payment_name: 'Visa ending in 1234',
      card_type: 'Visa',
      card_last4: '1234',
      card_expiry: '12/25',
      is_default: true,
    },
    {
      id: 'pm-2',
      payment_type: 'ach' as const,
      payment_name: 'Checking Account',
      is_default: false,
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();

    mockBilling.getPaymentMethods.mockResolvedValue(mockPaymentMethods);
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      accountId: 'acc-1',
      ...props,
    };

    return render(
      <QueryClientProvider client={queryClient}>
        <SavedPaymentMethods {...defaultProps} />
      </QueryClientProvider>
    );
  };

  describe('Component Rendering', () => {
    it('should render loading state initially', () => {
      mockBilling.getPaymentMethods.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderComponent();

      expect(screen.getByText(/loading.*payment.*methods/i)).toBeInTheDocument();
    });

    it('should render payment methods after loading', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/visa.*ending.*1234/i)).toBeInTheDocument();
        expect(screen.getByText(/checking.*account/i)).toBeInTheDocument();
      });
    });

    it('should display empty state when no payment methods', async () => {
      mockBilling.getPaymentMethods.mockResolvedValue([]);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/no.*payment.*methods/i)).toBeInTheDocument();
      });
    });
  });

  describe('Add Payment Method', () => {
    it('should open add modal when button clicked', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/add.*payment.*method/i)).toBeInTheDocument();
      });

      const addButton = screen.getByText(/add.*payment.*method/i);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText(/payment.*type/i)).toBeInTheDocument();
      });
    });

    it('should validate required fields', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/add.*payment.*method/i)).toBeInTheDocument();
      });

      const addButton = screen.getByText(/add.*payment.*method/i);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText(/payment.*type/i)).toBeInTheDocument();
      });

      const submitButton = screen.getByText(/save/i);
      fireEvent.click(submitButton);

      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });
    });

    it('should create payment method successfully', async () => {
      mockBilling.createPaymentMethod.mockResolvedValue({
        id: 'pm-3',
        payment_type: 'credit_card',
        payment_name: 'Mastercard ending in 5678',
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/add.*payment.*method/i)).toBeInTheDocument();
      });

      const addButton = screen.getByText(/add.*payment.*method/i);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/payment.*type/i)).toBeInTheDocument();
      });

      // Fill form
      const typeSelect = screen.getByLabelText(/payment.*type/i);
      fireEvent.change(typeSelect, { target: { value: 'credit_card' } });

      const nameInput = screen.getByLabelText(/payment.*name/i);
      fireEvent.change(nameInput, { target: { value: 'Mastercard ending in 5678' } });

      const submitButton = screen.getByText(/save/i);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockBilling.createPaymentMethod).toHaveBeenCalled();
      });

      expect(mockToast.success).toHaveBeenCalledWith('Payment method added successfully');
    });

    it('should handle create payment method error', async () => {
      mockBilling.createPaymentMethod.mockRejectedValue(new Error('API Error'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/add.*payment.*method/i)).toBeInTheDocument();
      });

      const addButton = screen.getByText(/add.*payment.*method/i);
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/payment.*type/i)).toBeInTheDocument();
      });

      // Fill form
      const typeSelect = screen.getByLabelText(/payment.*type/i);
      fireEvent.change(typeSelect, { target: { value: 'credit_card' } });

      const nameInput = screen.getByLabelText(/payment.*name/i);
      fireEvent.change(nameInput, { target: { value: 'Test Card' } });

      const submitButton = screen.getByText(/save/i);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalled();
      });

      expect(mockToast.error).toHaveBeenCalled();
    });
  });

  describe('Delete Payment Method', () => {
    it('should delete payment method successfully', async () => {
      mockBilling.deletePaymentMethod.mockResolvedValue({});

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/visa.*ending.*1234/i)).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Confirm deletion
      await waitFor(() => {
        const confirmButton = screen.getByText(/confirm|yes|delete/i);
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        expect(mockBilling.deletePaymentMethod).toHaveBeenCalled();
      });

      expect(mockToast.success).toHaveBeenCalledWith('Payment method deleted successfully');
    });

    it('should handle delete payment method error', async () => {
      mockBilling.deletePaymentMethod.mockRejectedValue(new Error('Delete failed'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/visa.*ending.*1234/i)).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Confirm deletion
      await waitFor(() => {
        const confirmButton = screen.getByText(/confirm|yes|delete/i);
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalled();
      });

      expect(mockToast.error).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      mockBilling.getPaymentMethods.mockRejectedValue(new Error('API Error'));

      renderComponent();

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalled();
      });
    });

    it('should display error message when payment methods fail to load', async () => {
      mockBilling.getPaymentMethods.mockRejectedValue(new Error('Failed to load'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText(/failed.*load/i)).toBeInTheDocument();
      });
    });
  });

  describe('Regression Prevention', () => {
    it('should handle undefined accountId', () => {
      renderComponent({ accountId: undefined as any });

      // Should not crash
      expect(screen.queryByText(/loading/i)).toBeInTheDocument();
    });

    it('should handle missing payment method properties', async () => {
      const incompleteMethods = [
        {
          id: 'pm-3',
          payment_type: 'credit_card' as const,
          // Missing other properties
        },
      ];

      mockBilling.getPaymentMethods.mockResolvedValue(incompleteMethods);

      renderComponent();

      await waitFor(() => {
        // Should not crash
        expect(screen.queryByText(/payment.*method/i)).toBeInTheDocument();
      });
    });
  });
});











