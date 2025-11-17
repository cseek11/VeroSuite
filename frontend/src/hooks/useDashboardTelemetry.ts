import { useEffect, useCallback, useRef } from 'react';

export interface TelemetryEvent {
  type: string;
  timestamp: number;
  payload?: any;
}

export interface PerformanceMetrics {
  firstMeaningfulPaint?: number;
  regionLoadTimes: Record<string, number>;
  widgetInitTimes: Record<string, number>;
  interactionLatencies: Array<{ action: string; latency: number }>;
}

interface UseDashboardTelemetryOptions {
  enabled?: boolean;
  onEvent?: (event: TelemetryEvent) => void;
}

interface UseDashboardTelemetryReturn {
  trackEvent: (type: string, payload?: any) => void;
  trackPerformance: (metric: string, value: number, tags?: Record<string, string>) => void;
  trackError: (error: Error, context?: Record<string, any>) => void;
  getMetrics: () => PerformanceMetrics;
  clearMetrics: () => void;
}

export function useDashboardTelemetry({
  enabled = true,
  onEvent
}: UseDashboardTelemetryOptions = {}): UseDashboardTelemetryReturn {
  const metricsRef = useRef<PerformanceMetrics>({
    regionLoadTimes: {},
    widgetInitTimes: {},
    interactionLatencies: []
  });
  const eventsRef = useRef<TelemetryEvent[]>([]);

  // Track first meaningful paint
  useEffect(() => {
    if (!enabled) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint' || entry.name === 'first-meaningful-paint') {
          metricsRef.current.firstMeaningfulPaint = entry.startTime;
          trackEvent('first_meaningful_paint', { time: entry.startTime });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // Performance Observer not supported
    }

    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  const trackEvent = useCallback((type: string, payload?: any) => {
    if (!enabled) return;

    const event: TelemetryEvent = {
      type,
      timestamp: Date.now(),
      payload
    };

    eventsRef.current.push(event);
    
    // Keep only last 100 events
    if (eventsRef.current.length > 100) {
      eventsRef.current.shift();
    }

    // Call custom handler
    onEvent?.(event);

    // In production, send to analytics service
    // analytics.track(type, payload);
  }, [enabled, onEvent]);

  const trackPerformance = useCallback((metric: string, value: number, tags?: Record<string, string>) => {
    if (!enabled) return;

    if (metric.startsWith('region_load_')) {
      const regionId = metric.replace('region_load_', '');
      metricsRef.current.regionLoadTimes[regionId] = value;
    } else if (metric.startsWith('widget_init_')) {
      const widgetId = metric.replace('widget_init_', '');
      metricsRef.current.widgetInitTimes[widgetId] = value;
    }

    trackEvent('performance_metric', { metric, value, tags });
  }, [enabled, trackEvent]);

  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    if (!enabled) return;

    trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context
    });

    // In production, send to error tracking service
    // errorTracking.captureException(error, { extra: context });
  }, [enabled, trackEvent]);

  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...metricsRef.current };
  }, []);

  const clearMetrics = useCallback(() => {
    metricsRef.current = {
      regionLoadTimes: {},
      widgetInitTimes: {},
      interactionLatencies: []
    };
    eventsRef.current = [];
  }, []);

  return {
    trackEvent,
    trackPerformance,
    trackError,
    getMetrics,
    clearMetrics
  };
}





