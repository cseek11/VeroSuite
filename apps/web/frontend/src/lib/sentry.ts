import * as Sentry from '@sentry/react';
import { config } from './config';
import { logger } from '@/utils/logger';

// Initialize Sentry
export function initSentry() {
  if (!config.monitoring.sentry.dsn) {
    logger.warn('Sentry DSN not configured - error tracking disabled', {}, 'sentry');
    return;
  }

  Sentry.init({
    dsn: config.monitoring.sentry.dsn,
    integrations: (() => {
      const tracing = (Sentry as any).browserTracingIntegration?.();
      return tracing ? [tracing] : [];
    })(),
    tracesSampleRate: config.monitoring.sentry.tracesSampleRate,
    environment: config.app.environment,
    release: config.app.version,
    
    // Error filtering
    beforeSend(event: any, _hint: any) {
      // Filter out certain errors
      if (event.exception) {
        const exception = event.exception.values?.[0];
        if (exception?.type === 'ChunkLoadError') {
          // Ignore chunk load errors (usually network issues)
          return null;
        }
      }
      
      // Add user context if available
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        event.user = {
          id: user.id,
          email: user.email,
          tenantId: user.tenant_id,
        };
      }
      
      return event;
    },
    
    // Breadcrumbs for better debugging
    beforeBreadcrumb(breadcrumb: any) {
      // Filter out sensitive data
      if (breadcrumb.category === 'http' && breadcrumb.data) {
        // Remove sensitive headers
        if (breadcrumb.data.request_headers) {
          delete breadcrumb.data.request_headers.authorization;
          delete breadcrumb.data.request_headers.cookie;
        }
      }
      return breadcrumb;
    },
  });
}

// Error boundary component
export const SentryErrorBoundary = Sentry.ErrorBoundary;

// Performance monitoring
export const SentryPerformance = {
  // Track API calls
  trackApiCall: (endpoint: string, duration: number, status: number) => {
    Sentry.addBreadcrumb({
      category: 'api',
      message: `${endpoint} - ${status}`,
      data: {
        endpoint,
        duration,
        status,
      },
      level: status >= 400 ? 'error' : 'info',
    });
  },

  // Track page loads
  trackPageLoad: (route: string, loadTime: number) => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Page loaded: ${route}`,
      data: {
        route,
        loadTime,
      },
      level: 'info',
    });
  },

  // Track user actions
  trackUserAction: (action: string, data?: any) => {
    Sentry.addBreadcrumb({
      category: 'user',
      message: action,
      data,
      level: 'info',
    });
  },
};

// Utility functions
export const SentryUtils = {
  // Set user context
  setUser: (user: any) => {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      tenantId: user.tenant_id,
    });
  },

  // Clear user context
  clearUser: () => {
    Sentry.setUser(null);
  },

  // Capture exceptions
  captureException: (error: Error, context?: any) => {
    Sentry.captureException(error, {
      extra: context,
    });
  },

  // Capture messages
  captureMessage: (message: string, level: Sentry.SeverityLevel = 'info') => {
    Sentry.captureMessage(message, level);
  },
};
