"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tooltip = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
var Tooltip = function (_a) {
    var content = _a.content, children = _a.children, _b = _a.side, side = _b === void 0 ? 'top' : _b, _c = _a.delayDuration, delayDuration = _c === void 0 ? 300 : _c, className = _a.className, _d = _a.forceSide, forceSide = _d === void 0 ? false : _d;
    var _e = (0, react_1.useState)(false), isVisible = _e[0], setIsVisible = _e[1];
    var _f = (0, react_1.useState)({ top: 0, left: 0 }), position = _f[0], setPosition = _f[1];
    var triggerRef = (0, react_1.useRef)(null);
    var tooltipRef = (0, react_1.useRef)(null);
    var timeoutRef = (0, react_1.useRef)();
    var showTooltip = function () {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(function () {
            setIsVisible(true);
            updatePosition();
        }, delayDuration);
    };
    var hideTooltip = function () {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };
    var updatePosition = function () {
        if (!triggerRef.current || !tooltipRef.current)
            return;
        var triggerRect = triggerRef.current.getBoundingClientRect();
        var tooltipRect = tooltipRef.current.getBoundingClientRect();
        var viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        var top = 0;
        var left = 0;
        switch (side) {
            case 'top':
                top = triggerRect.top - tooltipRect.height - 8;
                left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = triggerRect.bottom + 8;
                left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                left = triggerRect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                left = triggerRect.right + 8;
                break;
        }
        // Adjust for viewport boundaries only if forceSide is false
        if (!forceSide) {
            if (left < 8)
                left = 8;
            if (left + tooltipRect.width > viewport.width - 8) {
                left = viewport.width - tooltipRect.width - 8;
            }
            if (top < 8)
                top = 8;
            if (top + tooltipRect.height > viewport.height - 8) {
                top = viewport.height - tooltipRect.height - 8;
            }
        }
        setPosition({ top: top, left: left });
    };
    (0, react_1.useEffect)(function () {
        if (isVisible) {
            updatePosition();
            var handleResize_1 = function () { return updatePosition(); };
            var handleScroll_1 = function () { return updatePosition(); };
            window.addEventListener('resize', handleResize_1);
            window.addEventListener('scroll', handleScroll_1, true);
            return function () {
                window.removeEventListener('resize', handleResize_1);
                window.removeEventListener('scroll', handleScroll_1, true);
            };
        }
        return undefined;
    }, [isVisible, side]);
    (0, react_1.useEffect)(function () {
        return function () {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { ref: triggerRef, onMouseEnter: showTooltip, onMouseLeave: hideTooltip, onFocus: showTooltip, onBlur: function (_event) { return hideTooltip(); }, className: "inline-block", children: children }), isVisible && ((0, jsx_runtime_1.jsxs)("div", { ref: tooltipRef, className: (0, utils_1.cn)("fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg border border-gray-700", "animate-in fade-in-0 zoom-in-95 duration-200", className), style: {
                    top: position.top,
                    left: position.left,
                }, children: [content, (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("absolute w-2 h-2 bg-gray-900 border border-gray-700 rotate-45", {
                            'bottom-[-4px] left-1/2 transform -translate-x-1/2': side === 'top',
                            'top-[-4px] left-1/2 transform -translate-x-1/2': side === 'bottom',
                            'right-[-4px] top-1/2 transform -translate-y-1/2': side === 'left',
                            'left-[-4px] top-1/2 transform -translate-y-1/2': side === 'right',
                        }) })] }))] }));
};
exports.Tooltip = Tooltip;
exports.default = exports.Tooltip;
