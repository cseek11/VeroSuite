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
exports.ResponsiveContent = exports.useResponsive = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
var ResponsiveContext = (0, react_1.createContext)({
    isMobile: false,
    cardWidth: 0,
    cardHeight: 0,
    viewportWidth: 0,
    percentage: 0,
});
var useResponsive = function () { return (0, react_1.useContext)(ResponsiveContext); };
exports.useResponsive = useResponsive;
exports.ResponsiveContent = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.breakpoint, breakpoint = _c === void 0 ? 50 : _c, cardId = _a.cardId, props = __rest(_a, ["children", "className", "breakpoint", "cardId"]);
    var _d = (0, react_1.useState)({
        isMobile: false,
        cardWidth: 0,
        cardHeight: 0,
        viewportWidth: 0,
        percentage: 0,
    }), state = _d[0], setState = _d[1];
    var containerRef = (0, react_1.useRef)(null);
    var observerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var container = containerRef.current;
        if (!container)
            return;
        var updateResponsiveState = function () {
            var rect = container.getBoundingClientRect();
            var viewportWidth = window.innerWidth;
            var cardWidth = rect.width;
            var percentage = (cardWidth / viewportWidth) * 100;
            var isMobile = percentage < breakpoint;
            setState({
                isMobile: isMobile,
                cardWidth: cardWidth,
                cardHeight: rect.height,
                viewportWidth: viewportWidth,
                percentage: percentage,
            });
            // Add/remove mobile class for CSS targeting
            if (isMobile) {
                container.classList.add('card-mobile-mode');
            }
            else {
                container.classList.remove('card-mobile-mode');
            }
        };
        // Initial check
        updateResponsiveState();
        // Set up ResizeObserver
        observerRef.current = new ResizeObserver(function () {
            updateResponsiveState();
        });
        observerRef.current.observe(container);
        // Listen for window resize
        var handleWindowResize = function () {
            updateResponsiveState();
        };
        window.addEventListener('resize', handleWindowResize);
        return function () {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [breakpoint]);
    return ((0, jsx_runtime_1.jsx)(ResponsiveContext.Provider, { value: state, children: (0, jsx_runtime_1.jsx)("div", __assign({ ref: function (node) {
                containerRef.current = node;
                if (typeof ref === 'function') {
                    ref(node);
                }
                else if (ref) {
                    ref.current = node;
                }
            }, className: (0, utils_1.cn)('responsive-content', 'h-full w-full', {
                'mobile-mode': state.isMobile,
                'desktop-mode': !state.isMobile,
            }, className), "data-card-id": cardId }, props, { children: children })) }));
});
exports.ResponsiveContent.displayName = 'ResponsiveContent';
