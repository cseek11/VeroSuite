/**
 * Loading States Component Tests
 * 
 * Tests for the LoadingStates component library including:
 * - TableSkeleton
 * - CardSkeleton
 * - ListSkeleton
 * - FormSkeleton
 * - LoadingOverlay
 * - ProgressIndicator
 * - InlineLoading
 * - LoadingStateWrapper
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  TableSkeleton,
  CardSkeleton,
  ListSkeleton,
  FormSkeleton,
  LoadingOverlay,
  ProgressIndicator,
  InlineLoading,
  LoadingStateWrapper,
} from '../LoadingStates';

describe('LoadingStates', () => {
  describe('TableSkeleton', () => {
    it('should render table skeleton with default props', () => {
      render(<TableSkeleton />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should render specified number of rows', () => {
      render(<TableSkeleton rows={10} />);
      const rows = screen.getAllByRole('row');
      // Header row + 10 data rows
      expect(rows.length).toBe(11);
    });

    it('should render specified number of columns', () => {
      render(<TableSkeleton columns={6} />);
      const headerCells = screen.getAllByRole('columnheader');
      expect(headerCells.length).toBe(6);
    });

    it('should hide header when showHeader is false', () => {
      render(<TableSkeleton showHeader={false} />);
      expect(screen.queryByRole('columnheader')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<TableSkeleton className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('CardSkeleton', () => {
    it('should render card skeleton with default props', () => {
      render(<CardSkeleton />);
      const cards = screen.getAllByRole('article');
      expect(cards.length).toBe(3); // Default count
    });

    it('should render specified number of cards', () => {
      render(<CardSkeleton count={5} />);
      const cards = screen.getAllByRole('article');
      expect(cards.length).toBe(5);
    });

    it('should show image placeholder when showImage is true', () => {
      render(<CardSkeleton showImage />);
      const images = screen.getAllByRole('img', { hidden: true });
      expect(images.length).toBeGreaterThan(0);
    });

    it('should show footer when showFooter is true', () => {
      render(<CardSkeleton showFooter />);
      const footers = screen.getAllByRole('contentinfo');
      expect(footers.length).toBeGreaterThan(0);
    });

    it('should apply custom className', () => {
      const { container } = render(<CardSkeleton className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('ListSkeleton', () => {
    it('should render list skeleton with default props', () => {
      render(<ListSkeleton />);
      const items = screen.getAllByRole('listitem');
      expect(items.length).toBe(5); // Default count
    });

    it('should render specified number of items', () => {
      render(<ListSkeleton count={10} />);
      const items = screen.getAllByRole('listitem');
      expect(items.length).toBe(10);
    });

    it('should apply custom className', () => {
      const { container } = render(<ListSkeleton className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('FormSkeleton', () => {
    it('should render form skeleton', () => {
      render(<FormSkeleton />);
      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('should render specified number of fields', () => {
      render(<FormSkeleton fields={8} />);
      const fields = screen.getAllByRole('textbox', { hidden: true });
      expect(fields.length).toBe(8);
    });

    it('should apply custom className', () => {
      const { container } = render(<FormSkeleton className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('LoadingOverlay', () => {
    it('should render loading overlay', () => {
      render(<LoadingOverlay />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render custom message', () => {
      render(<LoadingOverlay message="Loading data..." />);
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<LoadingOverlay className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('ProgressIndicator', () => {
    it('should render progress indicator', () => {
      render(<ProgressIndicator />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should display progress percentage', () => {
      render(<ProgressIndicator progress={75} />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<ProgressIndicator className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('InlineLoading', () => {
    it('should render inline loading spinner', () => {
      render(<InlineLoading />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render with custom message', () => {
      render(<InlineLoading message="Loading..." />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<InlineLoading className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('LoadingStateWrapper', () => {
    it('should render skeleton when loading', () => {
      render(
        <LoadingStateWrapper
          isLoading={true}
          skeleton={<div data-testid="skeleton">Loading...</div>}
        >
          <div data-testid="content">Content</div>
        </LoadingStateWrapper>
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
    });

    it('should render content when not loading', () => {
      render(
        <LoadingStateWrapper
          isLoading={false}
          skeleton={<div data-testid="skeleton">Loading...</div>}
        >
          <div data-testid="content">Content</div>
        </LoadingStateWrapper>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    });

    it('should render error when provided', () => {
      const error = new Error('Loading failed');
      render(
        <LoadingStateWrapper
          isLoading={false}
          error={error}
          skeleton={<div data-testid="skeleton">Loading...</div>}
        >
          <div data-testid="content">Content</div>
        </LoadingStateWrapper>
      );

      expect(screen.getByText('Loading failed')).toBeInTheDocument();
    });
  });
});

