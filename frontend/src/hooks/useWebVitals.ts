/**
 * useWebVitals Hook
 * 
 * Monitors and reports Core Web Vitals metrics (FCP, LCP, FID, CLS, TTFB).
 * Integrates with performance budgets and sends metrics to monitoring service.
 */

import { useEffect } from 'react';
import { performanceBudgets, getBudgetStatus } from '@/config/performanceBudgets';
import { logger } from '@/utils/logger';

export interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export interface WebVitalsReport {
  FCP?: number;
  LCP?: number;
  FID?: number;
  CLS?: number;
  TTFB?: number;
  timestamp: number;
}

const webVitalsReport: WebVitalsReport = {
  timestamp: Date.now(),
};

/**
 * Report Web Vitals metric
 */
function reportWebVital(metric: WebVitalsMetric) {
  const budget = performanceBudgets.webVitals[metric.name as keyof typeof performanceBudgets.webVitals];
  
  if (!budget) {
    logger.warn('Unknown Web Vital metric', { metric: metric.name });
    return;
  }
  
  const status = getBudgetStatus(budget, metric.value);
  
  // Store metric
  webVitalsReport[metric.name as keyof WebVitalsReport] = metric.value;
  webVitalsReport.timestamp = Date.now();
  
  // Log metric
  logger.info('Web Vital metric', {
    metric: metric.name,
    value: metric.value,
    unit: budget.unit,
    status,
    rating: metric.rating,
  });
  
  // Send to monitoring service (Sentry, Analytics, etc.)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
    });
  }
  
  // Report to Sentry if available
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.metrics.distribution(metric.name, metric.value, {
      tags: {
        rating: metric.rating,
        status,
      },
    });
  }
  
  // Warn if metric exceeds budget
  if (status === 'error') {
    logger.error('Web Vital exceeds error threshold', {
      metric: metric.name,
      value: metric.value,
      threshold: budget.error,
      unit: budget.unit,
    });
  } else if (status === 'warning') {
    logger.warn('Web Vital exceeds warning threshold', {
      metric: metric.name,
      value: metric.value,
      threshold: budget.warning,
      unit: budget.unit,
    });
  }
}

/**
 * Measure Time to First Byte (TTFB)
 */
function measureTTFB() {
  if (typeof window === 'undefined' || !window.performance) return;
  
  const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!navigation) return;
  
  const ttfb = navigation.responseStart - navigation.requestStart;
  const budget = performanceBudgets.webVitals.TTFB;
  const status = getBudgetStatus(budget, ttfb);
  
  webVitalsReport.TTFB = ttfb;
  
  logger.info('TTFB measured', {
    value: ttfb,
    unit: 'ms',
    status,
  });
  
  // Report to monitoring
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'TTFB', {
      value: Math.round(ttfb),
    });
  }
}

/**
 * useWebVitals Hook
 * 
 * Monitors Core Web Vitals and reports them to monitoring services.
 * 
 * @param enabled - Whether to enable Web Vitals monitoring (default: true)
 */
export function useWebVitals(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    
    // Measure TTFB on page load
    if (document.readyState === 'complete') {
      measureTTFB();
    } else {
      window.addEventListener('load', measureTTFB);
    }
    
    // Load Web Vitals library if available
    // Note: In production, you would install and import @web-vitals/web-vitals
    // For now, we'll use the Performance API directly
    
    // Monitor FCP (First Contentful Paint)
    try {
      const paintEntries = window.performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        reportWebVital({
          name: 'FCP',
          value: fcpEntry.startTime,
          id: 'fcp',
          delta: fcpEntry.startTime,
          rating: fcpEntry.startTime <= 1800 ? 'good' : fcpEntry.startTime <= 3000 ? 'needs-improvement' : 'poor',
        });
      }
    } catch (error) {
      logger.warn('Failed to measure FCP', { error });
    }
    
    // Monitor LCP (Largest Contentful Paint)
    try {
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          
          if (lastEntry) {
            reportWebVital({
              name: 'LCP',
              value: lastEntry.renderTime || lastEntry.loadTime,
              id: 'lcp',
              delta: lastEntry.renderTime || lastEntry.loadTime,
              rating: (lastEntry.renderTime || lastEntry.loadTime) <= 2500 ? 'good' : (lastEntry.renderTime || lastEntry.loadTime) <= 4000 ? 'needs-improvement' : 'poor',
            });
          }
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        return () => {
          lcpObserver.disconnect();
        };
      }
    } catch (error) {
      logger.warn('Failed to measure LCP', { error });
    }
    
    // Monitor CLS (Cumulative Layout Shift)
    try {
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          
          reportWebVital({
            name: 'CLS',
            value: clsValue,
            id: 'cls',
            delta: clsValue,
            rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
          });
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
        return () => {
          clsObserver.disconnect();
        };
      }
    } catch (error) {
      logger.warn('Failed to measure CLS', { error });
    }
    
    // Monitor FID (First Input Delay) - requires user interaction
    // This is handled separately when user interacts with the page
    
  }, [enabled]);
  
  return webVitalsReport;
}

/**
 * Measure First Input Delay (FID) on first user interaction
 */
export function measureFID() {
  if (typeof window === 'undefined' || !window.performance) return;
  
  if ('PerformanceObserver' in window) {
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = (entry as any).processingStart - (entry as any).startTime;
        
        reportWebVital({
          name: 'FID',
          value: fid,
          id: 'fid',
          delta: fid,
          rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor',
        });
        
        fidObserver.disconnect();
        break;
      }
    });
    
    fidObserver.observe({ entryTypes: ['first-input'] });
  }
}

// Auto-measure FID on first interaction
if (typeof window !== 'undefined') {
  ['mousedown', 'keydown', 'touchstart'].forEach(eventType => {
    window.addEventListener(eventType, measureFID, { once: true, passive: true });
  });
}






