"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var KpiBuilderCard = function (_a) {
    var onOpenBuilder = _a.onOpenBuilder;
    return ((0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600 text-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: "Custom KPI Builder" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: "Create and configure custom KPIs with drag-and-drop interface" }), (0, jsx_runtime_1.jsx)("button", { onClick: onOpenBuilder, className: "px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors", children: "Open KPI Builder" })] }) }));
};
exports.default = KpiBuilderCard;
