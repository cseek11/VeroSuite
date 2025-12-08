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
exports.default = UserMetrics;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
function fetchUserMetrics(userId, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function () {
        var token, tenantId, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem('verofield_auth')
                        ? JSON.parse(localStorage.getItem('verofield_auth')).token
                        : localStorage.getItem('jwt');
                    tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/v1/users/").concat(userId, "/metrics?startDate=").concat(startDate.toISOString(), "&endDate=").concat(endDate.toISOString()), {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token),
                                'x-tenant-id': tenantId,
                            },
                        })];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to fetch user metrics', {
                        error: error_1 instanceof Error ? error_1.message : String(error_1),
                        userId: userId,
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString()
                    });
                    throw error_1;
                case 4:
                    if (!response.ok) {
                        throw new Error("Failed to fetch metrics: ".concat(response.statusText));
                    }
                    return [2 /*return*/, response.json()];
            }
        });
    });
}
function UserMetrics(_a) {
    var userId = _a.userId, _b = _a.defaultPeriod, defaultPeriod = _b === void 0 ? 'month' : _b;
    var _c = (0, react_1.useState)(defaultPeriod), period = _c[0], setPeriod = _c[1];
    var getDateRange = function (periodType) {
        var end = new Date();
        var start = new Date();
        switch (periodType) {
            case 'week':
                start.setDate(start.getDate() - 7);
                break;
            case 'month':
                start.setMonth(start.getMonth() - 1);
                break;
            case 'quarter':
                start.setMonth(start.getMonth() - 3);
                break;
            case 'year':
                start.setFullYear(start.getFullYear() - 1);
                break;
            default:
                start.setMonth(start.getMonth() - 1);
        }
        return { start: start, end: end };
    };
    var _d = getDateRange(period), start = _d.start, end = _d.end;
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['user-metrics', userId, period],
        queryFn: function () { return fetchUserMetrics(userId, start, end); },
        enabled: !!userId,
    }), metrics = _e.data, isLoading = _e.isLoading, error = _e.error;
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-32", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-red-800 text-sm", children: ["Error loading metrics: ", error instanceof Error ? error.message : 'Unknown error'] }) }));
    }
    if (!metrics) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8 text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { children: "No metrics available" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Performance Metrics" }), (0, jsx_runtime_1.jsxs)("select", { value: period, onChange: function (e) { return setPeriod(e.target.value); }, className: "text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "week", children: "Last 7 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "month", children: "Last 30 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "quarter", children: "Last 3 Months" }), (0, jsx_runtime_1.jsx)("option", { value: "year", children: "Last Year" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white p-4 rounded-lg border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Total Jobs" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-gray-900", children: metrics.jobs.total })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-8 w-8 text-purple-500" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white p-4 rounded-lg border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Completed" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-green-600", children: metrics.jobs.completed })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-8 w-8 text-green-500" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white p-4 rounded-lg border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "In Progress" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-blue-600", children: metrics.jobs.in_progress })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-8 w-8 text-blue-500" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white p-4 rounded-lg border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Scheduled" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-yellow-600", children: metrics.jobs.scheduled })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-8 w-8 text-yellow-500" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white p-4 rounded-lg border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Cancelled" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-red-600", children: metrics.jobs.cancelled })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-8 w-8 text-red-500" })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-6 rounded-lg border border-gray-200", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-sm font-medium text-gray-700 mb-4 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-5 w-5 mr-2 text-green-500" }), "Revenue"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Total Revenue" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-2xl font-bold text-gray-900", children: ["$", metrics.revenue.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Average per Job" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xl font-semibold text-gray-700", children: ["$", metrics.revenue.average_per_job.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-6 rounded-lg border border-gray-200", children: [(0, jsx_runtime_1.jsxs)("h4", { className: "text-sm font-medium text-gray-700 mb-4 flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-5 w-5 mr-2 text-blue-500" }), "Efficiency"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Avg Completion Time" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-2xl font-bold text-gray-900", children: [metrics.efficiency.average_completion_time_hours.toFixed(1), " hrs"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "On-Time Rate" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xl font-semibold text-gray-700", children: [metrics.efficiency.on_time_completion_rate.toFixed(1), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Jobs per Day" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xl font-semibold text-gray-700", children: metrics.efficiency.jobs_per_day.toFixed(1) })] })] })] })] })] }));
}
