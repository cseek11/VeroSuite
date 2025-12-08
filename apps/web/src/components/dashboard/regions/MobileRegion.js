"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileRegion = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var RegionHeader_1 = require("./RegionHeader");
var MobileRegion = function (_a) {
    var region = _a.region, children = _a.children, onToggleCollapse = _a.onToggleCollapse, onToggleLock = _a.onToggleLock, onDelete = _a.onDelete, onFullScreen = _a.onFullScreen;
    var _b = (0, react_1.useState)(false), isFullScreen = _b[0], setIsFullScreen = _b[1];
    var handleFullScreen = function () {
        if (onFullScreen) {
            onFullScreen(region.id);
        }
        setIsFullScreen(!isFullScreen);
    };
    if (isFullScreen) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 bg-white", children: (0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-4 border-b", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold capitalize", children: region.region_type.replace('-', ' ') }), (0, jsx_runtime_1.jsx)("button", { onClick: handleFullScreen, className: "p-2 hover:bg-gray-100 rounded", "aria-label": "Exit full screen", children: "\u2715" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-auto", children: children })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "mobile-region bg-white border border-gray-200 rounded-lg mb-4 shadow-sm", children: [(0, jsx_runtime_1.jsx)(RegionHeader_1.RegionHeader, __assign({ region: region }, (onToggleCollapse ? { onToggleCollapse: function () { return onToggleCollapse(region.id); } } : {}), (onToggleLock ? { onToggleLock: function () { return onToggleLock(region.id); } } : {}), (onDelete ? { onDelete: function () { return onDelete(region.id); } } : {}))), !region.is_collapsed && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4", children: children }), (0, jsx_runtime_1.jsx)("div", { className: "p-2 border-t border-gray-200 flex justify-end", children: (0, jsx_runtime_1.jsx)("button", { onClick: handleFullScreen, className: "px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded", "aria-label": "View full screen", children: "Full Screen" }) })] }))] }));
};
exports.MobileRegion = MobileRegion;
