"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertDialog = AlertDialog;
exports.ConfirmDialog = ConfirmDialog;
exports.PromptDialog = PromptDialog;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var Dialog_1 = require("./Dialog");
var Button_1 = __importDefault(require("./Button"));
var Input_1 = __importDefault(require("./Input"));
var lucide_react_1 = require("lucide-react");
function AlertDialog(_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange, title = _a.title, message = _a.message, _b = _a.type, type = _b === void 0 ? 'info' : _b;
    var getTypeStyles = function () {
        switch (type) {
            case 'warning':
                return 'border-amber-300 bg-amber-50';
            case 'error':
                return 'border-red-300 bg-red-50';
            case 'success':
                return 'border-emerald-300 bg-emerald-50';
            default:
                return 'border-blue-300 bg-blue-50';
        }
    };
    var getIconColor = function () {
        switch (type) {
            case 'warning':
                return 'text-amber-600';
            case 'error':
                return 'text-red-600';
            case 'success':
                return 'text-emerald-600';
            default:
                return 'text-blue-600';
        }
    };
    var getIcon = function () {
        switch (type) {
            case 'warning':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "w-5 h-5 ".concat(getIconColor()) });
            case 'error':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "w-5 h-5 ".concat(getIconColor()) });
            case 'success':
                return (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "w-5 h-5 ".concat(getIconColor()) });
            default:
                return (0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "w-5 h-5 ".concat(getIconColor()) });
        }
    };
    return ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: open, onOpenChange: onOpenChange, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-md", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: title }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 rounded-lg border ".concat(getTypeStyles()), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-3", children: [getIcon(), (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium ".concat(getIconColor(), " flex-1"), children: message })] }) }), (0, jsx_runtime_1.jsx)(Dialog_1.DialogFooter, { children: (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: function () { return onOpenChange(false); }, children: "OK" }) })] }) }));
}
function ConfirmDialog(_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange, onConfirm = _a.onConfirm, title = _a.title, message = _a.message, _b = _a.confirmText, confirmText = _b === void 0 ? 'Confirm' : _b, _c = _a.cancelText, cancelText = _c === void 0 ? 'Cancel' : _c, _d = _a.type, type = _d === void 0 ? 'warning' : _d;
    var getTypeStyles = function () {
        switch (type) {
            case 'danger':
                return 'border-red-300 bg-red-50';
            case 'info':
                return 'border-blue-300 bg-blue-50';
            default:
                return 'border-amber-300 bg-amber-50';
        }
    };
    var getConfirmButtonVariant = function () {
        switch (type) {
            case 'danger':
                return 'danger';
            case 'info':
                return 'primary';
            default:
                return 'primary';
        }
    };
    var handleConfirm = function () {
        onConfirm();
        onOpenChange(false);
    };
    var handleCancel = function () {
        onOpenChange(false);
    };
    return ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: open, onOpenChange: onOpenChange, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-md", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: title }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 rounded-lg border ".concat(getTypeStyles()), children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-700", children: message }) }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: handleCancel, children: cancelText }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: getConfirmButtonVariant(), onClick: handleConfirm, children: confirmText })] })] }) }));
}
function PromptDialog(_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange, onConfirm = _a.onConfirm, title = _a.title, message = _a.message, _b = _a.placeholder, placeholder = _b === void 0 ? '' : _b, _c = _a.defaultValue, defaultValue = _c === void 0 ? '' : _c, _d = _a.confirmText, confirmText = _d === void 0 ? 'Confirm' : _d, _e = _a.cancelText, cancelText = _e === void 0 ? 'Cancel' : _e;
    var _f = (0, react_1.useState)(defaultValue), value = _f[0], setValue = _f[1];
    (0, react_1.useEffect)(function () {
        if (open) {
            setValue(defaultValue);
        }
    }, [open, defaultValue]);
    var handleConfirm = function () {
        if (value.trim()) {
            onConfirm(value);
            setValue('');
            onOpenChange(false);
        }
    };
    var handleCancel = function () {
        setValue('');
        onOpenChange(false);
    };
    var handleKeyPress = function (e) {
        if (e.key === 'Enter' && value.trim()) {
            handleConfirm();
        }
    };
    return ((0, jsx_runtime_1.jsx)(Dialog_1.Dialog, { open: open, onOpenChange: onOpenChange, children: (0, jsx_runtime_1.jsxs)(Dialog_1.DialogContent, { className: "max-w-md", children: [(0, jsx_runtime_1.jsx)(Dialog_1.DialogHeader, { children: (0, jsx_runtime_1.jsx)(Dialog_1.DialogTitle, { children: title }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4 rounded-lg border border-blue-300 bg-blue-50", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-slate-700 mb-3", children: message }), (0, jsx_runtime_1.jsx)(Input_1.default, { value: value, onChange: function (e) { return setValue(e.target.value); }, onKeyPress: handleKeyPress, placeholder: placeholder, autoFocus: true })] }), (0, jsx_runtime_1.jsxs)(Dialog_1.DialogFooter, { children: [(0, jsx_runtime_1.jsx)(Button_1.default, { variant: "outline", onClick: handleCancel, children: cancelText }), (0, jsx_runtime_1.jsx)(Button_1.default, { variant: "primary", onClick: handleConfirm, disabled: !value.trim(), children: confirmText })] })] }) }));
}
