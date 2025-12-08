"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var useSmartKPIs_1 = require("@/hooks/useSmartKPIs");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var SmartKPITest = function () {
    var _a, _b;
    var smartKPIs = (0, useSmartKPIs_1.useSmartKPIs)();
    return ((0, jsx_runtime_1.jsx)(Card_1.default, { title: "Smart KPIs Test", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold", children: "Debug Information:" }), (0, jsx_runtime_1.jsxs)("p", { children: ["Loading: ", smartKPIs.isLoading ? 'Yes' : 'No'] }), (0, jsx_runtime_1.jsxs)("p", { children: ["KPI Data Count: ", ((_a = smartKPIs.kpiData) === null || _a === void 0 ? void 0 : _a.length) || 0] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Enhanced Metrics Count: ", ((_b = smartKPIs.enhancedMetrics) === null || _b === void 0 ? void 0 : _b.length) || 0] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold", children: "KPI Data:" }), (0, jsx_runtime_1.jsx)("pre", { className: "text-xs bg-gray-100 p-2 rounded overflow-auto", children: JSON.stringify(smartKPIs.kpiData, null, 2) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold", children: "Enhanced Metrics:" }), (0, jsx_runtime_1.jsx)("pre", { className: "text-xs bg-gray-100 p-2 rounded overflow-auto", children: JSON.stringify(smartKPIs.enhancedMetrics, null, 2) })] })] }) }));
};
exports.default = SmartKPITest;
