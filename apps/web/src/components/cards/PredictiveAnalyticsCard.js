"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var PredictiveAnalyticsEngine_1 = __importDefault(require("@/components/analytics/PredictiveAnalyticsEngine"));
var logger_1 = require("@/utils/logger");
var PredictiveAnalyticsCard = function () {
    var _a = (0, react_1.useState)(false), showAnalytics = _a[0], setShowAnalytics = _a[1];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 text-gray-600 text-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: "AI Predictive Analytics" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mb-4", children: "Advanced ML models for pest pressure, revenue forecasting, and demand prediction" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowAnalytics(true); }, className: "px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors", children: "Open Analytics Engine" })] }) }), showAnalytics && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "Predictive Analytics Engine" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "AI-powered predictions and insights" })] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowAnalytics(false); }, className: "text-gray-400 hover:text-gray-600 transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-6 h-6" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6 overflow-y-auto max-h-[calc(95vh-120px)]", children: (0, jsx_runtime_1.jsx)(PredictiveAnalyticsEngine_1.default, { showAdvanced: true, onPredictionSelect: function (prediction) {
                                    logger_1.logger.debug('Selected prediction', { prediction: prediction }, 'PredictiveAnalyticsCard');
                                } }) })] }) }))] }));
};
exports.default = PredictiveAnalyticsCard;
