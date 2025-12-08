/**
 * API Response Types
 * 
 * Type definitions for React Query API responses.
 * These types ensure type safety when using useQuery hooks.
 */

import type { Invoice, Payment } from './enhanced-types';

// ============================================================================
// PAYMENT DASHBOARD TYPES
// ============================================================================

export interface PaymentDashboardData {
  dailyTrends: Record<string, number>;
  paymentMethodBreakdown: Record<string, number>;
  summary: {
    total: number;
    count: number;
    averagePayment: number;
    paymentCount: number;
    successRate?: number;
  };
  payments: Payment[];
}

// ============================================================================
// PAYMENT TRACKING TYPES
// ============================================================================

export interface PaymentTrackingData {
  dailyTrends: Record<string, number>;
  payments: Payment[];
  summary: {
    totalAmount: number;
    paymentCount: number;
    averagePayment: number;
  };
}

// ============================================================================
// PAYMENT ANALYTICS TYPES
// ============================================================================

export interface PaymentAnalyticsData {
  paymentMethodBreakdown: Record<string, number>;
  summary: {
    successRate: number;
  };
}

// ============================================================================
// AR SUMMARY TYPES
// ============================================================================

export interface ARSummaryData {
  totalAR: number;
  overdueAR?: number;
  currentAR?: number;
  agingBuckets?: {
    '0-30': number;
    '31-60': number;
    '61-90': number;
    '90+': number;
  };
}

// ============================================================================
// INVOICE LIST TYPES
// ============================================================================

export interface InvoiceListData {
  invoices: Invoice[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================================
// INVOICE REMINDERS TYPES
// ============================================================================

export interface ReminderHistory {
  id: string;
  invoice_id: string;
  invoice_number: string;
  customer_name: string;
  sent_at: string;
  reminder_type: 'email' | 'sms' | 'letter';
  status: 'sent' | 'failed' | 'pending';
  message?: string;
}

export interface InvoiceRemindersData {
  invoices: Invoice[];
  reminderHistory: ReminderHistory[];
}

// ============================================================================
// INVOICE SCHEDULER TYPES
// ============================================================================

export interface ScheduledInvoice {
  id: string;
  customer_id: string;
  customer_name?: string;
  schedule_type: 'recurring' | 'one-time';
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  next_run_date: string;
  is_active: boolean;
  template_id?: string;
  amount: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceSchedulerData {
  schedules: ScheduledInvoice[];
}

// ============================================================================
// INVOICE TEMPLATES TYPES
// ============================================================================

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  template_content: string;
  tags?: string[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface InvoiceTemplatesData {
  templates: InvoiceTemplate[];
}

// ============================================================================
// PL REPORT TYPES
// ============================================================================

export interface PLReportData {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
    expenses: number;
    netIncome: number;
  }>;
}

// ============================================================================
// AR AGING REPORT TYPES
// ============================================================================

export interface ARAgingReportData {
  totalAR: number;
  agingBuckets: {
    '0-30': number;
    '31-60': number;
    '61-90': number;
    '90+': number;
  };
  invoiceDetails: Array<{
    invoiceNumber: string;
    customerName: string;
    amount: number;
    balanceDue: number;
    dueDate: string;
    daysPastDue?: number;
    agingBucket: string;
  }>;
  customerBreakdown: Array<{
    customerName: string;
    totalAR: number;
  }>;
}

// ============================================================================
// RECONCILIATION TOOLS TYPES
// ============================================================================

export interface ReconciliationData {
  payments: Payment[];
  summary: {
    totalMatched: number;
    totalUnmatched: number;
    totalAmount: number;
  };
}

// ============================================================================
// INVOICE VIEW TYPES
// ============================================================================

export interface InvoiceViewData {
  invoice: Invoice | null;
  invoices: Invoice[];
}

