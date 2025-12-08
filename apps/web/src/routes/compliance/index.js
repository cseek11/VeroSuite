"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ComplianceDashboard;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Compliance Dashboard Route
 * Main compliance dashboard page with tabs for overview and violations
 *
 * Last Updated: 2025-12-07
 */
var react_1 = require("react");
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var ComplianceOverview_1 = __importDefault(require("./components/ComplianceOverview"));
var ViolationList_1 = __importDefault(require("./components/ViolationList"));
var ComplianceScore_1 = __importDefault(require("./components/ComplianceScore"));
function ComplianceDashboard() {
    var _a = (0, react_1.useState)('overview'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = (0, react_1.useState)(undefined), selectedPR = _b[0], setSelectedPR = _b[1];
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900 mb-2", children: "Compliance Dashboard" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600", children: "Monitor and manage rule compliance across all 25 rules (R01-R25)" })] }), (0, jsx_runtime_1.jsxs)(ui_1.Tabs, { value: activeTab, onValueChange: function (value) { return setActiveTab(value); }, children: [(0, jsx_runtime_1.jsxs)(ui_1.TabsList, { className: "mb-6", children: [(0, jsx_runtime_1.jsxs)(ui_1.TabsTrigger, { value: "overview", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-4 w-4 mr-2" }), "Overview"] }), (0, jsx_runtime_1.jsxs)(ui_1.TabsTrigger, { value: "violations", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4 mr-2" }), "Violations"] }), (0, jsx_runtime_1.jsxs)(ui_1.TabsTrigger, { value: "score", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BarChart3, { className: "h-4 w-4 mr-2" }), "Score"] })] }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "overview", children: (0, jsx_runtime_1.jsx)(ComplianceOverview_1.default, {}) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "violations", children: (0, jsx_runtime_1.jsx)(ViolationList_1.default, {}) }), (0, jsx_runtime_1.jsx)(ui_1.TabsContent, { value: "score", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "PR Number" }), (0, jsx_runtime_1.jsx)("input", { type: "number", placeholder: "Enter PR number...", value: selectedPR || '', onChange: function (e) { return setSelectedPR(e.target.value ? parseInt(e.target.value) : undefined); }, className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), selectedPR !== undefined ? ((0, jsx_runtime_1.jsx)(ComplianceScore_1.default, { prNumber: selectedPR })) : ((0, jsx_runtime_1.jsx)(ComplianceScore_1.default, {}))] }) })] })] }) }));
}
