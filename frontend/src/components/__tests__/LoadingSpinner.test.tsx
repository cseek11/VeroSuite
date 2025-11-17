import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingSpinner, PageLoader } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    // Loader2 icon has the size classes
    const loaderIcon = screen.getByTestId('loader2-icon');
    expect(loaderIcon).toHaveClass('w-4');
    expect(loaderIcon).toHaveClass('h-4');

    rerender(<LoadingSpinner size="lg" />);
    const loaderIconLarge = screen.getByTestId('loader2-icon');
    expect(loaderIconLarge).toHaveClass('w-8');
    expect(loaderIconLarge).toHaveClass('h-8');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    const container = screen.getByRole('status', { hidden: true }).parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner text="Loading..." />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('PageLoader', () => {
  it('renders with default text', () => {
    render(<PageLoader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<PageLoader text="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('has full screen layout', () => {
    render(<PageLoader />);
    const container = screen.getByText('Loading...').closest('.min-h-screen');
    expect(container).toBeInTheDocument();
  });
});
