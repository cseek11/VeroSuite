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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PaymentAnalytics;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var recharts_1 = require("recharts");
var COLORS = ['#7c3aed', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
function PaymentAnalytics(_a) {
    var _this = this;
    var _b;
    var _c = _a.startDate, startDate = _c === void 0 ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : _c, // 30 days ago
    _d = _a.endDate, // 30 days ago
    endDate = _d === void 0 ? new Date() : _d, onDateRangeChange = _a.onDateRangeChange;
    var _e = (0, react_1.useState)(startDate.toISOString().split('T')[0]), dateRangeStart = _e[0], setDateRangeStart = _e[1];
    var _f = (0, react_1.useState)(endDate.toISOString().split('T')[0]), dateRangeEnd = _f[0], setDateRangeEnd = _f[1];
    // Fetch payment analytics
    var _g = (0, react_query_1.useQuery)({
        queryKey: ['payment-analytics', dateRangeStart, dateRangeEnd],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, enhanced_api_1.billing.getPaymentAnalytics(dateRangeStart || '', dateRangeEnd || '')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
    }), analyticsData = _g.data, isLoading = _g.isLoading, error = _g.error;
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };
    var formatPercentage = function (value) {
        return "".concat(value.toFixed(1), "%");
    };
    var handleDateRangeChange = function () {
        var newStartDate = dateRangeStart ? new Date(dateRangeStart) : new Date();
        var newEndDate = dateRangeEnd ? new Date(dateRangeEnd) : new Date();
        if (onDateRangeChange) {
            onDateRangeChange(newStartDate, newEndDate);
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading payment analytics..." })] }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-600 mr-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { children: "Failed to load payment analytics. Please try again." })] }) }) }) }));
    }
    if (!analyticsData) {
        return null;
    }
    var _h = analyticsData || {}, summary = _h.summary, paymentMethodBreakdownRaw = _h.paymentMethodBreakdown, failureReasonsRaw = _h.failureReasons, monthlyTrendsRaw = _h.monthlyTrends;
    // Convert paymentMethodBreakdown from Record to array format for charts
    var paymentMethodBreakdown = paymentMethodBreakdownRaw
        ? Object.entries(paymentMethodBreakdownRaw).map(function (_a) {
            var method = _a[0], count = _a[1];
            return ({
                method: method,
                count: count,
                total: count, // For display
            });
        })
        : [];
    // Convert monthlyTrends from Record to array format for charts
    var monthlyTrends = monthlyTrendsRaw
        ? Object.entries(monthlyTrendsRaw).map(function (_a) {
            var month = _a[0], value = _a[1];
            return ({
                month: month,
                successful: value,
                failed: 0, // Placeholder if not available
            });
        })
        : [];
    // Convert failureReasons from Record to array format for charts
    var failureReasons = failureReasonsRaw
        ? Object.entries(failureReasonsRaw).map(function (_a) {
            var reason = _a[0], count = _a[1];
            return ({
                reason: reason,
                count: count,
            });
        })
        : [];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, children: "Date Range" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "w-5 h-5 text-gray-400" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Start Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: dateRangeStart, onChange: function (e) { return setDateRangeStart(e.target.value); } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "End Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: dateRangeEnd, onChange: function (e) { return setDateRangeEnd(e.target.value); } })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end", children: (0, jsx_runtime_1.jsx)(Button_1.default, { onClick: handleDateRangeChange, variant: "primary", children: "Apply Filter" }) })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Total Payments" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "mt-2", children: (_b = summary === null || summary === void 0 ? void 0 : summary.totalPayments) !== null && _b !== void 0 ? _b : 0 })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-purple-100 rounded-full p-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-6 h-6 text-purple-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Success Rate" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "mt-2", children: summary ? formatPercentage(summary.successRate) : '0%' })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-green-100 rounded-full p-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-6 h-6 text-green-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Total Amount" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "mt-2", children: (summary === null || summary === void 0 ? void 0 : summary.totalAmount) ? formatCurrency(summary.totalAmount) : '$0.00' })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-100 rounded-full p-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-6 h-6 text-blue-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Avg Payment" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "mt-2", children: (summary === null || summary === void 0 ? void 0 : summary.averagePaymentAmount) ? formatCurrency(summary.averagePaymentAmount) : '$0.00' })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-orange-100 rounded-full p-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-6 h-6 text-orange-600" }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, children: "Payment Trends" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", icon: lucide_react_1.Download, children: "Export" })] }), (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.LineChart, { data: monthlyTrends, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "month" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, {}), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, {}), (0, jsx_runtime_1.jsx)(recharts_1.Legend, {}), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "successful", stroke: "#10b981", name: "Successful" }), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "failed", stroke: "#ef4444", name: "Failed" })] }) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, children: "Payment Methods" }), (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-5 h-5 text-gray-400" })] }), (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 250, children: (0, jsx_runtime_1.jsxs)(lucide_react_1.PieChart, { children: [(0, jsx_runtime_1.jsx)(recharts_1.Pie, { data: paymentMethodBreakdown, cx: "50%", cy: "50%", labelLine: false, outerRadius: 80, fill: "#8884d8", dataKey: "count", children: paymentMethodBreakdown.map(function (_entry, index) { return ((0, jsx_runtime_1.jsx)(recharts_1.Cell, { fill: COLORS[index % COLORS.length] }, "cell-".concat(index))); }) }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, {})] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 space-y-2", children: paymentMethodBreakdown.map(function (method, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 rounded-full mr-2", style: { backgroundColor: COLORS[index % COLORS.length] } }), (0, jsx_runtime_1.jsx)(ui_1.Text, { children: method.method })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-500", children: [method.count, " payments"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium", children: formatCurrency(method.total) })] })] }, method.method)); }) })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, children: "Failure Reasons" }), (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-gray-400" })] }), failureReasons.length > 0 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 200, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: failureReasons, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "reason", angle: -45, textAnchor: "end", height: 100 }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, {}), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, {}), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "count", fill: "#ef4444" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 space-y-2", children: failureReasons.slice(0, 5).map(function (reason) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm", children: reason.reason }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: formatPercentage(reason.percentage) }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "font-medium", children: ["(", reason.count, ")"] })] })] }, reason.reason)); }) })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-12 h-12 text-green-500 mx-auto mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-500", children: "No payment failures in this period" })] }))] }) })] })] }));
}
