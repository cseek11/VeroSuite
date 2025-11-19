/**
 * FinancialDashboard Component Tests
 *
 * Tests for FinancialDashboard component including:
 * - Component rendering
 * - Tab navigation
 * - Default tab behavior
 * - Component integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FinancialDashboard from '../FinancialDashboard';

// Mock child components to avoid complex dependencies
vi.mock('../ARManagement', () => ({
  default: () => <div data-testid="ar-management">AR Management</div>,
}));

vi.mock('../RevenueAnalytics', () => ({
  default: () => <div data-testid="revenue-analytics">Revenue Analytics</div>,
}));

vi.mock('../PaymentAnalytics', () => ({
  default: () => <div data-testid="payment-analytics">Payment Analytics</div>,
}));

vi.mock('../PaymentTracking', () => ({
  default: () => <div data-testid="payment-tracking">Payment Tracking</div>,
}));

vi.mock('../OverdueAlerts', () => ({
  default: () => <div data-testid="overdue-alerts">Overdue Alerts</div>,
}));

vi.mock('../FinancialReports', () => ({
  default: () => <div data-testid="financial-reports">Financial Reports</div>,
}));

describe('FinancialDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render overview tab by default', () => {
      render(<FinancialDashboard />);

      expect(screen.getByText(/financial dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/quick access/i)).toBeInTheDocument();
    });

    it('should render with custom default tab', () => {
      render(<FinancialDashboard defaultTab="ar" />);

      expect(screen.getByTestId('ar-management')).toBeInTheDocument();
    });

    it('should render all tab options', () => {
      render(<FinancialDashboard />);

      // Check for tab labels
      expect(screen.getByText(/accounts receivable/i)).toBeInTheDocument();
      expect(screen.getByText(/revenue analytics/i)).toBeInTheDocument();
      expect(screen.getByText(/overdue invoices/i)).toBeInTheDocument();
      expect(screen.getByText(/financial reports/i)).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should switch to AR tab when AR link is clicked', () => {
      render(<FinancialDashboard />);

      const arLink = screen.getByText(/accounts receivable/i).closest('button');
      expect(arLink).toBeInTheDocument();

      if (arLink) {
        fireEvent.click(arLink);
        expect(screen.getByTestId('ar-management')).toBeInTheDocument();
      }
    });

    it('should switch to Revenue tab when Revenue link is clicked', () => {
      render(<FinancialDashboard />);

      const revenueLink = screen.getByText(/revenue analytics/i).closest('button');
      expect(revenueLink).toBeInTheDocument();

      if (revenueLink) {
        fireEvent.click(revenueLink);
        expect(screen.getByTestId('revenue-analytics')).toBeInTheDocument();
      }
    });

    it('should switch to Overdue tab when Overdue link is clicked', () => {
      render(<FinancialDashboard />);

      const overdueLink = screen.getByText(/overdue invoices/i).closest('button');
      expect(overdueLink).toBeInTheDocument();

      if (overdueLink) {
        fireEvent.click(overdueLink);
        expect(screen.getByTestId('overdue-alerts')).toBeInTheDocument();
      }
    });

    it('should switch to Reports tab when Reports link is clicked', () => {
      render(<FinancialDashboard />);

      const reportsLink = screen.getByText(/financial reports/i).closest('button');
      expect(reportsLink).toBeInTheDocument();

      if (reportsLink) {
        fireEvent.click(reportsLink);
        expect(screen.getByTestId('financial-reports')).toBeInTheDocument();
      }
    });
  });

  describe('Component Integration', () => {
    it('should render ARManagement component in AR tab', () => {
      render(<FinancialDashboard defaultTab="ar" />);
      expect(screen.getByTestId('ar-management')).toBeInTheDocument();
    });

    it('should render RevenueAnalytics component in Revenue tab', () => {
      render(<FinancialDashboard defaultTab="revenue" />);
      expect(screen.getByTestId('revenue-analytics')).toBeInTheDocument();
    });

    it('should render PaymentTracking component in Tracking tab', () => {
      render(<FinancialDashboard defaultTab="tracking" />);
      expect(screen.getByTestId('payment-tracking')).toBeInTheDocument();
    });

    it('should render OverdueAlerts component in Overdue tab', () => {
      render(<FinancialDashboard defaultTab="overdue" />);
      expect(screen.getByTestId('overdue-alerts')).toBeInTheDocument();
    });

    it('should render FinancialReports component in Reports tab', () => {
      render(<FinancialDashboard defaultTab="reports" />);
      expect(screen.getByTestId('financial-reports')).toBeInTheDocument();
    });
  });

  describe('Overview Tab', () => {
    it('should display quick access cards', () => {
      render(<FinancialDashboard defaultTab="overview" />);

      expect(screen.getByText(/financial dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/view comprehensive financial metrics/i)).toBeInTheDocument();
    });

    it('should display quick links section', () => {
      render(<FinancialDashboard defaultTab="overview" />);

      expect(screen.getByText(/quick links/i)).toBeInTheDocument();
      expect(screen.getByText(/analytics/i)).toBeInTheDocument();
    });
  });
});







