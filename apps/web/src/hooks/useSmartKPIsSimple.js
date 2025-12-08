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
exports.useSmartKPIsSimple = void 0;
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
// Mock data for development - will be replaced with real API calls
var mockKPIData = [
    {
        id: 'jobs-completed',
        metric: 'Jobs Completed Today',
        value: 45,
        threshold: { green: 40, yellow: 30, red: 20 },
        trend: 'up',
        trendValue: 12,
        lastUpdated: new Date().toISOString(),
        category: 'operational',
        realTime: true,
        drillDown: {
            endpoint: '/api/jobs/completed',
            filters: { date: 'today', status: 'completed' },
            title: 'Completed Jobs Details',
            description: 'View detailed breakdown of completed jobs'
        }
    },
    {
        id: 'revenue',
        metric: 'Daily Revenue',
        value: 12500,
        threshold: { green: 10000, yellow: 7500, red: 5000, unit: 'USD' },
        trend: 'up',
        trendValue: 8,
        lastUpdated: new Date().toISOString(),
        category: 'financial',
        realTime: true,
        drillDown: {
            endpoint: '/api/financial/revenue',
            filters: { period: 'daily' },
            title: 'Revenue Breakdown',
            description: 'Detailed revenue analysis by service type'
        }
    },
    {
        id: 'customer-satisfaction',
        metric: 'Customer Satisfaction',
        value: 4.2,
        threshold: { green: 4.0, yellow: 3.5, red: 3.0, unit: 'stars' },
        trend: 'stable',
        trendValue: 0,
        lastUpdated: new Date().toISOString(),
        category: 'customer',
        realTime: false,
        drillDown: {
            endpoint: '/api/customers/satisfaction',
            filters: { period: 'monthly' },
            title: 'Customer Feedback',
            description: 'Detailed customer satisfaction metrics'
        }
    },
    {
        id: 'cancellations',
        metric: 'Cancellation Rate',
        value: 5.2,
        threshold: { green: 3, yellow: 7, red: 10, unit: '%' },
        trend: 'down',
        trendValue: -2,
        lastUpdated: new Date().toISOString(),
        category: 'operational',
        realTime: true
    }
];
var useSmartKPIsSimple = function () {
    var _a = (0, react_1.useState)(null), selectedKPI = _a[0], setSelectedKPI = _a[1];
    var _b = (0, react_1.useState)(false), isDrillDownOpen = _b[0], setIsDrillDownOpen = _b[1];
    var _c = (0, react_1.useState)(null), drillDownData = _c[0], setDrillDownData = _c[1];
    // Get KPI status based on threshold
    var getKPIStatus = (0, react_1.useCallback)(function (value, threshold) {
        if (value >= threshold.green)
            return 'green';
        if (value >= threshold.yellow)
            return 'yellow';
        return 'red';
    }, []);
    // Get status color
    var getStatusColor = (0, react_1.useCallback)(function (status) {
        switch (status) {
            case 'green': return '#10B981'; // green-500
            case 'yellow': return '#F59E0B'; // amber-500
            case 'red': return '#EF4444'; // red-500
            default: return '#6B7280'; // gray-500
        }
    }, []);
    // Handle drill-down
    var handleDrillDown = (0, react_1.useCallback)(function (kpi) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!kpi.drillDown)
                return [2 /*return*/];
            setSelectedKPI(kpi);
            setIsDrillDownOpen(true);
            // Mock data for now
            setDrillDownData({
                title: kpi.drillDown.title,
                description: kpi.drillDown.description,
                data: Array.from({ length: 10 }, function (_, i) { return ({
                    id: i + 1,
                    name: "Item ".concat(i + 1),
                    value: Math.floor(Math.random() * 1000),
                    date: new Date(Date.now() - i * 86400000).toISOString()
                }); })
            });
            return [2 /*return*/];
        });
    }); }, []);
    // Convert Smart KPI to Enhanced Dashboard Metric
    var convertToEnhancedMetric = (0, react_1.useCallback)(function (kpi) {
        var _a, _b;
        var status = getKPIStatus(kpi.value, kpi.threshold);
        var statusColor = getStatusColor(status);
        var changeType = kpi.trend === 'up' ? 'increase' : kpi.trend === 'down' ? 'decrease' : undefined;
        var result = __assign(__assign({ title: kpi.metric, value: kpi.threshold.unit ? "".concat(kpi.value).concat(kpi.threshold.unit) : kpi.value.toString() }, (changeType !== undefined && { changeType: changeType })), { icon: function () { return null; }, color: statusColor, threshold: kpi.threshold, drillDown: kpi.drillDown, realTime: (_a = kpi.realTime) !== null && _a !== void 0 ? _a : false, category: kpi.category, trend: kpi.trend, trendValue: (_b = kpi.trendValue) !== null && _b !== void 0 ? _b : 0, lastUpdated: kpi.lastUpdated });
        if (kpi.trendValue !== undefined) {
            result.change = kpi.trendValue;
        }
        return result;
    }, [getKPIStatus, getStatusColor]);
    // Get enhanced metrics for dashboard
    var enhancedMetrics = mockKPIData.map(convertToEnhancedMetric);
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
        logger_1.logger.debug('useSmartKPIsSimple - mockKPIData', { mockKPIData: mockKPIData }, 'useSmartKPIsSimple');
        logger_1.logger.debug('useSmartKPIsSimple - enhancedMetrics', { enhancedMetrics: enhancedMetrics }, 'useSmartKPIsSimple');
    }
    return {
        // Data
        kpiConfigs: mockKPIData,
        kpiData: mockKPIData,
        kpiTrends: [],
        enhancedMetrics: enhancedMetrics,
        // Loading states
        isLoading: false,
        // Actions
        updateKPIConfig: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); }); },
        handleDrillDown: handleDrillDown,
        // Drill-down state
        selectedKPI: selectedKPI,
        isDrillDownOpen: isDrillDownOpen,
        setIsDrillDownOpen: setIsDrillDownOpen,
        drillDownData: drillDownData,
        // Utilities
        getKPIStatus: getKPIStatus,
        getStatusColor: getStatusColor,
        convertToEnhancedMetric: convertToEnhancedMetric
    };
};
exports.useSmartKPIsSimple = useSmartKPIsSimple;
