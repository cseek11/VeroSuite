"use strict";
/**
 * Performance Budgets Configuration
 *
 * Defines performance targets and budgets for the VeroField application.
 * These budgets are used for monitoring, testing, and CI/CD validation.
 *
 * Based on Web Vitals and real-world performance targets.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceBudgets = void 0;
exports.getBudgetStatus = getBudgetStatus;
exports.formatBudgetValue = formatBudgetValue;
/**
 * Performance Budgets Configuration
 *
 * Targets are based on:
 * - Web Vitals thresholds (Good: 75th percentile)
 * - Real-world user expectations
 * - Industry best practices
 * - Mobile network constraints
 */
exports.performanceBudgets = {
    // Core Web Vitals - Based on Google's thresholds
    webVitals: {
        FCP: {
            metric: 'FCP',
            target: 1800, // 1.8s - Good threshold
            warning: 3000, // 3s - Needs improvement
            error: 4000, // 4s - Poor
            unit: 'ms',
            description: 'First Contentful Paint - Time until first content is rendered',
        },
        LCP: {
            metric: 'LCP',
            target: 2500, // 2.5s - Good threshold
            warning: 4000, // 4s - Needs improvement
            error: 5000, // 5s - Poor
            unit: 'ms',
            description: 'Largest Contentful Paint - Time until largest content is rendered',
        },
        FID: {
            metric: 'FID',
            target: 100, // 100ms - Good threshold
            warning: 300, // 300ms - Needs improvement
            error: 500, // 500ms - Poor
            unit: 'ms',
            description: 'First Input Delay - Time until first user interaction is processed',
        },
        CLS: {
            metric: 'CLS',
            target: 0.1, // 0.1 - Good threshold
            warning: 0.25, // 0.25 - Needs improvement
            error: 0.5, // 0.5 - Poor
            unit: 'score',
            description: 'Cumulative Layout Shift - Visual stability score',
        },
        TTFB: {
            metric: 'TTFB',
            target: 800, // 800ms - Good threshold
            warning: 1500, // 1.5s - Needs improvement
            error: 2000, // 2s - Poor
            unit: 'ms',
            description: 'Time to First Byte - Server response time',
        },
    },
    // Dashboard Performance
    dashboard: {
        loadTime: {
            metric: 'dashboard-load',
            target: 1500, // 1.5s - Target
            warning: 2000, // 2s - Warning
            error: 3000, // 3s - Error
            unit: 'ms',
            description: 'Dashboard initial load time',
        },
        cardInteraction: {
            metric: 'card-interaction',
            target: 50, // 50ms - Target (very responsive)
            warning: 100, // 100ms - Warning
            error: 200, // 200ms - Error
            unit: 'ms',
            description: 'Card interaction latency (click, hover, etc.)',
        },
        listRendering: {
            metric: 'list-rendering',
            target: 300, // 300ms - Target
            warning: 500, // 500ms - Warning
            error: 1000, // 1s - Error
            unit: 'ms',
            description: 'List rendering time (customers, jobs, etc.)',
        },
        cardDragStart: {
            metric: 'card-drag-start',
            target: 16, // 16ms - Target (60fps)
            warning: 33, // 33ms - Warning (30fps)
            error: 100, // 100ms - Error
            unit: 'ms',
            description: 'Card drag start latency',
        },
        cardResize: {
            metric: 'card-resize',
            target: 16, // 16ms - Target (60fps)
            warning: 33, // 33ms - Warning (30fps)
            error: 100, // 100ms - Error
            unit: 'ms',
            description: 'Card resize latency',
        },
    },
    // API Performance
    api: {
        responseTime: {
            metric: 'api-response',
            target: 300, // 300ms - Target
            warning: 500, // 500ms - Warning
            error: 1000, // 1s - Error
            unit: 'ms',
            description: 'API response time (p95)',
        },
        slowQuery: {
            metric: 'slow-query',
            target: 1000, // 1s - Target
            warning: 2000, // 2s - Warning
            error: 5000, // 5s - Error
            unit: 'ms',
            description: 'Slow database query threshold',
        },
        errorRate: {
            metric: 'api-error-rate',
            target: 0.01, // 1% - Target
            warning: 0.05, // 5% - Warning
            error: 0.10, // 10% - Error
            unit: 'score',
            description: 'API error rate (errors / total requests)',
        },
    },
    // Resource Performance
    resources: {
        bundleSize: {
            metric: 'bundle-size',
            target: 500 * 1024, // 500KB - Target
            warning: 1000 * 1024, // 1MB - Warning
            error: 2000 * 1024, // 2MB - Error
            unit: 'bytes',
            description: 'JavaScript bundle size (gzipped)',
        },
        imageSize: {
            metric: 'image-size',
            target: 200 * 1024, // 200KB - Target
            warning: 500 * 1024, // 500KB - Warning
            error: 1000 * 1024, // 1MB - Error
            unit: 'bytes',
            description: 'Image file size (per image)',
        },
        fontSize: {
            metric: 'font-size',
            target: 100 * 1024, // 100KB - Target
            warning: 200 * 1024, // 200KB - Warning
            error: 500 * 1024, // 500KB - Error
            unit: 'bytes',
            description: 'Font file size (total)',
        },
        totalSize: {
            metric: 'total-size',
            target: 2000 * 1024, // 2MB - Target
            warning: 3000 * 1024, // 3MB - Warning
            error: 5000 * 1024, // 5MB - Error
            unit: 'bytes',
            description: 'Total page size (gzipped)',
        },
    },
    // Mobile Performance
    mobile: {
        loadTime3G: {
            metric: 'mobile-load-3g',
            target: 3000, // 3s - Target
            warning: 5000, // 5s - Warning
            error: 8000, // 8s - Error
            unit: 'ms',
            description: 'Page load time on 3G network',
        },
        loadTime4G: {
            metric: 'mobile-load-4g',
            target: 2000, // 2s - Target
            warning: 3000, // 3s - Warning
            error: 5000, // 5s - Error
            unit: 'ms',
            description: 'Page load time on 4G network',
        },
        interactionDelay: {
            metric: 'mobile-interaction',
            target: 100, // 100ms - Target
            warning: 200, // 200ms - Warning
            error: 300, // 300ms - Error
            unit: 'ms',
            description: 'Touch interaction delay on mobile',
        },
        memoryUsage: {
            metric: 'mobile-memory',
            target: 50 * 1024 * 1024, // 50MB - Target
            warning: 100 * 1024 * 1024, // 100MB - Warning
            error: 200 * 1024 * 1024, // 200MB - Error
            unit: 'bytes',
            description: 'Memory usage on mobile devices',
        },
    },
};
/**
 * Get budget status for a metric value
 */
function getBudgetStatus(budget, value) {
    if (value <= budget.target)
        return 'pass';
    if (value <= budget.warning)
        return 'warning';
    return 'error';
}
/**
 * Format budget value for display
 */
function formatBudgetValue(value, unit) {
    switch (unit) {
        case 'ms':
            return value < 1000 ? "".concat(value, "ms") : "".concat((value / 1000).toFixed(2), "s");
        case 'bytes':
            if (value < 1024)
                return "".concat(value, "B");
            if (value < 1024 * 1024)
                return "".concat((value / 1024).toFixed(2), "KB");
            return "".concat((value / (1024 * 1024)).toFixed(2), "MB");
        case 'score':
            return value.toFixed(2);
        case 'count':
            return value.toString();
        default:
            return value.toString();
    }
}
