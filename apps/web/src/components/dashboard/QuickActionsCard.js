"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var QuickActions_1 = __importDefault(require("./QuickActions"));
var useRoleBasedActions_1 = require("@/hooks/useRoleBasedActions");
var QuickActionsCard = function (_a) {
    var _b = _a.title, title = _b === void 0 ? "Quick Actions" : _b, _c = _a.compact, compact = _c === void 0 ? false : _c;
    var _d = (0, react_1.useState)([]), selectedItems = _d[0], _setSelectedItems = _d[1];
    var _e = (0, react_1.useState)({}), activeFilters = _e[0], _setActiveFilters = _e[1];
    // Mock card context - in real implementation, this would come from parent
    var cardContext = {
        selectedItems: selectedItems,
        activeFilters: activeFilters,
        userRole: 'dispatcher', // This would come from auth store
        permissions: ['jobs:assign', 'technicians:message', 'jobs:update'],
        cardId: 'quick-actions'
    };
    var _f = (0, useRoleBasedActions_1.useRoleBasedActions)(cardContext), _availableActions = _f.availableActions, actionsByCategory = _f.actionsByCategory;
    var getActionCount = function () {
        return Object.values(actionsByCategory).reduce(function (total, actions) { return total + actions.length; }, 0);
    };
    var getCategoryIcon = function (category) {
        switch (category) {
            case 'dispatch':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "w-4 h-4" });
            case 'technician':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Package, { className: "w-4 h-4" });
            case 'owner':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "w-4 h-4" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-4 h-4" });
        }
    };
    return ((0, jsx_runtime_1.jsx)(Card_1.default, { title: title, children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "w-5 h-5 text-purple-600" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium text-gray-700", children: [getActionCount(), " actions available"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-1", children: Object.entries(actionsByCategory).map(function (_a) {
                                var category = _a[0], actions = _a[1];
                                return (actions.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full", title: "".concat(category, ": ").concat(actions.length, " actions"), children: [getCategoryIcon(category), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600", children: actions.length })] }, category)));
                            }) })] }), (0, jsx_runtime_1.jsx)(QuickActions_1.default, { context: cardContext, compact: compact, showLabels: !compact }), selectedItems.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-blue-800", children: [selectedItems.length, " item", selectedItems.length !== 1 ? 's' : '', " selected"] })] }) })), !compact && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500 space-y-1", children: [(0, jsx_runtime_1.jsx)("p", { children: "\u2022 Actions are filtered based on your role and permissions" }), (0, jsx_runtime_1.jsx)("p", { children: "\u2022 Select items in other cards to enable contextual actions" }), (0, jsx_runtime_1.jsx)("p", { children: "\u2022 Some actions require confirmation before execution" })] }))] }) }));
};
exports.default = QuickActionsCard;
