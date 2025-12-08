"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PLReport;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var jspdf_1 = __importDefault(require("jspdf"));
function PLReport() {
    var _a, _b;
    var now = new Date();
    var yearStart = new Date(now.getFullYear(), 0, 1);
    var _c = (0, react_1.useState)((_a = yearStart.toISOString().split('T')[0]) !== null && _a !== void 0 ? _a : ''), startDate = _c[0], setStartDate = _c[1];
    var _d = (0, react_1.useState)((_b = now.toISOString().split('T')[0]) !== null && _b !== void 0 ? _b : ''), endDate = _d[0], setEndDate = _d[1];
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'analytics'],
        queryFn: function () { return enhanced_api_1.billing.getBillingAnalytics(); },
    }), _billingAnalytics = _e.data, analyticsLoading = _e.isLoading;
    var _f = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'revenue-analytics', startDate !== null && startDate !== void 0 ? startDate : '', endDate !== null && endDate !== void 0 ? endDate : ''],
        queryFn: function () { return enhanced_api_1.billing.getRevenueAnalytics(startDate !== null && startDate !== void 0 ? startDate : '', endDate !== null && endDate !== void 0 ? endDate : ''); },
    }), revenueAnalytics = _f.data, revenueLoading = _f.isLoading;
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };
    var handleExportPDF = function () {
        var doc = new jspdf_1.default();
        var pageWidth = doc.internal.pageSize.getWidth();
        var margin = 20;
        var yPos = margin;
        // Title
        doc.setFontSize(18);
        doc.text('Profit & Loss Report', pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;
        // Date range
        doc.setFontSize(10);
        doc.text("Period: ".concat(new Date(startDate).toLocaleDateString(), " - ").concat(new Date(endDate).toLocaleDateString()), pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;
        // Revenue section
        doc.setFontSize(14);
        doc.text('REVENUE', margin, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.text("Total Revenue: ".concat(formatCurrency((revenueAnalytics === null || revenueAnalytics === void 0 ? void 0 : revenueAnalytics.totalRevenue) || 0)), margin + 5, yPos);
        yPos += 8;
        // Expenses section (placeholder - would come from expense tracking)
        doc.setFontSize(14);
        doc.text('EXPENSES', margin, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.text('Expenses: $0.00 (Expense tracking not yet implemented)', margin + 5, yPos);
        yPos += 8;
        // Net Income
        var netIncome = ((revenueAnalytics === null || revenueAnalytics === void 0 ? void 0 : revenueAnalytics.totalRevenue) || 0) - 0; // Expenses would be subtracted here
        doc.setFontSize(14);
        doc.text('NET INCOME', margin, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.text(formatCurrency(netIncome), margin + 5, yPos);
        doc.save("P&L-Report-".concat(startDate, "-").concat(endDate, ".pdf"));
        logger_1.logger.debug('P&L report exported', { startDate: startDate, endDate: endDate }, 'PLReport');
    };
    var handleExportCSV = function () {
        var _a, _b;
        var csv = [
            ['Profit & Loss Report'],
            ["Period: ".concat(startDate, " to ").concat(endDate)],
            [],
            ['Category', 'Amount'],
            ['Total Revenue', (((_a = revenueAnalytics === null || revenueAnalytics === void 0 ? void 0 : revenueAnalytics.totalRevenue) !== null && _a !== void 0 ? _a : 0)).toFixed(2)],
            ['Total Expenses', '0.00'],
            ['Net Income', (((_b = revenueAnalytics === null || revenueAnalytics === void 0 ? void 0 : revenueAnalytics.totalRevenue) !== null && _b !== void 0 ? _b : 0) - 0).toFixed(2)],
        ].map(function (row) { return row.join(','); }).join('\n');
        var blob = new Blob([csv], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "P&L-Report-".concat(startDate, "-").concat(endDate, ".csv");
        a.click();
        window.URL.revokeObjectURL(url);
    };
    if (analyticsLoading || revenueLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading P&L data..." })] }));
    }
    var netIncome = ((revenueAnalytics === null || revenueAnalytics === void 0 ? void 0 : revenueAnalytics.totalRevenue) || 0) - 0; // Expenses placeholder
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900", children: "Profit & Loss Report" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-600 mt-1", children: "Financial performance overview" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", icon: lucide_react_1.Download, onClick: handleExportCSV, children: "Export CSV" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", icon: lucide_react_1.Download, onClick: handleExportPDF, children: "Export PDF" })] })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-5 h-5 text-gray-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium", children: "Report Period:" })] }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: startDate, onChange: function (e) { return setStartDate(e.target.value); }, className: "w-40" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { children: "to" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: endDate, onChange: function (e) { return setEndDate(e.target.value); }, className: "w-40" })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-green-700 font-medium text-sm", children: "Total Revenue" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-green-900 font-bold mt-1", children: formatCurrency((revenueAnalytics === null || revenueAnalytics === void 0 ? void 0 : revenueAnalytics.totalRevenue) || 0) }), (revenueAnalytics === null || revenueAnalytics === void 0 ? void 0 : revenueAnalytics.growthRate) !== undefined && revenueAnalytics.growthRate !== 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mt-2 text-xs ".concat(revenueAnalytics.growthRate > 0 ? 'text-green-600' : 'text-red-600'), children: [revenueAnalytics.growthRate > 0 ? ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-3 h-3 mr-1" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "w-3 h-3 mr-1" })), Math.abs(revenueAnalytics.growthRate).toFixed(1), "% growth"] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-6 h-6 text-green-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200", children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-red-700 font-medium text-sm", children: "Total Expenses" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-red-900 font-bold mt-1", children: formatCurrency(0) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-red-600 text-xs mt-1", children: "Expense tracking coming soon" })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-red-100 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "w-6 h-6 text-red-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "bg-gradient-to-br ".concat(netIncome >= 0
                            ? 'from-blue-50 to-cyan-50 border-blue-200'
                            : 'from-orange-50 to-amber-50 border-orange-200'), children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-medium text-sm ".concat(netIncome >= 0 ? 'text-blue-700' : 'text-orange-700'), children: "Net Income" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "font-bold mt-1 ".concat(netIncome >= 0 ? 'text-blue-900' : 'text-orange-900'), children: formatCurrency(netIncome) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-xs mt-1 ".concat(netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'), children: netIncome >= 0 ? 'Profit' : 'Loss' })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 rounded-full flex items-center justify-center ".concat(netIncome >= 0 ? 'bg-blue-100' : 'bg-orange-100'), children: netIncome >= 0 ? ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-6 h-6 ".concat(netIncome >= 0 ? 'text-blue-600' : 'text-orange-600') })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "w-6 h-6 text-orange-600" })) })] }) }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-semibold", children: "Detailed Breakdown" }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.BarChart3, children: "View Chart" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "border-b pb-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold text-green-800 mb-3", children: "REVENUE" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 pl-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { children: "Total Revenue" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold", children: formatCurrency((revenueAnalytics === null || revenueAnalytics === void 0 ? void 0 : revenueAnalytics.totalRevenue) || 0) })] }), (revenueAnalytics === null || revenueAnalytics === void 0 ? void 0 : revenueAnalytics.monthlyRevenue) && revenueAnalytics.monthlyRevenue.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 space-y-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-sm font-medium text-gray-700", children: "Monthly Breakdown:" }), revenueAnalytics.monthlyRevenue.map(function (month) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm pl-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { children: new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }), (0, jsx_runtime_1.jsx)(ui_1.Text, { children: formatCurrency(month.revenue) })] }, month.month)); })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border-b pb-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold text-red-800 mb-3", children: "EXPENSES" }), (0, jsx_runtime_1.jsx)("div", { className: "pl-4", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { className: "text-gray-500 italic", children: "Expense tracking will be available in a future update" }) })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center pt-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-bold ".concat(netIncome >= 0 ? 'text-blue-800' : 'text-orange-800'), children: "NET INCOME" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "font-bold ".concat(netIncome >= 0 ? 'text-blue-900' : 'text-orange-900'), children: formatCurrency(netIncome) })] }) })] })] }) })] }));
}
