"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertPanel = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var AlertPanel = function (_a) {
    var alerts = _a.alerts, onAlertClick = _a.onAlertClick, onDismiss = _a.onDismiss, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(true), isExpanded = _c[0], setIsExpanded = _c[1];
    var _d = (0, react_1.useState)(new Set()), dismissedAlerts = _d[0], setDismissedAlerts = _d[1];
    var visibleAlerts = alerts.filter(function (alert) { return !dismissedAlerts.has(alert.id); });
    var criticalCount = visibleAlerts.filter(function (a) { return a.severity === 'critical'; }).length;
    var warningCount = visibleAlerts.filter(function (a) { return a.severity === 'high' || a.severity === 'medium'; }).length;
    var infoCount = visibleAlerts.filter(function (a) { return a.severity === 'low'; }).length;
    var getSeverityColor = function (severity) {
        switch (severity) {
            case 'critical': return 'bg-red-50 border-red-200 text-red-800';
            case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
            case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
            default: return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };
    var getTypeIcon = function (type) {
        switch (type) {
            case 'conflict':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4" });
            case 'overdue':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" });
            case 'capacity':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4" });
            case 'skill_mismatch':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" });
            case 'route_optimization':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-4 w-4" });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" });
        }
    };
    var handleDismiss = function (alertId, e) {
        e.stopPropagation();
        setDismissedAlerts(function (prev) { return new Set(prev).add(alertId); });
        onDismiss === null || onDismiss === void 0 ? void 0 : onDismiss(alertId);
    };
    if (visibleAlerts.length === 0) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "border-t border-gray-200 bg-white ".concat(className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors", onClick: function () { return setIsExpanded(!isExpanded); }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-orange-500" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold text-gray-700", children: ["Alerts (", visibleAlerts.length, ")"] }), criticalCount > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700", children: ["\uD83D\uDD34 ", criticalCount, " critical"] })), warningCount > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700", children: ["\uD83D\uDFE1 ", warningCount, " warnings"] })), infoCount > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700", children: ["\u2139\uFE0F ", infoCount, " info"] }))] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: isExpanded ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "h-4 w-4 text-gray-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { className: "h-4 w-4 text-gray-500" })) })] }), isExpanded && ((0, jsx_runtime_1.jsx)("div", { className: "max-h-64 overflow-y-auto", children: visibleAlerts
                    .sort(function (a, b) {
                    var severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                    return severityOrder[a.severity] - severityOrder[b.severity];
                })
                    .map(function (alert) { return ((0, jsx_runtime_1.jsx)("div", { className: "border-b border-gray-100 p-3 cursor-pointer hover:bg-gray-50 transition-colors ".concat(getSeverityColor(alert.severity)), onClick: function () {
                        var _a;
                        onAlertClick === null || onAlertClick === void 0 ? void 0 : onAlertClick(alert);
                        (_a = alert.onClick) === null || _a === void 0 ? void 0 : _a.call(alert);
                    }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "mt-0.5 flex-shrink-0", children: getTypeIcon(alert.type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-sm", children: alert.message }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs px-1.5 py-0.5 rounded capitalize ".concat(getSeverityColor(alert.severity)), children: alert.severity })] }), alert.jobTitle && ((0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-600 truncate", children: ["Job: ", alert.jobTitle] })), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500 mt-1", children: alert.timestamp.toLocaleTimeString() })] }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) { return handleDismiss(alert.id, e); }, className: "flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors", title: "Dismiss alert", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4 text-gray-500" }) })] }) }, alert.id)); }) }))] }));
};
exports.AlertPanel = AlertPanel;
