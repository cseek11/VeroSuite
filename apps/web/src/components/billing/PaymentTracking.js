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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PaymentTracking;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var recharts_1 = require("recharts");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
function PaymentTracking() {
    var _this = this;
    var _a, _b;
    var _c = (0, react_1.useState)(function () {
        return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '';
    }), startDate = _c[0], setStartDate = _c[1];
    var _d = (0, react_1.useState)(function () { return new Date().toISOString().split('T')[0] || ''; }), endDate = _d[0], setEndDate = _d[1];
    var defaultTrackingData = {
        dailyTrends: {},
        payments: [],
        summary: {
            totalAmount: 0,
            paymentCount: 0,
            averagePayment: 0
        }
    };
    var handleDateChange = function (setter) {
        return function (value) {
            var _a, _b;
            if (typeof value === 'string') {
                setter(value);
                return;
            }
            setter((_b = (_a = value === null || value === void 0 ? void 0 : value.target) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '');
        };
    };
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'payment-tracking', startDate !== null && startDate !== void 0 ? startDate : '', endDate !== null && endDate !== void 0 ? endDate : ''],
        queryFn: function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, enhanced_api_1.billing.getPaymentTracking(startDate !== null && startDate !== void 0 ? startDate : '', endDate !== null && endDate !== void 0 ? endDate : '')];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        }); },
        initialData: defaultTrackingData,
        placeholderData: defaultTrackingData
    }), _f = _e.data, data = _f === void 0 ? defaultTrackingData : _f, isLoading = _e.isLoading, error = _e.error, refetch = _e.refetch;
    (0, react_1.useEffect)(function () {
        if (error) {
            logger_1.logger.error('Failed to fetch payment tracking data', error, 'PaymentTracking');
            toast_1.toast.error('Failed to load payment tracking data. Please try again.');
        }
    }, [error]);
    // Prepare chart data from daily trends - MUST be called before early returns (Rules of Hooks)
    var chartData = (0, react_1.useMemo)(function () {
        if (!(data === null || data === void 0 ? void 0 : data.dailyTrends)) {
            return [];
        }
        return Object.entries(data.dailyTrends)
            .map(function (_a) {
            var date = _a[0], amount = _a[1];
            return ({
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                amount: Number(amount),
                fullDate: date
            });
        })
            .sort(function (a, b) { return new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime(); });
    }, [data === null || data === void 0 ? void 0 : data.dailyTrends]);
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };
    var formatDate = function (date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    // Early returns MUST come after all hooks (Rules of Hooks)
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading payment tracking data..." })] }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { children: "Failed to load payment tracking data. Please try again." }) }) }) }));
    }
    var trackingData = data !== null && data !== void 0 ? data : defaultTrackingData;
    var payments = ((_a = trackingData.payments) !== null && _a !== void 0 ? _a : []);
    var summary = (_b = trackingData.summary) !== null && _b !== void 0 ? _b : defaultTrackingData.summary;
    var handleExportCSV = function () {
        try {
            var headers = ['Date', 'Customer', 'Invoice', 'Amount', 'Payment Method', 'Reference Number', 'Notes'];
            var rows = payments.map(function (payment) {
                var _a, _b, _c, _d;
                var p = payment;
                return [
                    p.payment_date ? new Date(p.payment_date).toLocaleDateString() : 'N/A',
                    ((_b = (_a = p.Invoice) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.name) || 'Unknown',
                    ((_c = p.Invoice) === null || _c === void 0 ? void 0 : _c.invoice_number) || 'N/A',
                    formatCurrency(Number(p.amount || 0)),
                    ((_d = p.payment_methods) === null || _d === void 0 ? void 0 : _d.payment_name) || 'N/A',
                    p.reference_number || 'N/A',
                    p.notes || ''
                ];
            });
            var csvContent = __spreadArray([
                'Payment Tracking Report',
                "Generated: ".concat(new Date().toLocaleDateString()),
                "Date Range: ".concat(formatDate(startDate), " - ").concat(formatDate(endDate)),
                "Total Amount: ".concat(formatCurrency(summary.totalAmount)),
                "Payment Count: ".concat(summary.paymentCount),
                "Average Payment: ".concat(formatCurrency(summary.averagePayment)),
                '',
                headers.join(',')
            ], rows.map(function (row) {
                return row.map(function (cell) { return "\"".concat(String(cell).replace(/"/g, '""'), "\""); }).join(',');
            }), true).join('\n');
            var blob = new Blob([csvContent], { type: 'text/csv' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "Payment-Tracking-".concat(startDate, "-").concat(endDate, ".csv");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            logger_1.logger.debug('Payment Tracking CSV exported', { startDate: startDate, endDate: endDate }, 'PaymentTracking');
            toast_1.toast.success('Payment tracking report exported successfully');
        }
        catch (error) {
            logger_1.logger.error('Failed to export Payment Tracking CSV', error, 'PaymentTracking');
            toast_1.toast.error('Failed to export report. Please try again.');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900", children: "Payment Tracking & Reconciliation" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 mt-1", children: "Monitor payment trends and reconcile transactions" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", icon: lucide_react_1.Download, onClick: handleExportCSV, children: "Export CSV" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: function () { return refetch(); }, children: "Refresh" })] })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "w-5 h-5 text-gray-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium", children: "Date Range:" })] }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: startDate, onChange: handleDateChange(setStartDate), className: "w-40" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { children: "to" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: endDate, onChange: handleDateChange(setEndDate), className: "w-40" })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-green-700 font-medium text-sm", children: "Total Payments" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-green-900 font-bold mt-1", children: formatCurrency(summary.totalAmount) }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-green-600 text-xs mt-1", children: [summary.paymentCount, " transaction", summary.paymentCount !== 1 ? 's' : ''] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-6 h-6 text-green-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-blue-700 font-medium text-sm", children: "Average Payment" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-blue-900 font-bold mt-1", children: formatCurrency(summary.averagePayment) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-blue-600 text-xs mt-1", children: "Per transaction" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-6 h-6 text-blue-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-purple-700 font-medium text-sm", children: "Payment Count" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-purple-900 font-bold mt-1", children: summary.paymentCount }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-purple-600 text-xs mt-1", children: "In selected period" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Receipt, { className: "w-6 h-6 text-purple-600" }) })] }) }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold", children: "Payment Trends" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsxs)("span", { children: [Object.keys((trackingData === null || trackingData === void 0 ? void 0 : trackingData.dailyTrends) || {}).length, " days of data"] })] })] }), chartData.length > 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "h-80", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.LineChart, { data: chartData, margin: { top: 5, right: 30, left: 20, bottom: 5 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "date", stroke: "#6b7280", style: { fontSize: '12px' } }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { stroke: "#6b7280", style: { fontSize: '12px' }, tickFormatter: function (value) { return "$".concat(value.toLocaleString()); } }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { contentStyle: {
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                padding: '8px'
                                            }, formatter: function (value) { return formatCurrency(value); } }), (0, jsx_runtime_1.jsx)(recharts_1.Legend, {}), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "amount", stroke: "#8b5cf6", strokeWidth: 2, dot: { fill: '#8b5cf6', r: 4 }, name: "Daily Payments" })] }) }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-12 h-12 text-gray-400 mx-auto mb-2" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-500", children: "No payment data available for selected date range" })] }) }))] }) }), payments.length > 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold mb-6", children: "Payment Distribution" }), (0, jsx_runtime_1.jsx)("div", { className: "h-64", children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: chartData, margin: { top: 5, right: 30, left: 20, bottom: 5 }, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "date", stroke: "#6b7280", style: { fontSize: '12px' } }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { stroke: "#6b7280", style: { fontSize: '12px' }, tickFormatter: function (value) { return "$".concat(value.toLocaleString()); } }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { contentStyle: {
                                                backgroundColor: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                padding: '8px'
                                            }, formatter: function (value) { return formatCurrency(value); } }), (0, jsx_runtime_1.jsx)(recharts_1.Legend, {}), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "amount", fill: "#8b5cf6", name: "Daily Payments", radius: [8, 8, 0, 0] })] }) }) })] }) })), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold", children: "Recent Payments" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Download, onClick: handleExportCSV, children: "Export" })] }), payments.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-16 h-16 text-gray-300 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-500 mb-2", children: "No payments found" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-400 text-sm", children: "Try adjusting the date range." })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [payments.slice(0, 20).map(function (payment) {
                                    var _a, _b, _c;
                                    var p = payment;
                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-10 h-10 bg-green-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 text-green-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold", children: ((_b = (_a = p.Invoice) === null || _a === void 0 ? void 0 : _a.accounts) === null || _b === void 0 ? void 0 : _b.name) || 'Unknown Customer' }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 text-sm text-gray-600 mt-1", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Invoice: ", ((_c = p.Invoice) === null || _c === void 0 ? void 0 : _c.invoice_number) || 'N/A'] }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { children: p.payment_date ? formatDate(p.payment_date) : 'N/A' }), p.payment_methods && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "w-3 h-3 mr-1" }), p.payment_methods.payment_name || 'Payment Method'] })] }))] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-bold text-lg text-green-800", children: formatCurrency(Number(p.amount || 0)) }), p.reference_number && ((0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-xs text-gray-500", children: ["Ref: ", p.reference_number] }))] })] }), p.notes && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 pt-2 border-t border-gray-100", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm text-gray-600", children: p.notes }) }))] }, p.id || Math.random()));
                                }), payments.length > 20 && ((0, jsx_runtime_1.jsx)("div", { className: "text-center pt-4", children: (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-gray-500 text-sm", children: ["Showing 20 of ", payments.length, " payments"] }) }))] }))] }) })] }));
}
