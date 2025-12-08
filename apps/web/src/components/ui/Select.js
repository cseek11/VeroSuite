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
var logger_1 = require("@/utils/logger");
var Select = react_1.default.forwardRef(function (_a, ref) {
    var label = _a.label, error = _a.error, helperText = _a.helperText, options = _a.options, placeholder = _a.placeholder, onChange = _a.onChange, _b = _a.className, className = _b === void 0 ? '' : _b, id = _a.id, value = _a.value, props = __rest(_a, ["label", "error", "helperText", "options", "placeholder", "onChange", "className", "id", "value"]);
    var selectId = id || "select-".concat(Math.random().toString(36).substr(2, 9));
    var errorId = error ? "".concat(selectId, "-error") : undefined;
    var helperId = helperText ? "".concat(selectId, "-helper") : undefined;
    // Guard: Validate options prop
    if (!options || !Array.isArray(options)) {
        var errorMessage = "Select component: options prop is required and must be an array. Received: ".concat(options === undefined ? 'undefined' : options === null ? 'null' : typeof options);
        logger_1.logger.error(errorMessage, new Error('INVALID_OPTIONS'), 'Select');
        return ((0, jsx_runtime_1.jsxs)("div", { className: "crm-field ".concat(className), children: [label && ((0, jsx_runtime_1.jsx)("label", { htmlFor: selectId, className: "crm-label", children: label })), (0, jsx_runtime_1.jsx)("select", { ref: ref, id: selectId, disabled: true, className: "crm-select crm-input-error", "aria-invalid": "true", children: (0, jsx_runtime_1.jsx)("option", { value: "", children: "Invalid options provided" }) }), error && ((0, jsx_runtime_1.jsx)("p", { id: errorId, className: "crm-error", children: error }))] }));
    }
    var handleChange = function (e) {
        onChange === null || onChange === void 0 ? void 0 : onChange(e.target.value);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "crm-field ".concat(className), children: [label && ((0, jsx_runtime_1.jsx)("label", { htmlFor: selectId, className: "crm-label", children: label })), (0, jsx_runtime_1.jsxs)("select", __assign({ ref: ref, id: selectId, value: value, onChange: handleChange, className: "crm-select ".concat(error ? 'crm-input-error' : ''), "aria-invalid": error ? 'true' : 'false', "aria-describedby": [errorId, helperId].filter(Boolean).join(' ') || undefined, style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'rgb(30, 41, 59)',
                    backdropFilter: 'blur(4px)',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    outline: 'none',
                    transition: 'none'
                } }, props, { children: [placeholder && ((0, jsx_runtime_1.jsx)("option", { value: "", disabled: true, children: placeholder })), options.map(function (option) { return ((0, jsx_runtime_1.jsx)("option", { value: option.value, disabled: option.disabled, children: option.label }, option.value)); })] })), error && ((0, jsx_runtime_1.jsx)("p", { id: errorId, className: "crm-error", children: error })), helperText && !error && ((0, jsx_runtime_1.jsx)("p", { id: helperId, className: "crm-help", children: helperText }))] }));
});
Select.displayName = 'Select';
exports.default = Select;
