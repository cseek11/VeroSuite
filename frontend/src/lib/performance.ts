import { SentryPerformance, SentryUtils } from './sentry';

// Performance monitoring service
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, any> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track API call performance
  trackApiCall(endpoint: string, startTime: number, endTime: number, status: number, error?: Error) {
    const duration = endTime - startTime;
    const metric = {
      endpoint,
      duration,
      status,
      timestamp: new Date().toISOString(),
      error: error?.message,
    };

    // Store metric
    this.metrics.set(`${endpoint}_${Date.now()}`, metric);

    // Send to Sentry
    SentryPerformance.trackApiCall(endpoint, duration, status);

    // Log slow API calls
    if (duration > 2000) {
      console.warn(`Slow API call detected: ${endpoint} took ${duration}ms`);
      SentryUtils.captureMessage(`Slow API call: ${endpoint}`, 'warning');
    }

    // Log failed API calls
    if (status >= 400) {
      console.error(`API call failed: ${endpoint} - ${status}`);
      if (error) {
        SentryUtils.captureException(error, { extra: { endpoint, status, duration } });
      }
    }

    return metric;
  }

  // Track page load performance
  trackPageLoad(route: string, startTime: number, endTime: number) {
    const loadTime = endTime - startTime;
    const metric = {
      route,
      loadTime,
      timestamp: new Date().toISOString(),
    };

    // Store metric
    this.metrics.set(`page_${route}_${Date.now()}`, metric);

    // Send to Sentry
    SentryPerformance.trackPageLoad(route, loadTime);

    // Log slow page loads
    if (loadTime > 3000) {
      console.warn(`Slow page load detected: ${route} took ${loadTime}ms`);
      SentryUtils.captureMessage(`Slow page load: ${route}`, 'warning');
    }

    return metric;
  }

  // Track user interactions
  trackUserAction(action: string, data?: any) {
    const metric = {
      action,
      data,
      timestamp: new Date().toISOString(),
    };

    // Store metric
    this.metrics.set(`action_${action}_${Date.now()}`, metric);

    // Send to Sentry
    SentryPerformance.trackUserAction(action, data);

    return metric;
  }

  // Get performance metrics
  getMetrics(filter?: { type?: string; timeRange?: number }) {
    const now = Date.now();
    const filteredMetrics = Array.from(this.metrics.entries())
      .filter(([key, metric]) => {
        if (filter?.type && !key.includes(filter.type)) {
          return false;
        }
        if (filter?.timeRange) {
          const metricTime = new Date(metric.timestamp).getTime();
          return now - metricTime < filter.timeRange;
        }
        return true;
      })
      .map(([key, metric]) => ({ key, ...metric }));

    return filteredMetrics;
  }

  // Get performance summary
  getPerformanceSummary() {
    const apiCalls = this.getMetrics({ type: 'api' });
    const pageLoads = this.getMetrics({ type: 'page' });

    const apiStats = this.calculateStats(apiCalls.map(m => m.duration));
    const pageStats = this.calculateStats(pageLoads.map(m => m.loadTime));

    return {
      apiCalls: {
        total: apiCalls.length,
        average: apiStats.average,
        median: apiStats.median,
        p95: apiStats.p95,
        slowCalls: apiCalls.filter(m => m.duration > 2000).length,
        failedCalls: apiCalls.filter(m => m.status >= 400).length,
      },
      pageLoads: {
        total: pageLoads.length,
        average: pageStats.average,
        median: pageStats.median,
        p95: pageStats.p95,
        slowLoads: pageLoads.filter(m => m.loadTime > 3000).length,
      },
    };
  }

  private calculateStats(values: number[]) {
    if (values.length === 0) {
      return { average: 0, median: 0, p95: 0 };
    }

    const sorted = values.sort((a, b) => a - b);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const p95Index = Math.floor(sorted.length * 0.95);
    const p95 = sorted[p95Index];

    return { average, median, p95 };
  }

  // Clear old metrics (keep last 1000)
  cleanup() {
    const entries = Array.from(this.metrics.entries());
    if (entries.length > 1000) {
      const toDelete = entries.slice(0, entries.length - 1000);
      toDelete.forEach(([key]) => this.metrics.delete(key));
    }
  }
}

// Performance monitoring hooks
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();

  return {
    trackApiCall: (endpoint: string, startTime: number, endTime: number, status: number, error?: Error) =>
      monitor.trackApiCall(endpoint, startTime, endTime, status, error),
    trackPageLoad: (route: string, startTime: number, endTime: number) =>
      monitor.trackPageLoad(route, startTime, endTime),
    trackUserAction: (action: string, data?: any) =>
      monitor.trackUserAction(action, data),
    getMetrics: (filter?: { type?: string; timeRange?: number }) =>
      monitor.getMetrics(filter),
    getPerformanceSummary: () => monitor.getPerformanceSummary(),
  };
};

// API call wrapper for automatic performance tracking
export const withPerformanceTracking = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  endpoint: string
) => {
  return async (...args: T): Promise<R> => {
    const monitor = PerformanceMonitor.getInstance();
    const startTime = performance.now();
    
    try {
      const result = await fn(...args);
      const endTime = performance.now();
      monitor.trackApiCall(endpoint, startTime, endTime, 200);
      return result;
    } catch (error: any) {
      const endTime = performance.now();
      const status = error?.status || 500;
      monitor.trackApiCall(endpoint, startTime, endTime, status, error);
      throw error;
    }
  };
};
