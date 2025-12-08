"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ComplianceScore;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Compliance Score Component
 * Displays compliance score with visualization
 *
 * Last Updated: 2025-12-07
 */
var react_1 = require("react");
var useComplianceData_1 = require("../hooks/useComplianceData");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var ui_1 = require("@/components/ui");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var ErrorBoundary_1 = require("@/components/ErrorBoundary");
var lucide_react_1 = require("lucide-react");
function ComplianceScore(_a) {
    var prNumber = _a.prNumber, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, useComplianceData_1.usePRComplianceScore)(prNumber || 0), score = _c.data, isLoading = _c.isLoading, error = _c.error;
    // Calculate score color and status
    var scoreStatus = (0, react_1.useMemo)(function () {
        if (!score)
            return { color: 'gray', label: 'N/A', icon: lucide_react_1.Minus };
        if (score.score >= 90)
            return { color: 'green', label: 'Excellent', icon: lucide_react_1.CheckCircle2 };
        if (score.score >= 75)
            return { color: 'blue', label: 'Good', icon: lucide_react_1.Shield };
        if (score.score >= 50)
            return { color: 'yellow', label: 'Fair', icon: lucide_react_1.AlertTriangle };
        return { color: 'red', label: 'Poor', icon: lucide_react_1.XCircle };
    }, [score]);
    // Calculate score percentage for progress bar
    var scorePercentage = score ? Math.max(0, Math.min(100, score.score)) : 0;
    if (error) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-12 w-12 text-red-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-red-900 mb-2", children: "Failed to Load Compliance Score" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-red-700", children: (error === null || error === void 0 ? void 0 : error.message) || 'An error occurred while loading compliance score' })] }) }));
    }
    if (!prNumber) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-gray-900 mb-2", children: "No PR Selected" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600", children: "Select a PR number to view its compliance score" })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsx)(Card_1.default, { className: className, children: isLoading ? ((0, jsx_runtime_1.jsx)("div", { className: "p-12", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading compliance score..." }) })) : score ? ((0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-2xl font-bold text-gray-900 mb-1", children: "Compliance Score" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "text-gray-600", children: ["PR #", score.pr_number] })] }), (0, jsx_runtime_1.jsxs)(ui_1.Badge, { variant: scoreStatus.color === 'green'
                                    ? 'default'
                                    : scoreStatus.color === 'red'
                                        ? 'destructive'
                                        : 'secondary', className: "text-lg px-4 py-2", children: [(0, jsx_runtime_1.jsx)(scoreStatus.icon, { className: "h-4 w-4 mr-2 inline" }), score.score, "/100"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-sm font-medium text-gray-700", children: "Overall Score" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-sm font-bold ".concat(scoreStatus.color === 'green'
                                            ? 'text-green-600'
                                            : scoreStatus.color === 'red'
                                                ? 'text-red-600'
                                                : scoreStatus.color === 'yellow'
                                                    ? 'text-yellow-600'
                                                    : 'text-gray-600'), children: scoreStatus.label })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-4 mb-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-4 rounded-full transition-all duration-500 ".concat(scoreStatus.color === 'green'
                                        ? 'bg-green-500'
                                        : scoreStatus.color === 'red'
                                            ? 'bg-red-500'
                                            : scoreStatus.color === 'yellow'
                                                ? 'bg-yellow-500'
                                                : 'bg-blue-500'), style: { width: "".concat(scorePercentage, "%") } }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [(0, jsx_runtime_1.jsx)("span", { children: "0" }), (0, jsx_runtime_1.jsx)("span", { children: "50" }), (0, jsx_runtime_1.jsx)("span", { children: "75" }), (0, jsx_runtime_1.jsx)("span", { children: "90" }), (0, jsx_runtime_1.jsx)("span", { children: "100" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-red-50 rounded-lg border border-red-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-sm font-medium text-red-900", children: "BLOCK Violations" }), (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-5 w-5 text-red-500" })] }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-3xl font-bold text-red-600", children: score.block_count }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-xs text-red-700 mt-1", children: score.block_count > 0
                                            ? 'Merge blocked'
                                            : 'No blocking violations' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-yellow-50 rounded-lg border border-yellow-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-sm font-medium text-yellow-900", children: "OVERRIDE Violations" }), (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-yellow-500" })] }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-3xl font-bold text-yellow-600", children: score.override_count }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-xs text-yellow-700 mt-1", children: score.override_count > 0
                                            ? 'Override required'
                                            : 'No override violations' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-orange-50 rounded-lg border border-orange-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-sm font-medium text-orange-900", children: "WARNING Violations" }), (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-5 w-5 text-orange-500" })] }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-3xl font-bold text-orange-600", children: score.warning_count }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-xs text-orange-700 mt-1", children: score.warning_count > 0
                                            ? 'Warnings logged'
                                            : 'No warnings' })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "border-t pt-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-sm text-gray-600 mb-1", children: "Weighted Violations" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-lg font-semibold text-gray-900", children: score.weighted_violations })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-sm text-gray-600 mb-1", children: "Can Merge" }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: score.can_merge ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "h-5 w-5 text-green-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-lg font-semibold text-green-600", children: "Yes" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-5 w-5 text-red-500" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-lg font-semibold text-red-600", children: "No" })] })) })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 p-3 bg-gray-50 rounded-lg", children: (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "text-xs text-gray-600", children: [(0, jsx_runtime_1.jsx)("strong", { children: "Score Calculation:" }), " BLOCK violations (-10 each), OVERRIDE violations (-3 each), WARNING violations (-1 each). Maximum score: 100. Merge is blocked if any BLOCK violations exist."] }) })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "p-12 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-gray-900 mb-2", children: "No Score Available" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "text-gray-600", children: ["No compliance data found for PR #", prNumber] })] })) }) }));
}
