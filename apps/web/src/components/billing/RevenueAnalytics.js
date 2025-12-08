"use strict";
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
exports.default = RevenueAnalytics;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var recharts_1 = require("recharts");
var enhanced_api_1 = require("@/lib/enhanced-api");
var logger_1 = require("@/utils/logger");
var toast_1 = require("@/utils/toast");
function RevenueAnalytics(_a) {
    var propStartDate = _a.startDate, propEndDate = _a.endDate;
    var _b = (0, react_1.useState)(propStartDate ||
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]), startDate = _b[0], setStartDate = _b[1];
    var _c = (0, react_1.useState)(propEndDate || new Date().toISOString().split('T')[0]), endDate = _c[0], setEndDate = _c[1];
    var _d = (0, react_1.useState)('overview'), _activeView = _d[0], _setActiveView = _d[1];
    var _e = (0, react_query_1.useQuery)({
        queryKey: ['billing', 'revenue-analytics', startDate, endDate],
        queryFn: function () { return enhanced_api_1.billing.getRevenueAnalytics(startDate, endDate); },
        enabled: !!startDate && !!endDate,
    }), revenueData = _e.data, isLoading = _e.isLoading, error = _e.error, refetch = _e.refetch;
    var formatCurrency = function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };
    var formatPercentage = function (value) {
        return "".concat(value >= 0 ? '+' : '').concat(value.toFixed(1), "%");
    };
    // Prepare chart data
    var chartData = (0, react_1.useMemo)(function () {
        if (!(revenueData === null || revenueData === void 0 ? void 0 : revenueData.monthlyRevenue))
            return [];
        return revenueData.monthlyRevenue.map(function (item) { return ({
            month: item.month,
            revenue: Number(item.revenue || 0),
            formattedRevenue: formatCurrency(Number(item.revenue || 0)),
        }); });
    }, [revenueData]);
    var handleExport = function () {
        if (!revenueData) {
            var errorMsg = "Cannot export revenue analytics: No data available for period ".concat(startDate, " to ").concat(endDate, ". Please wait for data to load or adjust the date range.");
            logger_1.logger.warn(errorMsg, { startDate: startDate, endDate: endDate }, 'RevenueAnalytics');
            toast_1.toast.error('No data to export. Please wait for data to load or adjust the date range.');
            return;
        }
        try {
            // Create CSV content
            var csvRows = __spreadArray([
                ['Revenue Analytics Report'],
                ["Period: ".concat(startDate, " to ").concat(endDate)],
                [''],
                ['Metric', 'Value'],
                ['Total Revenue', formatCurrency(revenueData.totalRevenue || 0)],
                ['Growth Rate', "".concat(formatPercentage(revenueData.growthRate || 0))],
                [''],
                ['Monthly Revenue'],
                ['Month', 'Revenue']
            ], (revenueData.monthlyRevenue || []).map(function (item) { return [
                item.month,
                formatCurrency(Number(item.revenue || 0)),
            ]; }), true);
            var csvContent = csvRows.map(function (row) { return row.join(','); }).join('\n');
            var blob = new Blob([csvContent], { type: 'text/csv' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "revenue-analytics-".concat(startDate, "-to-").concat(endDate, ".csv");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast_1.toast.success('Revenue analytics exported successfully');
            logger_1.logger.debug('Revenue analytics exported', { startDate: startDate, endDate: endDate, rowCount: csvRows.length }, 'RevenueAnalytics');
        }
        catch (error) {
            var errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error("Failed to export revenue analytics CSV for period ".concat(startDate, " to ").concat(endDate, ". ").concat(errorMessage, ". Please check browser download permissions and try again."), error, 'RevenueAnalytics');
            toast_1.toast.error("Failed to export revenue analytics. ".concat(errorMessage, ". Please check your browser settings and try again."));
        }
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "w-8 h-8 animate-spin text-purple-600" }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Loading revenue analytics..." })] }));
    }
    if (error) {
        var errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger_1.logger.error("Failed to load revenue analytics for period ".concat(startDate, " to ").concat(endDate, ". ").concat(errorMessage, ". This may be due to network issues, invalid date range, or server errors."), error, 'RevenueAnalytics');
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 text-red-600 mr-2" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { className: "font-semibold text-red-900", children: "Failed to load revenue analytics" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { className: "text-sm text-red-700 mt-1", children: [errorMessage, ". Please check your date range and network connection, then try again."] })] })] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", onClick: function () { return refetch(); }, className: "mt-4", children: "Retry" })] }) }) }));
    }
    if (!revenueData) {
        return null;
    }
    var totalRevenue = revenueData.totalRevenue, growthRate = revenueData.growthRate, monthlyRevenue = revenueData.monthlyRevenue;
    var isPositiveGrowth = (growthRate || 0) >= 0;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 3, className: "font-semibold flex items-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-6 h-6 mr-2 text-purple-600" }), "Revenue Analytics"] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mt-1", children: "Track revenue trends and performance metrics" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-2", children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", size: "sm", icon: lucide_react_1.Download, onClick: handleExport, children: "Export" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-gray-700 mb-2 block", children: "Start Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: startDate, onChange: function (e) { return setStartDate(e.target.value); } })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "font-medium text-gray-700 mb-2 block", children: "End Date" }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "date", value: endDate, onChange: function (e) { return setEndDate(e.target.value); } })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-end", children: (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", onClick: function () { return refetch(); }, className: "w-full", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "w-4 h-4 mr-2" }), "Apply Filter"] }) })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Total Revenue" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "mt-2 text-gray-900", children: formatCurrency(totalRevenue || 0) }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600 mt-1", children: [startDate, " to ", endDate] })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-purple-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-6 h-6 text-purple-600" }) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Growth Rate" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "mt-2 ".concat(isPositiveGrowth ? 'text-green-600' : 'text-red-600'), children: formatPercentage(growthRate || 0) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mt-1", children: [isPositiveGrowth ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ArrowUp, { className: "w-4 h-4 text-green-600 mr-1" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ArrowDown, { className: "w-4 h-4 text-red-600 mr-1" })), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: isPositiveGrowth ? 'text-green-600' : 'text-red-600', children: [isPositiveGrowth ? 'Increased' : 'Decreased', " from previous period"] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 rounded-lg ".concat(isPositiveGrowth ? 'bg-green-100' : 'bg-red-100'), children: isPositiveGrowth ? ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-6 h-6 text-green-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "w-6 h-6 text-red-600" })) })] }) }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-500", children: "Average Monthly Revenue" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "mt-2 text-gray-900", children: formatCurrency(monthlyRevenue && monthlyRevenue.length > 0
                                                    ? (totalRevenue || 0) / monthlyRevenue.length
                                                    : 0) }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600 mt-1", children: [(monthlyRevenue === null || monthlyRevenue === void 0 ? void 0 : monthlyRevenue.length) || 0, " months"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-blue-100 rounded-lg", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "w-6 h-6 text-blue-600" }) })] }) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold mb-4", children: "Monthly Revenue Trend" }), chartData.length > 0 ? ((0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.LineChart, { data: chartData, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "month" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { tickFormatter: function (value) { return "$".concat((value / 1000).toFixed(0), "k"); } }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { formatter: function (value) { return formatCurrency(value); }, labelStyle: { color: '#374151' } }), (0, jsx_runtime_1.jsx)(recharts_1.Legend, {}), (0, jsx_runtime_1.jsx)(recharts_1.Line, { type: "monotone", dataKey: "revenue", stroke: "#7c3aed", strokeWidth: 2, name: "Revenue", dot: { fill: '#7c3aed', r: 4 } })] }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-[300px] text-gray-500", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { children: "No revenue data available for the selected period" }) }))] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold mb-4", children: "Monthly Revenue Comparison" }), chartData.length > 0 ? ((0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 300, children: (0, jsx_runtime_1.jsxs)(recharts_1.BarChart, { data: chartData, children: [(0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "month" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { tickFormatter: function (value) { return "$".concat((value / 1000).toFixed(0), "k"); } }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { formatter: function (value) { return formatCurrency(value); }, labelStyle: { color: '#374151' } }), (0, jsx_runtime_1.jsx)(recharts_1.Legend, {}), (0, jsx_runtime_1.jsx)(recharts_1.Bar, { dataKey: "revenue", fill: "#7c3aed", name: "Revenue" })] }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-[300px] text-gray-500", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { children: "No revenue data available for the selected period" }) }))] }) })] }), monthlyRevenue && monthlyRevenue.length > 0 && ((0, jsx_runtime_1.jsx)(Card_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "font-semibold mb-4", children: "Monthly Revenue Breakdown" }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-200", children: [(0, jsx_runtime_1.jsx)("th", { className: "text-left py-3 px-4 font-semibold text-gray-700", children: "Month" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-3 px-4 font-semibold text-gray-700", children: "Revenue" }), (0, jsx_runtime_1.jsx)("th", { className: "text-right py-3 px-4 font-semibold text-gray-700", children: "% of Total" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: monthlyRevenue.map(function (item, index) {
                                            var revenue = Number(item.revenue || 0);
                                            var percentage = totalRevenue ? (revenue / totalRevenue) * 100 : 0;
                                            return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-gray-900", children: item.month }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right font-medium text-gray-900", children: formatCurrency(revenue) }), (0, jsx_runtime_1.jsxs)("td", { className: "py-3 px-4 text-right text-gray-600", children: [percentage.toFixed(1), "%"] })] }, index));
                                        }) }), (0, jsx_runtime_1.jsx)("tfoot", { children: (0, jsx_runtime_1.jsxs)("tr", { className: "bg-gray-50 font-semibold", children: [(0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-gray-900", children: "Total" }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right text-gray-900", children: formatCurrency(totalRevenue || 0) }), (0, jsx_runtime_1.jsx)("td", { className: "py-3 px-4 text-right text-gray-900", children: "100%" })] }) })] }) })] }) }))] }));
}
