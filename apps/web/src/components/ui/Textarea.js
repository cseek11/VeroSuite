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
var Textarea = react_1.default.forwardRef(function (_a, ref) {
    var label = _a.label, error = _a.error, helperText = _a.helperText, _b = _a.className, className = _b === void 0 ? '' : _b, id = _a.id, _c = _a.rows, rows = _c === void 0 ? 3 : _c, props = __rest(_a, ["label", "error", "helperText", "className", "id", "rows"]);
    var textareaId = id || "textarea-".concat(Math.random().toString(36).substr(2, 9));
    var errorId = error ? "".concat(textareaId, "-error") : undefined;
    var helperId = helperText ? "".concat(textareaId, "-helper") : undefined;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "crm-field ".concat(className), children: [label && ((0, jsx_runtime_1.jsx)("label", { htmlFor: textareaId, className: "crm-label", children: label })), (0, jsx_runtime_1.jsx)("textarea", __assign({ ref: ref, id: textareaId, rows: rows, className: "crm-textarea ".concat(error ? 'crm-input-error' : ''), "aria-invalid": error ? 'true' : 'false', "aria-describedby": [errorId, helperId].filter(Boolean).join(' ') || undefined }, props)), error && ((0, jsx_runtime_1.jsx)("p", { id: errorId, className: "crm-error", children: error })), helperText && !error && ((0, jsx_runtime_1.jsx)("p", { id: helperId, className: "crm-help", children: helperText }))] }));
});
Textarea.displayName = 'Textarea';
exports.default = Textarea;
