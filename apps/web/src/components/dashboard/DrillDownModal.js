"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
var DrillDownModal = function (_a) {
    var _b;
    var isOpen = _a.isOpen, onClose = _a.onClose, kpi = _a.kpi, data = _a.data;
    if (!isOpen || !kpi)
        return null;
    var getCategoryIcon = function (category) {
        switch (category) {
            case 'financial':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "w-5 h-5 text-green-600" });
            case 'operational':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-5 h-5 text-blue-600" });
            case 'customer':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-5 h-5 text-purple-600" });
            case 'compliance':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-5 h-5 text-orange-600" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-5 h-5 text-gray-600" });
        }
    };
    var getTrendIcon = function (trend) {
        switch (trend) {
            case 'up':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-4 h-4 text-green-500" });
            case 'down':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingDown, { className: "w-4 h-4 text-red-500" });
            case 'stable':
                return (0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 bg-gray-400 rounded-full" });
            default:
                return null;
        }
    };
    var formatValue = function (value, unit) {
        if (unit === 'USD') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        }
        if (unit === 'stars') {
            return "".concat(value.toFixed(1), " \u2B50");
        }
        if (unit === '%') {
            return "".concat(value.toFixed(1), "%");
        }
        return value.toLocaleString();
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [getCategoryIcon(kpi.category), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: kpi.metric }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: (_b = kpi.drillDown) === null || _b === void 0 ? void 0 : _b.description })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-6 h-6" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 overflow-y-auto max-h-[calc(90vh-140px)]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-gray-600", children: "Current Value" }), getTrendIcon(kpi.trend)] }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-gray-900 mt-1", children: formatValue(kpi.value, kpi.threshold.unit) }), kpi.trendValue !== undefined && ((0, jsx_runtime_1.jsxs)("p", { className: "text-sm mt-1 ".concat(kpi.trend === 'up' ? 'text-green-600' :
                                                kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'), children: [kpi.trendValue > 0 ? '+' : '', kpi.trendValue, "% from last period"] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-gray-600", children: "Threshold Status" }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: "Good" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-medium text-green-600", children: ["\u2265", formatValue(kpi.threshold.green, kpi.threshold.unit)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: "Warning" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-medium text-yellow-600", children: ["\u2265", formatValue(kpi.threshold.yellow, kpi.threshold.unit)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500", children: "Critical" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-medium text-red-600", children: ["<", formatValue(kpi.threshold.yellow, kpi.threshold.unit)] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium text-gray-600", children: "Last Updated" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-900 mt-1", children: new Date(kpi.lastUpdated).toLocaleString() }), kpi.realTime && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mt-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-green-600 font-medium", children: "Real-time" })] }))] })] }), data && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-4", children: "Detailed Data" }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white border border-gray-200 rounded-lg overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "min-w-full divide-y divide-gray-200", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsx)("tr", { children: data.data && data.data.length > 0 && Object.keys(data.data[0]).map(function (key) { return ((0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: key.replace(/_/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }) }, key)); }) }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: data.data && data.data.map(function (item, index) { return ((0, jsx_runtime_1.jsx)("tr", { className: "hover:bg-gray-50", children: Object.values(item).map(function (value, valueIndex) { return ((0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: typeof value === 'string' && value.includes('T') && value.includes('Z')
                                                                ? new Date(value).toLocaleDateString()
                                                                : value }, valueIndex)); }) }, index)); }) })] }) }) })] })), !data && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-gray-400 mb-4", children: (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-12 h-12 mx-auto" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No Data Available" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: "Detailed data for this KPI is not currently available." })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500", children: "Close" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () {
                                // TODO: Implement export functionality
                                logger_1.logger.debug('Export KPI data', { kpiId: kpi === null || kpi === void 0 ? void 0 : kpi.id }, 'DrillDownModal');
                            }, className: "px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500", children: "Export Data" })] })] }) }));
};
exports.default = DrillDownModal;
