"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormCol = exports.FormRow = exports.Form = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var Form = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, onSubmit = _a.onSubmit;
    return ((0, jsx_runtime_1.jsx)("form", { onSubmit: onSubmit, className: "space-y-4 ".concat(className), children: children }));
};
exports.Form = Form;
var FormRow = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    return ((0, jsx_runtime_1.jsx)("div", { className: "crm-field-row ".concat(className), children: children }));
};
exports.FormRow = FormRow;
var FormCol = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    return ((0, jsx_runtime_1.jsx)("div", { className: "crm-field-col ".concat(className), children: children }));
};
exports.FormCol = FormCol;
