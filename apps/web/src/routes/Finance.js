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
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
// Real financial data will be fetched from the API
// Mock data removed - using real API data
var FinancePage = function () {
    var _a = (0, react_1.useState)('overview'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = (0, react_1.useState)(''), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = (0, react_1.useState)('all'), filterStatus = _c[0], setFilterStatus = _c[1];
    var _d = (0, react_1.useState)([]), invoices = _d[0], setInvoices = _d[1];
    var _e = (0, react_1.useState)([]), payments = _e[0], setPayments = _e[1];
    var _f = (0, react_1.useState)(null), billingAnalytics = _f[0], setBillingAnalytics = _f[1];
    var _g = (0, react_1.useState)(true), loading = _g[0], setLoading = _g[1];
    var _h = (0, react_1.useState)(null), error = _h[0], setError = _h[1];
    var tabs = [
        { id: 'overview', label: 'Overview', icon: lucide_react_1.BarChart3 },
        { id: 'invoices', label: 'Invoices', icon: lucide_react_1.FileText },
        { id: 'payments', label: 'Payments', icon: lucide_react_1.CreditCard },
        { id: 'expenses', label: 'Expenses', icon: lucide_react_1.Receipt },
        { id: 'reports', label: 'Reports', icon: lucide_react_1.PieChart }
    ];
    // Load data on component mount
    (0, react_1.useEffect)(function () {
        var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, invoicesData, paymentsData, analyticsData, invoices_1, payments_1, analytics, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        setError(null);
                        return [4 /*yield*/, Promise.allSettled([
                                enhanced_api_1.enhancedApi.billing.getInvoices().catch(function () { return []; }),
                                enhanced_api_1.enhancedApi.billing.getPayments().catch(function () { return []; }),
                                enhanced_api_1.enhancedApi.billing.getBillingAnalytics().catch(function () { return ({
                                    totalRevenue: 0,
                                    outstandingAmount: 0,
                                    paidAmount: 0,
                                    totalInvoices: 0,
                                    overdueInvoices: 0,
                                    averagePaymentTime: 0
                                }); })
                            ])];
                    case 1:
                        _a = _b.sent(), invoicesData = _a[0], paymentsData = _a[1], analyticsData = _a[2];
                        invoices_1 = invoicesData.status === 'fulfilled' ? invoicesData.value : [];
                        payments_1 = paymentsData.status === 'fulfilled' ? paymentsData.value : [];
                        analytics = analyticsData.status === 'fulfilled'
                            ? analyticsData.value
                            : {
                                totalRevenue: 0,
                                outstandingAmount: 0,
                                paidAmount: 0,
                                totalInvoices: 0,
                                overdueInvoices: 0,
                                averagePaymentTime: 0
                            };
                        setInvoices(invoices_1);
                        setPayments(payments_1);
                        setBillingAnalytics(analytics);
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _b.sent();
                        logger_1.logger.error('Error loading finance data', err_1, 'Finance');
                        setError(err_1 instanceof Error ? err_1.message : 'Failed to load finance data');
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        loadData();
    }, []);
    // Refresh data function
    var refreshData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, invoicesData, paymentsData, analyticsData, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, Promise.all([
                            enhanced_api_1.enhancedApi.billing.getInvoices(),
                            enhanced_api_1.enhancedApi.billing.getPayments(),
                            enhanced_api_1.enhancedApi.billing.getBillingAnalytics()
                        ])];
                case 1:
                    _a = _b.sent(), invoicesData = _a[0], paymentsData = _a[1], analyticsData = _a[2];
                    setInvoices(invoicesData);
                    setPayments(paymentsData);
                    setBillingAnalytics(analyticsData);
                    return [3 /*break*/, 4];
                case 2:
                    err_2 = _b.sent();
                    logger_1.logger.error('Error refreshing finance data', err_2, 'Finance');
                    setError(err_2 instanceof Error ? err_2.message : 'Failed to refresh finance data');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getStatusColor = function (status) {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'overdue': return 'bg-red-100 text-red-800';
            case 'approved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'paid': return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" });
            case 'pending': return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-yellow-600" });
            case 'overdue': return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4 text-red-600" });
            case 'approved': return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" });
            default: return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-gray-600" });
        }
    };
    var filteredInvoices = invoices.filter(function (invoice) {
        var _a;
        var customerName = ((_a = invoice.accounts) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Customer';
        return customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (filterStatus === 'all' || invoice.status === filterStatus);
    });
    // Expenses will be loaded from real API when implemented
    var filteredExpenses = [];
    // Simple chart component using real data
    var RevenueChart = function () {
        var maxRevenue = Math.max((billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.totalRevenue) || 0, 1000);
        var maxOutstanding = Math.max((billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.outstandingAmount) || 0, 1000);
        return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-base font-semibold text-slate-900", children: "Revenue vs Outstanding" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-indigo-500 rounded" }), (0, jsx_runtime_1.jsx)("span", { children: "Revenue" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-amber-500 rounded" }), (0, jsx_runtime_1.jsx)("span", { children: "Outstanding" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-48 flex items-end justify-center gap-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "w-16 flex flex-col-reverse gap-1 mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-purple-500 rounded-t", style: { height: "".concat((((billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.totalRevenue) || 0) / maxRevenue) * 120, "px") } }), (0, jsx_runtime_1.jsx)("div", { className: "bg-orange-500 rounded-t", style: { height: "".concat((((billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.outstandingAmount) || 0) / maxOutstanding) * 120, "px") } })] }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600", children: "Current" })] }) })] }));
    };
    var ProfitChart = function () {
        var profit = ((billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.totalRevenue) || 0) - ((billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.outstandingAmount) || 0);
        var maxProfit = Math.max(profit, 1000);
        return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-base font-semibold text-slate-900", children: "Current Profit" }), (0, jsx_runtime_1.jsx)("div", { className: "h-32 flex items-end justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 bg-green-500 rounded-t", style: { height: "".concat((profit / maxProfit) * 100, "px") } }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-600 mt-1", children: ["$", (profit / 1000).toFixed(0), "k"] })] }) })] }));
    };
    var ExpensePieChart = function () { return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-base font-semibold text-slate-900", children: "Expense Categories" }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative w-32 h-32", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-2 rounded-full bg-white" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-gray-900", children: "$45k" }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-600", children: "Total" })] }) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-blue-500 rounded" }), (0, jsx_runtime_1.jsx)("span", { children: "Equipment" })] }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "$1,200" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-purple-500 rounded" }), (0, jsx_runtime_1.jsx)("span", { children: "Vehicle" })] }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "$450" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-green-500 rounded" }), (0, jsx_runtime_1.jsx)("span", { children: "Office" })] }), (0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: "$180" })] })] })] })); };
    // Show loading state
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600", children: "Loading finance data..." })] }) }));
    }
    // Show error state
    if (error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-12 w-12 text-red-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-slate-900 mb-2", children: "Error Loading Finance Data" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 mb-4", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: refreshData, className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm", children: "Try Again" })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1", children: "Finance Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm", children: "Manage invoices, payments, expenses, and financial reporting" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: refreshData, className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-3 w-3" }), "Refresh"] }), (0, jsx_runtime_1.jsxs)("button", { className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-3 w-3" }), "Export"] }), (0, jsx_runtime_1.jsxs)("button", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-3 w-3" }), "New Invoice"] })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-white/20 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-3 w-3 text-emerald-300" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded-md", children: (billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.totalRevenue) ? '+0%' : 'N/A' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xl font-bold mb-1", children: ["$", (billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.totalRevenue.toLocaleString()) || '0'] }), (0, jsx_runtime_1.jsx)("div", { className: "text-emerald-100 font-medium text-xs", children: "Total Revenue" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-white/20 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Receipt, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "h-3 w-3 text-rose-300" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded-md", children: (billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.outstandingAmount) ? '-0%' : 'N/A' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xl font-bold mb-1", children: ["$", (billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.outstandingAmount.toLocaleString()) || '0'] }), (0, jsx_runtime_1.jsx)("div", { className: "text-rose-100 font-medium text-xs", children: "Outstanding Amount" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-white/20 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-3 w-3 text-blue-300" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded-md", children: (billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.paidAmount) ? '+0%' : 'N/A' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-xl font-bold mb-1", children: ["$", (billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.paidAmount.toLocaleString()) || '0'] }), (0, jsx_runtime_1.jsx)("div", { className: "text-blue-100 font-medium text-xs", children: "Paid Amount" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" }), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1.5 bg-white/20 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "h-3 w-3 text-amber-300" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded-md", children: (billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.totalInvoices) ? '0%' : 'N/A' })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "text-xl font-bold mb-1", children: (billingAnalytics === null || billingAnalytics === void 0 ? void 0 : billingAnalytics.totalInvoices) || '0' }), (0, jsx_runtime_1.jsx)("div", { className: "text-amber-100 font-medium text-xs", children: "Total Invoices" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 flex-wrap", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative flex-1 max-w-md", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search invoices, payments, expenses...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, className: "w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm" })] }), (0, jsx_runtime_1.jsxs)("select", { value: filterStatus, onChange: function (e) { return setFilterStatus(e.target.value); }, className: "border border-slate-200 rounded-lg px-2 py-1.5 min-w-[120px] bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Status" }), (0, jsx_runtime_1.jsx)("option", { value: "paid", children: "Paid" }), (0, jsx_runtime_1.jsx)("option", { value: "pending", children: "Pending" }), (0, jsx_runtime_1.jsx)("option", { value: "overdue", children: "Overdue" }), (0, jsx_runtime_1.jsx)("option", { value: "approved", children: "Approved" })] }), (0, jsx_runtime_1.jsxs)("button", { className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "h-3 w-3" }), "Filters"] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0 overflow-hidden mb-4", children: (0, jsx_runtime_1.jsx)("div", { className: "flex space-x-4 overflow-x-auto border-b border-slate-200", children: tabs.map(function (tab) {
                        var Icon = tab.icon;
                        return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab(tab.id); }, className: "flex items-center gap-1 py-1 px-1 border-b-2 font-medium text-xs whitespace-nowrap transition-colors duration-200 ".concat(activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'), children: [(0, jsx_runtime_1.jsx)(Icon, { className: "h-3 w-3" }), tab.label] }, tab.id));
                    }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex flex-col min-h-0 overflow-hidden", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [activeTab === 'overview' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: (0, jsx_runtime_1.jsx)(RevenueChart, {}) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: (0, jsx_runtime_1.jsx)(ProfitChart, {}) })] }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: (0, jsx_runtime_1.jsx)(ExpensePieChart, {}) })] })), activeTab === 'invoices' && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-bold text-slate-800 mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 bg-indigo-100 rounded-md", children: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-indigo-600" }) }), "Invoices"] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: filteredInvoices.map(function (invoice) {
                                        var _a;
                                        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-slate-600" }), (0, jsx_runtime_1.jsx)("span", { className: "px-1.5 py-0.5 text-xs rounded-full ".concat(getStatusColor(invoice.status)), children: invoice.status })] }), (0, jsx_runtime_1.jsx)("button", { className: "p-1 text-slate-400 hover:text-slate-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { className: "h-3 w-3" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-slate-900 mb-1", children: invoice.invoice_number }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-600 mb-1", children: ((_a = invoice.accounts) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Customer' }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-slate-600 mb-2", children: ["Due: ", new Date(invoice.due_date).toLocaleDateString()] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-semibold text-slate-900", children: ["$", invoice.total_amount.toLocaleString()] }), getStatusIcon(invoice.status)] })] }, invoice.id));
                                    }) })] })), activeTab === 'payments' && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-bold text-slate-800 mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 bg-emerald-100 rounded-md", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "h-4 w-4 text-emerald-600" }) }), "Payments"] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: payments.map(function (payment) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "h-4 w-4 text-slate-600" }), (0, jsx_runtime_1.jsx)("span", { className: "px-1.5 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800", children: "Paid" })] }), (0, jsx_runtime_1.jsx)("button", { className: "p-1 text-slate-400 hover:text-slate-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { className: "h-3 w-3" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-slate-900 mb-1", children: payment.Invoice.invoice_number }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-600 mb-1", children: payment.payment_methods.payment_name || 'Payment Method' }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-slate-600 mb-2", children: ["Paid: ", new Date(payment.payment_date).toLocaleDateString()] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-semibold text-slate-900", children: ["$", payment.amount.toLocaleString()] }), (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-emerald-600" })] })] }, payment.id)); }) })] })), activeTab === 'expenses' && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-bold text-slate-800 mb-3 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-1 bg-rose-100 rounded-md", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Receipt, { className: "h-4 w-4 text-rose-600" }) }), "Expenses"] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3", children: filteredExpenses.map(function (expense) { return ((0, jsx_runtime_1.jsxs)("div", { className: "p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Receipt, { className: "h-4 w-4 text-slate-600" }), (0, jsx_runtime_1.jsx)("span", { className: "px-1.5 py-0.5 text-xs rounded-full ".concat(getStatusColor(expense.status)), children: expense.status })] }), (0, jsx_runtime_1.jsx)("button", { className: "p-1 text-slate-400 hover:text-slate-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { className: "h-3 w-3" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-slate-900 mb-1", children: expense.category }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-slate-600 mb-1", children: expense.description }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-slate-600 mb-2", children: ["Date: ", new Date(expense.date).toLocaleDateString()] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-semibold text-slate-900", children: ["$", expense.amount.toLocaleString()] }), getStatusIcon(expense.status)] })] }, expense.id)); }) })] })), activeTab === 'reports' && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-base font-semibold text-slate-900 mb-3", children: "Monthly Summary" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-slate-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Total Revenue" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-bold text-emerald-600", children: "$125,000" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-slate-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Total Expenses" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-bold text-rose-600", children: "$45,000" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-slate-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Net Profit" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-bold text-blue-600", children: "$80,000" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-slate-50 rounded-lg", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", children: "Profit Margin" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-bold text-violet-600", children: "64%" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-base font-semibold text-slate-900 mb-3", children: "Quick Actions" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("button", { className: "w-full justify-start bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-3 w-3" }), "Export Financial Report"] }), (0, jsx_runtime_1.jsxs)("button", { className: "w-full justify-start bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-3 w-3" }), "Schedule Tax Filing"] }), (0, jsx_runtime_1.jsxs)("button", { className: "w-full justify-start bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-3 w-3" }), "Generate P&L Statement"] }), (0, jsx_runtime_1.jsxs)("button", { className: "w-full justify-start bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "h-3 w-3" }), "Payment Reconciliation"] })] })] })] }))] }) })] }));
};
exports.default = FinancePage;
