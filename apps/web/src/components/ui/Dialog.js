"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialog = Dialog;
exports.DialogContent = DialogContent;
exports.DialogHeader = DialogHeader;
exports.DialogTitle = DialogTitle;
exports.DialogDescription = DialogDescription;
exports.DialogFooter = DialogFooter;
exports.DialogClose = DialogClose;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var DialogContext = (0, react_1.createContext)(undefined);
function Dialog(_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange, children = _a.children;
    if (!open)
        return null;
    var dialogContent = ((0, jsx_runtime_1.jsx)(DialogContext.Provider, { value: { open: open, onOpenChange: onOpenChange }, children: (0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto py-4 px-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50", onClick: function () { return onOpenChange(false); }, style: { zIndex: -1 } }), (0, jsx_runtime_1.jsx)("div", { className: "relative w-full max-w-full flex-shrink-0", style: { zIndex: 1 }, children: children })] }) }));
    // Render dialog at document body level using portal
    return typeof document !== 'undefined'
        ? (0, react_dom_1.createPortal)(dialogContent, document.body)
        : dialogContent;
}
function DialogContent(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    // Extract max-width from className if provided, otherwise use default
    var hasMaxWidth = className.includes('max-w-');
    var defaultMaxWidth = hasMaxWidth ? '' : 'max-w-md';
    // Check if max-height is provided, if not add a default
    var hasMaxHeight = className.includes('max-h-');
    var defaultMaxHeight = hasMaxHeight ? '' : 'max-h-[90vh]';
    return ((0, jsx_runtime_1.jsx)("div", { className: "bg-white rounded-lg shadow-xl ".concat(defaultMaxWidth, " ").concat(defaultMaxHeight, " w-full mx-auto min-h-[400px] ").concat(className), children: (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: children }) }));
}
function DialogHeader(_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)("div", { className: "-mx-6 -mt-6 px-6 py-4 mb-4 border-b border-gray-200", children: children }));
}
function DialogTitle(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    return ((0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-semibold text-gray-900 ".concat(className), children: children }));
}
function DialogDescription(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    return ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600 mt-1 ".concat(className), children: children }));
}
function DialogFooter(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    return ((0, jsx_runtime_1.jsx)("div", { className: "-mx-6 -mb-6 px-6 py-4 mt-4 border-t border-gray-200 flex justify-end gap-2 ".concat(className), children: children }));
}
function DialogClose(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var context = (0, react_1.useContext)(DialogContext);
    if (!context) {
        throw new Error('DialogClose must be used within a Dialog');
    }
    return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return context.onOpenChange(false); }, className: className, children: children }));
}
