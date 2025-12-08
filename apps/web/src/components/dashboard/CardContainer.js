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
exports.CardContainer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
exports.CardContainer = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.variant, variant = _c === void 0 ? 'default' : _c, _d = _a.size, size = _d === void 0 ? 'auto' : _d, props = __rest(_a, ["children", "className", "variant", "size"]);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ ref: ref, className: (0, utils_1.cn)('card-container', 'h-full w-full flex flex-col overflow-hidden', 'transition-all duration-200', __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (variant === 'default' && { 'bg-white rounded-lg shadow-lg border': true })), (variant === 'page' && { 'bg-blue-50/30 border-blue-400': true })), (variant === 'kpi' && { 'bg-white rounded-lg shadow-lg border': true })), (variant === 'template' && { 'bg-white rounded-lg shadow-lg border': true })), (size === 'small' && { 'min-h-[300px] min-w-[400px]': true })), (size === 'medium' && { 'min-h-[400px] min-w-[500px]': true })), (size === 'large' && { 'min-h-[600px] min-w-[700px]': true })), (size === 'auto' && { 'min-h-[300px] min-w-[400px]': true })), className) }, props, { children: children })));
});
exports.CardContainer.displayName = 'CardContainer';
