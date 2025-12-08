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
exports.default = UserDeactivation;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
function deactivateUser(userId, reassignToUserId, reason) {
    return __awaiter(this, void 0, void 0, function () {
        var token, tenantId, response, error_1, error;
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
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/v1/users/").concat(userId, "/deactivate"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer ".concat(token),
                                'x-tenant-id': tenantId,
                            },
                            body: JSON.stringify({
                                reassignToUserId: reassignToUserId,
                                reason: reason,
                            }),
                        })];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to deactivate user', {
                        error: error_1 instanceof Error ? error_1.message : String(error_1),
                        userId: userId,
                        reassignToUserId: reassignToUserId
                    });
                    throw error_1;
                case 4:
                    if (!!response.ok) return [3 /*break*/, 6];
                    return [4 /*yield*/, response.json().catch(function () { return ({ message: response.statusText }); })];
                case 5:
                    error = _a.sent();
                    throw new Error(error.message || 'Failed to deactivate user');
                case 6: return [2 /*return*/, response.json()];
            }
        });
    });
}
function UserDeactivation(_a) {
    var userId = _a.userId, userName = _a.userName, onDeactivated = _a.onDeactivated, onCancel = _a.onCancel;
    var _b = (0, react_1.useState)(''), reassignToUserId = _b[0], setReassignToUserId = _b[1];
    var _c = (0, react_1.useState)(''), reason = _c[0], setReason = _c[1];
    var _d = (0, react_1.useState)(''), confirmText = _d[0], setConfirmText = _d[1];
    var queryClient = (0, react_query_1.useQueryClient)();
    var deactivateMutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return deactivateUser(userId, reassignToUserId || undefined, reason || undefined); },
        onSuccess: function (data) {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['user', userId] });
            logger_1.logger.info('User deactivated', { userId: userId, result: data }, 'UserDeactivation');
            onDeactivated === null || onDeactivated === void 0 ? void 0 : onDeactivated();
        },
        onError: function (error) {
            logger_1.logger.error('Error deactivating user', error, 'UserDeactivation');
        },
    });
    var handleDeactivate = function () {
        if (confirmText !== userName) {
            alert("Please type \"".concat(userName, "\" to confirm deactivation"));
            return;
        }
        if (!confirm('Are you sure you want to deactivate this user? This action cannot be easily undone.')) {
            return;
        }
        deactivateMutation.mutate();
    };
    var isConfirmValid = confirmText === userName;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-yellow-600 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-yellow-800", children: "Warning" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-yellow-700 mt-1", children: "Deactivating this user will:" }), (0, jsx_runtime_1.jsxs)("ul", { className: "list-disc list-inside text-sm text-yellow-700 mt-2 space-y-1", children: [(0, jsx_runtime_1.jsx)("li", { children: "Set their account status to inactive" }), (0, jsx_runtime_1.jsx)("li", { children: "Unassign or reassign their open jobs and work orders" }), (0, jsx_runtime_1.jsx)("li", { children: "Prevent them from logging in" })] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Reassign Work To (Optional)" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: reassignToUserId, onChange: function (e) { return setReassignToUserId(e.target.value); }, placeholder: "User ID to reassign work to (leave empty to unassign)", className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-xs text-gray-500", children: "If provided, all open jobs and work orders will be reassigned to this user" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Reason for Deactivation (Optional)" }), (0, jsx_runtime_1.jsx)("textarea", { value: reason, onChange: function (e) { return setReason(e.target.value); }, placeholder: "Enter reason for deactivation...", rows: 3, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: ["Type \"", userName, "\" to confirm"] }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: confirmText, onChange: function (e) { return setConfirmText(e.target.value); }, placeholder: userName, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500" })] })] }), deactivateMutation.isError && ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "text-red-800 text-sm", children: deactivateMutation.error instanceof Error
                        ? deactivateMutation.error.message
                        : 'Failed to deactivate user' }) })), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3 pt-4 border-t border-gray-200", children: [onCancel && ((0, jsx_runtime_1.jsx)("button", { onClick: onCancel, disabled: deactivateMutation.isPending, className: "px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50", children: "Cancel" })), (0, jsx_runtime_1.jsx)("button", { onClick: handleDeactivate, disabled: !isConfirmValid || deactivateMutation.isPending, className: "px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed", children: deactivateMutation.isPending ? 'Deactivating...' : 'Deactivate User' })] })] }));
}
