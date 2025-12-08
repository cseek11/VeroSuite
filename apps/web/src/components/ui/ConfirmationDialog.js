"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmationDialog = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var ConfirmationDialog = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onConfirm = _a.onConfirm, title = _a.title, message = _a.message, _b = _a.confirmText, confirmText = _b === void 0 ? 'Confirm' : _b, _c = _a.cancelText, cancelText = _c === void 0 ? 'Cancel' : _c, _d = _a.type, type = _d === void 0 ? 'danger' : _d, _e = _a.isLoading, isLoading = _e === void 0 ? false : _e;
    if (!isOpen)
        return null;
    var getTypeStyles = function () {
        switch (type) {
            case 'danger':
                return {
                    icon: 'text-red-500',
                    confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    border: 'border-red-200'
                };
            case 'warning':
                return {
                    icon: 'text-yellow-500',
                    confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
                    border: 'border-yellow-200'
                };
            case 'info':
                return {
                    icon: 'text-blue-500',
                    confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                    border: 'border-blue-200'
                };
            default:
                return {
                    icon: 'text-red-500',
                    confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    border: 'border-red-200'
                };
        }
    };
    var styles = getTypeStyles();
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex min-h-screen items-center justify-center p-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 transition-opacity", onClick: onClose }), (0, jsx_runtime_1.jsxs)("div", { className: "relative bg-white rounded-lg shadow-xl max-w-md w-full border ".concat(styles.border), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-6 h-6 ".concat(styles.icon) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-gray-900", children: title })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 transition-colors", disabled: isLoading, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 leading-relaxed", children: message }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, disabled: isLoading, className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: cancelText }), (0, jsx_runtime_1.jsx)("button", { onClick: onConfirm, disabled: isLoading, className: "px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ".concat(styles.confirmButton, " disabled:opacity-50 disabled:cursor-not-allowed transition-colors"), children: isLoading ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), (0, jsx_runtime_1.jsx)("span", { children: "Processing..." })] })) : (confirmText) })] })] })] }) }));
};
exports.ConfirmationDialog = ConfirmationDialog;
exports.default = exports.ConfirmationDialog;
