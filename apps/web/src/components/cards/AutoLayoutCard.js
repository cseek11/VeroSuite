"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var AutoLayoutManager_1 = __importDefault(require("@/components/dashboard/AutoLayoutManager"));
var logger_1 = require("@/utils/logger");
var AutoLayoutCard = function () {
    var _a = (0, react_1.useState)(false), showAutoLayout = _a[0], setShowAutoLayout = _a[1];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600 text-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: "AI Auto-Layout" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: "Intelligent layout optimization based on usage patterns and user behavior" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowAutoLayout(true); }, className: "px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors", children: "Open Auto-Layout" })] }) }), showAutoLayout && ((0, jsx_runtime_1.jsx)(AutoLayoutManager_1.default, { isOpen: showAutoLayout, onClose: function () { return setShowAutoLayout(false); }, userId: "demo-user", currentCards: [
                    { id: 'smart-kpis', type: 'smart-kpis', x: 0, y: 0, width: 400, height: 280 },
                    { id: 'dashboard-metrics', type: 'dashboard-metrics', x: 420, y: 0, width: 280, height: 180 },
                    { id: 'quick-actions', type: 'quick-actions', x: 720, y: 0, width: 200, height: 180 },
                    { id: 'jobs-calendar', type: 'jobs-calendar', x: 0, y: 300, width: 400, height: 300 },
                    { id: 'recent-activity', type: 'recent-activity', x: 420, y: 300, width: 300, height: 300 }
                ], onLayoutChange: function (changes) {
                    logger_1.logger.debug('Layout changes', { changes: changes }, 'AutoLayoutCard');
                    // Here you would apply the layout changes to the actual cards
                } }))] }));
};
exports.default = AutoLayoutCard;
