"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementDetail = AgreementDetail;
var jsx_runtime_1 = require("react/jsx-runtime");
// React import removed - not needed with React 17+
var react_query_1 = require("@tanstack/react-query");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
var agreements_api_1 = require("@/lib/agreements-api");
var logger_1 = require("@/utils/logger");
function AgreementDetail(_a) {
    var agreement = _a.agreement, onEdit = _a.onEdit, onClose = _a.onClose;
    var queryClient = (0, react_query_1.useQueryClient)();
    var deleteMutation = (0, react_query_1.useMutation)({
        mutationFn: function () { return agreements_api_1.agreementsApi.deleteAgreement(agreement.id); },
        onSuccess: function () {
            queryClient.invalidateQueries({ queryKey: ['agreements'] });
            onClose();
        },
        onError: function (error) {
            logger_1.logger.error('Error deleting agreement', error, 'AgreementDetail');
        },
    });
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
    void _getStatusColor; // Suppress unused warning
    void _getBillingFrequencyColor; // Suppress unused warning
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    var formatDateTime = function (dateString) {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    var calculateProgress = function () {
        if (!agreement.end_date)
            return 0;
        var start = new Date(agreement.start_date).getTime();
        var end = new Date(agreement.end_date).getTime();
        var now = new Date().getTime();
        var total = end - start;
        var elapsed = now - start;
        return Math.min(Math.max((elapsed / total) * 100, 0), 100);
    };
    var getDaysUntilExpiry = function () {
        if (!agreement.end_date)
            return null;
        var end = new Date(agreement.end_date);
        var now = new Date();
        var diffTime = end.getTime() - now.getTime();
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    var getExpiryAlert = function () {
        var daysUntilExpiry = getDaysUntilExpiry();
        if (!daysUntilExpiry)
            return null;
        if (daysUntilExpiry < 0) {
            return { type: 'error', message: 'Agreement has expired' };
        }
        else if (daysUntilExpiry <= 30) {
            return { type: 'warning', message: "Agreement expires in ".concat(daysUntilExpiry, " days") };
        }
        else if (daysUntilExpiry <= 90) {
            return { type: 'info', message: "Agreement expires in ".concat(daysUntilExpiry, " days") };
        }
        return null;
    };
    var progress = calculateProgress();
    var expiryAlert = getExpiryAlert();
    var handleDelete = function () {
        if (window.confirm('Are you sure you want to delete this agreement? This action cannot be undone.')) {
            deleteMutation.mutate();
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-6 w-6 text-blue-600" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900", children: agreement.title }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Agreement #", agreement.agreement_number] })] })] }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: agreement.status === 'active' ? 'default' : 'secondary', children: agreement.status.toUpperCase() })] }), expiryAlert && ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded-lg p-4 ".concat(expiryAlert.type === 'error' ? 'bg-red-50 border-red-200' :
                    expiryAlert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-blue-50 border-blue-200'), children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium mb-1 ".concat(expiryAlert.type === 'error' ? 'text-red-800' :
                            expiryAlert.type === 'warning' ? 'text-yellow-800' :
                                'text-blue-800'), children: "Agreement Notice" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm ".concat(expiryAlert.type === 'error' ? 'text-red-700' :
                            expiryAlert.type === 'warning' ? 'text-yellow-700' :
                                'text-blue-700'), children: expiryAlert.message })] })), agreement.end_date && ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Agreement Progress" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-900", children: [Math.round(progress), "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-2 rounded-full ".concat(progress > 80 ? 'bg-red-500' :
                                progress > 60 ? 'bg-yellow-500' :
                                    'bg-green-500'), style: { width: "".concat(progress, "%") } }) })] })), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-5 w-5 text-gray-600" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900", children: "Customer Information" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Customer Name" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: agreement.account.name })] }), agreement.account.email && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Email" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: agreement.account.email })] })), agreement.account.phone && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Phone" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: agreement.account.phone })] }))] })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-5 w-5 text-gray-600" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900", children: "Service Information" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Service Type" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: agreement.service_types.name }), agreement.service_types.description && ((0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600 mt-1", children: agreement.service_types.description }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Billing Frequency" }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", children: agreement.billing_frequency })] })] })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-5 w-5 text-gray-600" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900", children: "Financial Information" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [agreement.pricing && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Agreement Value" }), (0, jsx_runtime_1.jsxs)(ui_1.Heading, { level: 4, className: "text-green-600 font-bold", children: ["$", agreement.pricing.toLocaleString()] })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Auto-renewal" }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-2", children: agreement.auto_renewal ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4 text-green-600" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-green-600", children: "Enabled" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-600", children: "Disabled" })] })) })] })] })] }), (0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-5 w-5 text-gray-600" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900", children: "Agreement Dates" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Start Date" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: formatDate(agreement.start_date) })] }), agreement.end_date && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "End Date" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "font-medium", children: formatDate(agreement.end_date) })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Created" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: formatDateTime(agreement.created_at) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-gray-600", children: "Last Updated" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: formatDateTime(agreement.updated_at) })] })] })] }), agreement.terms && ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-3", children: "Terms and Conditions" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-gray-700 whitespace-pre-wrap", children: agreement.terms })] })), agreement.Invoice && agreement.Invoice.length > 0 && ((0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-4", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-gray-900 mb-3", children: "Related Invoices" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: agreement.Invoice.map(function (invoice) { return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-medium", children: ["Invoice #", invoice.invoice_number] }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-gray-600", children: ["Due: ", formatDate(invoice.due_date)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-medium", children: ["$", invoice.total_amount.toLocaleString()] }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: invoice.status === 'paid' ? 'default' : 'secondary', children: invoice.status })] })] }, invoice.id)); }) })] })), deleteMutation.error && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-red-800 mb-1", children: "Error" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-700", children: deleteMutation.error.message })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 justify-end pt-4 border-t border-gray-200", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: onClose, disabled: deleteMutation.isPending, children: "Close" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "outline", onClick: handleDelete, disabled: deleteMutation.isPending, className: "text-red-600 hover:text-red-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "h-4 w-4 mr-1" }), deleteMutation.isPending ? 'Deleting...' : 'Delete'] }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", onClick: onEdit, disabled: deleteMutation.isPending, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4 mr-1" }), "Edit Agreement"] })] })] }));
}
