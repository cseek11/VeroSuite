/**
 * Checkbox Component Tests
 * 
 * Tests for the Checkbox component including:
 * - Check/uncheck functionality
 * - Indeterminate state
 * - Disabled state
 * - Error handling
 * - Helper text
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from '../Checkbox';

describe('Checkbox', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render checkbox', () => {
      render(<Checkbox onChange={mockOnChange} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should render label when provided', () => {
      render(<Checkbox label="Checkbox Label" onChange={mockOnChange} />);

      expect(screen.getByText('Checkbox Label')).toBeInTheDocument();
    });

    it('should render error message when error prop is provided', () => {
      render(
        <Checkbox
          onChange={mockOnChange}
          error="This field is required"
        />
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should render helper text when helperText prop is provided', () => {
      render(
        <Checkbox
          onChange={mockOnChange}
          helperText="Please check this box"
        />
      );

      expect(screen.getByText('Please check this box')).toBeInTheDocument();
    });
  });

  describe('Check/Uncheck Functionality', () => {
    it('should call onChange with true when checked', () => {
      render(<Checkbox onChange={mockOnChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnChange).toHaveBeenCalledWith(true);
    });

    it('should call onChange with false when unchecked', () => {
      render(<Checkbox checked={true} onChange={mockOnChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnChange).toHaveBeenCalledWith(false);
    });

    it('should update checked state', () => {
      const { rerender } = render(
        <Checkbox checked={false} onChange={mockOnChange} />
      );

      let checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      rerender(<Checkbox checked={true} onChange={mockOnChange} />);
      checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });
  });

  describe('Indeterminate State', () => {
    it('should support indeterminate state', () => {
      render(<Checkbox indeterminate onChange={mockOnChange} />);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });
  });

  describe('Disabled State', () => {
    it('should disable checkbox when disabled prop is true', () => {
      render(<Checkbox disabled onChange={mockOnChange} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('should not call onChange when disabled', () => {
      render(<Checkbox disabled onChange={mockOnChange} />);

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-invalid when error is present', () => {
      render(
        <Checkbox
          onChange={mockOnChange}
          error="Error message"
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-describedby when error or helperText is present', () => {
      render(
        <Checkbox
          onChange={mockOnChange}
          error="Error message"
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby');
    });
  });
});

