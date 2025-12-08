"use strict";
/**
 * useWebVitals Hook
 *
 * Monitors and reports Core Web Vitals metrics (FCP, LCP, FID, CLS, TTFB).
 * Integrates with performance budgets and sends metrics to monitoring service.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebVitals = useWebVitals;
exports.measureFID = measureFID;
var react_1 = require("react");
var performanceBudgets_1 = require("@/config/performanceBudgets");
var logger_1 = require("@/utils/logger");
var webVitalsReport = {
    timestamp: Date.now(),
};
/**
 * Report Web Vitals metric
 */
function reportWebVital(metric) {
    var _a, _b;
    var budget = performanceBudgets_1.performanceBudgets.webVitals[metric.name];
    if (!budget) {
        logger_1.logger.warn('Unknown Web Vital metric', { metric: metric.name });
        return;
    }
    var status = (0, performanceBudgets_1.getBudgetStatus)(budget, metric.value);
    // Store metric
    webVitalsReport[metric.name] = metric.value;
    webVitalsReport.timestamp = Date.now();
    // Log metric
    logger_1.logger.info('Web Vital metric', {
        metric: metric.name,
        value: metric.value,
        unit: budget.unit,
        status: status,
        rating: metric.rating,
    });
    // Send to monitoring service (Sentry, Analytics, etc.)
    if (typeof window !== 'undefined' && 'gtag' in window && typeof window.gtag === 'function') {
        window.gtag('event', metric.name, {
            value: Math.round(metric.value),
            metric_id: metric.id,
            metric_value: metric.value,
            metric_delta: metric.delta,
        });
    }
    // Report to Sentry if available
    if (typeof window !== 'undefined' && 'Sentry' in window && typeof ((_b = (_a = window.Sentry) === null || _a === void 0 ? void 0 : _a.metrics) === null || _b === void 0 ? void 0 : _b.distribution) === 'function') {
        window.Sentry.metrics.distribution(metric.name, metric.value, {
            tags: {
                rating: metric.rating,
                status: status,
            },
        });
    }
    // Warn if metric exceeds budget
    if (status === 'error') {
        logger_1.logger.error('Web Vital exceeds error threshold', {
            metric: metric.name,
            value: metric.value,
            threshold: budget.error,
            unit: budget.unit,
        });
    }
    else if (status === 'warning') {
        logger_1.logger.warn('Web Vital exceeds warning threshold', {
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
    if (typeof window === 'undefined' || !window.performance)
        return;
    var navigation = window.performance.getEntriesByType('navigation')[0];
    if (!navigation)
        return;
    var ttfb = navigation.responseStart - navigation.requestStart;
    var budget = performanceBudgets_1.performanceBudgets.webVitals.TTFB;
    var status = (0, performanceBudgets_1.getBudgetStatus)(budget, ttfb);
    webVitalsReport.TTFB = ttfb;
    logger_1.logger.info('TTFB measured', {
        value: ttfb,
        unit: 'ms',
        status: status,
    });
    // Report to monitoring
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'TTFB', {
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
function useWebVitals(enabled) {
    if (enabled === void 0) { enabled = true; }
    (0, react_1.useEffect)(function () {
        if (!enabled || typeof window === 'undefined')
            return undefined;
        // Measure TTFB on page load
        if (document.readyState === 'complete') {
            measureTTFB();
        }
        else {
            window.addEventListener('load', measureTTFB);
            return function () {
                window.removeEventListener('load', measureTTFB);
            };
        }
        // Load Web Vitals library if available
        // Note: In production, you would install and import @web-vitals/web-vitals
        // For now, we'll use the Performance API directly
        // Monitor FCP (First Contentful Paint)
        try {
            var paintEntries = window.performance.getEntriesByType('paint');
            var fcpEntry = paintEntries.find(function (entry) { return entry.name === 'first-contentful-paint'; });
            if (fcpEntry) {
                reportWebVital({
                    name: 'FCP',
                    value: fcpEntry.startTime,
                    id: 'fcp',
                    delta: fcpEntry.startTime,
                    rating: fcpEntry.startTime <= 1800 ? 'good' : fcpEntry.startTime <= 3000 ? 'needs-improvement' : 'poor',
                });
            }
        }
        catch (error) {
            logger_1.logger.warn('Failed to measure FCP', { error: error });
        }
        // Monitor LCP (Largest Contentful Paint)
        try {
            if ('PerformanceObserver' in window) {
                var lcpObserver_1 = new PerformanceObserver(function (list) {
                    var entries = list.getEntries();
                    var lastEntry = entries[entries.length - 1];
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
                lcpObserver_1.observe({ entryTypes: ['largest-contentful-paint'] });
                return function () {
                    lcpObserver_1.disconnect();
                };
            }
        }
        catch (error) {
            logger_1.logger.warn('Failed to measure LCP', { error: error });
        }
        // Monitor CLS (Cumulative Layout Shift)
        try {
            if ('PerformanceObserver' in window) {
                var clsValue_1 = 0;
                var clsObserver_1 = new PerformanceObserver(function (list) {
                    for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
                        var entry = _a[_i];
                        if (!entry.hadRecentInput) {
                            clsValue_1 += entry.value;
                        }
                    }
                    reportWebVital({
                        name: 'CLS',
                        value: clsValue_1,
                        id: 'cls',
                        delta: clsValue_1,
                        rating: clsValue_1 <= 0.1 ? 'good' : clsValue_1 <= 0.25 ? 'needs-improvement' : 'poor',
                    });
                });
                clsObserver_1.observe({ entryTypes: ['layout-shift'] });
                return function () {
                    clsObserver_1.disconnect();
                };
            }
        }
        catch (error) {
            logger_1.logger.warn('Failed to measure CLS', { error: error });
        }
        // Monitor FID (First Input Delay) - requires user interaction
        // This is handled separately when user interacts with the page
        return undefined;
    }, [enabled]);
    return webVitalsReport;
}
/**
 * Measure First Input Delay (FID) on first user interaction
 */
function measureFID() {
    if (typeof window === 'undefined' || !window.performance)
        return;
    if ('PerformanceObserver' in window) {
        var fidObserver_1 = new PerformanceObserver(function (list) {
            for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
                var entry = _a[_i];
                var fid = entry.processingStart - entry.startTime;
                reportWebVital({
                    name: 'FID',
                    value: fid,
                    id: 'fid',
                    delta: fid,
                    rating: fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor',
                });
                fidObserver_1.disconnect();
                break;
            }
        });
        fidObserver_1.observe({ entryTypes: ['first-input'] });
    }
}
// Auto-measure FID on first interaction
if (typeof window !== 'undefined') {
    ['mousedown', 'keydown', 'touchstart'].forEach(function (eventType) {
        window.addEventListener(eventType, measureFID, { once: true, passive: true });
    });
}
