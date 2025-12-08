"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ComplianceOverview;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Compliance Overview Component
 * Displays all 25 rules with compliance status
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
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Select_1 = __importDefault(require("@/components/ui/Select"));
function ComplianceOverview(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = (0, react_1.useState)('all'), tierFilter = _d[0], setTierFilter = _d[1];
    var _e = (0, react_1.useState)('all'), categoryFilter = _e[0], setCategoryFilter = _e[1];
    // Fetch rules and compliance checks
    var _f = (0, useComplianceData_1.useRules)(), _g = _f.data, rules = _g === void 0 ? [] : _g, rulesLoading = _f.isLoading, rulesError = _f.error;
    var _h = (0, useComplianceData_1.useComplianceChecks)(), _j = _h.data, checks = _j === void 0 ? [] : _j, checksLoading = _h.isLoading;
    // Create a map of rule_id -> latest check status
    var ruleStatusMap = (0, react_1.useMemo)(function () {
        var map = new Map();
        checks.forEach(function (check) {
            var existing = map.get(check.rule_id);
            // Keep the most recent check (or VIOLATION if any exists)
            if (!existing || check.status === 'VIOLATION' || check.created_at > existing) {
                map.set(check.rule_id, check.status);
            }
        });
        return map;
    }, [checks]);
    // Filter rules
    var filteredRules = (0, react_1.useMemo)(function () {
        return rules.filter(function (rule) {
            var _a;
            // Search filter
            if (searchTerm) {
                var searchLower = searchTerm.toLowerCase();
                if (!rule.name.toLowerCase().includes(searchLower) &&
                    !rule.id.toLowerCase().includes(searchLower) &&
                    !((_a = rule.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower))) {
                    return false;
                }
            }
            // Tier filter
            if (tierFilter !== 'all' && rule.tier !== tierFilter) {
                return false;
            }
            // Category filter
            if (categoryFilter !== 'all' && rule.category !== categoryFilter) {
                return false;
            }
            return true;
        });
    }, [rules, searchTerm, tierFilter, categoryFilter]);
    // Get unique categories
    var categories = (0, react_1.useMemo)(function () {
        var cats = new Set();
        rules.forEach(function (rule) {
            if (rule.category)
                cats.add(rule.category);
        });
        return Array.from(cats).sort();
    }, [rules]);
    // Count violations by tier
    var violationCounts = (0, react_1.useMemo)(function () {
        var counts = { BLOCK: 0, OVERRIDE: 0, WARNING: 0 };
        checks
            .filter(function (check) { return check.status === 'VIOLATION'; })
            .forEach(function (check) {
            if (check.severity === 'BLOCK')
                counts.BLOCK++;
            else if (check.severity === 'OVERRIDE')
                counts.OVERRIDE++;
            else if (check.severity === 'WARNING')
                counts.WARNING++;
        });
        return counts;
    }, [checks]);
    var isLoading = rulesLoading || checksLoading;
    var hasError = rulesError;
    if (hasError) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-12 w-12 text-red-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-red-900 mb-2", children: "Failed to Load Compliance Data" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-red-700", children: (rulesError === null || rulesError === void 0 ? void 0 : rulesError.message) || 'An error occurred while loading compliance data' })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsxs)("div", { className: className, children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900 mb-2", children: "Compliance Overview" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600", children: "Monitor compliance status for all 25 rules (R01-R25)" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [(0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 text-sm", children: "Total Rules" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-2xl font-bold text-gray-900", children: rules.length })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-8 w-8 text-blue-500" })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 text-sm", children: "BLOCK Violations" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-2xl font-bold text-red-600", children: violationCounts.BLOCK })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-8 w-8 text-red-500" })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 text-sm", children: "OVERRIDE Violations" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-2xl font-bold text-yellow-600", children: violationCounts.OVERRIDE })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-8 w-8 text-yellow-500" })] }) }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 text-sm", children: "WARNING Violations" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-2xl font-bold text-orange-600", children: violationCounts.WARNING })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-8 w-8 text-orange-500" })] }) })] }), (0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-4 mb-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "inline h-4 w-4 mr-1" }), "Search"] }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search rules...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "w-full" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "inline h-4 w-4 mr-1" }), "Tier"] }), (0, jsx_runtime_1.jsx)(Select_1.default, { value: tierFilter, onChange: function (value) { return setTierFilter(value || 'all'); }, options: [
                                            { value: 'all', label: 'All Tiers' },
                                            { value: 'BLOCK', label: 'BLOCK' },
                                            { value: 'OVERRIDE', label: 'OVERRIDE' },
                                            { value: 'WARNING', label: 'WARNING' }
                                        ] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "inline h-4 w-4 mr-1" }), "Category"] }), (0, jsx_runtime_1.jsx)(Select_1.default, { value: categoryFilter, onChange: function (value) { return setCategoryFilter(value); }, options: __spreadArray([
                                            { value: 'all', label: 'All Categories' }
                                        ], categories.map(function (cat) { return ({ value: cat, label: cat }); }), true) })] })] }) }), isLoading ? ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-12", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading compliance rules..." }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredRules.map(function (rule) {
                        var status = ruleStatusMap.get(rule.id) || 'PASS';
                        var isViolation = status === 'VIOLATION';
                        var isOverride = status === 'OVERRIDE';
                        return ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4 hover:shadow-lg transition-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-lg font-semibold text-gray-900", children: rule.id }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: rule.tier === 'BLOCK'
                                                                ? 'destructive'
                                                                : rule.tier === 'OVERRIDE'
                                                                    ? 'warning'
                                                                    : 'secondary', children: rule.tier })] }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-sm font-medium text-gray-700 mb-1", children: rule.name }), rule.category && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-xs text-gray-500", children: rule.category }))] }), (0, jsx_runtime_1.jsx)("div", { className: "ml-2", children: isViolation ? ((0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-6 w-6 text-red-500" })) : isOverride ? ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-6 w-6 text-yellow-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "h-6 w-6 text-green-500" })) })] }), rule.description && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-sm text-gray-600 mb-3 line-clamp-2", children: rule.description })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t", children: [(0, jsx_runtime_1.jsxs)("span", { children: ["Status: ", (0, jsx_runtime_1.jsx)("strong", { children: status })] }), rule.opa_policy && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileCode, { className: "h-3 w-3" }), "OPA"] }))] })] }, rule.id));
                    }) })), !isLoading && filteredRules.length === 0 && ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-12 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-gray-900 mb-2", children: "No Rules Found" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600", children: "Try adjusting your filters to see more results" })] }))] }) }));
}
