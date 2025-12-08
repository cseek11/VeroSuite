"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var useSmartKPIs_1 = require("@/hooks/useSmartKPIs");
var DashboardMetrics = function (_a) {
    var metrics = _a.metrics, _b = _a.enableSmartKPIs, enableSmartKPIs = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)(null), setHoveredMetric = _c[1];
    var smartKPIs = (0, useSmartKPIs_1.useSmartKPIs)();
    // Use smart KPIs if enabled, otherwise use regular metrics
    var displayMetrics = enableSmartKPIs ?
        (smartKPIs.enhancedMetrics && smartKPIs.enhancedMetrics.length > 0 ? smartKPIs.enhancedMetrics : metrics) :
        metrics;
    var handleDrillDown = function (metric, _index) {
        if (enableSmartKPIs && metric.drillDown) {
            // Find the corresponding Smart KPI
            var smartKPI = smartKPIs.kpiData.find(function (kpi) { return kpi.metric === metric.title; });
            if (smartKPI) {
                smartKPIs.handleDrillDown(smartKPI);
            }
        }
    };
    var getThresholdIndicator = function (metric) {
        if (!metric.threshold)
            return null;
        var value = typeof metric.value === 'string' ?
            parseFloat(metric.value.replace(/[^\d.-]/g, '')) :
            Number(metric.value);
        var status = 'green';
        if (value >= metric.threshold.green)
            status = 'green';
        else if (value >= metric.threshold.yellow)
            status = 'yellow';
        else
            status = 'red';
        var statusIcon = {
            green: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-3 h-3 text-green-500" }),
            yellow: (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "w-3 h-3 text-yellow-500" }),
            red: (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-3 h-3 text-red-500" })
        };
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-0.5", children: [statusIcon[status], (0, jsx_runtime_1.jsx)("span", { className: "text-xs font-medium ".concat(status === 'green' ? 'text-green-600' :
                        status === 'yellow' ? 'text-yellow-600' : 'text-red-600'), children: status.toUpperCase() })] }));
    };
    var getThresholdTooltip = function (metric) {
        if (!metric.threshold)
            return null;
        return ((0, jsx_runtime_1.jsxs)("div", { className: "absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Good: \u2265", metric.threshold.green, metric.threshold.unit || ''] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mt-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-yellow-500 rounded-full" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Warning: \u2265", metric.threshold.yellow, metric.threshold.unit || ''] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 mt-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-red-500 rounded-full" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Critical: <", metric.threshold.yellow, metric.threshold.unit || ''] })] }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800" })] }));
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2", children: displayMetrics.map(function (metric, index) {
            var isEnhanced = enableSmartKPIs && 'threshold' in metric;
            var enhancedMetric = metric;
            return ((0, jsx_runtime_1.jsxs)("div", { className: "relative group cursor-pointer transition-all duration-200 hover:shadow-lg bg-white rounded-lg border border-gray-200 p-4 ".concat(isEnhanced && enhancedMetric.drillDown ? 'hover:bg-purple-50' : ''), onMouseEnter: function () { return setHoveredMetric(index); }, onMouseLeave: function () { return setHoveredMetric(null); }, onClick: function () { return isEnhanced && handleDrillDown(enhancedMetric, index); }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-full bg-opacity-20", style: { backgroundColor: metric.color }, children: isEnhanced ? ((0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 rounded-full", style: { backgroundColor: metric.color } })) : ((function () {
                                    // Map icon strings to actual components
                                    var iconMap = {
                                        'Users': lucide_react_1.Users,
                                        'Calendar': lucide_react_1.Calendar,
                                        'TrendingUp': lucide_react_1.TrendingUp
                                    };
                                    var iconName = typeof metric.icon === 'string' ? metric.icon : 'TrendingUp';
                                    var IconComponent = iconMap[iconName] || lucide_react_1.TrendingUp;
                                    return (0, jsx_runtime_1.jsx)(IconComponent, { className: "w-4 h-4" });
                                })()) }), (0, jsx_runtime_1.jsxs)("div", { className: "ml-2 flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-xs font-medium text-gray-600", children: metric.title }), isEnhanced && getThresholdIndicator(enhancedMetric)] }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg font-bold text-gray-900", children: metric.value }), metric.change !== undefined && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mt-0.5", children: [metric.changeType === 'increase' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-3 h-3 text-green-500 mr-1" })) : metric.changeType === 'decrease' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "w-3 h-3 text-red-500 mr-1 transform rotate-180" })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 mr-1" })), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs font-medium ".concat(metric.changeType === 'increase' ? 'text-green-600' :
                                                    metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'), children: [metric.change > 0 ? '+' : '', metric.change, "%"] })] })), isEnhanced && enhancedMetric.realTime && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mt-0.5", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-green-600 font-medium", children: "Live" })] })), isEnhanced && enhancedMetric.drillDown && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mt-1 text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "w-3 h-3 mr-1" }), "Click to drill down"] }))] })] }), isEnhanced && getThresholdTooltip(enhancedMetric)] }, index));
        }) }));
};
exports.default = DashboardMetrics;
