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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversalCardManager = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var logger_1 = require("@/utils/logger");
/**
 * UniversalCardManager - Provides consistent minimize/maximize/close functionality for ALL cards
 *
 * Features:
 * - Minimize: Shrinks card to icon size in grid
 * - Maximize: Expands card to full viewport
 * - Restore: Returns to original size/position
 * - Lock: Prevents dragging/resizing
 * - Persistent state via localStorage
 *
 * Performance:
 * - Uses React.memo for children
 * - Debounced state persistence
 * - Event delegation for buttons
 */
var UniversalCardManager = function (_a) {
    var cardId = _a.cardId, cardType = _a.cardType, children = _a.children, onMinimize = _a.onMinimize, onMaximize = _a.onMaximize, onRestore = _a.onRestore, onClose = _a.onClose, _b = _a.isLocked, isLocked = _b === void 0 ? false : _b, onToggleLock = _a.onToggleLock, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _d = (0, react_1.useState)({
        isMinimized: false,
        isMaximized: false
    }), state = _d[0], setState = _d[1];
    // Load saved state from localStorage
    (0, react_1.useEffect)(function () {
        var savedState = localStorage.getItem("card-state-".concat(cardId));
        if (savedState) {
            try {
                var parsed_1 = JSON.parse(savedState);
                setState(function (prev) { return (__assign(__assign({}, prev), { originalSize: parsed_1.originalSize, originalPosition: parsed_1.originalPosition })); });
            }
            catch (error) {
                logger_1.logger.warn('Failed to load card state', { error: error, cardId: cardId }, 'UniversalCardManager');
            }
        }
    }, [cardId]);
    // Save state to localStorage (debounced)
    (0, react_1.useEffect)(function () {
        var timeoutId = setTimeout(function () {
            localStorage.setItem("card-state-".concat(cardId), JSON.stringify({
                originalSize: state.originalSize,
                originalPosition: state.originalPosition
            }));
        }, 500);
        return function () { return clearTimeout(timeoutId); };
    }, [cardId, state.originalSize, state.originalPosition]);
    // Listen for minimize/maximize/restore events from parent
    (0, react_1.useEffect)(function () {
        var handleMinimizeEvent = function () {
            setState(function (prev) { return (__assign(__assign({}, prev), { isMinimized: true, isMaximized: false })); });
        };
        var handleMaximizeEvent = function () {
            setState(function (prev) { return (__assign(__assign({}, prev), { isMinimized: false, isMaximized: true })); });
        };
        var handleRestoreEvent = function () {
            setState(function (prev) { return (__assign(__assign({}, prev), { isMinimized: false, isMaximized: false })); });
        };
        window.addEventListener("minimizeCard-".concat(cardId), handleMinimizeEvent);
        window.addEventListener("maximizeCard-".concat(cardId), handleMaximizeEvent);
        window.addEventListener("restoreCard-".concat(cardId), handleRestoreEvent);
        return function () {
            window.removeEventListener("minimizeCard-".concat(cardId), handleMinimizeEvent);
            window.removeEventListener("maximizeCard-".concat(cardId), handleMaximizeEvent);
            window.removeEventListener("restoreCard-".concat(cardId), handleRestoreEvent);
        };
    }, [cardId]);
    var handleMinimize = (0, react_1.useCallback)(function (e) {
        e.stopPropagation();
        e.preventDefault();
        // Dispatch event for VeroCardsV3 to handle positioning
        window.dispatchEvent(new CustomEvent('minimizeCard', {
            detail: { cardId: cardId, cardType: cardType }
        }));
        onMinimize === null || onMinimize === void 0 ? void 0 : onMinimize();
    }, [cardId, cardType, onMinimize]);
    var handleMaximize = (0, react_1.useCallback)(function (e) {
        e.stopPropagation();
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('expandCard', {
            detail: { cardId: cardId, cardType: cardType }
        }));
        onMaximize === null || onMaximize === void 0 ? void 0 : onMaximize();
    }, [cardId, cardType, onMaximize]);
    var handleRestore = (0, react_1.useCallback)(function (e) {
        e.stopPropagation();
        e.preventDefault();
        var savedState = localStorage.getItem("card-state-".concat(cardId));
        var originalSize = { width: 400, height: 300 };
        var originalPosition = { x: 100, y: 100 };
        if (savedState) {
            try {
                var parsed = JSON.parse(savedState);
                originalSize = parsed.originalSize || originalSize;
                originalPosition = parsed.originalPosition || originalPosition;
            }
            catch (error) {
                logger_1.logger.warn('Failed to parse saved state', { error: error, cardId: cardId }, 'UniversalCardManager');
            }
        }
        window.dispatchEvent(new CustomEvent('restoreCard', {
            detail: {
                cardId: cardId,
                cardType: cardType,
                originalSize: originalSize,
                originalPosition: originalPosition
            }
        }));
        onRestore === null || onRestore === void 0 ? void 0 : onRestore();
    }, [cardId, cardType, onRestore]);
    var handleClose = (0, react_1.useCallback)(function (e) {
        e.stopPropagation();
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('closeCard', {
            detail: { cardId: cardId, cardType: cardType }
        }));
        onClose === null || onClose === void 0 ? void 0 : onClose();
    }, [cardId, cardType, onClose]);
    var handleToggleLock = (0, react_1.useCallback)(function (e) {
        e.stopPropagation();
        e.preventDefault();
        onToggleLock === null || onToggleLock === void 0 ? void 0 : onToggleLock();
    }, [onToggleLock]);
    // Render minimized view
    if (state.isMinimized) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center p-2 ".concat(className), children: [(0, jsx_runtime_1.jsx)("button", { onClick: handleRestore, onMouseDown: function (e) { return e.stopPropagation(); }, className: "p-2 hover:bg-purple-100 rounded-full transition-all duration-200 hover:scale-110", title: "Restore ".concat(cardType), children: (0, jsx_runtime_1.jsx)(lucide_react_1.Maximize2, { className: "w-6 h-6 text-purple-600" }) }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600 mt-1 text-center truncate w-full", children: cardType })] }));
    }
    // Render normal/maximized view
    return ((0, jsx_runtime_1.jsxs)("div", { className: "h-full w-full flex flex-col ".concat(className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200", children: [onToggleLock && ((0, jsx_runtime_1.jsx)("button", { onClick: handleToggleLock, onMouseDown: function (e) { return e.stopPropagation(); }, className: "p-1.5 rounded-full transition-all duration-200 hover:scale-110 ".concat(isLocked
                            ? 'bg-red-500/20 hover:bg-red-500/30'
                            : 'bg-gray-500/20 hover:bg-gray-500/30'), title: isLocked ? 'Unlock' : 'Lock', children: isLocked ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-3 h-3 text-red-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Unlock, { className: "w-3 h-3 text-gray-600" })) })), (0, jsx_runtime_1.jsx)("button", { onClick: handleMinimize, onMouseDown: function (e) { return e.stopPropagation(); }, className: "p-1.5 hover:bg-yellow-500/20 rounded-full transition-all duration-200 hover:scale-110", title: "Minimize", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Minimize, { className: "w-3 h-3 text-yellow-600" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: state.isMaximized ? handleRestore : handleMaximize, onMouseDown: function (e) { return e.stopPropagation(); }, className: "p-1.5 hover:bg-blue-500/20 rounded-full transition-all duration-200 hover:scale-110", title: state.isMaximized ? 'Restore' : 'Maximize', children: (0, jsx_runtime_1.jsx)(lucide_react_1.Maximize2, { className: "w-3 h-3 ".concat(state.isMaximized ? 'text-green-600' : 'text-blue-600') }) }), (0, jsx_runtime_1.jsx)("button", { onClick: handleClose, onMouseDown: function (e) { return e.stopPropagation(); }, className: "p-1.5 hover:bg-red-500/20 rounded-full transition-all duration-200 hover:scale-110", title: "Close", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-3 h-3 text-red-600" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 overflow-auto", children: children })] }));
};
exports.UniversalCardManager = UniversalCardManager;
exports.default = exports.UniversalCardManager;
