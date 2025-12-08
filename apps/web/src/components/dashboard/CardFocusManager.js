"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardNavigationInstructions = exports.CardFocusManager = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var utils_1 = require("@/lib/utils");
var CardFocusManagerComponent = function (_a) {
    var cardId = _a.cardId, isFocused = _a.isFocused, isSelected = _a.isSelected, navigationMode = _a.navigationMode, isNavigating = _a.isNavigating, children = _a.children, className = _a.className, style = _a.style, onFocus = _a.onFocus, onBlur = _a.onBlur;
    var cardRef = (0, react_1.useRef)(null);
    // Update focus styles based on state
    (0, react_1.useEffect)(function () {
        var cardElement = cardRef.current;
        if (!cardElement)
            return;
        // Update tabindex for keyboard navigation
        if (isFocused) {
            cardElement.setAttribute('tabindex', '0');
        }
        else {
            cardElement.removeAttribute('tabindex');
        }
        // Update ARIA attributes for accessibility
        cardElement.setAttribute('aria-selected', isSelected.toString());
        cardElement.setAttribute('aria-focus', isFocused.toString());
        // Add role for screen readers
        if (!cardElement.getAttribute('role')) {
            cardElement.setAttribute('role', 'button');
        }
    }, [isFocused, isSelected]);
    // Handle focus events
    var handleFocus = function (e) {
        onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
    };
    var handleBlur = function (e) {
        onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
    };
    // Handle keyboard events for the card
    var handleKeyDown = function (e) {
        // Prevent default behavior for navigation keys
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', ' '].includes(e.key)) {
            e.preventDefault();
        }
    };
    // Get focus ring styles based on navigation mode
    var getFocusStyles = function () {
        var baseStyles = 'outline-none transition-all duration-200';
        if (isNavigating && isFocused) {
            switch (navigationMode) {
                case 'move':
                    return "".concat(baseStyles, " ring-2 ring-blue-500 ring-offset-2 ring-offset-white shadow-lg shadow-blue-500/20");
                case 'resize':
                    return "".concat(baseStyles, " ring-2 ring-green-500 ring-offset-2 ring-offset-white shadow-lg shadow-green-500/20");
                case 'select':
                default:
                    return "".concat(baseStyles, " ring-2 ring-purple-500 ring-offset-2 ring-offset-white shadow-lg shadow-purple-500/20");
            }
        }
        if (isSelected) {
            return "".concat(baseStyles, " ring-2 ring-purple-500 ring-offset-1 ring-offset-white");
        }
        return baseStyles;
    };
    return ((0, jsx_runtime_1.jsxs)("div", { ref: cardRef, "data-card-id": cardId, className: (0, utils_1.cn)(getFocusStyles(), className), style: style, onFocus: handleFocus, onBlur: handleBlur, onKeyDown: handleKeyDown, "aria-label": "Card ".concat(cardId), children: [children, isNavigating && isFocused && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute -top-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50", children: [navigationMode === 'move' && '🔄 Move Mode', navigationMode === 'resize' && '📏 Resize Mode', navigationMode === 'select' && '👆 Select Mode'] })), isFocused && ((0, jsx_runtime_1.jsxs)("div", { className: "sr-only", "aria-live": "polite", children: [isSelected ? 'Selected' : 'Not selected', " card focused"] }))] }));
};
// Memoized CardFocusManager to prevent unnecessary re-renders
exports.CardFocusManager = (0, react_1.memo)(CardFocusManagerComponent, function (prevProps, nextProps) {
    // Only re-render if these props change
    return (prevProps.cardId === nextProps.cardId &&
        prevProps.isFocused === nextProps.isFocused &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.navigationMode === nextProps.navigationMode &&
        prevProps.isNavigating === nextProps.isNavigating &&
        prevProps.className === nextProps.className &&
        // Deep compare style object
        JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style));
});
exports.CardFocusManager.displayName = 'CardFocusManager';
// Keyboard navigation instructions component
var KeyboardNavigationInstructions = function () {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white border border-gray-200 rounded-lg p-4 shadow-sm", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "Keyboard Navigation" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-xs text-gray-600", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Navigate between cards:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono bg-gray-100 px-2 py-1 rounded", children: "Arrow Keys" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Select multiple cards:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono bg-gray-100 px-2 py-1 rounded", children: "Shift + Arrow Keys" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Move selected card:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono bg-gray-100 px-2 py-1 rounded", children: "Ctrl + Arrow Keys" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Resize selected card:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono bg-gray-100 px-2 py-1 rounded", children: "Alt + Arrow Keys" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Activate card:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono bg-gray-100 px-2 py-1 rounded", children: "Space / Enter" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Tab navigation:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono bg-gray-100 px-2 py-1 rounded", children: "Tab / Shift+Tab" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "First/Last card:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono bg-gray-100 px-2 py-1 rounded", children: "Home / End" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { children: "Deselect all:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-mono bg-gray-100 px-2 py-1 rounded", children: "Escape" })] })] })] }));
};
exports.KeyboardNavigationInstructions = KeyboardNavigationInstructions;
