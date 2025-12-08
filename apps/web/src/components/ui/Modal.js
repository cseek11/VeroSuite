"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = Modal;
exports.AlertModal = AlertModal;
exports.ConfirmModal = ConfirmModal;
exports.PromptModal = PromptModal;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
function Modal(_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, title = _a.title, children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-[9999]", onClick: onClose }), (0, jsx_runtime_1.jsx)("div", { className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999] ".concat(className), children: (0, jsx_runtime_1.jsxs)("div", { className: "p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-gray-800", children: title }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "p-1 hover:bg-gray-100 rounded transition-colors", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4 text-gray-500" }) })] }), children] }) })] }));
}
function AlertModal(_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, title = _a.title, message = _a.message, _b = _a.type, type = _b === void 0 ? 'info' : _b;
    var getTypeStyles = function () {
        switch (type) {
            case 'warning':
                return 'border-yellow-300 bg-yellow-50';
            case 'error':
                return 'border-red-300 bg-red-50';
            case 'success':
                return 'border-green-300 bg-green-50';
            default:
                return 'border-blue-300 bg-blue-50';
        }
    };
    var getIconColor = function () {
        switch (type) {
            case 'warning':
                return 'text-yellow-600';
            case 'error':
                return 'text-red-600';
            case 'success':
                return 'text-green-600';
            default:
                return 'text-blue-600';
        }
    };
    return ((0, jsx_runtime_1.jsxs)(Modal, { isOpen: isOpen, onClose: onClose, title: title, children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 rounded-lg border ".concat(getTypeStyles()), children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium ".concat(getIconColor()), children: message }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-end mt-6", children: (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors", children: "OK" }) })] }));
}
function ConfirmModal(_a) {
    var isOpen = _a.isOpen, onConfirm = _a.onConfirm, onCancel = _a.onCancel, title = _a.title, message = _a.message, _b = _a.confirmText, confirmText = _b === void 0 ? 'Confirm' : _b, _c = _a.cancelText, cancelText = _c === void 0 ? 'Cancel' : _c, _d = _a.type, type = _d === void 0 ? 'warning' : _d;
    var getTypeStyles = function () {
        switch (type) {
            case 'danger':
                return 'border-red-300 bg-red-50';
            case 'info':
                return 'border-blue-300 bg-blue-50';
            default:
                return 'border-yellow-300 bg-yellow-50';
        }
    };
    var getConfirmButtonStyles = function () {
        switch (type) {
            case 'danger':
                return 'bg-red-500 hover:bg-red-600';
            case 'info':
                return 'bg-blue-500 hover:bg-blue-600';
            default:
                return 'bg-yellow-500 hover:bg-yellow-600';
        }
    };
    return ((0, jsx_runtime_1.jsxs)(Modal, { isOpen: isOpen, onClose: onCancel, title: title, children: [(0, jsx_runtime_1.jsx)("div", { className: "p-4 rounded-lg border ".concat(getTypeStyles()), children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-700", children: message }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-2 mt-6", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onCancel, className: "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors", children: cancelText }), (0, jsx_runtime_1.jsx)("button", { onClick: onConfirm, className: "px-4 py-2 text-white rounded-lg transition-colors ".concat(getConfirmButtonStyles()), children: confirmText })] })] }));
}
function PromptModal(_a) {
    var isOpen = _a.isOpen, onConfirm = _a.onConfirm, onCancel = _a.onCancel, title = _a.title, message = _a.message, _b = _a.placeholder, placeholder = _b === void 0 ? '' : _b, _c = _a.defaultValue, defaultValue = _c === void 0 ? '' : _c, _d = _a.confirmText, confirmText = _d === void 0 ? 'Confirm' : _d, _e = _a.cancelText, cancelText = _e === void 0 ? 'Cancel' : _e;
    var _f = react_1.default.useState(defaultValue), value = _f[0], setValue = _f[1];
    react_1.default.useEffect(function () {
        if (isOpen) {
            setValue(defaultValue);
        }
    }, [isOpen, defaultValue]);
    var handleConfirm = function () {
        onConfirm(value);
        setValue('');
    };
    var handleKeyPress = function (e) {
        if (e.key === 'Enter') {
            handleConfirm();
        }
    };
    return ((0, jsx_runtime_1.jsxs)(Modal, { isOpen: isOpen, onClose: onCancel, title: title, children: [(0, jsx_runtime_1.jsxs)("div", { className: "p-4 rounded-lg border border-blue-300 bg-blue-50", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-700 mb-3", children: message }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: value, onChange: function (e) { return setValue(e.target.value); }, onKeyPress: handleKeyPress, placeholder: placeholder, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all", autoFocus: true })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end gap-2 mt-6", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onCancel, className: "px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors", children: cancelText }), (0, jsx_runtime_1.jsx)("button", { onClick: handleConfirm, disabled: !value.trim(), className: "px-4 py-2 text-white rounded-lg transition-colors ".concat(value.trim()
                            ? 'bg-purple-500 hover:bg-purple-600'
                            : 'bg-gray-300 cursor-not-allowed'), children: confirmText })] })] }));
}
