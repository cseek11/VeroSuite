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
var Checkbox = function (_a) {
    var label = _a.label, error = _a.error, helperText = _a.helperText, onChange = _a.onChange, _b = _a.className, className = _b === void 0 ? '' : _b, id = _a.id, checked = _a.checked, disabled = _a.disabled, indeterminate = _a.indeterminate, props = __rest(_a, ["label", "error", "helperText", "onChange", "className", "id", "checked", "disabled", "indeterminate"]);
    var checkboxId = id || "checkbox-".concat(Math.random().toString(36).substr(2, 9));
    var errorId = error ? "".concat(checkboxId, "-error") : undefined;
    var helperId = helperText ? "".concat(checkboxId, "-helper") : undefined;
    var checkboxRef = react_1.default.useRef(null);
    // Handle indeterminate state
    react_1.default.useEffect(function () {
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = indeterminate === true;
        }
    }, [indeterminate]);
    var handleChange = function (e) {
        if (disabled)
            return;
        onChange === null || onChange === void 0 ? void 0 : onChange(e.target.checked);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "crm-field ".concat(className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-start", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center h-5", children: (0, jsx_runtime_1.jsx)("input", __assign({ ref: checkboxRef, id: checkboxId, type: "checkbox", checked: checked, disabled: disabled, onChange: handleChange, className: "crm-checkbox", "aria-invalid": error ? 'true' : 'false', "aria-describedby": [errorId, helperId].filter(Boolean).join(' ') || undefined }, props)) }), label && ((0, jsx_runtime_1.jsx)("div", { className: "ml-3 text-sm", children: (0, jsx_runtime_1.jsx)("label", { htmlFor: checkboxId, className: "crm-label !mb-0", children: label }) }))] }), error && ((0, jsx_runtime_1.jsx)("p", { id: errorId, className: "crm-error", children: error })), helperText && !error && ((0, jsx_runtime_1.jsx)("p", { id: helperId, className: "crm-help", children: helperText }))] }));
};
exports.default = Checkbox;
