"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinimizedRegionDock = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var MinimizedRegionDock = function (_a) {
    var minimizedRegions = _a.minimizedRegions, onRestore = _a.onRestore;
    if (minimizedRegions.length === 0)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-4 right-4 z-50 flex items-center gap-2 p-2 bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg max-w-[calc(100vw-8rem)] overflow-x-auto", children: (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: minimizedRegions.map(function (region) { return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.2 }, className: "bg-white border border-gray-200 rounded-lg shadow-sm p-2 min-w-[150px] hover:shadow-md transition-shadow flex-shrink-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-sm font-medium text-gray-700 truncate flex-1", children: region.region_type.replace('-', ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return onRestore(region.id); }, className: "flex-shrink-0 p-1 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors", title: "Restore region", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Maximize2, { className: "w-3 h-3" }) })] }) }, region.id)); }) }) }));
};
exports.MinimizedRegionDock = MinimizedRegionDock;
