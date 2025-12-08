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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var react_query_1 = require("@tanstack/react-query");
var enhanced_api_1 = require("@/lib/enhanced-api");
// Using Inspection type from @/types/inventory
var defaultInventoryData = {
    totalItems: 0,
    lowStock: 0,
    outOfStock: 0,
    expiringSoon: 0,
    complianceRate: 0,
    safetyScore: 0,
};
var InventoryCompliancePanel = function () {
    var _a = (0, react_query_1.useQuery)({
        queryKey: ['inventory', 'compliance'],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(enhanced_api_1.enhancedApi.inventory && typeof enhanced_api_1.enhancedApi.inventory.getComplianceData === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.inventory.getComplianceData()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, defaultInventoryData];
                }
            });
        }); },
    }).data, inventoryData = _a === void 0 ? defaultInventoryData : _a;
    var _b = (0, react_query_1.useQuery)({
        queryKey: ['inventory', 'categories'],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var categories;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(enhanced_api_1.enhancedApi.inventory && typeof enhanced_api_1.enhancedApi.inventory.getCategories === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.inventory.getCategories()];
                    case 1:
                        categories = _a.sent();
                        // Map to ensure type compatibility with InventoryCategory
                        return [2 /*return*/, categories.map(function (cat) { return ({
                                id: String(cat.id || ''),
                                name: String(cat.name || ''),
                                description: cat.description ? String(cat.description) : undefined,
                                itemCount: typeof cat.itemCount === 'number' ? cat.itemCount : undefined,
                                total: typeof cat.total === 'number' ? cat.total : 0,
                                lowStock: typeof cat.lowStock === 'number' ? cat.lowStock : 0,
                                outOfStock: typeof cat.outOfStock === 'number' ? cat.outOfStock : 0,
                                compliance: typeof cat.compliance === 'number' ? cat.compliance : undefined,
                            }); })];
                    case 2: return [2 /*return*/, []];
                }
            });
        }); },
    }).data, inventoryCategories = _b === void 0 ? [] : _b;
    var _c = (0, react_query_1.useQuery)({
        queryKey: ['inventory', 'alerts'],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var alerts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(enhanced_api_1.enhancedApi.inventory && typeof enhanced_api_1.enhancedApi.inventory.getComplianceAlerts === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.inventory.getComplianceAlerts()];
                    case 1:
                        alerts = _a.sent();
                        // Map to ensure type compatibility with ComplianceAlert
                        return [2 /*return*/, alerts.map(function (alert) { return ({
                                id: String(alert.id || ''),
                                type: alert.type,
                                severity: alert.severity,
                                message: String(alert.message || ''),
                                itemId: alert.itemId ? String(alert.itemId) : '',
                                itemName: alert.itemName ? String(alert.itemName) : '',
                                dueDate: alert.dueDate ? String(alert.dueDate) : '',
                                createdAt: String(alert.createdAt || new Date().toISOString()),
                            }); })];
                    case 2: return [2 /*return*/, []];
                }
            });
        }); },
    }).data, complianceAlerts = _c === void 0 ? [] : _c;
    var _d = (0, react_query_1.useQuery)({
        queryKey: ['inventory', 'inspections'],
        queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
            var inspections;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(enhanced_api_1.enhancedApi.inventory && typeof enhanced_api_1.enhancedApi.inventory.getRecentInspections === 'function')) return [3 /*break*/, 2];
                        return [4 /*yield*/, enhanced_api_1.enhancedApi.inventory.getRecentInspections()];
                    case 1:
                        inspections = _a.sent();
                        // Map to match the expected Inspection type structure
                        return [2 /*return*/, inspections.map(function (insp) { return (__assign(__assign({}, insp), { scheduledDate: insp.scheduledDate || new Date().toISOString() })); })];
                    case 2: return [2 /*return*/, []];
                }
            });
        }); },
    }).data, recentInspections = _d === void 0 ? [] : _d;
    var getSeverityColor = function (severity) {
        switch (severity) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var getSeverityIcon = function (severity) {
        switch (severity) {
            case 'high':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 text-red-500" });
            case 'medium':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-yellow-500" });
            case 'low':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-blue-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-gray-500" });
        }
    };
    var getAlertIcon = function (type) {
        switch (type) {
            case 'expiration':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-5 w-5 text-red-500" });
            case 'low_stock':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Package, { className: "h-5 w-5 text-yellow-500" });
            case 'temperature':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Thermometer, { className: "h-5 w-5 text-blue-500" });
            case 'maintenance':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-5 w-5 text-orange-500" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-gray-500" });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { title: "Inventory & Compliance Overview", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Package, { className: "mx-auto h-8 w-8 text-blue-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-blue-600", children: inventoryData.totalItems }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Total Items" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "mx-auto h-8 w-8 text-yellow-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-yellow-600", children: inventoryData.lowStock }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Low Stock" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "mx-auto h-8 w-8 text-green-500 mb-2" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "font-bold text-green-600", children: [inventoryData.complianceRate, "%"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Compliance Rate" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "mx-auto h-8 w-8 text-purple-500 mb-2" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "font-bold text-purple-600", children: [inventoryData.safetyScore, "%"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Safety Score" })] })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { title: "Inventory by Category", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: inventoryCategories.map(function (category, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-3", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: category.name }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-2", children: (0, jsx_runtime_1.jsxs)(ui_1.Badge, { variant: "default", className: category.compliance && category.compliance >= 95 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800', children: [category.compliance || 0, "%"] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-3 gap-4 mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-blue-600", children: category.total }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Total Items" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-yellow-600", children: category.lowStock }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Low Stock" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-red-600", children: category.outOfStock }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Out of Stock" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-2 rounded-full ".concat(category.compliance && category.compliance >= 95 ? 'bg-green-500' : 'bg-yellow-500'), style: { width: "".concat(category.compliance || 0, "%") } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 text-center", children: [category.compliance || 0, "%"] })] }, index)); }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { title: "Compliance Alerts", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: complianceAlerts.map(function (alert) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start space-x-3 p-3 border rounded-lg", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: getAlertIcon(alert.type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: alert.itemName }), getSeverityIcon(alert.severity)] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mb-1", children: alert.message }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: new Date(alert.createdAt).toLocaleDateString() }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getSeverityColor(alert.severity), children: alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1) })] })] })] }, alert.id)); }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { title: "Recent Inspections", children: (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: recentInspections.map(function (inspection) { return ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: inspection.inspector }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: new Date(inspection.scheduledDate).toLocaleDateString() })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-bold text-green-600", children: inspection.result === 'pass' ? '100%' : inspection.result === 'fail' ? '0%' : '50%' }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: "bg-green-100 text-green-800", children: inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1) })] })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: inspection.notes })] }, inspection.id)); }) }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { title: "Safety & Compliance Metrics", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "mx-auto h-8 w-8 text-green-500 mb-2" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "font-bold text-green-600", children: [inventoryData.complianceRate, "%"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Overall Compliance" }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2 mt-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-green-500 h-2 rounded-full", style: { width: "".concat(inventoryData.complianceRate, "%") } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 text-center mt-1", children: [inventoryData.complianceRate, "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "mx-auto h-8 w-8 text-blue-500 mb-2" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "font-bold text-blue-600", children: [inventoryData.safetyScore, "%"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Safety Score" }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2 mt-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-500 h-2 rounded-full", style: { width: "".concat(inventoryData.safetyScore, "%") } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-600 text-center mt-1", children: [inventoryData.safetyScore, "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "mx-auto h-8 w-8 text-orange-500 mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold text-orange-600", children: inventoryData.expiringSoon }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Items Expiring Soon" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Requires immediate attention" })] })] }) })] }));
};
exports.default = InventoryCompliancePanel;
