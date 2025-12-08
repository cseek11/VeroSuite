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
exports.default = SessionManagement;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
function fetchActiveSessions(userId) {
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
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/v1/users/").concat(userId, "/sessions"), {
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
                    logger_1.logger.error('Failed to fetch user sessions', {
                        error: error_1 instanceof Error ? error_1.message : String(error_1),
                        userId: userId
                    });
                    throw error_1;
                case 4:
                    if (!response.ok) {
                        throw new Error("Failed to fetch sessions: ".concat(response.statusText));
                    }
                    return [2 /*return*/, response.json()];
            }
        });
    });
}
function revokeSession(userId, sessionId) {
    return __awaiter(this, void 0, void 0, function () {
        var token, tenantId, response, error_2;
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
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/v1/users/").concat(userId, "/sessions/").concat(sessionId), {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token),
                                'x-tenant-id': tenantId,
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to revoke session: ".concat(response.statusText));
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    logger_1.logger.error('Failed to revoke user session', {
                        error: error_2 instanceof Error ? error_2.message : String(error_2),
                        userId: userId,
                        sessionId: sessionId
                    });
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function revokeAllSessions(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var token, tenantId, response, error_3;
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
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/v1/users/").concat(userId, "/sessions"), {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token),
                                'x-tenant-id': tenantId,
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to revoke all sessions: ".concat(response.statusText));
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    logger_1.logger.error('Failed to revoke all user sessions', {
                        error: error_3 instanceof Error ? error_3.message : String(error_3),
                        userId: userId
                    });
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function SessionManagement(_a) {
    var userId = _a.userId;
    var queryClient = (0, react_query_1.useQueryClient)();
    var _b = (0, react_query_1.useQuery)({
        queryKey: ['user-sessions', userId],
        queryFn: function () { return fetchActiveSessions(userId); },
        enabled: !!userId,
    }), _c = _b.data, sessions = _c === void 0 ? [] : _c, isLoading = _b.isLoading, error = _b.error;
    var revokeSessionMutation = (0, react_query_1.useMutation)({
        mutationFn: function (sessionId) { return revokeSession(userId, sessionId); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['user-sessions', userId] });
        },
    });
    var revokeAllMutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return revokeAllSessions(userId); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['user-sessions', userId] });
        },
    });
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-32", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-red-800 text-sm", children: ["Error loading sessions: ", error instanceof Error ? error.message : 'Unknown error'] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Active Sessions" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: [sessions.length, " active session(s)"] })] }), sessions.length > 0 && ((0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                            if (confirm('Are you sure you want to revoke all sessions? This will log the user out from all devices.')) {
                                revokeAllMutation.mutate();
                            }
                        }, disabled: revokeAllMutation.isPending, className: "inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { className: "h-4 w-4 mr-2" }), "Revoke All"] }))] }), sessions.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8 text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Monitor, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { children: "No active sessions" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: sessions.map(function (session) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)("div", { className: "h-10 w-10 rounded-full bg-green-100 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Monitor, { className: "h-5 w-5 text-green-600" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [session.ip_address && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "h-4 w-4 mr-1" }), session.ip_address] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-sm text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 mr-1" }), new Date(session.last_activity).toLocaleString()] })] }), session.user_agent && ((0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-1 truncate", children: session.user_agent })), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-400 mt-1", children: ["Expires: ", new Date(session.expires_at).toLocaleString()] })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                if (confirm('Are you sure you want to revoke this session?')) {
                                    revokeSessionMutation.mutate(session.id);
                                }
                            }, disabled: revokeSessionMutation.isPending, className: "ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md disabled:opacity-50", title: "Revoke Session", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }) })] }, session.id)); }) }))] }));
}
