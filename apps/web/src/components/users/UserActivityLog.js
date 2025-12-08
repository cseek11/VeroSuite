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
exports.default = UserActivityLog;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
function fetchUserActivity(userId_1) {
    return __awaiter(this, arguments, void 0, function (userId, limit) {
        var token, tenantId, response, error_1;
        if (limit === void 0) { limit = 50; }
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
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/v1/users/").concat(userId, "/activity?limit=").concat(limit), {
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
                    logger_1.logger.error('Failed to fetch user activity log', {
                        error: error_1 instanceof Error ? error_1.message : String(error_1),
                        userId: userId,
                        limit: limit
                    });
                    throw error_1;
                case 4:
                    if (!response.ok) {
                        throw new Error("Failed to fetch user activity: ".concat(response.statusText));
                    }
                    return [2 /*return*/, response.json()];
            }
        });
    });
}
var getActionIcon = function (action) {
    var actionLower = action.toLowerCase();
    if (actionLower.includes('create') || actionLower.includes('add')) {
        return (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-green-600" });
    }
    if (actionLower.includes('update') || actionLower.includes('edit')) {
        return (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-4 w-4 text-blue-600" });
    }
    if (actionLower.includes('delete') || actionLower.includes('remove')) {
        return (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-red-600" });
    }
    if (actionLower.includes('login') || actionLower.includes('auth')) {
        return (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4 text-purple-600" });
    }
    return (0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-4 w-4 text-gray-600" });
};
var getActionColor = function (action) {
    var actionLower = action.toLowerCase();
    if (actionLower.includes('create') || actionLower.includes('add')) {
        return 'bg-green-50 text-green-800 border-green-200';
    }
    if (actionLower.includes('update') || actionLower.includes('edit')) {
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
    if (actionLower.includes('delete') || actionLower.includes('remove')) {
        return 'bg-red-50 text-red-800 border-red-200';
    }
    if (actionLower.includes('login') || actionLower.includes('auth')) {
        return 'bg-purple-50 text-purple-800 border-purple-200';
    }
    return 'bg-gray-50 text-gray-800 border-gray-200';
};
function UserActivityLog(_a) {
    var userId = _a.userId, _b = _a.limit, limit = _b === void 0 ? 50 : _b;
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['user-activity', userId, limit],
        queryFn: function () { return fetchUserActivity(userId, limit); },
        enabled: !!userId,
    }), _d = _c.data, activities = _d === void 0 ? [] : _d, isLoading = _c.isLoading, error = _c.error;
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-32", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-red-800 text-sm", children: ["Error loading activity logs: ", error instanceof Error ? error.message : 'Unknown error'] }) }));
    }
    if (activities.length === 0) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8 text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { children: "No activity logs found" })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Recent Activity" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-500", children: [activities.length, " activities"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: activities.map(function (activity) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3 p-3 rounded-lg border ".concat(getActionColor(activity.action)), children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 mt-0.5", children: getActionIcon(activity.action) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium", children: activity.action }), (0, jsx_runtime_1.jsx)("time", { className: "text-xs text-gray-500 ml-2", children: new Date(activity.timestamp).toLocaleString() })] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-600 mt-1", children: [activity.resource_type, activity.resource_id && ((0, jsx_runtime_1.jsxs)("span", { className: "ml-1 font-mono text-xs", children: ["#", activity.resource_id.slice(0, 8)] }))] }), activity.ip_address && ((0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-500 mt-1", children: ["IP: ", activity.ip_address] }))] })] }, activity.id)); }) })] }));
}
