"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilityDock = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var UtilityDock = function (_a) {
    var isVisible = _a.isVisible, _onToggle = _a.onToggle;
    if (!isVisible)
        return null;
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { y: 100 }, animate: { y: 0 }, className: "fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-7xl mx-auto px-4 py-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("button", { className: "flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4" }), "Quick Create"] }), (0, jsx_runtime_1.jsx)("button", { className: "p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MessageCircle, { className: "w-5 h-5" }) }), (0, jsx_runtime_1.jsxs)("button", { className: "p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "w-5 h-5" }), (0, jsx_runtime_1.jsx)("span", { className: "absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" })] })] }), (0, jsx_runtime_1.jsx)("button", { className: "p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-5 h-5" }) })] }) }) }));
};
exports.UtilityDock = UtilityDock;
