"use strict";
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
exports.SearchAnalyticsDashboard = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var search_analytics_service_1 = require("../../lib/search-analytics-service");
var logger_1 = require("@/utils/logger");
var SearchAnalyticsDashboard = function () {
    var _a;
    var _b = (0, react_1.useState)(30), selectedTimeRange = _b[0], _setSelectedTimeRange = _b[1];
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(null), performanceData = _d[0], setPerformanceData = _d[1];
    var _e = (0, react_1.useState)([]), trendingSearches = _e[0], setTrendingSearches = _e[1];
    var _f = (0, search_analytics_service_1.useSearchAnalytics)(), getSearchPerformanceSummary = _f.getSearchPerformanceSummary, getTrendingSearches = _f.getTrendingSearches, _getSearchErrorSummary = _f.getSearchErrorSummary, _getUserSearchInsights = _f.getUserSearchInsights;
    var loadAnalyticsData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, perf, trending, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setIsLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, Promise.all([
                            getSearchPerformanceSummary(selectedTimeRange),
                            getTrendingSearches(10)
                        ])];
                case 2:
                    _a = _b.sent(), perf = _a[0], trending = _a[1];
                    setPerformanceData(perf);
                    setTrendingSearches(trending);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _b.sent();
                    logger_1.logger.error('Failed to load analytics data', error_1, 'SearchAnalyticsDashboard');
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        loadAnalyticsData();
    }, [selectedTimeRange]);
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-50 p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-900 mb-8", children: "Search Analytics Dashboard" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Total Searches" }), (0, jsx_runtime_1.jsx)("p", { className: "text-3xl font-bold text-blue-600", children: (performanceData === null || performanceData === void 0 ? void 0 : performanceData.total_searches) || 0 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Success Rate" }), (0, jsx_runtime_1.jsx)("p", { className: "text-3xl font-bold text-green-600", children: (performanceData === null || performanceData === void 0 ? void 0 : performanceData.success_rate) ? "".concat((performanceData.success_rate * 100).toFixed(1), "%") : '0%' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Avg Response Time" }), (0, jsx_runtime_1.jsx)("p", { className: "text-3xl font-bold text-orange-600", children: (performanceData === null || performanceData === void 0 ? void 0 : performanceData.avg_execution_time_ms) ? "".concat(performanceData.avg_execution_time_ms, "ms") : '0ms' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: "Cache Hit Rate" }), (0, jsx_runtime_1.jsx)("p", { className: "text-3xl font-bold text-purple-600", children: (performanceData === null || performanceData === void 0 ? void 0 : performanceData.cache_hit_rate) ? "".concat((performanceData.cache_hit_rate * 100).toFixed(1), "%") : '0%' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow p-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Trending Searches" }), trendingSearches.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: trendingSearches.map(function (search, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center p-3 bg-gray-50 rounded", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: search.query_text }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600", children: [search.search_count, " searches"] })] }, index)); }) })) : ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-center py-8", children: isLoading ? 'Loading...' : 'No trending searches available' }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow p-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Performance Insights" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Unique Users:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: (performanceData === null || performanceData === void 0 ? void 0 : performanceData.unique_users) || 0 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Avg Results per Search:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: ((_a = performanceData === null || performanceData === void 0 ? void 0 : performanceData.avg_results_per_search) === null || _a === void 0 ? void 0 : _a.toFixed(1)) || 0 })] })] })] })] })] }) }));
};
exports.SearchAnalyticsDashboard = SearchAnalyticsDashboard;
exports.default = exports.SearchAnalyticsDashboard;
