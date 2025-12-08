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
exports.StatusBar = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var WebSocketStatus_1 = require("@/components/dashboard/WebSocketStatus");
var VirtualCardContainer_1 = require("@/components/dashboard/VirtualCardContainer");
var SyncStatus_1 = require("./SyncStatus");
var StatusBar = function (_a) {
    var searchTerm = _a.searchTerm, filteredCardsLength = _a.filteredCardsLength, totalCardsLength = _a.totalCardsLength, isVirtualScrolling = _a.isVirtualScrolling, virtualScrollingThreshold = _a.virtualScrollingThreshold, currentLayout = _a.currentLayout, applyTemplate = _a.applyTemplate, _b = _a.syncStatus, syncStatus = _b === void 0 ? 'idle' : _b, _c = _a.lastSynced, lastSynced = _c === void 0 ? null : _c, _d = _a.syncErrorMessage, syncErrorMessage = _d === void 0 ? null : _d;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6 px-4 flex items-center justify-between text-xs text-gray-500", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [searchTerm ? ("".concat(filteredCardsLength, " of ").concat(totalCardsLength, " cards found \u2022 Search: \"").concat(searchTerm, "\"")) : ("".concat(totalCardsLength, " cards \u2022 Press ? for keyboard shortcuts")), isVirtualScrolling && ((0, jsx_runtime_1.jsxs)("span", { className: "ml-2 text-purple-600 font-medium", children: ["\u2022 Virtual Scrolling ON (threshold: ", virtualScrollingThreshold, ")"] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-400", children: "Layout:" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-1", children: [['grid', 'dashboard', 'sidebar'].map(function (layoutType) { return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return applyTemplate(layoutType); }, className: "px-2 py-1 rounded text-xs font-medium transition-colors ".concat(currentLayout === layoutType
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'), children: layoutType.charAt(0).toUpperCase() + layoutType.slice(1) }, layoutType)); }), currentLayout === 'custom' && ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 rounded text-xs font-medium bg-orange-500 text-white", children: "Custom" }))] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)(SyncStatus_1.SyncStatus, __assign({ status: syncStatus }, (lastSynced ? { lastSynced: lastSynced } : {}), (syncErrorMessage ? { errorMessage: syncErrorMessage } : {}))), (0, jsx_runtime_1.jsx)(WebSocketStatus_1.WebSocketStatus, { showStats: true }), (0, jsx_runtime_1.jsx)(VirtualCardContainer_1.VirtualCardPerformance, { cardCount: totalCardsLength, isVirtualScrolling: isVirtualScrolling })] })] }));
};
exports.StatusBar = StatusBar;
