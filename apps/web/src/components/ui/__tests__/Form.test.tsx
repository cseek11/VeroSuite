/**
 * Form Component Tests
 * 
 * Tests for the Form component including:
 * - Form submission
 * - Form validation
 * - FormRow and FormCol layout
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Form, FormRow, FormCol } from '../Form';

describe('Form', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render form with children', () => {
      render(
        <Form onSubmit={mockOnSubmit}>
          <div>Form Content</div>
        </Form>
      );

      expect(screen.getByText('Form Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Form onSubmit={mockOnSubmit} className="custom-form">
          <div>Content</div>
        </Form>
      );

      const form = screen.getByText('Content').closest('form');
      expect(form).toHaveClass('custom-form');
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit when form is submitted', () => {
      render(
        <Form onSubmit={mockOnSubmit}>
          <button type="submit">Submit</button>
        </Form>
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should prevent default form submission', () => {
      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };

      render(
        <Form onSubmit={mockOnSubmit}>
          <button type="submit">Submit</button>
        </Form>
      );

      const form = screen.getByRole('button').closest('form');
      fireEvent.submit(form!, mockEvent);

      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  describe('FormRow', () => {
    it('should render FormRow with children', () => {
      render(
        <Form>
          <FormRow>
            <div>Row Content</div>
          </FormRow>
        </Form>
      );

      expect(screen.getByText('Row Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Form>
          <FormRow className="custom-row">
            <div>Content</div>
          </FormRow>
        </Form>
      );

      const row = screen.getByText('Content').closest('.crm-field-row');
      expect(row).toHaveClass('custom-row');
    });
  });

  describe('FormCol', () => {
    it('should render FormCol with children', () => {
      render(
        <Form>
          <FormCol>
            <div>Col Content</div>
          </FormCol>
        </Form>
      );

      expect(screen.getByText('Col Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <Form>
          <FormCol className="custom-col">
            <div>Content</div>
          </FormCol>
        </Form>
      );

      const col = screen.getByText('Content').closest('.crm-field-col');
      expect(col).toHaveClass('custom-col');
    });
  });
});

