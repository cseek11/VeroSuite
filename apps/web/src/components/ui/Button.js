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
var jsx_runtime_1 = require("react/jsx-runtime");
var lucide_react_1 = require("lucide-react");
var Button = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, _c = _a.size, size = _c === void 0 ? 'md' : _c, Icon = _a.icon, _d = _a.disabled, disabled = _d === void 0 ? false : _d, _e = _a.loading, loading = _e === void 0 ? false : _e, onClick = _a.onClick, _f = _a.className, className = _f === void 0 ? '' : _f, _g = _a.type, type = _g === void 0 ? 'button' : _g, props = __rest(_a, ["children", "variant", "size", "icon", "disabled", "loading", "onClick", "className", "type"]);
    // Map variants to Tailwind button classes
    var getVariantClasses = function () {
        switch (variant) {
            case 'primary':
                return 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl';
            case 'secondary':
                return 'bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:shadow-lg';
            case 'outline':
                return 'border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white hover:shadow-lg';
            case 'ghost':
                return 'hover:bg-slate-100 text-slate-700';
            case 'danger':
                return 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl';
            case 'success':
                return 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl';
            default:
                return 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl';
        }
    };
    // Map sizes to Tailwind button classes
    var getSizeClasses = function () {
        switch (size) {
            case 'sm':
                return 'px-3 py-1.5 text-sm';
            case 'lg':
                return 'px-6 py-3 text-lg';
            default:
                return 'px-3 py-1.5 text-sm';
        }
    };
    var isDisabled = disabled || loading;
    return ((0, jsx_runtime_1.jsxs)("button", __assign({ type: type, className: "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ".concat(getVariantClasses(), " ").concat(getSizeClasses(), " ").concat(className), disabled: isDisabled, onClick: onClick }, props, { children: [loading && (0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "animate-spin w-4 h-4 mr-2" }), !loading && Icon && (0, jsx_runtime_1.jsx)(Icon, { className: "w-4 h-4 mr-2" }), children] })));
};
exports.default = Button;
