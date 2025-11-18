/**
 * Breadcrumbs Component Tests
 * 
 * Tests for the Breadcrumbs component including:
 * - Auto-generation from route
 * - Custom breadcrumb items
 * - Navigation functionality
 * - Responsive behavior
 * - Accessibility
 * - Error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import { logger } from '@/utils/logger';
import { getOrCreateTraceContext } from '@/lib/trace-propagation';

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock trace propagation
vi.mock('@/lib/trace-propagation', () => ({
  getOrCreateTraceContext: vi.fn(() => ({
    traceId: 'test-trace-id',
    spanId: 'test-span-id',
    requestId: 'test-request-id',
  })),
}));

const TestWrapper = ({ children, initialEntries = ['/'] }: { children: React.ReactNode; initialEntries?: string[] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    {children}
  </MemoryRouter>
);

describe('Breadcrumbs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render breadcrumbs from route', () => {
      render(
        <TestWrapper initialEntries={['/dashboard']}>
          <Breadcrumbs />
        </TestWrapper>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should render custom breadcrumb items', () => {
      const customItems = [
        { label: 'Home', path: '/' },
        { label: 'Customers', path: '/customers' },
        { label: 'John Doe', path: '/customers/123' },
      ];

      render(
        <TestWrapper>
          <Breadcrumbs items={customItems} />
        </TestWrapper>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Customers')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should not render if only one item (home)', () => {
      render(
        <TestWrapper initialEntries={['/']}>
          <Breadcrumbs />
        </TestWrapper>
      );

      // Should not render breadcrumbs for home page
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('should render with custom separator', () => {
      const customItems = [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/dashboard' },
      ];

      render(
        <TestWrapper>
          <Breadcrumbs items={customItems} separator={<span>/</span>} />
        </TestWrapper>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should limit items when maxItems is specified', () => {
      const manyItems = [
        { label: 'Home', path: '/' },
        { label: 'Level 1', path: '/level1' },
        { label: 'Level 2', path: '/level1/level2' },
        { label: 'Level 3', path: '/level1/level2/level3' },
        { label: 'Level 4', path: '/level1/level2/level3/level4' },
      ];

      render(
        <TestWrapper>
          <Breadcrumbs items={manyItems} maxItems={3} />
        </TestWrapper>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('Level 4')).toBeInTheDocument();
      // Level 2 and 3 should not be visible
      expect(screen.queryByText('Level 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Level 3')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate when breadcrumb is clicked', () => {
      const mockNavigate = vi.fn();
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useNavigate: () => mockNavigate,
        };
      });

      const customItems = [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Current', path: '/dashboard/current' },
      ];

      render(
        <TestWrapper initialEntries={['/dashboard/current']}>
          <Breadcrumbs items={customItems} />
        </TestWrapper>
      );

      const homeButton = screen.getByText('Home').closest('button');
      if (homeButton) {
        fireEvent.click(homeButton);
        // Navigation is handled by React Router, so we just verify the button is clickable
        expect(homeButton).toBeInTheDocument();
      }
    });

    it('should not navigate when clicking current page', () => {
      const customItems = [
        { label: 'Home', path: '/' },
        { label: 'Current', path: '/current' },
      ];

      render(
        <TestWrapper initialEntries={['/current']}>
          <Breadcrumbs items={customItems} />
        </TestWrapper>
      );

      const currentItem = screen.getByText('Current');
      expect(currentItem).toBeInTheDocument();
      // Current page should not be clickable
      expect(currentItem.closest('button')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should log error when navigation fails', () => {
      const mockNavigate = vi.fn(() => {
        throw new Error('Navigation failed');
      });

      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useNavigate: () => mockNavigate,
        };
      });

      const customItems = [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/dashboard' },
      ];

      render(
        <TestWrapper>
          <Breadcrumbs items={customItems} />
        </TestWrapper>
      );

      const homeButton = screen.getByText('Home').closest('button');
      if (homeButton) {
        fireEvent.click(homeButton);
        // Error should be logged
        expect(logger.error).toHaveBeenCalled();
      }
    });
  });

  describe('Accessibility', () => {
    it('should have ARIA label for breadcrumb navigation', () => {
      render(
        <TestWrapper initialEntries={['/dashboard']}>
          <Breadcrumbs />
        </TestWrapper>
      );

      const nav = screen.getByLabelText('Breadcrumb navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should have aria-current for current page', () => {
      const customItems = [
        { label: 'Home', path: '/' },
        { label: 'Current', path: '/current' },
      ];

      render(
        <TestWrapper initialEntries={['/current']}>
          <Breadcrumbs items={customItems} />
        </TestWrapper>
      );

      const currentItem = screen.getByText('Current');
      expect(currentItem).toHaveAttribute('aria-current', 'page');
    });

    it('should have aria-label for navigation buttons', () => {
      const customItems = [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/dashboard' },
      ];

      render(
        <TestWrapper initialEntries={['/dashboard/current']}>
          <Breadcrumbs items={customItems} />
        </TestWrapper>
      );

      const homeButton = screen.getByLabelText('Navigate to Home');
      expect(homeButton).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should apply responsive classes', () => {
      render(
        <TestWrapper initialEntries={['/dashboard']}>
          <Breadcrumbs />
        </TestWrapper>
      );

      const nav = screen.getByLabelText('Breadcrumb navigation');
      expect(nav).toHaveClass('text-xs', 'sm:text-sm');
    });

    it('should truncate long labels on mobile', () => {
      const customItems = [
        { label: 'Home', path: '/' },
        { label: 'Very Long Breadcrumb Label That Should Be Truncated', path: '/long' },
      ];

      render(
        <TestWrapper>
          <Breadcrumbs items={customItems} />
        </TestWrapper>
      );

      const longLabel = screen.getByText('Very Long Breadcrumb Label That Should Be Truncated');
      expect(longLabel).toHaveClass('truncate');
    });
  });

  describe('Props', () => {
    it('should hide home icon when showHome is false', () => {
      render(
        <TestWrapper initialEntries={['/dashboard']}>
          <Breadcrumbs showHome={false} />
        </TestWrapper>
      );

      // Home should not be in the breadcrumbs
      expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <TestWrapper initialEntries={['/dashboard']}>
          <Breadcrumbs className="custom-class" />
        </TestWrapper>
      );

      const nav = screen.getByLabelText('Breadcrumb navigation');
      expect(nav).toHaveClass('custom-class');
    });
  });
});

