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
exports.default = UserHierarchy;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
function fetchUserHierarchy(userId) {
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
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/v1/users/").concat(userId, "/hierarchy"), {
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
                    logger_1.logger.error('Failed to fetch user hierarchy', {
                        error: error_1 instanceof Error ? error_1.message : String(error_1),
                        userId: userId
                    });
                    throw error_1;
                case 4:
                    if (!response.ok) {
                        throw new Error("Failed to fetch user hierarchy: ".concat(response.statusText));
                    }
                    return [2 /*return*/, response.json()];
            }
        });
    });
}
function UserHierarchy(_a) {
    var userId = _a.userId, onUserClick = _a.onUserClick;
    var _b = (0, react_query_1.useQuery)({
        queryKey: ['user-hierarchy', userId],
        queryFn: function () { return fetchUserHierarchy(userId); },
        enabled: !!userId,
    }), hierarchy = _b.data, isLoading = _b.isLoading, error = _b.error;
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-32", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-red-800 text-sm", children: ["Error loading hierarchy: ", error instanceof Error ? error.message : 'Unknown error'] }) }));
    }
    if (!hierarchy) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8 text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { children: "No hierarchy information available" })] }));
    }
    var handleUserClick = function (clickedUserId) {
        if (onUserClick && clickedUserId !== userId) {
            onUserClick(clickedUserId);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [hierarchy.manager && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUp, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-700", children: "Manager" })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg border ".concat(onUserClick
                            ? 'cursor-pointer hover:bg-gray-50 border-gray-200'
                            : 'border-gray-200 bg-gray-50'), onClick: function () { return handleUserClick(hierarchy.manager.id); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-5 w-5 text-purple-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-medium text-gray-900", children: [hierarchy.manager.first_name, " ", hierarchy.manager.last_name] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 truncate", children: hierarchy.manager.email }), hierarchy.manager.position && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600 mt-1", children: hierarchy.manager.position }))] })] }) })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4 text-purple-600" }), (0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-700", children: "Current User" })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg border-2 border-purple-200 bg-purple-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-5 w-5 text-purple-700" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-semibold text-gray-900", children: [hierarchy.user.first_name, " ", hierarchy.user.last_name] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 truncate", children: hierarchy.user.email }), hierarchy.user.position && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600 mt-1", children: hierarchy.user.position }))] })] }) })] }), hierarchy.directReports.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowDown, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsxs)("h4", { className: "text-sm font-medium text-gray-700", children: ["Direct Reports (", hierarchy.directReports.length, ")"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: hierarchy.directReports.map(function (report) { return ((0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg border ".concat(onUserClick
                                ? 'cursor-pointer hover:bg-gray-50 border-gray-200'
                                : 'border-gray-200 bg-gray-50'), onClick: function () { return handleUserClick(report.id); }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-5 w-5 text-green-600" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-medium text-gray-900", children: [report.first_name, " ", report.last_name] }), report.status && ((0, jsx_runtime_1.jsx)("span", { className: "text-xs px-2 py-0.5 rounded-full ".concat(report.status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'), children: report.status }))] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 truncate", children: report.email }), report.position && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-600 mt-1", children: report.position }))] })] }) }, report.id)); }) })] })), !hierarchy.manager && hierarchy.directReports.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "text-center py-4 text-gray-500 text-sm", children: "No hierarchy relationships defined" }))] }));
}
