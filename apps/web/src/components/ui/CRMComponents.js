"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skeleton = exports.Spinner = exports.SelectValue = exports.SelectItem = exports.SelectContent = exports.SelectTrigger = exports.Select = exports.DialogTrigger = exports.DialogFooter = exports.DialogTitle = exports.DialogHeader = exports.DialogContent = exports.Dialog = exports.TabsContent = exports.TabsTrigger = exports.TabsList = exports.Tabs = exports.Separator = exports.Divider = exports.Badge = exports.Text = exports.Heading = exports.Grid = exports.Container = exports.Status = exports.CRMSelect = exports.Textarea = exports.Input = exports.Switch = exports.Button = exports.Card = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importDefault(require("react"));
var utils_1 = require("@/lib/utils");
var Card = function (_a) {
    var children = _a.children, className = _a.className, header = _a.header, footer = _a.footer;
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)('crm-card', className), children: [header && (0, jsx_runtime_1.jsx)("div", { className: "crm-card-header", children: header }), (0, jsx_runtime_1.jsx)("div", { className: "crm-card-body", children: children }), footer && (0, jsx_runtime_1.jsx)("div", { className: "crm-card-footer", children: footer })] }));
};
exports.Card = Card;
var Button = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, _c = _a.size, size = _c === void 0 ? 'md' : _c, className = _a.className, disabled = _a.disabled, onClick = _a.onClick, _d = _a.type, type = _d === void 0 ? 'button' : _d;
    var variantClasses = {
        primary: 'crm-btn crm-btn-primary',
        secondary: 'crm-btn crm-btn-secondary',
        success: 'crm-btn crm-btn-success',
        danger: 'crm-btn crm-btn-danger',
    };
    var sizeClasses = {
        sm: 'crm-btn-sm',
        md: '',
        lg: 'crm-btn-lg',
    };
    return ((0, jsx_runtime_1.jsx)("button", { type: type, className: (0, utils_1.cn)(variantClasses[variant], sizeClasses[size], className), disabled: disabled, onClick: onClick, children: children }));
};
exports.Button = Button;
var Switch = function (_a) {
    var _b = _a.checked, checked = _b === void 0 ? false : _b, onCheckedChange = _a.onCheckedChange, _c = _a.disabled, disabled = _c === void 0 ? false : _c, className = _a.className;
    return ((0, jsx_runtime_1.jsx)("button", { type: "button", role: "switch", "aria-checked": checked, disabled: disabled, onClick: function () { return onCheckedChange === null || onCheckedChange === void 0 ? void 0 : onCheckedChange(!checked); }, className: (0, utils_1.cn)('relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', checked ? 'bg-purple-600' : 'bg-gray-200', className), children: (0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)('pointer-events-none block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition-transform', checked ? 'translate-x-6' : 'translate-x-1') }) }));
};
exports.Switch = Switch;
var Input = function (_a) {
    var label = _a.label, placeholder = _a.placeholder, value = _a.value, onChange = _a.onChange, _b = _a.type, type = _b === void 0 ? 'text' : _b, disabled = _a.disabled, error = _a.error, className = _a.className;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [label && (0, jsx_runtime_1.jsx)("label", { className: "crm-label", children: label }), (0, jsx_runtime_1.jsx)("input", { type: type, value: value, onChange: function (e) { return onChange === null || onChange === void 0 ? void 0 : onChange(e.target.value); }, placeholder: placeholder, disabled: disabled, className: (0, utils_1.cn)('crm-input', error && 'border-red-500', className) }), error && (0, jsx_runtime_1.jsx)("p", { className: "crm-text-small text-red-600", children: error })] }));
};
exports.Input = Input;
var Textarea = function (_a) {
    var label = _a.label, placeholder = _a.placeholder, value = _a.value, onChange = _a.onChange, _b = _a.rows, rows = _b === void 0 ? 4 : _b, disabled = _a.disabled, error = _a.error, className = _a.className;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [label && (0, jsx_runtime_1.jsx)("label", { className: "crm-label", children: label }), (0, jsx_runtime_1.jsx)("textarea", { value: value, onChange: function (e) { return onChange === null || onChange === void 0 ? void 0 : onChange(e.target.value); }, placeholder: placeholder, rows: rows, disabled: disabled, className: (0, utils_1.cn)('crm-textarea', error && 'border-red-500', className) }), error && (0, jsx_runtime_1.jsx)("p", { className: "crm-text-small text-red-600", children: error })] }));
};
exports.Textarea = Textarea;
var CRMSelect = function (_a) {
    var label = _a.label, value = _a.value, onChange = _a.onChange, options = _a.options, disabled = _a.disabled, error = _a.error, className = _a.className;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [label && (0, jsx_runtime_1.jsx)("label", { className: "crm-label", children: label }), (0, jsx_runtime_1.jsx)("select", { value: value, onChange: function (e) { return onChange === null || onChange === void 0 ? void 0 : onChange(e.target.value); }, disabled: disabled, className: (0, utils_1.cn)('crm-select', error && 'border-red-500', className), children: options.map(function (option) { return ((0, jsx_runtime_1.jsx)("option", { value: option.value, children: option.label }, option.value)); }) }), error && (0, jsx_runtime_1.jsx)("p", { className: "crm-text-small text-red-600", children: error })] }));
};
exports.CRMSelect = CRMSelect;
var Status = function (_a) {
    var children = _a.children, variant = _a.variant, className = _a.className;
    var variantClasses = {
        success: 'crm-status crm-status-success',
        warning: 'crm-status crm-status-warning',
        error: 'crm-status crm-status-error',
        info: 'crm-status crm-status-info',
        neutral: 'crm-status crm-status-neutral',
    };
    return ((0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)(variantClasses[variant], className), children: children }));
};
exports.Status = Status;
var Container = function (_a) {
    var children = _a.children, className = _a.className;
    return (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('crm-container', className), children: children });
};
exports.Container = Container;
var Grid = function (_a) {
    var children = _a.children, _b = _a.cols, cols = _b === void 0 ? 1 : _b, className = _a.className;
    var gridClasses = {
        1: 'crm-grid',
        2: 'crm-grid-2',
        3: 'crm-grid-3',
        4: 'crm-grid-4',
    };
    return (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)(gridClasses[cols], className), children: children });
};
exports.Grid = Grid;
var Heading = function (_a) {
    var children = _a.children, level = _a.level, className = _a.className;
    var headingClasses = {
        1: 'crm-heading-1',
        2: 'crm-heading-2',
        3: 'crm-heading-3',
        4: 'crm-heading-4',
    };
    var Tag = "h".concat(level);
    return (0, jsx_runtime_1.jsx)(Tag, { className: (0, utils_1.cn)(headingClasses[level], className), children: children });
};
exports.Heading = Heading;
var Text = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'body' : _b, className = _a.className;
    var textClasses = {
        body: 'crm-text-body',
        secondary: 'crm-text-secondary',
        small: 'crm-text-small',
    };
    return (0, jsx_runtime_1.jsx)("p", { className: (0, utils_1.cn)(textClasses[variant], className), children: children });
};
exports.Text = Text;
var Badge = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, className = _a.className;
    var variantClasses = {
        default: 'inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800',
        secondary: 'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800',
        outline: 'inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-xs font-medium text-gray-700',
        destructive: 'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800',
        success: 'inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800',
        warning: 'inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800',
        error: 'inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800',
        info: 'inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800',
        neutral: 'inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800',
    };
    return ((0, jsx_runtime_1.jsx)("span", { className: (0, utils_1.cn)(variantClasses[variant], className), children: children }));
};
exports.Badge = Badge;
var Divider = function (_a) {
    var className = _a.className;
    return (0, jsx_runtime_1.jsx)("hr", { className: (0, utils_1.cn)('border-slate-200 my-6', className) });
};
exports.Divider = Divider;
var Separator = function (_a) {
    var _b = _a.orientation, orientation = _b === void 0 ? 'horizontal' : _b, className = _a.className;
    if (orientation === 'vertical') {
        return (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('w-px h-full bg-gray-200', className) });
    }
    return (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('h-px w-full bg-gray-200', className) });
};
exports.Separator = Separator;
var TabsContext = react_1.default.createContext(undefined);
var Tabs = function (_a) {
    var _b = _a.value, value = _b === void 0 ? '' : _b, _c = _a.onValueChange, onValueChange = _c === void 0 ? function () { } : _c, children = _a.children, className = _a.className;
    return ((0, jsx_runtime_1.jsx)(TabsContext.Provider, { value: { value: value, onValueChange: onValueChange }, children: (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('tabs-container', className), children: children }) }));
};
exports.Tabs = Tabs;
var TabsList = function (_a) {
    var children = _a.children, className = _a.className;
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('flex border-b border-gray-200', className), role: "tablist", children: children }));
};
exports.TabsList = TabsList;
var TabsTrigger = function (_a) {
    var value = _a.value, children = _a.children, className = _a.className;
    var context = react_1.default.useContext(TabsContext);
    if (!context) {
        throw new Error('TabsTrigger must be used within a Tabs component');
    }
    var currentValue = context.value, onValueChange = context.onValueChange;
    var isActive = currentValue === value;
    var handleClick = function () {
        onValueChange(value);
    };
    return ((0, jsx_runtime_1.jsx)("button", { role: "tab", "aria-selected": isActive, onClick: handleClick, className: (0, utils_1.cn)('px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-800 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200', isActive && 'text-purple-600 border-purple-500 bg-purple-50', className), children: children }));
};
exports.TabsTrigger = TabsTrigger;
var TabsContent = function (_a) {
    var value = _a.value, children = _a.children, className = _a.className;
    var context = react_1.default.useContext(TabsContext);
    if (!context) {
        throw new Error('TabsContent must be used within a Tabs component');
    }
    var currentValue = context.value;
    var isActive = currentValue === value;
    if (!isActive)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { role: "tabpanel", className: (0, utils_1.cn)('mt-4', className), children: children }));
};
exports.TabsContent = TabsContent;
var Dialog = function (_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange, children = _a.children;
    if (!open)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50", onClick: function () { return onOpenChange === null || onOpenChange === void 0 ? void 0 : onOpenChange(false); } }), (0, jsx_runtime_1.jsx)("div", { className: "relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4", children: children })] }));
};
exports.Dialog = Dialog;
var DialogContent = function (_a) {
    var children = _a.children, className = _a.className;
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('p-6', className), children: children }));
};
exports.DialogContent = DialogContent;
var DialogHeader = function (_a) {
    var children = _a.children, className = _a.className;
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('mb-4', className), children: children }));
};
exports.DialogHeader = DialogHeader;
var DialogTitle = function (_a) {
    var children = _a.children, className = _a.className;
    return ((0, jsx_runtime_1.jsx)("h2", { className: (0, utils_1.cn)('text-lg font-semibold text-gray-900', className), children: children }));
};
exports.DialogTitle = DialogTitle;
var DialogFooter = function (_a) {
    var children = _a.children, className = _a.className;
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('mt-4 pt-4 border-t border-gray-200 flex justify-end gap-2', className), children: children }));
};
exports.DialogFooter = DialogFooter;
var DialogTrigger = function (_a) {
    var children = _a.children;
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
};
exports.DialogTrigger = DialogTrigger;
var SelectContext = react_1.default.createContext(null);
var Select = function (_a) {
    var value = _a.value, onValueChange = _a.onValueChange, children = _a.children;
    var _b = react_1.default.useState(false), open = _b[0], setOpen = _b[1];
    var handleChange = onValueChange !== null && onValueChange !== void 0 ? onValueChange : (function () { });
    // Close dropdown when clicking outside
    react_1.default.useEffect(function () {
        if (!open)
            return;
        var handleClickOutside = function (event) {
            var target = event.target;
            if (!target.closest('[data-select-container]')) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, [open]);
    return ((0, jsx_runtime_1.jsx)(SelectContext.Provider, { value: { value: value !== null && value !== void 0 ? value : '', onValueChange: handleChange, open: open, setOpen: setOpen }, children: (0, jsx_runtime_1.jsx)("div", { className: "relative", "data-select-container": true, children: children }) }));
};
exports.Select = Select;
var SelectTrigger = function (_a) {
    var children = _a.children, className = _a.className;
    var context = react_1.default.useContext(SelectContext);
    if (!context) {
        throw new Error('SelectTrigger must be used within a Select component');
    }
    return ((0, jsx_runtime_1.jsxs)("button", { type: "button", onClick: function () { return context.setOpen(!context.open); }, className: (0, utils_1.cn)('flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500', className), "aria-expanded": context.open, "aria-haspopup": "listbox", children: [children, (0, jsx_runtime_1.jsx)("svg", { className: (0, utils_1.cn)('w-4 h-4 transition-transform', context.open && 'rotate-180'), fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }));
};
exports.SelectTrigger = SelectTrigger;
var SelectContent = function (_a) {
    var children = _a.children, className = _a.className;
    var context = react_1.default.useContext(SelectContext);
    if (!context) {
        throw new Error('SelectContent must be used within a Select component');
    }
    if (!context.open) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto', className), role: "listbox", children: children }));
};
exports.SelectContent = SelectContent;
var SelectItem = function (_a) {
    var value = _a.value, children = _a.children, className = _a.className;
    var context = react_1.default.useContext(SelectContext);
    if (!context) {
        throw new Error('SelectItem must be used within a Select component');
    }
    var isSelected = context.value === value;
    var handleClick = function () {
        var _a;
        (_a = context.onValueChange) === null || _a === void 0 ? void 0 : _a.call(context, value);
        context.setOpen(false);
    };
    return ((0, jsx_runtime_1.jsx)("div", { onClick: handleClick, className: (0, utils_1.cn)('px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer', isSelected && 'bg-blue-50 text-blue-600', className), role: "option", "aria-selected": isSelected, children: children }));
};
exports.SelectItem = SelectItem;
var SelectValue = function (_a) {
    var placeholder = _a.placeholder, children = _a.children;
    var context = react_1.default.useContext(SelectContext);
    if (!context) {
        throw new Error('SelectValue must be used within a Select component');
    }
    // If children are provided, use them (for custom display)
    if (children) {
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
    }
    // Otherwise show the selected value or placeholder
    return (0, jsx_runtime_1.jsx)("span", { children: context.value || placeholder || 'Select...' });
};
exports.SelectValue = SelectValue;
var Spinner = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 'md' : _b, className = _a.className;
    var sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('animate-spin rounded-full border-2 border-slate-300 border-t-purple-600', sizeClasses[size], className) }));
};
exports.Spinner = Spinner;
var Skeleton = function (_a) {
    var className = _a.className;
    return (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('animate-pulse bg-slate-200 rounded', className) });
};
exports.Skeleton = Skeleton;
