/**
 * Select Component Tests
 * 
 * Tests for the Select component including:
 * - Option selection
 * - Search functionality
 * - Disabled states
 * - Error handling
 * - Helper text
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from '../Select';

describe('Select', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ];

  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render select with options', () => {
      render(<Select options={mockOptions} onChange={mockOnChange} />);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should render label when provided', () => {
      render(<Select label="Select Option" options={mockOptions} onChange={mockOnChange} />);

      expect(screen.getByText('Select Option')).toBeInTheDocument();
    });

    it('should render placeholder when provided', () => {
      render(
        <Select
          placeholder="Choose an option"
          options={mockOptions}
          onChange={mockOnChange}
        />
      );

      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('should render error message when error prop is provided', () => {
      render(
        <Select
          options={mockOptions}
          onChange={mockOnChange}
          error="This field is required"
        />
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should render helper text when helperText prop is provided', () => {
      render(
        <Select
          options={mockOptions}
          onChange={mockOnChange}
          helperText="Please select an option"
        />
      );

      expect(screen.getByText('Please select an option')).toBeInTheDocument();
    });
  });

  describe('Option Selection', () => {
    it('should call onChange when option is selected', () => {
      render(<Select options={mockOptions} onChange={mockOnChange} />);

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'option1' } });

      expect(mockOnChange).toHaveBeenCalledWith('option1');
    });

    it('should update value when option is selected', () => {
      const { rerender } = render(
        <Select options={mockOptions} onChange={mockOnChange} value="option1" />
      );

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('option1');

      rerender(<Select options={mockOptions} onChange={mockOnChange} value="option2" />);
      expect(select.value).toBe('option2');
    });

    it('should disable options marked as disabled', () => {
      render(<Select options={mockOptions} onChange={mockOnChange} />);

      screen.getByRole('combobox');
      const option3 = screen.getByText('Option 3').closest('option');
      expect(option3).toBeDisabled();
    });
  });

  describe('Disabled State', () => {
    it('should disable select when disabled prop is true', () => {
      render(<Select options={mockOptions} onChange={mockOnChange} disabled />);

      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-invalid when error is present', () => {
      render(
        <Select
          options={mockOptions}
          onChange={mockOnChange}
          error="Error message"
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-describedby when error or helperText is present', () => {
      render(
        <Select
          options={mockOptions}
          onChange={mockOnChange}
          error="Error message"
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby');
    });
  });

  describe('Regression Prevention: SELECT_UNDEFINED_OPTIONS - 2025-11-16', () => {
    // Pattern: SELECT_UNDEFINED_OPTIONS (see docs/error-patterns.md)
    // Test ensures the pattern doesn't regress - component should handle undefined/null options gracefully

    it('should not crash when options prop is undefined', () => {
      // This test prevents regression of the bug where Select crashed with
      // "Cannot read properties of undefined (reading 'map')"
      const { container } = render(
        <Select options={undefined as any} onChange={mockOnChange} />
      );

      // Component should render error state instead of crashing
      expect(container.querySelector('select')).toBeDisabled();
      expect(screen.getByText(/invalid options provided/i)).toBeInTheDocument();
    });

    it('should not crash when options prop is null', () => {
      // Regression test: Component should handle null options
      const { container } = render(
        <Select options={null as any} onChange={mockOnChange} />
      );

      // Component should render error state instead of crashing
      expect(container.querySelector('select')).toBeDisabled();
      expect(screen.getByText(/invalid options provided/i)).toBeInTheDocument();
    });

    it('should not crash when options prop is not an array', () => {
      // Regression test: Component should handle non-array values
      const { container } = render(
        <Select options={'not an array' as any} onChange={mockOnChange} />
      );

      // Component should render error state instead of crashing
      expect(container.querySelector('select')).toBeDisabled();
      expect(screen.getByText(/invalid options provided/i)).toBeInTheDocument();
    });

    it('should render normally when options is an empty array', () => {
      // Edge case: Empty array should be valid
      render(<Select options={[]} onChange={mockOnChange} />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select).not.toBeDisabled();
    });

    it('should handle async data loading scenario', () => {
      // Regression test: Component should handle options loaded asynchronously
      const { rerender } = render(
        <Select options={undefined as any} onChange={mockOnChange} />
      );

      // Initially shows error state
      expect(screen.getByText(/invalid options provided/i)).toBeInTheDocument();

      // After data loads, should render normally
      rerender(<Select options={mockOptions} onChange={mockOnChange} />);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.queryByText(/invalid options provided/i)).not.toBeInTheDocument();
    });
  });
});

