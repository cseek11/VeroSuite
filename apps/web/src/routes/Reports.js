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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var auth_1 = require("@/stores/auth");
var react_router_dom_1 = require("react-router-dom");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
var lucide_react_1 = require("lucide-react");
// Report categories and their reports
var reportCategories = {
    financial: {
        name: 'Financial',
        icon: lucide_react_1.DollarSign,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        reports: [
            { id: 'revenue-trends', name: 'Revenue Trends', description: 'Monthly and yearly revenue analysis', icon: lucide_react_1.TrendingUp },
            { id: 'ar-aging', name: 'AR Aging', description: 'Accounts receivable aging report', icon: lucide_react_1.Clock },
            { id: 'refunds', name: 'Refunds & Credits', description: 'Refund and credit transaction history', icon: lucide_react_1.DollarSign },
            { id: 'branch-revenue', name: 'Branch Revenue', description: 'Revenue breakdown by branch and route', icon: lucide_react_1.BarChart3 },
            { id: 'profitability', name: 'Profitability Analysis', description: 'Cost vs revenue analysis', icon: lucide_react_1.PieChart }
        ]
    },
    jobs: {
        name: 'Jobs',
        icon: lucide_react_1.Wrench,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        reports: [
            { id: 'scheduled-vs-completed', name: 'Scheduled vs Completed', description: 'Job completion rate analysis', icon: lucide_react_1.CheckCircle },
            { id: 'avg-job-time', name: 'Average Job Time', description: 'Time efficiency metrics', icon: lucide_react_1.Clock },
            { id: 'missed-appointments', name: 'Missed Appointments', description: 'No-show and cancellation tracking', icon: lucide_react_1.AlertTriangle },
            { id: 'job-quality', name: 'Job Quality Metrics', description: 'Service quality and customer feedback', icon: lucide_react_1.Star },
            { id: 'route-efficiency', name: 'Route Efficiency', description: 'Route optimization and travel time', icon: lucide_react_1.Route }
        ]
    },
    technicians: {
        name: 'Technicians',
        icon: lucide_react_1.Users,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        reports: [
            { id: 'jobs-completed', name: 'Jobs Completed', description: 'Technician productivity metrics', icon: lucide_react_1.CheckCircle },
            { id: 'ratings', name: 'Customer Ratings', description: 'Technician performance ratings', icon: lucide_react_1.Star },
            { id: 'upsell-tracking', name: 'Upsell Tracking', description: 'Additional service sales performance', icon: lucide_react_1.TrendingUp },
            { id: 'compliance', name: 'Compliance Reports', description: 'Safety and certification tracking', icon: lucide_react_1.Shield },
            { id: 'time-tracking', name: 'Time Tracking', description: 'Work hours and efficiency analysis', icon: lucide_react_1.Clock }
        ]
    },
    customers: {
        name: 'Customers',
        icon: lucide_react_1.Users,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        reports: [
            { id: 'new-vs-returning', name: 'New vs Returning', description: 'Customer acquisition and retention', icon: lucide_react_1.Users },
            { id: 'retention', name: 'Customer Retention', description: 'Customer loyalty and churn analysis', icon: lucide_react_1.Heart },
            { id: 'ltv', name: 'Customer LTV', description: 'Lifetime value analysis', icon: lucide_react_1.DollarSign },
            { id: 'lead-conversion', name: 'Lead Conversion', description: 'Lead to customer conversion rates', icon: lucide_react_1.Target },
            { id: 'churn', name: 'Customer Churn', description: 'Churn rate and reasons analysis', icon: lucide_react_1.AlertTriangle }
        ]
    },
    inventory: {
        name: 'Inventory',
        icon: lucide_react_1.Package,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        reports: [
            { id: 'chemical-usage', name: 'Chemical Usage', description: 'Usage by technician and service type', icon: lucide_react_1.Package },
            { id: 'stock-alerts', name: 'Stock Alerts', description: 'Low stock and reorder notifications', icon: lucide_react_1.AlertTriangle },
            { id: 'compliance-logs', name: 'Compliance Logs', description: 'SDS access and usage tracking', icon: lucide_react_1.Shield },
            { id: 'cost-analysis', name: 'Cost Analysis', description: 'Inventory cost and waste tracking', icon: lucide_react_1.DollarSign },
            { id: 'supplier-performance', name: 'Supplier Performance', description: 'Supplier delivery and quality metrics', icon: lucide_react_1.Activity }
        ]
    },
    compliance: {
        name: 'Compliance',
        icon: lucide_react_1.Shield,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        reports: [
            { id: 'epa-osha', name: 'EPA/OSHA Reporting', description: 'Regulatory compliance reporting', icon: lucide_react_1.Shield },
            { id: 'certification-expiry', name: 'Certification Expiry', description: 'Technician certification tracking', icon: lucide_react_1.Calendar },
            { id: 'sds-access', name: 'SDS Access Logs', description: 'Safety data sheet access tracking', icon: lucide_react_1.FileText },
            { id: 'safety-incidents', name: 'Safety Incidents', description: 'Incident reporting and analysis', icon: lucide_react_1.AlertTriangle },
            { id: 'training-compliance', name: 'Training Compliance', description: 'Required training completion status', icon: lucide_react_1.CheckCircle }
        ]
    },
    marketing: {
        name: 'Marketing',
        icon: lucide_react_1.Target,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
        reports: [
            { id: 'campaign-roi', name: 'Campaign ROI', description: 'Marketing campaign effectiveness', icon: lucide_react_1.TrendingUp },
            { id: 'seasonal-demand', name: 'Seasonal Demand', description: 'Seasonal service demand patterns', icon: lucide_react_1.BarChart3 },
            { id: 'referral-sources', name: 'Referral Sources', description: 'Customer acquisition source analysis', icon: lucide_react_1.Users },
            { id: 'lead-sources', name: 'Lead Sources', description: 'Lead generation source effectiveness', icon: lucide_react_1.Target },
            { id: 'customer-feedback', name: 'Customer Feedback', description: 'Feedback and review analysis', icon: lucide_react_1.Star }
        ]
    },
    operations: {
        name: 'Operations',
        icon: lucide_react_1.Settings,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        reports: [
            { id: 'route-profitability', name: 'Route Profitability', description: 'Route-level profit analysis', icon: lucide_react_1.Route },
            { id: 'cancellation-rates', name: 'Cancellation Rates', description: 'Service cancellation analysis', icon: lucide_react_1.XCircle },
            { id: 'service-efficiency', name: 'Service Efficiency', description: 'Operational efficiency metrics', icon: lucide_react_1.Activity },
            { id: 'equipment-utilization', name: 'Equipment Utilization', description: 'Equipment usage and maintenance', icon: lucide_react_1.Wrench },
            { id: 'quality-control', name: 'Quality Control', description: 'Service quality and inspection results', icon: lucide_react_1.CheckCircle }
        ]
    },
    custom: {
        name: 'Custom',
        icon: lucide_react_1.Plus,
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        reports: [
            { id: 'custom-reports', name: 'Custom Reports', description: 'Create your own custom reports', icon: lucide_react_1.Plus },
            { id: 'dashboard-widgets', name: 'Dashboard Widgets', description: 'Export reports as dashboard widgets', icon: lucide_react_1.Grid },
            { id: 'scheduled-reports', name: 'Scheduled Reports', description: 'Automated report generation', icon: lucide_react_1.Calendar },
            { id: 'report-templates', name: 'Report Templates', description: 'Save and reuse report configurations', icon: lucide_react_1.FileText }
        ]
    }
};
var Reports = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var user = (0, auth_1.useAuthStore)().user;
    var _a = (0, react_1.useState)('financial'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = (0, react_1.useState)(''), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = (0, react_1.useState)('grid'), viewMode = _c[0], setViewMode = _c[1];
    var _d = (0, react_1.useState)(false), showFilters = _d[0], setShowFilters = _d[1];
    var _e = (0, react_1.useState)([]), pinnedReports = _e[0], setPinnedReports = _e[1];
    var dateRange = (0, react_1.useState)({ start: null, end: null })[0];
    var _f = (0, react_1.useState)('all'), selectedBranch = _f[0], setSelectedBranch = _f[1];
    var _g = (0, react_1.useState)('all'), selectedTechnician = _g[0], setSelectedTechnician = _g[1];
    if (!user) {
        return (0, jsx_runtime_1.jsx)(LoadingSpinner_1.PageLoader, { text: "Loading reports..." });
    }
    // Filter reports based on search query
    var filteredReports = (0, react_1.useMemo)(function () {
        var category = reportCategories[activeTab];
        if (!category)
            return [];
        if (!searchQuery)
            return category.reports;
        return category.reports.filter(function (report) {
            var _a, _b;
            return (((_a = report.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '').includes(searchQuery.toLowerCase()) ||
                (((_b = report.description) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '').includes(searchQuery.toLowerCase());
        });
    }, [activeTab, searchQuery]);
    var togglePinReport = function (reportId) {
        setPinnedReports(function (prev) {
            return prev.includes(reportId)
                ? prev.filter(function (id) { return id !== reportId; })
                : __spreadArray(__spreadArray([], prev, true), [reportId], false);
        });
    };
    var handleGenerateReport = function (reportId) {
        // Navigate to report generation page with parameters
        navigate("/reports/generate/".concat(reportId), {
            state: {
                dateRange: dateRange,
                branch: selectedBranch,
                technician: selectedTechnician
            }
        });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1", children: "Reports & Analytics" }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm", children: "Generate comprehensive reports to track performance and make data-driven decisions" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setShowFilters(!showFilters); }, className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-sm flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "h-4 w-4" }), "Filters"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setViewMode('grid'); }, className: "px-3 py-2 text-sm transition-all duration-200 ".concat(viewMode === 'grid'
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                                : 'text-slate-700 hover:bg-white'), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Grid, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return setViewMode('list'); }, className: "px-3 py-2 text-sm transition-all duration-200 ".concat(viewMode === 'list'
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                                : 'text-slate-700 hover:bg-white'), children: (0, jsx_runtime_1.jsx)(lucide_react_1.List, { className: "h-4 w-4" }) })] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative max-w-md", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search reports...", value: searchQuery, onChange: function (e) { return setSearchQuery(e.target.value); }, className: "w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm" })] }) }), showFilters && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-slate-900 mb-4", children: "Global Filters" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Date Range" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("input", { type: "date", placeholder: "Start Date", value: "", onChange: function () { }, className: "flex-1 px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm" }), (0, jsx_runtime_1.jsx)("input", { type: "date", placeholder: "End Date", value: "", onChange: function () { }, className: "flex-1 px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Branch" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedBranch, onChange: function (e) { return setSelectedBranch(e.target.value); }, className: "w-full px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Branches" }), (0, jsx_runtime_1.jsx)("option", { value: "main", children: "Main Branch" }), (0, jsx_runtime_1.jsx)("option", { value: "north", children: "North Branch" }), (0, jsx_runtime_1.jsx)("option", { value: "south", children: "South Branch" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-slate-700 mb-1", children: "Technician" }), (0, jsx_runtime_1.jsxs)("select", { value: selectedTechnician, onChange: function (e) { return setSelectedTechnician(e.target.value); }, className: "w-full px-3 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Technicians" }), (0, jsx_runtime_1.jsx)("option", { value: "tech1", children: "John Smith" }), (0, jsx_runtime_1.jsx)("option", { value: "tech2", children: "Jane Doe" }), (0, jsx_runtime_1.jsx)("option", { value: "tech3", children: "Mike Johnson" })] })] })] })] })), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4 overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "flex flex-1 space-x-4 overflow-x-auto border-b border-slate-200", children: Object.entries(reportCategories).map(function (_a) {
                        var key = _a[0], category = _a[1];
                        return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return setActiveTab(key); }, className: "flex items-center gap-1 py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ".concat(activeTab === key
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'), children: [(0, jsx_runtime_1.jsx)(category.icon, { className: "h-4 w-4" }), category.name] }, key));
                    }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [pinnedReports.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Bookmark, { className: "h-5 w-5 text-yellow-500" }), "Pinned Reports"] }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: pinnedReports.map(function (reportId) {
                                    // Find the report details
                                    var report = null;
                                    for (var _i = 0, _a = Object.values(reportCategories); _i < _a.length; _i++) {
                                        var category = _a[_i];
                                        var found = category.reports.find(function (r) { return r.id === reportId; });
                                        if (found) {
                                            report = __assign(__assign({}, found), { category: category.name });
                                            break;
                                        }
                                    }
                                    if (!report)
                                        return null;
                                    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white/60 backdrop-blur-sm rounded-lg p-4 border-l-4 border-yellow-400 shadow-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(report.icon, { className: "h-5 w-5 text-slate-600" }), (0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-slate-900", children: report.name })] }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return togglePinReport(reportId); }, className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-sm", children: (0, jsx_runtime_1.jsx)(lucide_react_1.BookmarkPlus, { className: "h-4 w-4 text-yellow-500" }) })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm mb-3", children: report.description }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleGenerateReport(reportId); }, className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex items-center gap-2", children: "Generate" }), (0, jsx_runtime_1.jsx)("div", { className: "relative", children: (0, jsx_runtime_1.jsxs)("button", { className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-sm flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-4 w-4" }), "Export"] }) })] })] }, reportId));
                                }) })] })), (0, jsx_runtime_1.jsx)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: (0, jsx_runtime_1.jsx)("div", { className: viewMode === 'grid'
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                : "space-y-3", children: filteredReports.map(function (report) { return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white/60 backdrop-blur-sm rounded-lg p-4 hover:shadow-lg transition-shadow ".concat(viewMode === 'list' ? 'flex items-center justify-between' : ''), children: viewMode === 'grid' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-lg ".concat(reportCategories[activeTab].bgColor), children: (0, jsx_runtime_1.jsx)(report.icon, { className: "h-5 w-5 ".concat(reportCategories[activeTab].color) }) }), (0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-slate-900", children: report.name })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-1", children: (0, jsx_runtime_1.jsx)("button", { onClick: function () { return togglePinReport(report.id); }, className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-sm", children: pinnedReports.includes(report.id) ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Bookmark, { className: "h-4 w-4 text-yellow-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.BookmarkPlus, { className: "h-4 w-4 text-slate-400" })) }) })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm mb-3", children: report.description }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleGenerateReport(report.id); }, className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex items-center gap-2 flex-1", children: "Generate Report" }), (0, jsx_runtime_1.jsxs)("button", { className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-sm flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-4 w-4" }), "Export"] })] })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-lg ".concat(reportCategories[activeTab].bgColor), children: (0, jsx_runtime_1.jsx)(report.icon, { className: "h-5 w-5 ".concat(reportCategories[activeTab].color) }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-slate-900", children: report.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-slate-600 text-sm", children: report.description })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return togglePinReport(report.id); }, className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-2 py-1 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-sm", children: pinnedReports.includes(report.id) ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Bookmark, { className: "h-4 w-4 text-yellow-500" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.BookmarkPlus, { className: "h-4 w-4 text-slate-400" })) }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return handleGenerateReport(report.id); }, className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex items-center gap-2", children: "Generate" }), (0, jsx_runtime_1.jsxs)("button", { className: "bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-sm flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-4 w-4" }), "Export"] })] })] })) }, report.id)); }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-slate-900 mb-4", children: "Quick Statistics" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-blue-600", children: "1,247" }), (0, jsx_runtime_1.jsx)("div", { className: "text-slate-600 text-sm", children: "Jobs This Month" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-green-600", children: "892" }), (0, jsx_runtime_1.jsx)("div", { className: "text-slate-600 text-sm", children: "Active Customers" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-purple-600", children: "94.2%" }), (0, jsx_runtime_1.jsx)("div", { className: "text-slate-600 text-sm", children: "Customer Satisfaction" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-orange-600", children: "$127,450" }), (0, jsx_runtime_1.jsx)("div", { className: "text-slate-600 text-sm", children: "Monthly Revenue" })] })] })] })] })] }));
};
exports.default = Reports;
