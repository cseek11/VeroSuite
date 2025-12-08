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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importDefault(require("react"));
var Input = react_1.default.forwardRef(function (_a, ref) {
    var label = _a.label, error = _a.error, Icon = _a.icon, helperText = _a.helperText, _b = _a.className, className = _b === void 0 ? '' : _b, id = _a.id, props = __rest(_a, ["label", "error", "icon", "helperText", "className", "id"]);
    var inputId = id || "input-".concat(Math.random().toString(36).substr(2, 9));
    var errorId = error ? "".concat(inputId, "-error") : undefined;
    var helperId = helperText ? "".concat(inputId, "-helper") : undefined;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 ".concat(className), children: [label && ((0, jsx_runtime_1.jsx)("label", { htmlFor: inputId, className: "block text-sm font-medium text-gray-700", children: label })), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [Icon && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4 text-purple-500" }) })), (0, jsx_runtime_1.jsx)("input", __assign({ ref: ref, id: inputId, className: "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ".concat(Icon ? 'pl-10' : '', " ").concat(error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''), "aria-invalid": error ? 'true' : 'false', "aria-describedby": [errorId, helperId].filter(Boolean).join(' ') || undefined }, props))] }), error && ((0, jsx_runtime_1.jsx)("p", { id: errorId, className: "text-sm text-red-600", children: error })), helperText && !error && ((0, jsx_runtime_1.jsx)("p", { id: helperId, className: "text-sm text-gray-500", children: helperText }))] }));
});
Input.displayName = 'Input';
exports.default = Input;
