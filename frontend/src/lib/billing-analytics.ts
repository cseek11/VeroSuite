/**
 * Billing Analytics Tracking
 * 
 * Analytics tracking for billing-related user interactions.
 * Provides insights into billing feature usage.
 * 
 * Last Updated: 2025-11-16
 */

import * as Sentry from '@sentry/react';
import { logger } from '@/utils/logger';

interface BillingEvent {
  event: string;
  properties?: Record<string, unknown>;
  invoiceId?: string;
  customerId?: string;
  amount?: number;
  paymentMethod?: string;
}

/**
 * Track billing-related events
 */
export function trackBillingEvent(event: BillingEvent) {
  try {
    // Structured logging
    logger.info('Billing event tracked', {
      context: 'BillingAnalytics',
      operation: 'trackBillingEvent',
      event: event.event,
      properties: event.properties,
      invoiceId: event.invoiceId,
      customerId: event.customerId,
      amount: event.amount,
      paymentMethod: event.paymentMethod,
    }, 'BillingAnalytics');

    // Sentry tracking (if available)
    if (typeof Sentry !== 'undefined' && Sentry.captureMessage) {
      Sentry.addBreadcrumb({
        category: 'billing',
        message: event.event,
        level: 'info',
        data: {
          invoiceId: event.invoiceId,
          customerId: event.customerId,
          amount: event.amount,
          paymentMethod: event.paymentMethod,
          ...event.properties,
        },
      });
    }

    // Future: Add analytics service integration here
    // Example: analytics.track(event.event, event.properties);
  } catch (error: unknown) {
    logger.error('Failed to track billing event', error, 'BillingAnalytics');
  }
}

/**
 * Track invoice view
 */
export function trackInvoiceView(invoiceId: string, customerId?: string) {
  trackBillingEvent({
    event: 'invoice_viewed',
    invoiceId,
    customerId,
  });
}

/**
 * Track invoice download
 */
export function trackInvoiceDownload(invoiceId: string, customerId?: string) {
  trackBillingEvent({
    event: 'invoice_downloaded',
    invoiceId,
    customerId,
  });
}

/**
 * Track payment initiated
 */
export function trackPaymentInitiated(
  invoiceId: string,
  amount: number,
  paymentMethod?: string,
  customerId?: string
) {
  trackBillingEvent({
    event: 'payment_initiated',
    invoiceId,
    amount,
    paymentMethod,
    customerId,
  });
}

/**
 * Track payment completed
 */
export function trackPaymentCompleted(
  invoiceId: string,
  amount: number,
  paymentMethod?: string,
  customerId?: string
) {
  trackBillingEvent({
    event: 'payment_completed',
    invoiceId,
    amount,
    paymentMethod,
    customerId,
  });
}

/**
 * Track payment method added
 */
export function trackPaymentMethodAdded(
  paymentMethod: string,
  customerId?: string
) {
  trackBillingEvent({
    event: 'payment_method_added',
    paymentMethod,
    customerId,
  });
}

/**
 * Track payment method deleted
 */
export function trackPaymentMethodDeleted(
  paymentMethodId: string,
  customerId?: string
) {
  trackBillingEvent({
    event: 'payment_method_deleted',
    properties: { paymentMethodId },
    customerId,
  });
}

/**
 * Track invoice search
 */
export function trackInvoiceSearch(searchTerm: string, filters?: Record<string, unknown>) {
  trackBillingEvent({
    event: 'invoice_searched',
    properties: {
      searchTerm,
      filters,
    },
  });
}

/**
 * Track invoice filter applied
 */
export function trackInvoiceFilter(filterType: string, filterValue: string) {
  trackBillingEvent({
    event: 'invoice_filter_applied',
    properties: {
      filterType,
      filterValue,
    },
  });
}









