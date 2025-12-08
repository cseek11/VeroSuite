"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementList = AgreementList;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var Input_1 = __importDefault(require("@/components/ui/Input"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var agreements_api_1 = require("@/lib/agreements-api");
var AgreementForm_1 = require("./AgreementForm");
var AgreementDetail_1 = require("./AgreementDetail");
function AgreementList(_a) {
    var _b;
    var customerId = _a.customerId;
    var _c = (0, react_1.useState)(null), selectedAgreement = _c[0], setSelectedAgreement = _c[1];
    var _d = (0, react_1.useState)(false), showAgreementModal = _d[0], setShowAgreementModal = _d[1];
    var _e = (0, react_1.useState)(false), showNewAgreementModal = _e[0], setShowNewAgreementModal = _e[1];
    var _f = (0, react_1.useState)(false), showEditModal = _f[0], setShowEditModal = _f[1];
    var _g = (0, react_1.useState)(''), searchTerm = _g[0], setSearchTerm = _g[1];
    var _h = (0, react_1.useState)(''), statusFilter = _h[0], setStatusFilter = _h[1];
    var _j = (0, react_1.useState)(1), page = _j[0], setPage = _j[1];
    var limit = (0, react_1.useState)(12)[0];
    var _k = (0, react_query_1.useQuery)({
        queryKey: ['agreements', { page: page, limit: limit, status: statusFilter, customerId: customerId }],
        queryFn: function () {
            var params = {
                page: page,
                limit: limit,
            };
            if (statusFilter) {
                params.status = statusFilter;
            }
            if (customerId) {
                params.customerId = customerId;
            }
            return agreements_api_1.agreementsApi.getAgreements(params);
        },
    }), agreementsData = _k.data, isLoading = _k.isLoading, error = _k.error;
    // Helper function for status color (currently unused, kept for potential future use)
    var _getStatusColor = function (status) {
        switch (status.toLowerCase()) {
            case 'active': return 'green';
            case 'expired': return 'red';
            case 'cancelled': return 'gray';
            case 'pending': return 'yellow';
            case 'inactive': return 'gray';
            default: return 'gray';
        }
    };
    void _getStatusColor; // Suppress unused warning
    // Helper function for billing frequency color (currently unused, kept for potential future use)
    var _getBillingFrequencyColor = function (frequency) {
        switch (frequency.toLowerCase()) {
            case 'weekly': return 'blue';
            case 'monthly': return 'purple';
            case 'quarterly': return 'green';
            case 'annually': return 'orange';
            case 'one_time': return 'gray';
            default: return 'gray';
        }
    };
    void _getBillingFrequencyColor; // Suppress unused warning
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    var calculateProgress = function (agreement) {
        if (!agreement.end_date)
            return 0;
        var start = new Date(agreement.start_date).getTime();
        var end = new Date(agreement.end_date).getTime();
        var now = new Date().getTime();
        var total = end - start;
        var elapsed = now - start;
        return Math.min(Math.max((elapsed / total) * 100, 0), 100);
    };
    var getDaysUntilExpiry = function (agreement) {
        if (!agreement.end_date)
            return null;
        var end = new Date(agreement.end_date);
        var now = new Date();
        var diffTime = end.getTime() - now.getTime();
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    var getExpiryAlert = function (agreement) {
        var daysUntilExpiry = getDaysUntilExpiry(agreement);
        if (!daysUntilExpiry)
            return null;
        if (daysUntilExpiry < 0) {
            return { type: 'error', message: 'Agreement expired' };
        }
        else if (daysUntilExpiry <= 30) {
            return { type: 'warning', message: "Expires in ".concat(daysUntilExpiry, " days") };
        }
        else if (daysUntilExpiry <= 90) {
            return { type: 'info', message: "Expires in ".concat(daysUntilExpiry, " days") };
        }
        return null;
    };
    var filteredAgreements = ((_b = agreementsData === null || agreementsData === void 0 ? void 0 : agreementsData.agreements) === null || _b === void 0 ? void 0 : _b.filter(function (agreement) {
        if (searchTerm) {
            var searchLower = searchTerm.toLowerCase();
            return (agreement.title.toLowerCase().includes(searchLower) ||
                agreement.agreement_number.toLowerCase().includes(searchLower) ||
                agreement.account.name.toLowerCase().includes(searchLower) ||
                agreement.service_types.name.toLowerCase().includes(searchLower));
        }
        return true;
    })) || [];
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "text-center py-8", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600", children: "Loading agreements..." }) }) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-red-800 mb-1", children: "Error loading agreements" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700", children: error.message })] }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-gray-900", children: "Service Agreements" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", onClick: function () { return setShowNewAgreementModal(true); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-1" }), "New Agreement"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4 mb-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1", children: (0, jsx_runtime_1.jsx)(Input_1.default, { placeholder: "Search agreements...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, icon: lucide_react_1.Search }) }), (0, jsx_runtime_1.jsx)(ui_1.CRMSelect, { value: statusFilter, onChange: function (value) { return setStatusFilter(value); }, options: [
                                    { value: '', label: 'All Statuses' },
                                    { value: 'active', label: 'Active' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'expired', label: 'Expired' },
                                    { value: 'cancelled', label: 'Cancelled' },
                                    { value: 'inactive', label: 'Inactive' },
                                ] })] }), filteredAgreements.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-2", children: "No Agreements Found" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600 mb-4", children: searchTerm || statusFilter
                                    ? 'No agreements match your search criteria.'
                                    : 'No service agreements have been created yet.' }), !searchTerm && !statusFilter && ((0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowNewAgreementModal(true); }, children: "Create First Agreement" }))] })) : ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredAgreements.map(function (agreement) {
                            var progress = calculateProgress(agreement);
                            var expiryAlert = getExpiryAlert(agreement);
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer", onClick: function () {
                                    setSelectedAgreement(agreement);
                                    setShowAgreementModal(true);
                                }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-5 w-5 text-blue-600" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 truncate", children: agreement.title })] }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: agreement.status === 'active' ? 'default' : 'secondary', children: agreement.status })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Customer" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-900 truncate", children: agreement.account.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Service Type" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-900 truncate", children: agreement.service_types.name })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Billing" }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", children: agreement.billing_frequency })] }), agreement.pricing && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Pricing" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-semibold text-green-600", children: ["$", agreement.pricing.toLocaleString()] })] }))] }), agreement.end_date && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Agreement Progress" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-900", children: [Math.round(progress), "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-2 rounded-full ".concat(progress > 80 ? 'bg-red-500' :
                                                        progress > 60 ? 'bg-yellow-500' :
                                                            'bg-green-500'), style: { width: "".concat(progress, "%") } }) })] })), expiryAlert && ((0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-lg text-sm mb-3 ".concat(expiryAlert.type === 'error' ? 'bg-red-50 text-red-800' :
                                            expiryAlert.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                                                'bg-blue-50 text-blue-800'), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [expiryAlert.type === 'error' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" })) : expiryAlert.type === 'warning' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4" })), (0, jsx_runtime_1.jsx)("span", { children: expiryAlert.message })] }) })), agreement.auto_renewal && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-3 flex items-center gap-1 text-sm text-green-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Auto-renewal enabled" })] })), (0, jsx_runtime_1.jsxs)("div", { className: "text-xs text-gray-500", children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Start: ", formatDate(agreement.start_date)] }), agreement.end_date && ((0, jsx_runtime_1.jsxs)("div", { children: ["End: ", formatDate(agreement.end_date)] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 mt-3 pt-3 border-t border-gray-100", children: [(0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", onClick: function () {
                                                    setSelectedAgreement(agreement);
                                                    setShowAgreementModal(true);
                                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-3 w-3 mr-1" }), "View"] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", size: "sm", onClick: function () {
                                                    setSelectedAgreement(agreement);
                                                    setShowEditModal(true);
                                                }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-3 w-3 mr-1" }), "Edit"] })] })] }, agreement.id));
                        }) })), (agreementsData === null || agreementsData === void 0 ? void 0 : agreementsData.pagination) && agreementsData.pagination.pages > 1 && ((0, jsx_runtime_1.jsx)("div", { className: "flex justify-center mt-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", disabled: page === 1, onClick: function () { return setPage(page - 1); }, children: "Previous" }), (0, jsx_runtime_1.jsxs)("span", { className: "flex items-center px-3 text-sm text-gray-600", children: ["Page ", page, " of ", agreementsData.pagination.pages] }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", disabled: page === agreementsData.pagination.pages, onClick: function () { return setPage(page + 1); }, children: "Next" })] }) }))] }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showAgreementModal, onOpenChange: function (open) { return !open && setShowAgreementModal(false); }, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-4xl", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsxs)(ui_1.DialogTitle, { children: ["Agreement Details - ", selectedAgreement === null || selectedAgreement === void 0 ? void 0 : selectedAgreement.title] }) }), selectedAgreement && ((0, jsx_runtime_1.jsx)(AgreementDetail_1.AgreementDetail, { agreement: selectedAgreement, onEdit: function () {
                                setShowAgreementModal(false);
                                setShowEditModal(true);
                            }, onClose: function () { return setShowAgreementModal(false); } }))] }) }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showNewAgreementModal, onOpenChange: function (open) { return !open && setShowNewAgreementModal(false); }, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-4xl", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(ui_1.DialogTitle, { children: "Create New Agreement" }) }), (0, jsx_runtime_1.jsx)(AgreementForm_1.AgreementForm, { onSuccess: function () {
                                setShowNewAgreementModal(false);
                            }, onCancel: function () { return setShowNewAgreementModal(false); } })] }) }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showEditModal, onOpenChange: function (open) { return !open && setShowEditModal(false); }, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-4xl", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(ui_1.DialogTitle, { children: "Edit Agreement" }) }), selectedAgreement && ((0, jsx_runtime_1.jsx)(AgreementForm_1.AgreementForm, { agreement: selectedAgreement, onSuccess: function () {
                                setShowEditModal(false);
                            }, onCancel: function () { return setShowEditModal(false); } }))] }) })] }));
}
