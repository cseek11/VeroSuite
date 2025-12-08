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
exports.CardContent = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var CardContainer_1 = require("./CardContainer");
var ScrollableArea_1 = require("./ScrollableArea");
var ResponsiveContent_1 = require("./ResponsiveContent");
var utils_1 = require("@/lib/utils");
exports.CardContent = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.variant, variant = _c === void 0 ? 'default' : _c, _d = _a.size, size = _d === void 0 ? 'auto' : _d, _e = _a.scrollbarStyle, scrollbarStyle = _e === void 0 ? 'thin' : _e, _f = _a.autoScroll, autoScroll = _f === void 0 ? false : _f, _g = _a.responsive, responsive = _g === void 0 ? true : _g, _h = _a.breakpoint, breakpoint = _h === void 0 ? 50 : _h, cardId = _a.cardId, onScroll = _a.onScroll, props = __rest(_a, ["children", "className", "variant", "size", "scrollbarStyle", "autoScroll", "responsive", "breakpoint", "cardId", "onScroll"]);
    var content = responsive ? ((0, jsx_runtime_1.jsx)(ResponsiveContent_1.ResponsiveContent, __assign({ breakpoint: breakpoint }, (cardId !== undefined && cardId !== null ? { cardId: cardId } : {}), { className: "h-full w-full", children: (0, jsx_runtime_1.jsx)(ScrollableArea_1.ScrollableArea, __assign({ scrollbarStyle: scrollbarStyle, autoScroll: autoScroll }, (onScroll !== undefined && onScroll !== null ? { onScroll: onScroll } : {}), { className: "h-full w-full", children: children })) }))) : ((0, jsx_runtime_1.jsx)(ScrollableArea_1.ScrollableArea, __assign({ scrollbarStyle: scrollbarStyle, autoScroll: autoScroll }, (onScroll !== undefined && onScroll !== null ? { onScroll: onScroll } : {}), { className: "h-full w-full", children: children })));
    return ((0, jsx_runtime_1.jsx)(CardContainer_1.CardContainer, __assign({ ref: ref, variant: variant, size: size, className: (0, utils_1.cn)(className) }, props, { children: content })));
});
exports.CardContent.displayName = 'CardContent';
