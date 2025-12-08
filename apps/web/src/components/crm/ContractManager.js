"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContractManager;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Card_1 = __importDefault(require("@/components/ui/Card"));
var Button_1 = __importDefault(require("@/components/ui/Button"));
var ui_1 = require("@/components/ui");
var lucide_react_1 = require("lucide-react");
function ContractManager(_a) {
    var _b, _c, _d;
    var contracts = _a.contracts, isLoading = _a.isLoading;
    var _e = (0, react_1.useState)(null), selectedContract = _e[0], setSelectedContract = _e[1];
    var _f = (0, react_1.useState)(false), showContractModal = _f[0], setShowContractModal = _f[1];
    var _g = (0, react_1.useState)(false), showNewContractModal = _g[0], setShowNewContractModal = _g[1];
    var getStatusColor = function (status) {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-red-100 text-red-800';
            case 'cancelled': return 'bg-gray-100 text-gray-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    var getContractTypeColor = function (type) {
        switch (type.toLowerCase()) {
            case 'monthly': return 'bg-blue-100 text-blue-800';
            case 'quarterly': return 'bg-purple-100 text-purple-800';
            case 'annual': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    var calculateProgress = function (contract) {
        if (!contract.end_date)
            return 0;
        var start = new Date(contract.start_date).getTime();
        var end = new Date(contract.end_date).getTime();
        var now = new Date().getTime();
        var total = end - start;
        var elapsed = now - start;
        return Math.min(Math.max((elapsed / total) * 100, 0), 100);
    };
    var getDaysUntilRenewal = function (contract) {
        if (!contract.end_date)
            return null;
        var end = new Date(contract.end_date);
        var now = new Date();
        var diffTime = end.getTime() - now.getTime();
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };
    var getRenewalAlert = function (contract) {
        var daysUntilRenewal = getDaysUntilRenewal(contract);
        if (!daysUntilRenewal)
            return null;
        if (daysUntilRenewal < 0) {
            return { type: 'error', message: 'Contract expired' };
        }
        else if (daysUntilRenewal <= 30) {
            return { type: 'warning', message: "Renews in ".concat(daysUntilRenewal, " days") };
        }
        else if (daysUntilRenewal <= 90) {
            return { type: 'info', message: "Renews in ".concat(daysUntilRenewal, " days") };
        }
        return null;
    };
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(Card_1.default, { className: "p-6", children: (0, jsx_runtime_1.jsx)("div", { className: "text-center py-8", children: (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-slate-600", children: "Loading contracts..." }) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Card_1.default, { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 3, className: "text-slate-900", children: "Contract Management" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { variant: "primary", onClick: function () { return setShowNewContractModal(true); }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4 mr-1" }), "New Contract"] })] }), contracts.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-12 w-12 text-slate-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900 mb-2", children: "No Contracts" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-slate-600 mb-4", children: "This customer doesn't have any contracts yet." }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowNewContractModal(true); }, children: "Create First Contract" })] })) : ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: contracts.map(function (contract) {
                            var progress = calculateProgress(contract);
                            var renewalAlert = getRenewalAlert(contract);
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer", onClick: function () {
                                    setSelectedContract(contract);
                                    setShowContractModal(true);
                                }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-5 w-5 text-blue-600" }), (0, jsx_runtime_1.jsx)(ui_1.Heading, { level: 4, className: "text-slate-900", children: contract.contract_type })] }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getStatusColor(contract.status), children: contract.status })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Service Frequency" }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getContractTypeColor(contract.service_frequency), children: contract.service_frequency })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Contract Value" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", className: "font-semibold text-green-600", children: ["$", contract.contract_value.toLocaleString()] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Payment Schedule" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-900", children: contract.payment_schedule })] })] }), contract.end_date && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Contract Progress" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "small", className: "text-slate-900", children: [Math.round(progress), "%"] })] }), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full h-2", children: (0, jsx_runtime_1.jsx)("div", { className: "h-2 rounded-full ".concat(progress > 80 ? 'bg-red-500' : progress > 60 ? 'bg-yellow-500' : 'bg-green-500'), style: { width: "".concat(progress, "%") } }) })] })), renewalAlert && ((0, jsx_runtime_1.jsx)("div", { className: "p-2 rounded-lg text-sm ".concat(renewalAlert.type === 'error' ? 'bg-red-50 text-red-800' :
                                            renewalAlert.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                                                'bg-blue-50 text-blue-800'), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [renewalAlert.type === 'error' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-4 w-4" })) : renewalAlert.type === 'warning' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "h-4 w-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-4 w-4" })), (0, jsx_runtime_1.jsx)("span", { children: renewalAlert.message })] }) })), contract.auto_renewal && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 flex items-center gap-1 text-sm text-green-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Auto-renewal enabled" })] })), (0, jsx_runtime_1.jsxs)("div", { className: "mt-3 text-xs text-slate-500", children: [(0, jsx_runtime_1.jsxs)("div", { children: ["Start: ", formatDate(contract.start_date)] }), contract.end_date && ((0, jsx_runtime_1.jsxs)("div", { children: ["End: ", formatDate(contract.end_date)] })), contract.signed_date && ((0, jsx_runtime_1.jsxs)("div", { children: ["Signed: ", formatDate(contract.signed_date)] }))] })] }, contract.id));
                        }) }))] }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showContractModal, onOpenChange: function (open) { return !open && setShowContractModal(false); }, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(ui_1.DialogTitle, { children: "Contract Details - ".concat(selectedContract === null || selectedContract === void 0 ? void 0 : selectedContract.contract_type) }) }), selectedContract && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Contract Type" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedContract.contract_type })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Status" }), (0, jsx_runtime_1.jsx)(ui_1.Badge, { variant: "default", className: getStatusColor(selectedContract.status), children: selectedContract.status })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Service Frequency" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedContract.service_frequency })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Contract Value" }), (0, jsx_runtime_1.jsxs)(ui_1.Text, { variant: "body", children: ["$", selectedContract.contract_value.toLocaleString()] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Payment Schedule" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedContract.payment_schedule })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Auto-renewal" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: selectedContract.auto_renewal ? 'Enabled' : 'Disabled' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Start Date" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: formatDate(selectedContract.start_date) })] }), selectedContract.end_date && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "End Date" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: formatDate(selectedContract.end_date) })] })), selectedContract.signed_date && ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "small", className: "text-slate-600", children: "Signed Date" }), (0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", children: formatDate(selectedContract.signed_date) })] }))] }), getRenewalAlert(selectedContract) && ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 rounded-lg border ".concat(((_b = getRenewalAlert(selectedContract)) === null || _b === void 0 ? void 0 : _b.type) === 'error'
                                        ? 'bg-red-50 border-red-200 text-red-800'
                                        : ((_c = getRenewalAlert(selectedContract)) === null || _c === void 0 ? void 0 : _c.type) === 'warning'
                                            ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                            : 'bg-blue-50 border-blue-200 text-blue-800'), children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold mb-1", children: "Renewal Notice" }), (0, jsx_runtime_1.jsx)("div", { children: (_d = getRenewalAlert(selectedContract)) === null || _d === void 0 ? void 0 : _d.message })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 justify-end", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowContractModal(false); }, children: "Close" }), (0, jsx_runtime_1.jsxs)(Button_1.default, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "h-4 w-4 mr-1" }), "Edit Contract"] })] })] }))] }) }), (0, jsx_runtime_1.jsx)(ui_1.Dialog, { open: showNewContractModal, onOpenChange: function (open) { return !open && setShowNewContractModal(false); }, children: (0, jsx_runtime_1.jsxs)(ui_1.DialogContent, { className: "max-w-2xl", children: [(0, jsx_runtime_1.jsx)(ui_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(ui_1.DialogTitle, { children: "Create New Contract" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(ui_1.Text, { variant: "body", className: "text-slate-600", children: "Contract creation functionality will be implemented in Phase 2." }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2 justify-end", children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: function () { return setShowNewContractModal(false); }, children: "Cancel" }), (0, jsx_runtime_1.jsx)(Button_1.default, { disabled: true, children: "Create Contract" })] })] })] }) })] }));
}
