"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var KpiTemplateCard = function (_a) {
    var onOpenTemplateLibrary = _a.onOpenTemplateLibrary;
    return ((0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600 text-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: "KPI Template Library" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: "Browse and use pre-built KPI templates from the database" }), (0, jsx_runtime_1.jsx)("button", { onClick: onOpenTemplateLibrary, className: "px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors", children: "Open Template Library" })] }) }));
};
exports.default = KpiTemplateCard;
