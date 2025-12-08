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
exports.ScrollableArea = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
exports.ScrollableArea = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.scrollbarStyle, scrollbarStyle = _c === void 0 ? 'thin' : _c, _d = _a.autoScroll, autoScroll = _d === void 0 ? false : _d, onScroll = _a.onScroll, props = __rest(_a, ["children", "className", "scrollbarStyle", "autoScroll", "onScroll"]);
    var internalRef = (0, react_1.useRef)(null);
    var scrollRef = ref || internalRef;
    // Auto-scroll to expanded content when it appears
    (0, react_1.useEffect)(function () {
        if (!autoScroll)
            return;
        var handleExpandedContent = function () {
            var _a;
            var expandedContent = (_a = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current) === null || _a === void 0 ? void 0 : _a.querySelector('.expanded-content');
            if (expandedContent) {
                expandedContent.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'nearest'
                });
            }
        };
        // Listen for custom events
        var handleCustomerRowExpanded = function (event) {
            var isExpanded = event.detail.isExpanded;
            if (isExpanded) {
                setTimeout(handleExpandedContent, 200);
            }
        };
        window.addEventListener('customerRowExpanded', handleCustomerRowExpanded);
        return function () {
            window.removeEventListener('customerRowExpanded', handleCustomerRowExpanded);
        };
    }, [autoScroll, scrollRef]);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ ref: scrollRef, className: (0, utils_1.cn)('scrollable-area', 'flex-1 overflow-auto', 'relative', {
            // Scrollbar styles
            'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100': scrollbarStyle === 'thin',
            'scrollbar-normal': scrollbarStyle === 'normal',
            'scrollbar-none': scrollbarStyle === 'hidden',
        }, className), style: {
            // Ensure proper height constraints for scrolling
            height: '100%',
            maxHeight: '100%',
            minHeight: '400px', // Minimum height to ensure scrollbars appear
            // Inline scrollbar styles for Firefox
            scrollbarWidth: scrollbarStyle === 'thin' ? 'thin' : 'auto',
            scrollbarColor: scrollbarStyle === 'thin' ? '#d1d5db #f3f4f6' : undefined,
        }, onScroll: onScroll }, props, { children: children })));
});
exports.ScrollableArea.displayName = 'ScrollableArea';
