"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSearchResults = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// ============================================================================
// CUSTOMER SEARCH RESULTS COMPONENT - Display Search Results
// ============================================================================
// This component displays search results in a modern, accessible format
// with actions for CRUD operations
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
var getStatusIcon = function (status) {
    switch (status === null || status === void 0 ? void 0 : status.toLowerCase()) {
        case 'active':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-500" });
        case 'inactive':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4 text-red-500" });
        case 'pending':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-yellow-500" });
        default:
            return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4 text-gray-500" });
    }
};
var getTypeIcon = function (accountType) {
    switch (accountType === null || accountType === void 0 ? void 0 : accountType.toLowerCase()) {
        case 'commercial':
        case 'industrial':
        case 'healthcare':
        case 'property_management':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.Building, { className: "h-4 w-4 text-blue-500" });
        case 'residential':
            return (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4 text-green-500" });
        default:
            return (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4 text-gray-500" });
    }
};
// formatScore removed - Account type doesn't have score property
// ============================================================================
// CUSTOMER RESULT CARD COMPONENT
// ============================================================================
var CustomerResultCard = function (_a) {
    var result = _a.result, onView = _a.onView, onEdit = _a.onEdit, onDelete = _a.onDelete, onCall = _a.onCall, onEmail = _a.onEmail, _b = _a.showActions, showActions = _b === void 0 ? true : _b, _c = _a.compact, compact = _c === void 0 ? false : _c;
    var _d = (0, react_1.useState)(false), showActionsMenu = _d[0], setShowActionsMenu = _d[1];
    var handleAction = function (action) {
        action(result);
        setShowActionsMenu(false);
    };
    if (compact) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 flex-1 min-w-0", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: getTypeIcon(result.account_type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-900 truncate", children: result.name }), getStatusIcon(result.status), (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ".concat(result.account_type === 'commercial' || result.account_type === 'industrial' || result.account_type === 'healthcare' || result.account_type === 'property_management'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'), children: result.account_type })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-1 flex items-center gap-4 text-xs text-gray-500", children: [result.email && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-3 w-3" }), result.email] })), result.phone && ((0, jsx_runtime_1.jsxs)("span", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-3 w-3" }), result.phone] }))] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: showActions && ((0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return setShowActionsMenu(!showActionsMenu); }, className: "p-1 hover:bg-gray-100 rounded-full transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MoreVertical, { className: "h-4 w-4 text-gray-400" }) }), showActionsMenu && ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10", children: (0, jsx_runtime_1.jsxs)("div", { className: "py-1", children: [onView && ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleAction(onView); }, className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }), "View Details"] })), onEdit && ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleAction(onEdit); }, className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4" }), "Edit Customer"] })), onCall && result.phone && ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleAction(onCall); }, className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-4 w-4" }), "Call Customer"] })), onEmail && result.email && ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleAction(onEmail); }, className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-4 w-4" }), "Send Email"] })), onDelete && ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleAction(onDelete); }, className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }), "Delete Customer"] }))] }) }))] })) })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: getTypeIcon(result.account_type) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 min-w-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-1", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900 truncate", children: result.name }), getStatusIcon(result.status)] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ".concat(result.account_type === 'commercial' || result.account_type === 'industrial' || result.account_type === 'healthcare' || result.account_type === 'property_management'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-green-100 text-green-800'), children: result.account_type }), (0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ".concat(result.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'), children: result.status })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [result.email && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate", children: result.email })] })), result.phone && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { children: result.phone })] })), result.address && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2 text-sm text-gray-600 md:col-span-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" }), (0, jsx_runtime_1.jsxs)("span", { className: "truncate", children: [result.address, result.city ? ", ".concat(result.city) : '', result.state ? ", ".concat(result.state) : '', result.zip_code ? " ".concat(result.zip_code) : ''] })] }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col items-end gap-2 ml-4", children: showActions && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [onView && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return onView(result); }, className: "p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors", title: "View Details", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) })), onEdit && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return onEdit(result); }, className: "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors", title: "Edit Customer", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4" }) })), onDelete && ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return onDelete(result); }, className: "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors", title: "Delete Customer", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4" }) }))] })) })] }) }));
};
// ============================================================================
// MAIN CUSTOMER SEARCH RESULTS COMPONENT
// ============================================================================
var CustomerSearchResults = function (_a) {
    // ============================================================================
    // RENDER HELPERS
    // ============================================================================
    var results = _a.results, _b = _a.loading, loading = _b === void 0 ? false : _b, _c = _a.error, error = _c === void 0 ? null : _c, onView = _a.onView, onEdit = _a.onEdit, onDelete = _a.onDelete, onCall = _a.onCall, onEmail = _a.onEmail, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.showActions, showActions = _e === void 0 ? true : _e, _f = _a.compact, compact = _f === void 0 ? false : _f;
    var renderLoading = function () { return ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center py-12", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-500", children: "Searching customers..." })] }) })); };
    var renderError = function () { return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-12 w-12 text-red-500 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Search Failed" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mb-4", children: error }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return window.location.reload(); }, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Try Again" })] })); };
    var renderEmpty = function () { return ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No customers found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Try adjusting your search terms or filters" })] })); };
    var renderResults = function () { return ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: results.map(function (result) { return ((0, jsx_runtime_1.jsx)(CustomerResultCard, { result: result, onView: onView, onEdit: onEdit, onDelete: onDelete, onCall: onCall, onEmail: onEmail, showActions: showActions, compact: compact }, result.id)); }) })); };
    // ============================================================================
    // RENDER
    // ============================================================================
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, children: [loading && renderLoading(), error && renderError(), !loading && !error && results.length === 0 && renderEmpty(), !loading && !error && results.length > 0 && renderResults()] }));
};
exports.CustomerSearchResults = CustomerSearchResults;
exports.default = exports.CustomerSearchResults;
