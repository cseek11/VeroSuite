"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboardTelemetry = useDashboardTelemetry;
var react_1 = require("react");
function useDashboardTelemetry(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.enabled, enabled = _c === void 0 ? true : _c, onEvent = _b.onEvent;
    var metricsRef = (0, react_1.useRef)({
        regionLoadTimes: {},
        widgetInitTimes: {},
        interactionLatencies: []
    });
    var eventsRef = (0, react_1.useRef)([]);
    // Track first meaningful paint
    (0, react_1.useEffect)(function () {
        if (!enabled)
            return;
        var observer = new PerformanceObserver(function (list) {
            for (var _i = 0, _a = list.getEntries(); _i < _a.length; _i++) {
                var entry = _a[_i];
                if (entry.name === 'first-contentful-paint' || entry.name === 'first-meaningful-paint') {
                    metricsRef.current.firstMeaningfulPaint = entry.startTime;
                    trackEvent('first_meaningful_paint', { time: entry.startTime });
                }
            }
        });
        try {
            observer.observe({ entryTypes: ['paint'] });
        }
        catch (e) {
            // Performance Observer not supported
        }
        return function () {
            observer.disconnect();
        };
    }, [enabled]);
    var trackEvent = (0, react_1.useCallback)(function (type, payload) {
        if (!enabled)
            return;
        var event = {
            type: type,
            timestamp: Date.now(),
            payload: payload
        };
        eventsRef.current.push(event);
        // Keep only last 100 events
        if (eventsRef.current.length > 100) {
            eventsRef.current.shift();
        }
        // Call custom handler
        onEvent === null || onEvent === void 0 ? void 0 : onEvent(event);
        // In production, send to analytics service
        // analytics.track(type, payload);
    }, [enabled, onEvent]);
    var trackPerformance = (0, react_1.useCallback)(function (metric, value, tags) {
        if (!enabled)
            return;
        if (metric.startsWith('region_load_')) {
            var regionId = metric.replace('region_load_', '');
            metricsRef.current.regionLoadTimes[regionId] = value;
        }
        else if (metric.startsWith('widget_init_')) {
            var widgetId = metric.replace('widget_init_', '');
            metricsRef.current.widgetInitTimes[widgetId] = value;
        }
        trackEvent('performance_metric', { metric: metric, value: value, tags: tags });
    }, [enabled, trackEvent]);
    var trackError = (0, react_1.useCallback)(function (error, context) {
        if (!enabled)
            return;
        trackEvent('error', {
            message: error.message,
            stack: error.stack,
            context: context
        });
        // In production, send to error tracking service
        // errorTracking.captureException(error, { extra: context });
    }, [enabled, trackEvent]);
    var getMetrics = (0, react_1.useCallback)(function () {
        return __assign({}, metricsRef.current);
    }, []);
    var clearMetrics = (0, react_1.useCallback)(function () {
        metricsRef.current = {
            regionLoadTimes: {},
            widgetInitTimes: {},
            interactionLatencies: []
        };
        eventsRef.current = [];
    }, []);
    return {
        trackEvent: trackEvent,
        trackPerformance: trackPerformance,
        trackError: trackError,
        getMetrics: getMetrics,
        clearMetrics: clearMetrics
    };
}
