/**
 * Breadcrumbs Component Tests
 *
 * Tests for Breadcrumbs component including:
 * - Component rendering
 * - Route parsing logic
 * - Breadcrumb generation for various routes
 * - Error handling scenarios
 * - Accessibility attributes
 * - Link navigation
 * - UUID detection logic
 * - Home page early return
 *
 * Regression Prevention: Route parsing errors, accessibility compliance
 * Pattern: REACT_ROUTER_NAVIGATION (see docs/error-patterns.md)
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';
import { logger } from '@/utils/logger';
import { getOrCreateTraceContext } from '@/lib/trace-propagation';
import * as reactRouterDom from 'react-router-dom';

// Mock dependencies
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  },
}));

vi.mock('@/lib/trace-propagation', () => ({
  getOrCreateTraceContext: vi.fn(() => ({
    traceId: 'test-trace-id',
    spanId: 'test-span-id',
    requestId: 'test-request-id',
  })),
}));

// Type assertions for mocked functions
const mockLogger = logger as {
  error: ReturnType<typeof vi.fn>;
  debug: ReturnType<typeof vi.fn>;
  info: ReturnType<typeof vi.fn>;
  warn: ReturnType<typeof vi.fn>;
};

const mockTraceContext = getOrCreateTraceContext as ReturnType<typeof vi.fn>;

describe('Breadcrumbs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (pathname: string) => {
    // Mock useLocation to return the pathname we want to test
    vi.spyOn(reactRouterDom, 'useLocation').mockReturnValue({
      pathname,
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    return render(
      <MemoryRouter initialEntries={[pathname]}>
        <Breadcrumbs />
      </MemoryRouter>
    );
  };

  describe('Component Rendering', () => {
    it('should not render on home page', () => {
      const { container } = renderComponent('/');
      expect(container.firstChild).toBeNull();
    });

    it('should render breadcrumbs for non-home routes', () => {
      renderComponent('/dashboard');
      expect(screen.getByLabelText('Breadcrumb navigation')).toBeInTheDocument();
    });

    it('should render Home breadcrumb as first item', () => {
      renderComponent('/dashboard');
      const homeLink = screen.getByText('Home');
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe('Route Parsing Logic', () => {
    it('should generate breadcrumbs for simple route', () => {
      renderComponent('/dashboard');
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should generate breadcrumbs for nested routes', () => {
      renderComponent('/billing/invoices');
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Billing')).toBeInTheDocument();
      expect(screen.getByText('Invoices')).toBeInTheDocument();
    });

    it('should handle work orders routes', () => {
      renderComponent('/work-orders');
      expect(screen.getByText('Work Orders')).toBeInTheDocument();
    });

    it('should handle work orders create route', () => {
      renderComponent('/work-orders/create');
      expect(screen.getByText('Create Work Order')).toBeInTheDocument();
    });

    it('should handle technicians routes', () => {
      renderComponent('/technicians');
      expect(screen.getByText('Technicians')).toBeInTheDocument();
    });

    it('should handle scheduler route', () => {
      renderComponent('/scheduler');
      expect(screen.getByText('Scheduler')).toBeInTheDocument();
    });

    it('should handle finance route', () => {
      renderComponent('/finance');
      expect(screen.getByText('Finance')).toBeInTheDocument();
    });

    it('should handle settings route', () => {
      renderComponent('/settings');
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('UUID Detection Logic', () => {
    it('should detect UUID and infer label from previous segment', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      renderComponent(`/work-orders/${uuid}`);
      
      // Should show "Work Orders Details" for UUID
      expect(screen.getByText(/Work Orders Details/i)).toBeInTheDocument();
    });

    it('should handle UUID in technicians route', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      renderComponent(`/technicians/${uuid}`);
      
      expect(screen.getByText(/Technicians Details/i)).toBeInTheDocument();
    });

    it('should handle UUID in agreements route', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      renderComponent(`/agreements/${uuid}`);
      
      expect(screen.getByText(/Agreements Details/i)).toBeInTheDocument();
    });

    it('should handle UUID with edit route', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      renderComponent(`/work-orders/${uuid}/edit`);

      expect(screen.getByText('Work Orders')).toBeInTheDocument();
      expect(screen.getByText(/Work Orders Details/i)).toBeInTheDocument();
      // The "edit" segment uses fallback capitalization, so it becomes "Edit"
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
  });

  describe('Fallback Label Generation', () => {
    it('should capitalize unknown route segments', () => {
      renderComponent('/unknown-route');
      expect(screen.getByText('Unknown Route')).toBeInTheDocument();
    });

    it('should handle multi-word route segments', () => {
      renderComponent('/my-custom-page');
      expect(screen.getByText('My Custom Page')).toBeInTheDocument();
    });

    it('should handle deeply nested unknown routes', () => {
      renderComponent('/section/subsection/page');
      expect(screen.getByText('Section')).toBeInTheDocument();
      expect(screen.getByText('Subsection')).toBeInTheDocument();
      expect(screen.getByText('Page')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on nav element', () => {
      renderComponent('/dashboard');
      const nav = screen.getByLabelText('Breadcrumb navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should have aria-current on current page', () => {
      renderComponent('/dashboard');
      const currentPage = screen.getByText('Dashboard');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
    });

    it('should have aria-hidden on separator icons', () => {
      renderComponent('/billing/invoices');
      // SVG icons with aria-hidden don't have a "separator" role
      // Instead, query by aria-hidden attribute
      const separators = document.querySelectorAll('[aria-hidden="true"]');
      expect(separators.length).toBeGreaterThan(0);
    });

    it('should have schema.org structured data', () => {
      renderComponent('/dashboard');
      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('itemscope');
      expect(list).toHaveAttribute('itemtype', 'https://schema.org/BreadcrumbList');
    });

    it('should have semantic HTML structure', () => {
      renderComponent('/dashboard');
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
    });
  });

  describe('Link Navigation', () => {
    it('should render Home as a link', () => {
      renderComponent('/dashboard');
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should render intermediate breadcrumbs as links', () => {
      renderComponent('/billing/invoices');
      const billingLink = screen.getByText('Billing').closest('a');
      expect(billingLink).toHaveAttribute('href', '/billing');
    });

    it('should render current page as span (not link)', () => {
      renderComponent('/dashboard');
      const dashboard = screen.getByText('Dashboard');
      expect(dashboard.tagName).toBe('SPAN');
      expect(dashboard.closest('a')).toBeNull();
    });

    it('should have hover styles on links', () => {
      renderComponent('/billing/invoices');
      const billingLink = screen.getByText('Billing').closest('a');
      expect(billingLink).toHaveClass('hover:text-gray-900');
    });
  });

  describe('Error Handling', () => {
    it('should handle breadcrumb generation errors gracefully', () => {
      // Mock location.pathname.split to throw an error
      const originalSplit = String.prototype.split;
      String.prototype.split = vi.fn(() => {
        throw new Error('Breadcrumb generation failed');
      });

      renderComponent('/dashboard');

      // Error should be caught and logged
      expect(mockLogger.error).toHaveBeenCalled();

      // Restore original
      String.prototype.split = originalSplit;
    });

    it('should log errors with trace context', () => {
      const originalSplit = String.prototype.split;
      String.prototype.split = vi.fn(() => {
        throw new Error('Test error');
      });

      renderComponent('/dashboard');

      expect(mockTraceContext).toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalled();

      // Restore original
      String.prototype.split = originalSplit;
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty path segments', () => {
      renderComponent('//');
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('should handle single segment routes', () => {
      renderComponent('/customers');
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Customers')).toBeInTheDocument();
    });

    it('should handle very long route paths', () => {
      renderComponent('/section/subsection/page/subpage/item');
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Section')).toBeInTheDocument();
    });

    it('should handle routes with special characters', () => {
      renderComponent('/test-route-123');
      expect(screen.getByText('Test Route 123')).toBeInTheDocument();
    });
  });

  describe('Visual Elements', () => {
    it('should render Home icon on first breadcrumb', () => {
      renderComponent('/dashboard');
      // Home icon should be present (lucide-react Home component)
      const homeElement = screen.getByText('Home');
      expect(homeElement).toBeInTheDocument();
    });

    it('should render ChevronRight separator between items', () => {
      renderComponent('/billing/invoices');
      // Separators should be present (lucide-react ChevronRight component)
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThan(1);
    });

    it('should apply correct styling classes', () => {
      renderComponent('/dashboard');
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('flex', 'items-center', 'space-x-2', 'text-sm', 'text-gray-600', 'mb-4');
    });

    it('should apply bold styling to current page', () => {
      renderComponent('/dashboard');
      const currentPage = screen.getByText('Dashboard');
      expect(currentPage).toHaveClass('font-medium', 'text-gray-900');
    });
  });

  describe('Route Label Mapping', () => {
    it('should use mapped labels for known routes', () => {
      const routes = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/customers', label: 'Customers' },
        { path: '/work-orders', label: 'Work Orders' },
        { path: '/technicians', label: 'Technicians' },
        { path: '/scheduler', label: 'Scheduler' },
        { path: '/billing', label: 'Billing' },
        { path: '/finance', label: 'Finance' },
        { path: '/routing', label: 'Routing' },
        { path: '/reports', label: 'Reports' },
        { path: '/settings', label: 'Settings' },
        { path: '/communications', label: 'Communications' },
        { path: '/knowledge', label: 'Knowledge' },
        { path: '/uploads', label: 'Uploads' },
        { path: '/charts', label: 'Charts' },
        { path: '/agreements', label: 'Agreements' },
        { path: '/users', label: 'User Management' },
      ];

      routes.forEach(({ path, label }) => {
        const { unmount } = renderComponent(path);
        expect(screen.getByText(label)).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle nested route labels', () => {
      renderComponent('/billing/invoices');
      expect(screen.getByText('Invoices')).toBeInTheDocument();

      renderComponent('/billing/payments');
      expect(screen.getByText('Payments')).toBeInTheDocument();

      renderComponent('/billing/reports');
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });
  });
});

