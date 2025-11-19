/**
 * PaymentConfirmation Component Tests
 * 
 * Tests for PaymentConfirmation component including:
 * - Component rendering
 * - Payment details display
 * - Receipt download
 * - Copy functionality
 * - Error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentConfirmation from '../PaymentConfirmation';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import '@testing-library/jest-dom';

// Mock dependencies
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

const mockLogger = logger as { error: ReturnType<typeof vi.fn>; debug: ReturnType<typeof vi.fn> };
const mockToast = toast as { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };

describe('PaymentConfirmation', () => {
  const mockInvoice = {
    id: 'inv-1',
    invoice_number: 'INV-001',
    total_amount: '1000.00',
    accounts: {
      id: 'acc-1',
      name: 'Test Customer',
      email: 'test@example.com',
    },
    status: 'paid',
    issue_date: '2025-01-01',
    due_date: '2025-01-31',
  };

  const mockPaymentIntent = {
    id: 'pi_test_1234567890',
    charges: {
      data: [
        { id: 'ch_test_1234567890' },
      ],
    },
  };

  const mockPaymentMethod = {
    id: 'pm-1',
    payment_type: 'credit_card' as const,
    payment_name: 'Visa ending in 1234',
    card_type: 'Visa',
    card_last4: '1234',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock URL.createObjectURL and document methods
    global.URL.createObjectURL = vi.fn(() => 'blob:url');
    global.URL.revokeObjectURL = vi.fn();
    document.createElement = vi.fn(() => ({
      href: '',
      download: '',
      click: vi.fn(),
    })) as any;
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
    
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve()),
      },
    });
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      invoice: mockInvoice,
      paymentIntent: mockPaymentIntent,
      paymentMethod: mockPaymentMethod,
      ...props,
    };

    return render(<PaymentConfirmation {...defaultProps} />);
  };

  describe('Component Rendering', () => {
    it('should render payment success message', () => {
      renderComponent();

      expect(screen.getByText(/payment.*successful/i)).toBeInTheDocument();
    });

    it('should display payment amount', () => {
      renderComponent();

      expect(screen.getByText(/\$1,000\.00/i)).toBeInTheDocument();
    });

    it('should display invoice number', () => {
      renderComponent();

      expect(screen.getByText('INV-001')).toBeInTheDocument();
    });

    it('should display customer email', () => {
      renderComponent();

      expect(screen.getByText(/test@example\.com/i)).toBeInTheDocument();
    });

    it('should display payment method when provided', () => {
      renderComponent();

      expect(screen.getByText(/visa.*ending.*1234/i)).toBeInTheDocument();
    });

    it('should display payment intent ID when provided', () => {
      renderComponent();

      expect(screen.getByText(/pi_test_1234567890/i)).toBeInTheDocument();
    });

    it('should display charge ID when provided', () => {
      renderComponent();

      expect(screen.getByText(/ch_test_1234567890/i)).toBeInTheDocument();
    });
  });

  describe('Receipt Download', () => {
    it('should download receipt when button clicked', () => {
      renderComponent();

      const downloadButton = screen.getByText(/download.*receipt/i);
      fireEvent.click(downloadButton);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Receipt downloaded',
        expect.objectContaining({ invoiceNumber: 'INV-001' }),
        'PaymentConfirmation'
      );
      expect(mockToast.success).toHaveBeenCalledWith('Receipt downloaded');
    });

    it('should handle receipt download error', () => {
      // Mock URL.createObjectURL to throw error
      global.URL.createObjectURL = vi.fn(() => {
        throw new Error('Blob error');
      });

      renderComponent();

      const downloadButton = screen.getByText(/download.*receipt/i);
      fireEvent.click(downloadButton);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to download receipt',
        expect.any(Error),
        'PaymentConfirmation'
      );
      expect(mockToast.error).toHaveBeenCalledWith(
        'Failed to download receipt. Please try again.'
      );
    });

    it('should call onDownloadReceipt callback when provided', () => {
      const onDownloadReceipt = vi.fn();
      renderComponent({ onDownloadReceipt });

      const downloadButton = screen.getByText(/download.*receipt/i);
      fireEvent.click(downloadButton);

      expect(onDownloadReceipt).toHaveBeenCalled();
    });
  });

  describe('Copy Functionality', () => {
    it('should copy invoice number to clipboard', async () => {
      renderComponent();

      const copyButton = screen.getByTitle(/copy.*invoice.*number/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('INV-001');
      });

      expect(mockToast.success).toHaveBeenCalledWith('Invoice number copied to clipboard');
    });

    it('should handle copy error', async () => {
      // Mock clipboard.writeText to throw error
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(() => Promise.reject(new Error('Clipboard error'))),
        },
      });

      renderComponent();

      const copyButton = screen.getByTitle(/copy.*invoice.*number/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Failed to copy invoice number',
          expect.any(Error),
          'PaymentConfirmation'
        );
      });

      expect(mockToast.error).toHaveBeenCalledWith('Failed to copy. Please try again.');
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button clicked', () => {
      const onClose = vi.fn();
      renderComponent({ onClose });

      const closeButton = screen.getByText(/close/i);
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('should not show close button when onClose not provided', () => {
      renderComponent({ onClose: undefined });

      expect(screen.queryByText(/close/i)).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing payment intent', () => {
      renderComponent({ paymentIntent: null });

      expect(screen.getByText(/payment.*successful/i)).toBeInTheDocument();
      expect(screen.queryByText(/pi_test/i)).not.toBeInTheDocument();
    });

    it('should handle missing payment method', () => {
      renderComponent({ paymentMethod: null });

      expect(screen.getByText(/payment.*successful/i)).toBeInTheDocument();
      expect(screen.queryByText(/visa/i)).not.toBeInTheDocument();
    });

    it('should handle missing customer email', () => {
      renderComponent({
        invoice: {
          ...mockInvoice,
          accounts: {
            ...mockInvoice.accounts,
            email: undefined,
          },
        },
      });

      expect(screen.getByText(/your email address/i)).toBeInTheDocument();
    });

    it('should handle payment intent without charges', () => {
      renderComponent({
        paymentIntent: {
          id: 'pi_test_123',
          charges: undefined,
        },
      });

      expect(screen.getByText(/payment.*successful/i)).toBeInTheDocument();
      expect(screen.queryByText(/ch_test/i)).not.toBeInTheDocument();
    });

    it('should handle payment intent with empty charges array', () => {
      renderComponent({
        paymentIntent: {
          id: 'pi_test_123',
          charges: {
            data: [],
          },
        },
      });

      expect(screen.getByText(/payment.*successful/i)).toBeInTheDocument();
      expect(screen.queryByText(/ch_test/i)).not.toBeInTheDocument();
    });
  });

  describe('Regression Prevention', () => {
    it('should handle undefined invoice gracefully', () => {
      renderComponent({ invoice: undefined as any });

      // Should not crash
      expect(screen.queryByText(/payment.*successful/i)).not.toBeInTheDocument();
    });

    it('should handle missing invoice properties', () => {
      renderComponent({
        invoice: {
          ...mockInvoice,
          invoice_number: undefined as any,
          total_amount: undefined as any,
        },
      });

      // Should not crash
      expect(screen.getByText(/payment.*successful/i)).toBeInTheDocument();
    });
  });
});








