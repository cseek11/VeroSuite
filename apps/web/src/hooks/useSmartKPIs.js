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
exports.useSmartKPIs = void 0;
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var auth_1 = require("@/stores/auth");
var logger_1 = require("@/utils/logger");
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
// Mock data for development - will be replaced with real API calls
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var useSmartKPIs = function () {
    var _a = (0, react_1.useState)(null), selectedKPI = _a[0], setSelectedKPI = _a[1];
    var _b = (0, react_1.useState)(false), isDrillDownOpen = _b[0], setIsDrillDownOpen = _b[1];
    var _c = (0, react_1.useState)(null), drillDownData = _c[0], setDrillDownData = _c[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    var _d = (0, auth_1.useAuthStore)(), token = _d.token, tenantId = _d.tenantId;
    // Fetch KPI configurations
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['smart-kpis', 'configs', tenantId],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!token || !tenantId)
                            return [2 /*return*/, []];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/kpis"), {
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                    'Content-Type': 'application/json'
                                }
                            })];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        logger_1.logger.error('Failed to fetch KPI configs', {
                            error: error_1 instanceof Error ? error_1.message : String(error_1)
                        });
                        throw error_1;
                    case 4:
                        if (!response.ok) {
                            throw new Error("Failed to fetch KPI configs: ".concat(response.statusText));
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!token && !!tenantId,
    }), _f = _e.data, kpiConfigs = _f === void 0 ? [] : _f, configsLoading = _e.isLoading;
    // Fetch real-time KPI data
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['smart-kpis', 'data', tenantId],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!token || !tenantId)
                            return [2 /*return*/, []];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/kpis/data/current"), {
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                    'Content-Type': 'application/json'
                                }
                            })];
                    case 2:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch KPI data: ".concat(response.statusText));
                        }
                        return [2 /*return*/, response.json()];
                    case 3:
                        error_2 = _a.sent();
                        logger_1.logger.error('Failed to fetch KPI data', {
                            error: error_2 instanceof Error ? error_2.message : String(error_2)
                        });
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        }); },
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes instead of 30 seconds
        staleTime: 2 * 60 * 1000, // 2 minutes stale time to reduce requests
        enabled: !!token && !!tenantId,
    }), _h = _g.data, kpiData = _h === void 0 ? [] : _h, dataLoading = _g.isLoading;
    // Fetch KPI trends - disabled temporarily due to API issues
    var _j = (0, react_query_1.useQuery)({
        queryKey: ['smart-kpis', 'trends', tenantId],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!token || !tenantId)
                            return [2 /*return*/, []];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/kpis/trends?period=24h"), {
                                headers: {
                                    'Authorization': "Bearer ".concat(token),
                                    'Content-Type': 'application/json'
                                }
                            })];
                    case 2:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        logger_1.logger.error('Failed to fetch KPI trends', {
                            error: error_3 instanceof Error ? error_3.message : String(error_3)
                        });
                        throw error_3;
                    case 4:
                        if (!response.ok) {
                            // Log the error but don't throw to prevent retries
                            logger_1.logger.warn('KPI trends API unavailable', { status: response.status }, 'useSmartKPIs');
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false, // Don't retry failed requests
        enabled: false, // Temporarily disable until API is fixed
    }), _k = _j.data, kpiTrends = _k === void 0 ? [] : _k, trendsLoading = _j.isLoading;
    // Update KPI configuration
    var updateKPIConfig = (0, react_query_1.useMutation)({
        mutationFn: function (config) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // TODO: Implement real API call
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Updating KPI config', { config: config }, 'useSmartKPIs');
                }
                return [2 /*return*/, config];
            });
        }); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['smart-kpis', 'configs'] });
        },
    });
    // Get KPI status based on threshold
    var getKPIStatus = (0, react_1.useCallback)(function (value, threshold) {
        // Safety check for undefined threshold
        if (!threshold || typeof threshold.green !== 'number') {
            return 'yellow'; // Default to yellow if threshold is invalid
        }
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
        var response, data, error_4, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!kpi.drillDown)
                        return [2 /*return*/];
                    setSelectedKPI(kpi);
                    setIsDrillDownOpen(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    if (!token || !kpi.id) {
                        // Fallback to mock data if no token
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
                    }
                    response = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/kpis/").concat(kpi.id, "/drill-down"), {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(kpi.drillDown.filters || {})
                        })];
                case 3:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch drill-down data: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    setDrillDownData(data);
                    return [3 /*break*/, 6];
                case 5:
                    error_4 = _a.sent();
                    logger_1.logger.error('Failed to fetch KPI drill-down data', {
                        error: error_4 instanceof Error ? error_4.message : String(error_4),
                        kpiId: kpi.id
                    });
                    throw error_4;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_5 = _a.sent();
                    logger_1.logger.error('Error fetching drill-down data', error_5, 'useSmartKPIs');
                    // Fallback to mock data on error
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
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); }, [token]);
    // Convert Smart KPI to Enhanced Dashboard Metric
    var convertToEnhancedMetric = (0, react_1.useCallback)(function (kpi) {
        var _a, _b;
        // Provide default threshold if undefined
        var threshold = kpi.threshold || { green: 80, yellow: 60, red: 40 };
        var status = getKPIStatus(kpi.value, threshold);
        var statusColor = getStatusColor(status);
        var changeType = kpi.trend === 'up' ? 'increase' : kpi.trend === 'down' ? 'decrease' : undefined;
        var result = __assign(__assign({ title: kpi.metric, value: threshold.unit ? "".concat(kpi.value).concat(threshold.unit) : kpi.value.toString() }, (changeType !== undefined && { changeType: changeType })), { icon: function () { return null; }, color: statusColor, threshold: threshold, drillDown: kpi.drillDown, realTime: (_a = kpi.realTime) !== null && _a !== void 0 ? _a : false, category: kpi.category, trend: kpi.trend, trendValue: (_b = kpi.trendValue) !== null && _b !== void 0 ? _b : 0, lastUpdated: kpi.lastUpdated });
        if (kpi.trendValue !== undefined) {
            result.change = kpi.trendValue;
        }
        return result;
    }, [getKPIStatus, getStatusColor]);
    // Process and combine KPI configs with data
    var processedKPIs = (0, react_1.useMemo)(function () {
        if (!kpiConfigs.length)
            return [];
        return kpiConfigs.map(function (config) {
            var data = kpiData.find(function (d) { return d.metric === config.name; });
            var trend = kpiTrends.find(function (t) { return t.metric === config.name; });
            return {
                id: config.id,
                metric: config.name,
                value: (data === null || data === void 0 ? void 0 : data.value) || 0,
                threshold: config.threshold,
                drillDown: config.drillDown,
                trend: (trend === null || trend === void 0 ? void 0 : trend.trend) || 'stable',
                trendValue: (trend === null || trend === void 0 ? void 0 : trend.trendValue) || 0,
                lastUpdated: (data === null || data === void 0 ? void 0 : data.timestamp) || new Date().toISOString(),
                category: config.category,
                realTime: config.realTime
            };
        });
    }, [kpiConfigs, kpiData, kpiTrends]);
    // Get enhanced metrics for dashboard
    var enhancedMetrics = (processedKPIs && processedKPIs.length > 0) ? processedKPIs.map(convertToEnhancedMetric) : [];
    // Debug logging (remove in production)
    // console.log('useSmartKPIs - kpiData:', kpiData);
    // console.log('useSmartKPIs - enhancedMetrics:', enhancedMetrics);
    // console.log('useSmartKPIs - isLoading:', configsLoading || dataLoading || trendsLoading);
    return {
        // Data
        kpiConfigs: kpiConfigs,
        kpiData: processedKPIs,
        kpiTrends: kpiTrends,
        enhancedMetrics: enhancedMetrics,
        // Loading states
        isLoading: configsLoading || dataLoading || trendsLoading,
        // Actions
        updateKPIConfig: updateKPIConfig,
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
exports.useSmartKPIs = useSmartKPIs;
