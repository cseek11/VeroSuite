"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardAnalytics = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useDashboardTelemetry_1 = require("@/hooks/useDashboardTelemetry");
var DashboardAnalytics = function () {
    var getMetrics = (0, useDashboardTelemetry_1.useDashboardTelemetry)({ enabled: true }).getMetrics;
    var _a = (0, react_1.useState)(getMetrics()), metrics = _a[0], setMetrics = _a[1];
    var _b = (0, react_1.useState)('7d'), timeRange = _b[0], setTimeRange = _b[1];
    (0, react_1.useEffect)(function () {
        // Refresh metrics periodically
        var interval = setInterval(function () {
            setMetrics(getMetrics());
        }, 5000);
        return function () { return clearInterval(interval); };
    }, [getMetrics]);
    var regionLoadStats = Object.entries(metrics.regionLoadTimes).map(function (_a) {
        var id = _a[0], time = _a[1];
        return ({
            id: id,
            time: time
        });
    }).sort(function (a, b) { return b.time - a.time; });
    var widgetInitStats = Object.entries(metrics.widgetInitTimes).map(function (_a) {
        var id = _a[0], time = _a[1];
        return ({
            id: id,
            time: time
        });
    }).sort(function (a, b) { return b.time - a.time; });
    return ((0, jsx_runtime_1.jsxs)("div", { className: "dashboard-analytics p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold mb-2", children: "Dashboard Analytics" }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: ['24h', '7d', '30d'].map(function (range) { return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return setTimeRange(range); }, className: "px-3 py-1 rounded text-sm ".concat(timeRange === range
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'), children: range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days' }, range)); }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-4 rounded-lg shadow", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-600 mb-1", children: "First Meaningful Paint" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold", children: metrics.firstMeaningfulPaint
                                    ? "".concat(Math.round(metrics.firstMeaningfulPaint), "ms")
                                    : 'N/A' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-4 rounded-lg shadow", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-600 mb-1", children: "Regions Loaded" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold", children: regionLoadStats.length })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-4 rounded-lg shadow", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-600 mb-1", children: "Widgets Initialized" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold", children: widgetInitStats.length })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-4 rounded-lg shadow", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-4", children: "Region Load Times" }), regionLoadStats.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-sm", children: "No data available" })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: regionLoadStats.slice(0, 10).map(function (stat) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600 truncate", children: [stat.id.slice(0, 16), "..."] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-blue-600 h-2 rounded-full", style: { width: "".concat(Math.min((stat.time / 1000) * 100, 100), "%") } }) }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium w-16 text-right", children: [Math.round(stat.time), "ms"] })] })] }, stat.id)); }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white p-4 rounded-lg shadow", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-4", children: "Widget Init Times" }), widgetInitStats.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-sm", children: "No data available" })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: widgetInitStats.slice(0, 10).map(function (stat) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600 truncate", children: [stat.id.slice(0, 16), "..."] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-24 bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "bg-green-600 h-2 rounded-full", style: { width: "".concat(Math.min((stat.time / 500) * 100, 100), "%") } }) }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium w-16 text-right", children: [Math.round(stat.time), "ms"] })] })] }, stat.id)); }) }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6 bg-white p-4 rounded-lg shadow", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold mb-4", children: "Interaction Latencies" }), metrics.interactionLatencies.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { className: "text-gray-500 text-sm", children: "No interaction data available" })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: metrics.interactionLatencies.slice(-10).map(function (latency, index) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: latency.action }), (0, jsx_runtime_1.jsxs)("span", { className: "font-medium", children: [Math.round(latency.latency), "ms"] })] }, index)); }) }))] })] }));
};
exports.DashboardAnalytics = DashboardAnalytics;
