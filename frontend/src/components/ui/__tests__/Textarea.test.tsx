/**
 * Textarea Component Tests
 * 
 * Tests for the Textarea component including:
 * - Text input
 * - Character count
 * - Validation
 * - Error handling
 * - Helper text
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Textarea from '../Textarea';

describe('Textarea', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render textarea', () => {
      render(<Textarea onChange={mockOnChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
    });

    it('should render label when provided', () => {
      render(<Textarea label="Description" onChange={mockOnChange} />);

      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should render error message when error prop is provided', () => {
      render(
        <Textarea
          onChange={mockOnChange}
          error="This field is required"
        />
      );

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should render helper text when helperText prop is provided', () => {
      render(
        <Textarea
          onChange={mockOnChange}
          helperText="Enter a description"
        />
      );

      expect(screen.getByText('Enter a description')).toBeInTheDocument();
    });
  });

  describe('Text Input', () => {
    it('should update value when text is entered', () => {
      render(<Textarea onChange={mockOnChange} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Test text' } });

      expect(textarea).toHaveValue('Test text');
    });

    it('should call onChange when text is entered', () => {
      render(<Textarea onChange={mockOnChange} />);

      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'Test text' } });

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('should respect rows prop', () => {
      render(<Textarea rows={5} onChange={mockOnChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    it('should use default rows when not provided', () => {
      render(<Textarea onChange={mockOnChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '3');
    });
  });

  describe('Disabled State', () => {
    it('should disable textarea when disabled prop is true', () => {
      render(<Textarea disabled onChange={mockOnChange} />);

      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-invalid when error is present', () => {
      render(
        <Textarea
          onChange={mockOnChange}
          error="Error message"
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have aria-describedby when error or helperText is present', () => {
      render(
        <Textarea
          onChange={mockOnChange}
          error="Error message"
        />
      );

      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby');
    });
  });
});

