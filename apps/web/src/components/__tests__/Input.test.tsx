import { render, screen, fireEvent } from '../../test/setup/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Input from '../ui/Input';
import { Mail } from 'lucide-react';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<Input icon={Mail} />);
    expect(screen.getByRole('textbox')).toHaveClass('pl-10');
  });

  it('shows error state', () => {
    render(<Input error="Invalid email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<Input helperText="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input.closest('.custom-class')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Input label="Email" error="Invalid email" helperText="Helper text" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('generates unique id when not provided', () => {
    render(<Input label="Email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id');
  });

  it('uses provided id', () => {
    render(<Input id="custom-id" label="Email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-id');
  });
});
