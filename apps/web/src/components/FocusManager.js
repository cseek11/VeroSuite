"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var FocusManager = function (_a) {
    var children = _a.children, _b = _a.autoFocus, autoFocus = _b === void 0 ? false : _b, _c = _a.trapFocus, trapFocus = _c === void 0 ? false : _c, _d = _a.restoreFocus, restoreFocus = _d === void 0 ? false : _d, onFocusChange = _a.onFocusChange;
    var containerRef = (0, react_1.useRef)(null);
    var previousFocusRef = (0, react_1.useRef)(null);
    // Get all focusable elements within the container
    var getFocusableElements = function () {
        if (!containerRef.current)
            return [];
        var focusableSelectors = [
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'a[href]',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]',
            '[role="button"]',
            '[role="tab"]',
            '[role="menuitem"]',
            '[data-focusable]'
        ];
        var elements = containerRef.current.querySelectorAll(focusableSelectors.join(', '));
        return Array.from(elements);
    };
    // Focus trap logic
    (0, react_1.useEffect)(function () {
        if (!trapFocus || !containerRef.current)
            return;
        var handleKeyDown = function (event) {
            if (event.key !== 'Tab')
                return;
            var focusableElements = getFocusableElements();
            if (focusableElements.length === 0)
                return;
            var firstElement = focusableElements[0];
            var lastElement = focusableElements[focusableElements.length - 1];
            if (!firstElement || !lastElement)
                return;
            if (event.shiftKey) {
                // Shift + Tab: move backwards
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            }
            else {
                // Tab: move forwards
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return function () { return document.removeEventListener('keydown', handleKeyDown); };
    }, [trapFocus]);
    // Auto focus first element
    (0, react_1.useEffect)(function () {
        if (!autoFocus || !containerRef.current)
            return;
        var timer = setTimeout(function () {
            var focusableElements = getFocusableElements();
            if (focusableElements.length > 0 && focusableElements[0]) {
                focusableElements[0].focus();
            }
        }, 100);
        return function () { return clearTimeout(timer); };
    }, [autoFocus]);
    // Restore focus on unmount
    (0, react_1.useEffect)(function () {
        if (!restoreFocus)
            return;
        return function () {
            if (previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        };
    }, [restoreFocus]);
    // Track focus changes
    (0, react_1.useEffect)(function () {
        var handleFocusIn = function (event) {
            var _a;
            var target = event.target;
            if ((_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.contains(target)) {
                onFocusChange === null || onFocusChange === void 0 ? void 0 : onFocusChange(target);
            }
        };
        var handleFocusOut = function () {
            onFocusChange === null || onFocusChange === void 0 ? void 0 : onFocusChange(null);
        };
        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusout', handleFocusOut);
        return function () {
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('focusout', handleFocusOut);
        };
    }, [onFocusChange]);
    return ((0, jsx_runtime_1.jsx)("div", { ref: containerRef, className: "focus-manager", tabIndex: trapFocus ? -1 : undefined, children: children }));
};
exports.default = FocusManager;
