"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomerManagement;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var CustomerList_1 = __importDefault(require("@/components/customers/CustomerList"));
var CustomerDetail_1 = __importDefault(require("@/components/customers/CustomerDetail"));
var CustomerForm_1 = __importDefault(require("@/components/customers/CustomerForm"));
function CustomerManagement() {
    var _a = (0, react_1.useState)('list'), viewMode = _a[0], setViewMode = _a[1];
    var _b = (0, react_1.useState)(null), selectedCustomer = _b[0], setSelectedCustomer = _b[1];
    var handleViewCustomer = function (customer) {
        setSelectedCustomer(customer);
        setViewMode('detail');
    };
    var handleEditCustomer = function (customer) {
        setSelectedCustomer(customer);
        setViewMode('edit');
    };
    var handleCreateCustomer = function () {
        setSelectedCustomer(null);
        setViewMode('create');
    };
    var handleBackToList = function () {
        setViewMode('list');
        setSelectedCustomer(null);
    };
    var handleSaveCustomer = function () {
        setViewMode('list');
        setSelectedCustomer(null);
    };
    var renderContent = function () {
        switch (viewMode) {
            case 'list':
                return ((0, jsx_runtime_1.jsx)(CustomerList_1.default, { onViewCustomer: handleViewCustomer, onEditCustomer: handleEditCustomer, onCreateCustomer: handleCreateCustomer }));
            case 'detail':
                return selectedCustomer ? ((0, jsx_runtime_1.jsx)(CustomerDetail_1.default, { customerId: selectedCustomer.id, onBack: handleBackToList, onEdit: handleEditCustomer })) : null;
            case 'create':
                return ((0, jsx_runtime_1.jsx)(CustomerForm_1.default, { onSave: handleSaveCustomer, onCancel: handleBackToList }));
            case 'edit':
                return selectedCustomer ? ((0, jsx_runtime_1.jsx)(CustomerForm_1.default, { customer: selectedCustomer, onSave: handleSaveCustomer, onCancel: handleBackToList })) : null;
            default:
                return null;
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-50 py-8", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: renderContent() }) }));
}
