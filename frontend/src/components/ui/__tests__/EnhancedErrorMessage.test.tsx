/**
 * Enhanced Error Message Component Tests
 * 
 * Tests for the EnhancedErrorMessage component including:
 * - Error message display
 * - User-friendly message mapping
 * - Retry functionality
 * - Dismiss functionality
 * - Severity levels
 * - Suggestions display
 * - Accessibility
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EnhancedErrorMessage from '../EnhancedErrorMessage';

describe('EnhancedErrorMessage', () => {
  const mockOnRetry = vi.fn();
  const mockOnDismiss = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render error message from Error object', () => {
      const error = new Error('Network error');
      render(<EnhancedErrorMessage error={error} />);

      expect(screen.getByText(/unable to connect to the server/i)).toBeInTheDocument();
    });

    it('should render error message from string', () => {
      render(<EnhancedErrorMessage error="Something went wrong" />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should render context when provided', () => {
      const error = new Error('Failed to load');
      render(<EnhancedErrorMessage error={error} context="Failed to load customers" />);

      expect(screen.getByText('Failed to load customers')).toBeInTheDocument();
    });

    it('should render with error severity by default', () => {
      const error = new Error('Test error');
      render(<EnhancedErrorMessage error={error} />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-red-50', 'border-red-200');
    });

    it('should render with warning severity', () => {
      const error = new Error('Warning message');
      render(<EnhancedErrorMessage error={error} severity="warning" />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-yellow-50', 'border-yellow-200');
    });

    it('should render with info severity', () => {
      const error = new Error('Info message');
      render(<EnhancedErrorMessage error={error} severity="info" />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-blue-50', 'border-blue-200');
    });
  });

  describe('User-Friendly Messages', () => {
    it('should map network errors to user-friendly messages', () => {
      const error = new Error('network error');
      render(<EnhancedErrorMessage error={error} />);

      expect(screen.getByText(/unable to connect to the server/i)).toBeInTheDocument();
    });

    it('should map timeout errors to user-friendly messages', () => {
      const error = new Error('timeout');
      render(<EnhancedErrorMessage error={error} />);

      expect(screen.getByText(/request took too long/i)).toBeInTheDocument();
    });

    it('should map unauthorized errors to user-friendly messages', () => {
      const error = new Error('unauthorized');
      render(<EnhancedErrorMessage error={error} />);

      expect(screen.getByText(/not authorized/i)).toBeInTheDocument();
    });
  });

  describe('Suggestions', () => {
    it('should display default suggestions based on error type', () => {
      const error = new Error('network error');
      render(<EnhancedErrorMessage error={error} />);

      expect(screen.getByText(/suggestions:/i)).toBeInTheDocument();
      expect(screen.getByText(/check your internet connection/i)).toBeInTheDocument();
    });

    it('should display custom suggestions when provided', () => {
      const error = new Error('Custom error');
      const customSuggestions = ['Custom suggestion 1', 'Custom suggestion 2'];
      render(<EnhancedErrorMessage error={error} suggestions={customSuggestions} />);

      expect(screen.getByText('Custom suggestion 1')).toBeInTheDocument();
      expect(screen.getByText('Custom suggestion 2')).toBeInTheDocument();
    });

    it('should not display suggestions section if no suggestions available', () => {
      const error = new Error('Error without suggestions');
      render(<EnhancedErrorMessage error={error} suggestions={[]} />);

      expect(screen.queryByText(/suggestions:/i)).not.toBeInTheDocument();
    });
  });

  describe('Retry Functionality', () => {
    it('should render retry button when onRetry is provided', () => {
      const error = new Error('Retryable error');
      render(<EnhancedErrorMessage error={error} onRetry={mockOnRetry} />);

      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', async () => {
      const error = new Error('Retryable error');
      mockOnRetry.mockResolvedValue(undefined);

      render(<EnhancedErrorMessage error={error} onRetry={mockOnRetry} />);

      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(mockOnRetry).toHaveBeenCalledTimes(1);
      });
    });

    it('should show loading state while retrying', async () => {
      const error = new Error('Retryable error');
      mockOnRetry.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<EnhancedErrorMessage error={error} onRetry={mockOnRetry} />);

      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      expect(screen.getByText('Retrying...')).toBeInTheDocument();
      expect(retryButton).toBeDisabled();
    });

    it('should not render retry button when showRetry is false', () => {
      const error = new Error('Error');
      render(<EnhancedErrorMessage error={error} onRetry={mockOnRetry} showRetry={false} />);

      expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
    });
  });

  describe('Dismiss Functionality', () => {
    it('should render dismiss button when dismissible is true', () => {
      const error = new Error('Dismissible error');
      render(<EnhancedErrorMessage error={error} dismissible onDismiss={mockOnDismiss} />);

      expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
    });

    it('should call onDismiss when dismiss button is clicked', () => {
      const error = new Error('Dismissible error');
      render(<EnhancedErrorMessage error={error} dismissible onDismiss={mockOnDismiss} />);

      const dismissButton = screen.getByRole('button', { name: /dismiss/i });
      fireEvent.click(dismissButton);

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('should have dismiss button in top right when dismissible', () => {
      const error = new Error('Dismissible error');
      render(<EnhancedErrorMessage error={error} dismissible onDismiss={mockOnDismiss} />);

      const dismissButtons = screen.getAllByLabelText('Dismiss error');
      expect(dismissButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Technical Details', () => {
    it('should show technical details when showDetails is true', () => {
      const error = new Error('Technical error message');
      render(<EnhancedErrorMessage error={error} showDetails />);

      const details = screen.getByText('Technical Details');
      expect(details).toBeInTheDocument();
    });

    it('should not show technical details by default', () => {
      const error = new Error('Error message');
      render(<EnhancedErrorMessage error={error} />);

      expect(screen.queryByText('Technical Details')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert" for screen readers', () => {
      const error = new Error('Error message');
      render(<EnhancedErrorMessage error={error} />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should have aria-live="assertive"', () => {
      const error = new Error('Error message');
      render(<EnhancedErrorMessage error={error} />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveAttribute('aria-live', 'assertive');
    });

    it('should have aria-label for dismiss button', () => {
      const error = new Error('Dismissible error');
      render(<EnhancedErrorMessage error={error} dismissible onDismiss={mockOnDismiss} />);

      expect(screen.getByLabelText('Dismiss error')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const error = new Error('Error');
      render(<EnhancedErrorMessage error={error} className="custom-class" />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('custom-class');
    });
  });
});

