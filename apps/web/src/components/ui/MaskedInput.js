"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_input_mask_1 = __importDefault(require("react-input-mask"));
var MaskedInput = function (_a) {
    var label = _a.label, value = _a.value, onChange = _a.onChange, placeholder = _a.placeholder, mask = _a.mask, error = _a.error, _b = _a.className, className = _b === void 0 ? '' : _b, Icon = _a.icon;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "crm-field ".concat(className), children: [label && (0, jsx_runtime_1.jsx)("label", { className: "crm-label", children: label }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [Icon && ((0, jsx_runtime_1.jsx)("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: (0, jsx_runtime_1.jsx)(Icon, { className: "h-4 w-4 text-gray-500" }) })), (0, jsx_runtime_1.jsx)(react_input_mask_1.default, { mask: mask, value: value, onChange: function (e) { return onChange(e.target.value); }, placeholder: placeholder, className: "crm-input ".concat(Icon ? 'pl-10' : '', " ").concat(error ? 'crm-input-error' : ''), style: {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'rgb(30, 41, 59)',
                            backdropFilter: 'blur(4px)',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            appearance: 'none'
                        }, onFocus: function (e) {
                            e.target.style.boxShadow = '0 0 0 2px rgba(34, 197, 94, 0.3)';
                            e.target.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                        }, onBlur: function (e) {
                            e.target.style.boxShadow = 'none';
                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        } })] }), error && (0, jsx_runtime_1.jsx)("p", { className: "crm-error", children: error })] }));
};
exports.default = MaskedInput;
