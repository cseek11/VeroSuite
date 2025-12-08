"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navbar = exports.Typography = exports.Tooltip = exports.Textarea = exports.Select = exports.TabsContent = exports.TabsTrigger = exports.TabsList = exports.Tabs = exports.ProgressBar = exports.Modal = exports.Input = exports.Dropdown = exports.Collapse = exports.Badge = exports.Chip = exports.Checkbox = exports.Card = exports.IconButton = exports.Button = exports.Avatar = exports.AlertDescription = exports.Alert = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
// @ts-nocheck
/**
 * ============================================================================
 * ⚠️  DEPRECATED: EnhancedUI Component Library
 * ============================================================================
 *
 * This file contains deprecated UI components that have been replaced by
 * standard UI components in @/components/ui/.
 *
 * Migration Status: 100% Complete (38/38 files migrated)
 *
 * ⚠️  DO NOT USE THESE COMPONENTS IN NEW CODE
 *
 * Migration Guide:
 * - Typography → Heading/Text from '@/components/ui'
 * - Chip → Badge from '@/components/ui'
 * - Modal → Dialog components from '@/components/ui'
 * - Alert → Inline styled divs with Tailwind classes
 * - ProgressBar → Inline styled divs with Tailwind classes
 * - Card, Button, Input → Direct imports from '@/components/ui/Card', etc.
 *
 * These components are kept temporarily for backward compatibility only.
 * They will be removed in a future major version.
 *
 * ============================================================================
 */
var react_1 = __importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
// Tabs Context
var TabsContext = react_1.default.createContext({
    value: '',
    onValueChange: function () { }
});
// Enhanced UI Components
var Alert = function (_a) {
    var _b = _a.type, type = _b === void 0 ? 'info' : _b, title = _a.title, children = _a.children, onClose = _a.onClose, _c = _a.className, className = _c === void 0 ? '' : _c;
    var icons = { info: lucide_react_1.Info, success: lucide_react_1.Check, warning: lucide_react_1.AlertTriangle, danger: lucide_react_1.XCircle, error: lucide_react_1.XCircle };
    var colors = {
        info: 'bg-blue-50 text-blue-800 border-blue-200',
        success: 'bg-green-50 text-green-800 border-green-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        danger: 'bg-red-50 text-red-800 border-red-200',
        error: 'bg-red-50 text-red-800 border-red-200'
    };
    var Icon = icons[type];
    return ((0, jsx_runtime_1.jsx)("div", { className: "p-4 rounded-xl border ".concat(colors[type], " ").concat(className), children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "w-5 h-5 mr-3 mt-0.5" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [title && (0, jsx_runtime_1.jsx)("h4", { className: "font-semibold mb-1", children: title }), (0, jsx_runtime_1.jsx)("div", { children: children })] }), onClose && ((0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "ml-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) }))] }) }));
};
exports.Alert = Alert;
var AlertDescription = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    return ((0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-600 ".concat(className), children: children }));
};
exports.AlertDescription = AlertDescription;
var Avatar = function (_a) {
    var src = _a.src, alt = _a.alt, _b = _a.size, size = _b === void 0 ? 'md' : _b, fallback = _a.fallback, _c = _a.className, className = _c === void 0 ? '' : _c;
    var sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-12 h-12 text-lg', xl: 'w-16 h-16 text-xl' };
    return ((0, jsx_runtime_1.jsx)("div", { className: "".concat(sizes[size], " rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium ").concat(className), children: src ? ((0, jsx_runtime_1.jsx)("img", { src: src, alt: alt, className: "w-full h-full rounded-full object-cover" })) : ((0, jsx_runtime_1.jsx)("span", { children: fallback || (alt === null || alt === void 0 ? void 0 : alt.charAt(0)) || 'U' })) }));
};
exports.Avatar = Avatar;
var Button = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, _c = _a.size, size = _c === void 0 ? 'md' : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, onClick = _a.onClick, _e = _a.className, className = _e === void 0 ? '' : _e, Icon = _a.icon;
    var variants = {
        primary: 'crm-btn-primary',
        secondary: 'crm-btn-secondary',
        success: 'crm-btn-success',
        danger: 'crm-btn-danger',
        outline: 'crm-btn-outline',
        ghost: 'crm-btn-ghost',
        default: 'crm-btn-default'
    };
    var sizes = {
        sm: 'crm-btn-sm',
        md: 'crm-btn-md',
        lg: 'crm-btn-lg'
    };
    return ((0, jsx_runtime_1.jsxs)("button", { onClick: onClick, disabled: disabled, className: "crm-btn ".concat(variants[variant], " ").concat(sizes[size], " ").concat(className), children: [Icon && (0, jsx_runtime_1.jsx)(Icon, { className: "w-4 h-4 mr-2" }), children] }));
};
exports.Button = Button;
var IconButton = function (_a) {
    var Icon = _a.icon, onClick = _a.onClick, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, _c = _a.size, size = _c === void 0 ? 'md' : _c, _d = _a.className, className = _d === void 0 ? '' : _d;
    var variants = {
        default: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100',
        primary: 'text-purple-600 hover:text-purple-800 hover:bg-purple-100',
        danger: 'text-red-600 hover:text-red-800 hover:bg-red-100'
    };
    var sizes = { sm: 'p-1', md: 'p-2', lg: 'p-3' };
    return ((0, jsx_runtime_1.jsx)("button", { onClick: onClick, className: "rounded-lg transition-colors ".concat(variants[variant], " ").concat(sizes[size], " ").concat(className), children: (0, jsx_runtime_1.jsx)(Icon, { className: "w-5 h-5" }) }));
};
exports.IconButton = IconButton;
var Card = function (_a) {
    var title = _a.title, children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, actions = _a.actions, _c = _a.glass, glass = _c === void 0 ? false : _c;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "crm-card ".concat(glass ? 'bg-white bg-opacity-20 backdrop-blur-lg' : '', " ").concat(className), children: [title && ((0, jsx_runtime_1.jsxs)("div", { className: "crm-card-header flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-base font-semibold text-gray-900", children: title }), actions && (0, jsx_runtime_1.jsx)("div", { className: "flex gap-2", children: actions })] })), (0, jsx_runtime_1.jsx)("div", { className: "crm-card-body", children: children })] }));
};
exports.Card = Card;
var Checkbox = function (_a) {
    var checked = _a.checked, defaultChecked = _a.defaultChecked, onChange = _a.onChange, label = _a.label, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(defaultChecked || checked || false), internalChecked = _c[0], setInternalChecked = _c[1];
    var handleChange = function (newChecked) {
        setInternalChecked(newChecked);
        onChange === null || onChange === void 0 ? void 0 : onChange(newChecked);
    };
    var isChecked = checked !== undefined ? checked : internalChecked;
    return ((0, jsx_runtime_1.jsxs)("label", { className: "flex items-center cursor-pointer ".concat(className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: isChecked, onChange: function (e) { return handleChange(e.target.checked); }, className: "absolute opacity-0 w-4 h-4 cursor-pointer" }), (0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ".concat(isChecked ? 'bg-purple-500 border-purple-500' : 'border-gray-200 hover:border-purple-400 bg-white'), children: isChecked && (0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "w-2.5 h-2.5 text-white" }) })] }), label && (0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-sm text-gray-700", children: label })] }));
};
exports.Checkbox = Checkbox;
var Chip = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, color = _a.color, size = _a.size, onRemove = _a.onRemove, _c = _a.className, className = _c === void 0 ? '' : _c;
    var variants = {
        default: 'bg-gray-100 text-gray-700',
        primary: 'bg-purple-100 text-purple-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        outline: 'bg-transparent border border-gray-300 text-gray-700'
    };
    var sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
    return ((0, jsx_runtime_1.jsxs)("span", { className: "inline-flex items-center rounded-full font-medium ".concat(variants[variant], " ").concat(sizeClasses, " ").concat(className), style: color ? { backgroundColor: color, color: 'white' } : undefined, children: [children, onRemove && ((0, jsx_runtime_1.jsx)("button", { onClick: onRemove, className: "ml-2 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-3 h-3" }) }))] }));
};
exports.Chip = Chip;
var Badge = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var variants = {
        default: 'bg-gray-100 text-gray-700',
        primary: 'bg-purple-100 text-purple-700',
        secondary: 'bg-gray-200 text-gray-800',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        outline: 'bg-transparent border border-gray-300 text-gray-700'
    };
    return ((0, jsx_runtime_1.jsx)("span", { className: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ".concat(variants[variant], " ").concat(className), children: children }));
};
exports.Badge = Badge;
var Collapse = function (_a) {
    var title = _a.title, children = _a.children, open = _a.open, onToggle = _a.onToggle;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "border border-gray-200 rounded-xl overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: onToggle, className: "w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: title }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "w-4 h-4 transition-transform ".concat(open ? 'rotate-90' : '') })] }), open && ((0, jsx_runtime_1.jsx)("div", { className: "px-4 py-3 bg-white", children: children }))] }));
};
exports.Collapse = Collapse;
var Dropdown = function (_a) {
    var trigger = _a.trigger, items = _a.items, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = (0, react_1.useState)(false), isOpen = _c[0], setIsOpen = _c[1];
    var dropdownRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);
    return ((0, jsx_runtime_1.jsxs)("div", { ref: dropdownRef, className: "relative ".concat(className), children: [(0, jsx_runtime_1.jsx)("div", { onClick: function () { return setIsOpen(!isOpen); }, children: trigger }), isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50", children: items.map(function (item, index) { return ((0, jsx_runtime_1.jsx)("div", { children: item.divider ? ((0, jsx_runtime_1.jsx)("div", { className: "border-t border-gray-200 my-1" })) : ((0, jsx_runtime_1.jsxs)("button", { onClick: function () {
                            var _a;
                            (_a = item.onClick) === null || _a === void 0 ? void 0 : _a.call(item);
                            setIsOpen(false);
                        }, className: "w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center", children: [item.icon && (0, jsx_runtime_1.jsx)(item.icon, { className: "w-4 h-4 mr-3" }), item.label] })) }, index)); }) }))] }));
};
exports.Dropdown = Dropdown;
exports.Input = react_1.default.forwardRef(function (_a, ref) {
    var label = _a.label, value = _a.value, onChange = _a.onChange, placeholder = _a.placeholder, _b = _a.type, type = _b === void 0 ? 'text' : _b, Icon = _a.icon, error = _a.error, _c = _a.className, className = _c === void 0 ? '' : _c, disabled = _a.disabled, multiline = _a.multiline, name = _a.name, onBlur = _a.onBlur, rest = __rest(_a, ["label", "value", "onChange", "placeholder", "type", "icon", "error", "className", "disabled", "multiline", "name", "onBlur"]);
    // Handle React Hook Form's onChange signature
    var handleChange = function (e) {
        var _a;
        var newValue = e.target.value;
        // Call both the custom onChange and React Hook Form's onChange if it exists
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
        // Also call any onChange from React Hook Form (in rest props) - safely check if it exists
        if (rest.onChange && typeof rest.onChange === 'function') {
            (_a = rest.onChange) === null || _a === void 0 ? void 0 : _a.call(rest, e);
        }
    };
    if (multiline) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "crm-field ".concat(className), children: [label && (0, jsx_runtime_1.jsx)("label", { className: "crm-label", children: label }), (0, jsx_runtime_1.jsx)("textarea", __assign({ name: name, value: value || '', onChange: handleChange, onBlur: onBlur, placeholder: placeholder, disabled: disabled || false, className: "crm-textarea ".concat(error ? 'crm-input-error' : ''), style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'rgb(30, 41, 59)',
                        backdropFilter: 'blur(4px)'
                    } }, rest)), error && (0, jsx_runtime_1.jsx)("p", { className: "crm-error", children: error })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "crm-field ".concat(className), children: [label && (0, jsx_runtime_1.jsx)("label", { className: "crm-label", children: label }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [Icon && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4 text-gray-500" }) })), (0, jsx_runtime_1.jsx)("input", __assign({ ref: ref, type: type, name: name, value: value || '', onChange: handleChange, onBlur: onBlur, placeholder: placeholder, disabled: disabled || false, className: "crm-input ".concat(Icon ? 'pl-10' : '', " ").concat(error ? 'crm-input-error' : ''), style: {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'rgb(30, 41, 59)',
                            backdropFilter: 'blur(4px)'
                        } }, rest))] }), error && (0, jsx_runtime_1.jsx)("p", { className: "crm-error", children: error })] }));
});
exports.Input.displayName = 'Input';
var Modal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, title = _a.title, children = _a.children, _b = _a.size, size = _b === void 0 ? 'md' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-2xl shadow-xl ".concat(sizes[size], " w-full mx-4 ").concat(className), children: [title && ((0, jsx_runtime_1.jsxs)("div", { className: "px-6 py-4 border-b border-gray-200 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold text-gray-900", children: title }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-6 h-6" }) })] })), (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: children })] }) }));
};
exports.Modal = Modal;
var ProgressBar = function (_a) {
    var value = _a.value, _b = _a.max, max = _b === void 0 ? 100 : _b, _c = _a.size, size = _c === void 0 ? 'md' : _c, _d = _a.color, color = _d === void 0 ? 'primary' : _d, _e = _a.showLabel, showLabel = _e === void 0 ? false : _e, _f = _a.className, className = _f === void 0 ? '' : _f;
    var sizes = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
    var colors = {
        primary: 'bg-purple-500',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500',
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        yellow: 'bg-yellow-500',
        amber: 'bg-amber-500',
        red: 'bg-red-500'
    };
    var percentage = Math.min((value / max) * 100, 100);
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, children: [showLabel && ((0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm text-gray-600 mb-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "Progress" }), (0, jsx_runtime_1.jsxs)("span", { children: [Math.round(percentage), "%"] })] })), (0, jsx_runtime_1.jsx)("div", { className: "w-full bg-gray-200 rounded-full ".concat(sizes[size]), children: (0, jsx_runtime_1.jsx)("div", { className: "".concat(colors[color], " rounded-full transition-all duration-300 ").concat(sizes[size]), style: { width: "".concat(percentage, "%") } }) })] }));
};
exports.ProgressBar = ProgressBar;
var Tabs = function (_a) {
    var tabs = _a.tabs, active = _a.active, onTabChange = _a.onTabChange, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, _c = _a.size, size = _c === void 0 ? 'md' : _c, children = _a.children, value = _a.value, onValueChange = _a.onValueChange, _d = _a.className, className = _d === void 0 ? '' : _d;
    var currentValue = value || active || '';
    var handleChange = onValueChange || onTabChange || (function () { });
    var sizeClasses = {
        sm: {
            container: 'space-x-4',
            button: 'py-1 px-1 text-xs',
            icon: 'w-3 h-3 mr-1'
        },
        md: {
            container: 'space-x-8',
            button: 'py-2 px-1 text-sm',
            icon: 'w-4 h-4 mr-2'
        },
        lg: {
            container: 'space-x-10',
            button: 'py-3 px-2 text-base',
            icon: 'w-5 h-5 mr-3'
        }
    };
    var currentSize = sizeClasses[size];
    // If children are provided, use context-based API
    if (children) {
        return ((0, jsx_runtime_1.jsx)(TabsContext.Provider, { value: { value: currentValue, onValueChange: handleChange }, children: (0, jsx_runtime_1.jsx)("div", { className: className, children: children }) }));
    }
    // Legacy API with tabs prop
    if (!tabs || !handleChange) {
        return (0, jsx_runtime_1.jsx)("div", { className: className, children: children });
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "".concat(variant === 'pills' ? '' : 'border-b border-gray-200', " ").concat(className), children: (0, jsx_runtime_1.jsx)("nav", { className: variant === 'pills' ? "flex ".concat(currentSize.container) : "-mb-px flex ".concat(currentSize.container), children: tabs.map(function (tab) { return ((0, jsx_runtime_1.jsxs)("button", { onClick: function () { return handleChange(tab.id); }, className: "".concat(variant === 'pills'
                    ? "px-3 ".concat(currentSize.button, " rounded-xl font-medium transition-colors ").concat(currentValue === tab.id ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100')
                    : "".concat(currentSize.button, " border-b-2 font-medium transition-colors ").concat(currentValue === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')), children: [tab.icon && (0, jsx_runtime_1.jsx)(tab.icon, { className: "".concat(currentSize.icon, " inline") }), tab.label] }, tab.id)); }) }) }));
};
exports.Tabs = Tabs;
var TabsList = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    return ((0, jsx_runtime_1.jsx)("div", { className: className, children: children }));
};
exports.TabsList = TabsList;
var TabsTrigger = function (_a) {
    var value = _a.value, children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = react_1.default.useContext(TabsContext), activeValue = _c.value, onValueChange = _c.onValueChange;
    var isActive = activeValue === value;
    return ((0, jsx_runtime_1.jsx)("button", { onClick: function () { return onValueChange(value); }, "data-state": isActive ? 'active' : 'inactive', className: className, children: children }));
};
exports.TabsTrigger = TabsTrigger;
var TabsContent = function (_a) {
    var value = _a.value, children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var activeValue = react_1.default.useContext(TabsContext).value;
    if (activeValue !== value) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: className, children: children }));
};
exports.TabsContent = TabsContent;
exports.Select = react_1.default.forwardRef(function (_a, ref) {
    var label = _a.label, value = _a.value, onChange = _a.onChange, placeholder = _a.placeholder, _b = _a.options, options = _b === void 0 ? [] : _b, error = _a.error, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d, children = _a.children, name = _a.name, onBlur = _a.onBlur, rest = __rest(_a, ["label", "value", "onChange", "placeholder", "options", "error", "className", "disabled", "children", "name", "onBlur"]);
    // Handle React Hook Form's onChange signature
    var handleChange = function (e) {
        var newValue = e.target.value;
        // Call both the custom onChange and React Hook Form's onChange if it exists
        onChange === null || onChange === void 0 ? void 0 : onChange(newValue);
        // Also call any onChange from React Hook Form (in rest props) - safely check if it exists
        if (rest.onChange && typeof rest.onChange === 'function') {
            rest.onChange(e);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "crm-field ".concat(className), children: [label && (0, jsx_runtime_1.jsx)("label", { className: "crm-label", children: label }), (0, jsx_runtime_1.jsx)("div", { className: "relative", children: (0, jsx_runtime_1.jsxs)("select", __assign({ ref: ref, name: name, value: value || '', onChange: handleChange, disabled: disabled, className: "crm-input ".concat(error ? 'crm-input-error' : ''), style: {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'rgb(30, 41, 59)',
                        backdropFilter: 'blur(4px)',
                        appearance: 'none',
                        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3e%3c/svg%3e")',
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                    }, onFocus: function (e) {
                        e.target.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.3)';
                        e.target.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                    }, onBlur: function (e) {
                        e.target.style.boxShadow = 'none';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
                    } }, rest, { children: [placeholder && ((0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: placeholder })), children ? children : options.map(function (option) { return ((0, jsx_runtime_1.jsx)("option", { value: option.value, children: option.label }, option.value)); })] })) }), error && (0, jsx_runtime_1.jsx)("p", { className: "crm-error", children: error })] }));
});
exports.Select.displayName = 'Select';
exports.Textarea = react_1.default.forwardRef(function (_a, ref) {
    var label = _a.label, value = _a.value, onChange = _a.onChange, placeholder = _a.placeholder, _b = _a.rows, rows = _b === void 0 ? 4 : _b, error = _a.error, _c = _a.className, className = _c === void 0 ? '' : _c;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "crm-field ".concat(className), children: [label && (0, jsx_runtime_1.jsx)("label", { className: "crm-label", children: label }), (0, jsx_runtime_1.jsx)("textarea", { ref: ref, value: value, onChange: function (e) { return onChange(e.target.value); }, placeholder: placeholder, rows: rows, className: "crm-textarea ".concat(error ? 'crm-input-error' : ''), style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'rgb(30, 41, 59)',
                    backdropFilter: 'blur(4px)'
                }, onFocus: function (e) {
                    e.target.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.3)';
                    e.target.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                }, onBlur: function (e) {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                } }), error && (0, jsx_runtime_1.jsx)("p", { className: "crm-error", children: error })] }));
});
exports.Textarea.displayName = 'Textarea';
var Tooltip = function (_a) {
    var content = _a.content, children = _a.children, _b = _a.position, position = _b === void 0 ? 'top' : _b;
    var _c = (0, react_1.useState)(false), visible = _c[0], setVisible = _c[1];
    var positions = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative inline-block", onMouseEnter: function () { return setVisible(true); }, onMouseLeave: function () { return setVisible(false); }, children: [children, visible && ((0, jsx_runtime_1.jsx)("div", { className: "absolute ".concat(positions[position], " z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg whitespace-nowrap"), children: content }))] }));
};
exports.Tooltip = Tooltip;
var Typography = function (_a) {
    var _b = _a.variant, variant = _b === void 0 ? 'body1' : _b, children = _a.children, _c = _a.className, className = _c === void 0 ? '' : _c;
    var variants = {
        h1: 'text-2xl font-bold text-gray-900 mb-4',
        h2: 'text-xl font-semibold text-gray-900 mb-3',
        h3: 'text-lg font-semibold text-gray-900 mb-2',
        h4: 'text-base font-medium text-gray-900 mb-2',
        h5: 'text-sm font-medium text-gray-900 mb-1',
        h6: 'text-xs font-medium text-gray-900 mb-1',
        body1: 'text-sm text-gray-700 leading-relaxed',
        body2: 'text-xs text-gray-600 leading-tight',
        caption: 'text-xs text-gray-500'
    };
    var Component = variant.startsWith('h') ? variant : 'p';
    return react_1.default.createElement(Component, { className: "".concat(variants[variant], " ").concat(className) }, children);
};
exports.Typography = Typography;
var Navbar = function (_a) {
    var _b;
    var _c = _a.user, user = _c === void 0 ? { name: "John Doe", avatar: "" } : _c, _d = _a.sidebarCollapsed, sidebarCollapsed = _d === void 0 ? false : _d, onSidebarToggle = _a.onSidebarToggle, onLogout = _a.onLogout;
    var navigate = (0, react_router_dom_1.useNavigate)();
    return ((0, jsx_runtime_1.jsx)("nav", { className: "bg-[url('/branding/crm_BG_small.png')] bg-cover bg-center shadow-sm border-b border-gray-200 sticky top-0 z-50", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center h-16 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onSidebarToggle, className: "p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "h-6 w-6" }) }), (0, jsx_runtime_1.jsx)("img", { src: "/branding/vero_small.png", alt: "VeroPest Suite", className: "h-8 w-auto transition-opacity duration-300 ".concat(sidebarCollapsed ? 'opacity-100' : 'opacity-0') })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 max-w-2xl mx-4 lg:mx-8 min-w-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search customers, jobs, invoices, technicians...", className: "pl-10 pr-16 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm" }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Filter, { className: "h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-500 hidden sm:inline", children: "\u2318K" })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2 lg:space-x-4 flex-shrink-0", children: [(0, jsx_runtime_1.jsxs)("div", { className: "hidden sm:flex items-center bg-gray-100 rounded-lg p-1 h-9", children: [(0, jsx_runtime_1.jsx)("button", { onClick: function () { return navigate('/dashboard'); }, className: "px-3 h-7 text-xs font-medium rounded-md transition-colors flex items-center ".concat(window.location.pathname === '/dashboard'
                                            ? 'bg-white text-purple-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'), children: "VeroDash" }), (0, jsx_runtime_1.jsx)("button", { onClick: function () { return navigate('/resizable-dashboard'); }, className: "px-3 h-7 text-xs font-medium rounded-md transition-colors flex items-center ".concat(window.location.pathname === '/resizable-dashboard'
                                            ? 'bg-white text-purple-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'), children: "VeroCards" })] }), (0, jsx_runtime_1.jsx)(exports.Dropdown, { trigger: (0, jsx_runtime_1.jsxs)(exports.Button, { variant: "outline", className: "flex items-center space-x-2 bg-white border-gray-300 hover:bg-gray-50 h-9", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: "Quick Actions" }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "h-4 w-4" })] }), items: [
                                    { label: 'Create Work Order', icon: lucide_react_1.Plus, onClick: function () { return navigate('/jobs/new'); } },
                                    { label: 'Schedule Job', icon: lucide_react_1.Calendar, onClick: function () { return navigate('/jobs/new'); } },
                                    { label: 'Add Customer', icon: lucide_react_1.User, onClick: function () { return navigate('/customers/new'); } },
                                    { label: 'View Reports', icon: lucide_react_1.BarChart3, onClick: function () { return navigate('/reports'); } }
                                ] }), (0, jsx_runtime_1.jsx)("div", { className: "relative", children: (0, jsx_runtime_1.jsx)("button", { className: "relative w-9 h-9 rounded-md text-gray-400 hover:text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Bell, { className: "h-6 w-6" }) }) }), (0, jsx_runtime_1.jsx)("div", { className: "relative", children: (0, jsx_runtime_1.jsx)(exports.Dropdown, { trigger: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 h-9", children: [(0, jsx_runtime_1.jsx)(exports.Avatar, { size: "sm", fallback: ((_b = user.name) === null || _b === void 0 ? void 0 : _b.charAt(0)) || 'U' }), (0, jsx_runtime_1.jsx)("div", { className: "hidden md:block text-left", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm font-medium text-gray-900", children: user.name || 'User' }) }), (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { className: "h-4 w-4 text-gray-400" })] }), items: [
                                        { label: 'Profile Settings', icon: lucide_react_1.Settings, onClick: function () { return navigate('/settings'); } },
                                        { label: 'Logout', icon: lucide_react_1.LogOut, onClick: onLogout }
                                    ] }) })] })] }) }) }));
};
exports.Navbar = Navbar;
