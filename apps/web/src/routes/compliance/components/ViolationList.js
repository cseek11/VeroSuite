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
exports.default = ViolationList;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * Violation List Component
 * Displays list of compliance violations with filtering and search
 *
 * Last Updated: 2025-12-07
 */
var react_1 = require("react");
var useComplianceData_1 = require("../hooks/useComplianceData");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var ui_1 = require("@/components/ui");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var ErrorBoundary_1 = require("@/components/ErrorBoundary");
var Input_1 = __importDefault(require("@/components/ui/Input"));
var Select_1 = __importDefault(require("@/components/ui/Select"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var lucide_react_1 = require("lucide-react");
function ViolationList(_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(''), searchTerm = _c[0], setSearchTerm = _c[1];
    var _d = (0, react_1.useState)('all'), statusFilter = _d[0], setStatusFilter = _d[1];
    var _e = (0, react_1.useState)('all'), severityFilter = _e[0], setSeverityFilter = _e[1];
    var _f = (0, react_1.useState)('all'), ruleIdFilter = _f[0], setRuleIdFilter = _f[1];
    var _g = (0, react_1.useState)(''), prNumberFilter = _g[0], setPrNumberFilter = _g[1];
    // Fetch compliance checks
    var _h = (0, useComplianceData_1.useComplianceChecks)(), _j = _h.data, checks = _j === void 0 ? [] : _j, isLoading = _h.isLoading, error = _h.error;
    // Filter violations
    var filteredChecks = (0, react_1.useMemo)(function () {
        return checks.filter(function (check) {
            var _a, _b, _c;
            // Only show violations by default (unless status filter is set)
            if (statusFilter === 'all' && check.status !== 'VIOLATION') {
                return false;
            }
            // Status filter
            if (statusFilter !== 'all' && check.status !== statusFilter) {
                return false;
            }
            // Severity filter
            if (severityFilter !== 'all' && check.severity !== severityFilter) {
                return false;
            }
            // Rule ID filter
            if (ruleIdFilter !== 'all' && check.rule_id !== ruleIdFilter) {
                return false;
            }
            // PR number filter
            if (prNumberFilter && String((_a = check.pr_number) !== null && _a !== void 0 ? _a : '') !== prNumberFilter) {
                return false;
            }
            // Search filter
            if (searchTerm) {
                var searchLower = searchTerm.toLowerCase();
                if (!check.rule_id.toLowerCase().includes(searchLower) &&
                    !((_b = check.file_path) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower)) &&
                    !((_c = check.violation_message) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchLower))) {
                    return false;
                }
            }
            return true;
        });
    }, [checks, searchTerm, statusFilter, severityFilter, ruleIdFilter, prNumberFilter]);
    // Get unique rule IDs and PR numbers for filters
    var uniqueRuleIds = (0, react_1.useMemo)(function () {
        var ids = new Set();
        checks.forEach(function (check) { return ids.add(check.rule_id); });
        return Array.from(ids).sort();
    }, [checks]);
    // Count violations
    var violationCounts = (0, react_1.useMemo)(function () {
        var counts = { total: 0, block: 0, override: 0, warning: 0 };
        filteredChecks.forEach(function (check) {
            counts.total++;
            if (check.severity === 'BLOCK')
                counts.block++;
            else if (check.severity === 'OVERRIDE')
                counts.override++;
            else if (check.severity === 'WARNING')
                counts.warning++;
        });
        return counts;
    }, [filteredChecks]);
    var clearFilters = function () {
        setSearchTerm('');
        setStatusFilter('all');
        setSeverityFilter('all');
        setRuleIdFilter('all');
        setPrNumberFilter('');
    };
    var hasActiveFilters = searchTerm || statusFilter !== 'all' || severityFilter !== 'all' || ruleIdFilter !== 'all' || prNumberFilter;
    if (error) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: className, children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-12 w-12 text-red-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-red-900 mb-2", children: "Failed to Load Violations" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-red-700", children: (error === null || error === void 0 ? void 0 : error.message) || 'An error occurred while loading violations' })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsxs)("div", { className: className, children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 1, className: "font-bold text-gray-900 mb-2", children: "Compliance Violations" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600", children: "View and manage compliance violations across all rules" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 text-sm mb-1", children: "Total Violations" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-2xl font-bold text-gray-900", children: violationCounts.total })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 text-sm mb-1", children: "BLOCK" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-2xl font-bold text-red-600", children: violationCounts.block })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 text-sm mb-1", children: "OVERRIDE" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-2xl font-bold text-yellow-600", children: violationCounts.override })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 text-sm mb-1", children: "WARNING" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 2, className: "text-2xl font-bold text-orange-600", children: violationCounts.warning })] })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-lg font-semibold text-gray-900", children: "Filters" }), hasActiveFilters && ((0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "ghost", size: "sm", onClick: clearFilters, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4 mr-1" }), "Clear Filters"] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "inline h-4 w-4 mr-1" }), "Search"] }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "text", placeholder: "Search violations...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "w-full" })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "inline h-4 w-4 mr-1" }), "Status"] }), (0, jsx_runtime_1.jsx)(Select_1.default, { value: statusFilter, onChange: function (value) { return setStatusFilter(value || 'all'); }, options: [
                                                { value: 'all', label: 'All Status' },
                                                { value: 'VIOLATION', label: 'Violation' },
                                                { value: 'PASS', label: 'Pass' },
                                                { value: 'OVERRIDE', label: 'Override' }
                                            ] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "inline h-4 w-4 mr-1" }), "Severity"] }), (0, jsx_runtime_1.jsx)(Select_1.default, { value: severityFilter, onChange: function (value) { return setSeverityFilter(value || 'all'); }, options: [
                                                { value: 'all', label: 'All Severity' },
                                                { value: 'BLOCK', label: 'BLOCK' },
                                                { value: 'OVERRIDE', label: 'OVERRIDE' },
                                                { value: 'WARNING', label: 'WARNING' }
                                            ] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "inline h-4 w-4 mr-1" }), "Rule ID"] }), (0, jsx_runtime_1.jsx)(Select_1.default, { value: ruleIdFilter, onChange: function (value) { return setRuleIdFilter(value); }, options: __spreadArray([
                                                { value: 'all', label: 'All Rules' }
                                            ], uniqueRuleIds.map(function (id) { return ({ value: id, label: id }); }), true) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GitBranch, { className: "inline h-4 w-4 mr-1" }), "PR Number"] }), (0, jsx_runtime_1.jsx)(Input_1.default, { type: "number", placeholder: "PR #", value: prNumberFilter, onChange: function (e) { return setPrNumberFilter(e.target.value); }, className: "w-full" })] })] })] }), isLoading ? ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-12", children: (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, { text: "Loading violations..." }) })) : filteredChecks.length === 0 ? ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-12 text-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "h-12 w-12 text-green-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-gray-900 mb-2", children: "No Violations Found" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600", children: hasActiveFilters
                                ? 'Try adjusting your filters to see more results'
                                : 'All compliance checks are passing!' })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: filteredChecks.map(function (check) {
                        var _a;
                        return ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4 hover:shadow-lg transition-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: check.severity === 'BLOCK'
                                                                ? 'destructive'
                                                                : check.severity === 'OVERRIDE'
                                                                    ? 'warning'
                                                                    : 'secondary', children: check.severity }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: check.status === 'VIOLATION' ? 'destructive' : 'secondary', children: check.status }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-sm font-semibold text-gray-900", children: check.rule_id })] }), check.violation_message && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-sm text-gray-700 mb-2", children: check.violation_message }))] }), (0, jsx_runtime_1.jsx)("div", { className: "ml-4", children: check.severity === 'BLOCK' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-6 w-6 text-red-500" })) : check.severity === 'OVERRIDE' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-6 w-6 text-yellow-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-6 w-6 text-orange-500" })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600", children: [check.file_path && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileCode, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono text-xs", children: check.file_path }), check.line_number && (0, jsx_runtime_1.jsxs)("span", { className: "text-gray-500", children: [":", check.line_number] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.GitBranch, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { children: ["PR #", (_a = check.pr_number) !== null && _a !== void 0 ? _a : '—'] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: new Date(check.created_at).toLocaleDateString() })] }), check.resolved_at && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle2, { className: "h-4 w-4 text-green-500" }), (0, jsx_runtime_1.jsxs)("span", { children: ["Resolved ", new Date(check.resolved_at).toLocaleDateString()] })] }))] })] }, check.id));
                    }) }))] }) }));
}
