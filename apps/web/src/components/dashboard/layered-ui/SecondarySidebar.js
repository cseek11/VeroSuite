"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecondarySidebar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var framer_motion_1 = require("framer-motion");
var SecondarySidebar = function (_a) {
    var isOpen = _a.isOpen, onToggle = _a.onToggle, children = _a.children, _b = _a.title, title = _b === void 0 ? 'Sidebar' : _b;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { initial: false, animate: { x: isOpen ? 0 : 0 }, className: "fixed top-1/2 -translate-y-1/2 z-40 ".concat(isOpen ? 'left-[300px]' : 'left-0', " bg-white border border-gray-200 rounded-r-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"), onClick: onToggle, children: isOpen ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "w-5 h-5 text-gray-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "w-5 h-5 text-gray-600" })) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: false, animate: {
                    x: isOpen ? 0 : -300,
                    width: isOpen ? 300 : 0
                }, transition: { duration: 0.2 }, className: "fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-30 overflow-hidden", children: (0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-between p-4 border-b border-gray-200", children: (0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-gray-900", children: title }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-y-auto p-4", children: children || ((0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-500", children: [(0, jsx_runtime_1.jsx)("p", { children: "Sidebar content goes here" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4", children: "Filters, search, contextual data, etc." })] })) })] }) })] }));
};
exports.SecondarySidebar = SecondarySidebar;
