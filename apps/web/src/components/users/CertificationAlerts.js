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
exports.default = CertificationAlerts;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
function fetchCertificationAlerts() {
    return __awaiter(this, arguments, void 0, function (daysAhead) {
        var token, tenantId, response, error_1;
        if (daysAhead === void 0) { daysAhead = 30; }
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
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/v1/users/certifications/alerts?daysAhead=").concat(daysAhead), {
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
                    logger_1.logger.error('Failed to fetch certification alerts', {
                        error: error_1 instanceof Error ? error_1.message : String(error_1),
                        daysAhead: daysAhead
                    });
                    throw error_1;
                case 4:
                    if (!response.ok) {
                        throw new Error("Failed to fetch certification alerts: ".concat(response.statusText));
                    }
                    return [2 /*return*/, response.json()];
            }
        });
    });
}
function CertificationAlerts() {
    var _a = (0, react_1.useState)(30), daysAhead = _a[0], setDaysAhead = _a[1];
    var _b = (0, react_query_1.useQuery)({
        queryKey: ['certification-alerts', daysAhead],
        queryFn: function () { return fetchCertificationAlerts(daysAhead); },
    }), _c = _b.data, alerts = _c === void 0 ? [] : _c, isLoading = _b.isLoading, error = _b.error;
    var getAlertColor = function (daysUntilExpiration) {
        if (!daysUntilExpiration)
            return 'bg-gray-100 text-gray-800';
        if (daysUntilExpiration <= 7)
            return 'bg-red-100 text-red-800 border-red-200';
        if (daysUntilExpiration <= 14)
            return 'bg-orange-100 text-orange-800 border-orange-200';
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-32", children: (0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-md p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-red-800 text-sm", children: ["Error loading alerts: ", error instanceof Error ? error.message : 'Unknown error'] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: "Certification Alerts" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: [alerts.length, " certification", alerts.length !== 1 ? 's' : '', " expiring soon"] })] }), (0, jsx_runtime_1.jsxs)("select", { value: daysAhead, onChange: function (e) { return setDaysAhead(parseInt(e.target.value, 10)); }, className: "text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500", children: [(0, jsx_runtime_1.jsx)("option", { value: "7", children: "Next 7 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "14", children: "Next 14 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "30", children: "Next 30 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "60", children: "Next 60 Days" }), (0, jsx_runtime_1.jsx)("option", { value: "90", children: "Next 90 Days" })] })] }), alerts.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8 text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), (0, jsx_runtime_1.jsxs)("p", { children: ["No certifications expiring in the next ", daysAhead, " days"] })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: alerts.map(function (alert) { return ((0, jsx_runtime_1.jsx)("div", { className: "p-4 rounded-lg border ".concat(getAlertColor(alert.days_until_expiration)), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 mt-0.5 flex-shrink-0" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: alert.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm opacity-90", children: alert.email })] }), alert.days_until_expiration !== null && ((0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm font-semibold", children: [alert.days_until_expiration, " day", alert.days_until_expiration !== 1 ? 's' : ''] }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs opacity-75", children: "until expiration" })] }))] }), alert.license_number && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 mr-1" }), "License: ", alert.license_number] })), alert.expiration_date && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-1 flex items-center text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4 mr-1" }), "Expires: ", new Date(alert.expiration_date).toLocaleDateString()] }))] })] }) }, alert.user_id)); }) }))] }));
}
