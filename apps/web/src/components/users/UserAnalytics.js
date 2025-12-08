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
exports.default = UserAnalytics;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
function fetchUserAnalytics() {
    return __awaiter(this, arguments, void 0, function (period) {
        var token, tenantId, response, error_1, data, users, totalUsers, activeUsers, inactiveUsers, usersByRole, usersByDepartment;
        if (period === void 0) { period = 'month'; }
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
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/v1/users?period=").concat(period), {
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
                    logger_1.logger.error('Failed to fetch user analytics data', {
                        error: error_1 instanceof Error ? error_1.message : String(error_1),
                        period: period
                    });
                    throw error_1;
                case 4:
                    if (!response.ok) {
                        throw new Error("Failed to fetch analytics: ".concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 5:
                    data = _a.sent();
                    users = data.users || [];
                    totalUsers = users.length;
                    activeUsers = users.filter(function (u) { return u.status === 'active'; }).length;
                    inactiveUsers = totalUsers - activeUsers;
                    usersByRole = {};
                    users.forEach(function (user) {
                        var _a;
                        (_a = user.roles) === null || _a === void 0 ? void 0 : _a.forEach(function (role) {
                            usersByRole[role] = (usersByRole[role] || 0) + 1;
                        });
                    });
                    usersByDepartment = {};
                    users.forEach(function (user) {
                        if (user.department) {
                            usersByDepartment[user.department] = (usersByDepartment[user.department] || 0) + 1;
                        }
                    });
                    return [2 /*return*/, {
                            totalUsers: totalUsers,
                            activeUsers: activeUsers,
                            inactiveUsers: inactiveUsers,
                            usersByRole: usersByRole,
                            usersByDepartment: usersByDepartment,
                            recentActivity: {
                                newUsers: 0, // TODO: Calculate from created_at
                                deactivatedUsers: 0, // TODO: Calculate from status changes
                            },
                            metrics: {
                                averageJobsPerUser: 0, // TODO: Calculate from jobs
                                averageRevenuePerUser: 0, // TODO: Calculate from revenue
                                topPerformers: [], // TODO: Calculate from metrics
                            },
                        }];
            }
        });
    });
}
function UserAnalytics(_a) {
    var _b = _a.period, period = _b === void 0 ? 'month' : _b;
    var _c = (0, react_1.useState)(period), selectedPeriod = _c[0], setSelectedPeriod = _c[1];
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['user-analytics', selectedPeriod],
        queryFn: function () { return fetchUserAnalytics(selectedPeriod); },
    }), analytics = _d.data, isLoading = _d.isLoading, error = _d.error;
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-32", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-red-800 text-sm", children: ["Error loading analytics: ", error instanceof Error ? error.message : 'Unknown error'] }) }));
    }
    if (!analytics) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "User Analytics" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedPeriod, onChange: function (e) { return setSelectedPeriod(e.target.value); }, className: "text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "week", children: "Last 7 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "month", children: "Last 30 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "quarter", children: "Last 3 Months" }), (0, jsx_runtime_1.jsx)("option", { value: "year", children: "Last Year" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white p-4 rounded-lg border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Total Users" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-gray-900", children: analytics.totalUsers })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-8 w-8 text-purple-500" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white p-4 rounded-lg border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Active Users" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-green-600", children: analytics.activeUsers })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-8 w-8 text-green-500" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white p-4 rounded-lg border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Inactive Users" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-gray-600", children: analytics.inactiveUsers })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-8 w-8 text-gray-500" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white p-4 rounded-lg border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Departments" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-gray-900", children: Object.keys(analytics.usersByDepartment).length })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-8 w-8 text-blue-500" })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-6", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-900 mb-4", children: "Users by Role" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: Object.entries(analytics.usersByRole).map(function (_a) {
                            var role = _a[0], count = _a[1];
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700 capitalize", children: role }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-purple-600 h-2 rounded-full", style: { width: "".concat((count / analytics.totalUsers) * 100, "%") } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-gray-900 w-8 text-right", children: count })] })] }, role));
                        }) })] }), Object.keys(analytics.usersByDepartment).length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white shadow-sm border border-gray-200 rounded-lg p-6", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-900 mb-4", children: "Users by Department" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: Object.entries(analytics.usersByDepartment).map(function (_a) {
                            var department = _a[0], count = _a[1];
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-700", children: department }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-32 bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-600 h-2 rounded-full", style: { width: "".concat((count / analytics.totalUsers) * 100, "%") } }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-gray-900 w-8 text-right", children: count })] })] }, department));
                        }) })] }))] }));
}
