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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPerformanceTracking = exports.usePerformanceMonitor = exports.PerformanceMonitor = void 0;
var sentry_1 = require("./sentry");
var logger_1 = require("@/utils/logger");
// Performance monitoring service
var PerformanceMonitor = /** @class */ (function () {
    function PerformanceMonitor() {
        Object.defineProperty(this, "metrics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    Object.defineProperty(PerformanceMonitor, "getInstance", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            if (!PerformanceMonitor.instance) {
                PerformanceMonitor.instance = new PerformanceMonitor();
            }
            return PerformanceMonitor.instance;
        }
    });
    // Track API call performance
    Object.defineProperty(PerformanceMonitor.prototype, "trackApiCall", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (endpoint, startTime, endTime, status, error) {
            var duration = endTime - startTime;
            var metric = {
                endpoint: endpoint,
                duration: duration,
                status: status,
                timestamp: new Date().toISOString(),
                error: error === null || error === void 0 ? void 0 : error.message,
            };
            // Store metric
            this.metrics.set("".concat(endpoint, "_").concat(Date.now()), metric);
            // Send to Sentry
            sentry_1.SentryPerformance.trackApiCall(endpoint, duration, status);
            // Log slow API calls
            if (duration > 2000) {
                logger_1.logger.warn('Slow API call detected', { endpoint: endpoint, duration: duration }, 'performance');
                sentry_1.SentryUtils.captureMessage("Slow API call: ".concat(endpoint), 'warning');
            }
            // Log failed API calls
            if (status >= 400) {
                logger_1.logger.error('API call failed', { endpoint: endpoint, status: status, error: error }, 'performance');
                if (error) {
                    sentry_1.SentryUtils.captureException(error, { extra: { endpoint: endpoint, status: status, duration: duration } });
                }
            }
            return metric;
        }
    });
    // Track page load performance
    Object.defineProperty(PerformanceMonitor.prototype, "trackPageLoad", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (route, startTime, endTime) {
            var loadTime = endTime - startTime;
            var metric = {
                route: route,
                loadTime: loadTime,
                timestamp: new Date().toISOString(),
            };
            // Store metric
            this.metrics.set("page_".concat(route, "_").concat(Date.now()), metric);
            // Send to Sentry
            sentry_1.SentryPerformance.trackPageLoad(route, loadTime);
            // Log slow page loads
            if (loadTime > 3000) {
                logger_1.logger.warn('Slow page load detected', { route: route, loadTime: loadTime }, 'performance');
                sentry_1.SentryUtils.captureMessage("Slow page load: ".concat(route), 'warning');
            }
            return metric;
        }
    });
    // Track user interactions
    Object.defineProperty(PerformanceMonitor.prototype, "trackUserAction", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (action, data) {
            var metric = {
                action: action,
                data: data,
                timestamp: new Date().toISOString(),
            };
            // Store metric
            this.metrics.set("action_".concat(action, "_").concat(Date.now()), metric);
            // Send to Sentry
            sentry_1.SentryPerformance.trackUserAction(action, data);
            return metric;
        }
    });
    // Get performance metrics
    Object.defineProperty(PerformanceMonitor.prototype, "getMetrics", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (filter) {
            var now = Date.now();
            var filteredMetrics = Array.from(this.metrics.entries())
                .filter(function (_a) {
                var key = _a[0], metric = _a[1];
                if ((filter === null || filter === void 0 ? void 0 : filter.type) && !key.includes(filter.type)) {
                    return false;
                }
                if (filter === null || filter === void 0 ? void 0 : filter.timeRange) {
                    var metricTime = new Date(metric.timestamp).getTime();
                    return now - metricTime < filter.timeRange;
                }
                return true;
            })
                .map(function (_a) {
                var key = _a[0], metric = _a[1];
                return (__assign({ key: key }, metric));
            });
            return filteredMetrics;
        }
    });
    // Get performance summary
    Object.defineProperty(PerformanceMonitor.prototype, "getPerformanceSummary", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var apiCalls = this.getMetrics({ type: 'api' });
            var pageLoads = this.getMetrics({ type: 'page' });
            var apiStats = this.calculateStats(apiCalls.map(function (m) { return m.duration; }));
            var pageStats = this.calculateStats(pageLoads.map(function (m) { return m.loadTime; }));
            return {
                apiCalls: {
                    total: apiCalls.length,
                    average: apiStats.average,
                    median: apiStats.median,
                    p95: apiStats.p95,
                    slowCalls: apiCalls.filter(function (m) { return m.duration > 2000; }).length,
                    failedCalls: apiCalls.filter(function (m) { return m.status >= 400; }).length,
                },
                pageLoads: {
                    total: pageLoads.length,
                    average: pageStats.average,
                    median: pageStats.median,
                    p95: pageStats.p95,
                    slowLoads: pageLoads.filter(function (m) { return m.loadTime > 3000; }).length,
                },
            };
        }
    });
    Object.defineProperty(PerformanceMonitor.prototype, "calculateStats", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (values) {
            if (values.length === 0) {
                return { average: 0, median: 0, p95: 0 };
            }
            var sorted = values.sort(function (a, b) { return a - b; });
            var average = values.reduce(function (sum, val) { return sum + val; }, 0) / values.length;
            var median = sorted[Math.floor(sorted.length / 2)];
            var p95Index = Math.floor(sorted.length * 0.95);
            var p95 = sorted[p95Index];
            return { average: average, median: median, p95: p95 };
        }
    });
    // Clear old metrics (keep last 1000)
    Object.defineProperty(PerformanceMonitor.prototype, "cleanup", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            var _this = this;
            var entries = Array.from(this.metrics.entries());
            if (entries.length > 1000) {
                var toDelete = entries.slice(0, entries.length - 1000);
                toDelete.forEach(function (_a) {
                    var key = _a[0];
                    return _this.metrics.delete(key);
                });
            }
        }
    });
    return PerformanceMonitor;
}());
exports.PerformanceMonitor = PerformanceMonitor;
// Performance monitoring hooks
var usePerformanceMonitor = function () {
    var monitor = PerformanceMonitor.getInstance();
    return {
        trackApiCall: function (endpoint, startTime, endTime, status, error) {
            return monitor.trackApiCall(endpoint, startTime, endTime, status, error);
        },
        trackPageLoad: function (route, startTime, endTime) {
            return monitor.trackPageLoad(route, startTime, endTime);
        },
        trackUserAction: function (action, data) {
            return monitor.trackUserAction(action, data);
        },
        getMetrics: function (filter) {
            return monitor.getMetrics(filter);
        },
        getPerformanceSummary: function () { return monitor.getPerformanceSummary(); },
    };
};
exports.usePerformanceMonitor = usePerformanceMonitor;
// API call wrapper for automatic performance tracking
var withPerformanceTracking = function (fn, endpoint) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(void 0, void 0, void 0, function () {
            var monitor, startTime, result, endTime, error_1, endTime, status_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        monitor = PerformanceMonitor.getInstance();
                        startTime = performance.now();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fn.apply(void 0, args)];
                    case 2:
                        result = _a.sent();
                        endTime = performance.now();
                        monitor.trackApiCall(endpoint, startTime, endTime, 200);
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _a.sent();
                        endTime = performance.now();
                        status_1 = (error_1 === null || error_1 === void 0 ? void 0 : error_1.status) || 500;
                        monitor.trackApiCall(endpoint, startTime, endTime, status_1, error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
};
exports.withPerformanceTracking = withPerformanceTracking;
