"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionContent = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var RegionContent = function (_a) {
    var region = _a.region, children = _a.children;
    return ((0, jsx_runtime_1.jsx)("div", { className: "region-content flex-1 overflow-auto p-4 h-full", style: {
            minHeight: "".concat(region.min_height, "px")
        }, children: children || ((0, jsx_runtime_1.jsxs)("div", { className: "text-center text-gray-500 py-8", children: [(0, jsx_runtime_1.jsx)("p", { children: "No content configured for this region" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-sm mt-2", children: ["Widget type: ", region.widget_type || 'None'] })] })) }));
};
exports.RegionContent = RegionContent;
