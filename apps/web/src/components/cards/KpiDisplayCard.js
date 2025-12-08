"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var Tooltip_1 = require("@/components/ui/Tooltip");
var KpiDisplayCard = function (_a) {
    var _b, _c, _d;
    var cardId = _a.cardId, kpiData = _a.kpiData;
    var kpi = cardId ? kpiData[cardId] : null;
    if (!kpi) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 text-gray-600 text-center", children: [(0, jsx_runtime_1.jsx)("p", { children: "No KPI data available" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-400 mt-2", children: ["Card ID: ", cardId] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-xs text-gray-400", children: ["Available KPI IDs: ", Object.keys(kpiData).join(', ')] })] }));
    }
    // Generate stable mock KPI value based on card ID (so it doesn't change when moving cards)
    var getStableValue = function (cardId) {
        var hash = 0;
        for (var i = 0; i < cardId.length; i++) {
            var char = cardId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) % 100;
    };
    var mockValue = getStableValue(cardId || 'default');
    var getThresholdColor = function (value, threshold) {
        if (value >= threshold.green)
            return 'text-green-600';
        if (value >= threshold.yellow)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    // Generate stable mock chart data based on card ID
    var generateChartData = function (baseValue, cardId) {
        // Generate a stable seed based on card ID for consistent data
        var seed = 0;
        for (var i = 0; i < cardId.length; i++) {
            seed = ((seed << 5) - seed + cardId.charCodeAt(i)) & 0xffffffff;
        }
        // Simple pseudo-random number generator using the seed
        var seededRandom = function () {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
        // Use a fixed base date to ensure consistent chart dates
        var baseDate = new Date('2024-01-01');
        var data = [];
        for (var i = 0; i < 7; i++) {
            data.push({
                date: new Date(baseDate.getTime() + (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: Math.max(0, baseValue + Math.sin(i) * 10 + (seededRandom() - 0.5) * 5)
            });
        }
        return data;
    };
    var chartData = generateChartData(mockValue, cardId || 'default');
    // Render different chart types based on KPI configuration
    var renderChart = function () {
        var _a, _b;
        var chartType = ((_a = kpi.chart) === null || _a === void 0 ? void 0 : _a.type) || 'line';
        switch (chartType) {
            case 'number':
                return null; // No chart for number type
            case 'gauge':
                return ((0, jsx_runtime_1.jsx)("div", { className: "h-16 w-full flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("svg", { width: "120", height: "120", viewBox: "0 0 120 120", className: "overflow-visible", children: [(0, jsx_runtime_1.jsx)("circle", { cx: "60", cy: "60", r: "50", fill: "none", stroke: "#e5e7eb", strokeWidth: "8" }), (0, jsx_runtime_1.jsx)("circle", { cx: "60", cy: "60", r: "50", fill: "none", stroke: getThresholdColor(mockValue, kpi.threshold).replace('text-', '#').replace('-600', ''), strokeWidth: "8", strokeLinecap: "round", strokeDasharray: "".concat((mockValue / 100) * 314, " 314"), transform: "rotate(-90 60 60)" }), (0, jsx_runtime_1.jsxs)("text", { x: "60", y: "65", textAnchor: "middle", fontSize: "14", fontWeight: "bold", fill: "#374151", children: [mockValue, ((_b = kpi.threshold) === null || _b === void 0 ? void 0 : _b.unit) || '%'] })] }) }));
            case 'bar':
                return ((0, jsx_runtime_1.jsx)("div", { className: "h-16 w-full", children: (0, jsx_runtime_1.jsxs)("svg", { width: "100%", height: "100%", viewBox: "0 0 200 60", className: "overflow-visible", children: [(0, jsx_runtime_1.jsx)("rect", { width: "200", height: "60", fill: "#f8fafc", rx: "4" }), chartData.map(function (point, index) {
                                var x = (index / (chartData.length - 1)) * 180 + 10;
                                var barHeight = (point.value / 100) * 40;
                                var y = 50 - barHeight;
                                return ((0, jsx_runtime_1.jsx)("rect", { x: x - 4, y: y, width: "8", height: barHeight, fill: "#3b82f6", rx: "2" }, index));
                            }), chartData.map(function (point, index) {
                                var x = (index / (chartData.length - 1)) * 180 + 10;
                                return ((0, jsx_runtime_1.jsx)("text", { x: x, y: "58", textAnchor: "middle", fontSize: "8", fill: "#6b7280", children: point.date.split(' ')[1] }, index));
                            })] }) }));
            case 'line':
            default:
                return ((0, jsx_runtime_1.jsx)("div", { className: "h-16 w-full", children: (0, jsx_runtime_1.jsxs)("svg", { width: "100%", height: "100%", viewBox: "0 0 200 60", className: "overflow-visible", children: [(0, jsx_runtime_1.jsx)("rect", { width: "200", height: "60", fill: "#f8fafc", rx: "4" }), (0, jsx_runtime_1.jsx)("polyline", { fill: "none", stroke: "#3b82f6", strokeWidth: "2", points: chartData.map(function (point, index) {
                                    var x = (index / (chartData.length - 1)) * 180 + 10;
                                    var y = 50 - (point.value / 100) * 40;
                                    return "".concat(x, ",").concat(y);
                                }).join(' ') }), chartData.map(function (point, index) {
                                var x = (index / (chartData.length - 1)) * 180 + 10;
                                var y = 50 - (point.value / 100) * 40;
                                return ((0, jsx_runtime_1.jsx)("circle", { cx: x, cy: y, r: "2", fill: "#3b82f6" }, index));
                            }), chartData.map(function (point, index) {
                                var x = (index / (chartData.length - 1)) * 180 + 10;
                                return ((0, jsx_runtime_1.jsx)("text", { x: x, y: "58", textAnchor: "middle", fontSize: "8", fill: "#6b7280", children: point.date.split(' ')[1] }, index));
                            })] }) }));
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: kpi.description }) }), (((_b = kpi.chart) === null || _b === void 0 ? void 0 : _b.type) || 'line') !== 'number' && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 mb-2", children: (((_c = kpi.chart) === null || _c === void 0 ? void 0 : _c.type) || 'line') === 'gauge' ? 'Performance Gauge' : '7-Day Trend' }), renderChart()] })), (0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 rounded-lg p-4 space-y-3 relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-4", children: [(0, jsx_runtime_1.jsx)(Tooltip_1.Tooltip, { content: kpi.threshold ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-white", children: "Performance Thresholds" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-green-500 rounded-full" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Green: \u2265", kpi.threshold.green, kpi.threshold.unit] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-yellow-500 rounded-full" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Yellow: \u2265", kpi.threshold.yellow, kpi.threshold.unit] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-3 h-3 bg-red-500 rounded-full" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Red: <", kpi.threshold.yellow, kpi.threshold.unit] })] })] })] })) : ((0, jsx_runtime_1.jsx)("div", { children: "No thresholds configured" })), side: "right", delayDuration: 200, forceSide: true, className: "z-30", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-3xl font-bold ".concat(getThresholdColor(mockValue, kpi.threshold), " cursor-help transition-colors hover:opacity-80"), children: [mockValue, ((_d = kpi.threshold) === null || _d === void 0 ? void 0 : _d.unit) || '%'] }) }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: "Current Value" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-500", children: "Status:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm px-2 py-1 rounded ".concat(kpi.enabled
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'), children: kpi.enabled ? (kpi.realTime ? 'Live View' : 'Active') : 'Disabled' })] }), kpi.realTime && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs text-blue-600", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-blue-500 rounded-full animate-pulse" }), "Real-time updates"] }))] })] }));
};
exports.default = KpiDisplayCard;
