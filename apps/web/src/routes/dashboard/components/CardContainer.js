"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardContainer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
/**
 * CardContainer Component
 *
 * Encapsulates individual card rendering with controls, resize handles, and event handlers.
 * Extracted from VeroCardsV3.tsx to improve maintainability and reduce file size.
 *
 * Target: <300 lines
 */
var react_1 = __importDefault(require("react"));
var lucide_react_1 = require("lucide-react");
var CardFocusManager_1 = require("@/components/dashboard/CardFocusManager");
var ResizeHandle_1 = __importDefault(require("@/components/dashboard/ResizeHandle"));
var renderHelpers_1 = require("../utils/renderHelpers");
exports.CardContainer = react_1.default.memo(function (_a) {
    var card = _a.card, isSelected = _a.isSelected, isDragging = _a.isDragging, isDraggingMultiple = _a.isDraggingMultiple, isLocked = _a.isLocked, isResizing = _a.isResizing, isFocused = _a.isFocused, isNavigating = _a.isNavigating, navigationMode = _a.navigationMode, searchTerm = _a.searchTerm, isInFilteredResults = _a.isInFilteredResults, cardGroup = _a.cardGroup, cardTypes = _a.cardTypes, kpiData = _a.kpiData, onDragStart = _a.onDragStart, onClick = _a.onClick, onFocus = _a.onFocus, onToggleLock = _a.onToggleLock, onRemove = _a.onRemove, onResizeStart = _a.onResizeStart, onMinimize = _a.onMinimize, onExpand = _a.onExpand, onRestore = _a.onRestore, setShowTemplateLibrary = _a.setShowTemplateLibrary;
    var isMinimized = card.width <= 200 && card.height <= 140;
    var isGroupLocked = (cardGroup === null || cardGroup === void 0 ? void 0 : cardGroup.locked) || false;
    // Determine card styling based on state
    var getCardClassName = function () {
        var baseClasses = 'absolute bg-white rounded-lg shadow-lg border transition-all duration-200 group overflow-hidden';
        var selectionClasses = isSelected
            ? isDraggingMultiple ? 'opacity-80 scale-95' : ''
            : 'hover:shadow-xl border-gray-200 hover:border-purple-200';
        var dragClasses = isDragging ? 'z-50 rotate-1 scale-105 shadow-2xl' : 'z-10';
        var lockClasses = isLocked || isGroupLocked
            ? 'border-red-400 bg-red-50/30 cursor-default'
            : card.type === 'customers-page' || card.id.includes('-page')
                ? 'border-blue-400 bg-blue-50/30 cursor-default'
                : 'cursor-default';
        var searchClasses = searchTerm && isInFilteredResults
            ? 'ring-2 ring-yellow-400 bg-yellow-50/30 animate-pulse'
            : '';
        return "".concat(baseClasses, " ").concat(selectionClasses, " ").concat(dragClasses, " ").concat(lockClasses, " ").concat(searchClasses);
    };
    var handleFocus = function (e) {
        // Only navigate if the focus didn't come from a button click
        if (e && e.target && (e.target === e.currentTarget || !e.target.closest('button'))) {
            onFocus(card.id);
        }
    };
    var handleRestoreClick = function () {
        // Get original size/position from localStorage
        var savedState = localStorage.getItem("card-state-".concat(card.id));
        var originalSize = { width: 400, height: 300 };
        var originalPosition = { x: 100, y: 100 };
        if (savedState) {
            try {
                var parsed = JSON.parse(savedState);
                originalSize = parsed.originalSize || originalSize;
                originalPosition = parsed.originalPosition || originalPosition;
            }
            catch (error) {
                // Failed to parse saved state - use defaults
                // Error is non-critical, just use default card state
            }
        }
        onRestore(card.id, card.type, originalSize, originalPosition);
    };
    return ((0, jsx_runtime_1.jsx)(CardFocusManager_1.CardFocusManager, { cardId: card.id, isFocused: isFocused, isSelected: isSelected, navigationMode: navigationMode, isNavigating: isNavigating, "data-card-id": card.id, className: getCardClassName(), style: {
            left: card.x,
            top: card.y,
            width: card.width,
            height: card.height
        }, onFocus: handleFocus, children: (0, jsx_runtime_1.jsxs)("div", { onClick: function (e) {
                // Don't trigger card selection if clicking on draggable content
                var target = e.target;
                if (!target.closest('.draggable-content')) {
                    onClick(card.id, e);
                }
            }, children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-2 right-2 z-50 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-lg px-1.5 py-1 shadow-xl border border-gray-200/50", children: [!isLocked && !isGroupLocked && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onMouseDown: function (e) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (!isLocked && !isGroupLocked) {
                                                onDragStart(card.id, e);
                                            }
                                        }, tabIndex: -1, className: "w-7 h-7 flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 shadow-sm cursor-grab active:cursor-grabbing", title: "Drag to move card", children: (0, jsx_runtime_1.jsx)(lucide_react_1.GripVertical, { className: "w-3.5 h-3.5" }) }), (0, jsx_runtime_1.jsx)("div", { className: "w-px h-4 bg-gray-300" })] })), isMinimized ? ((0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleRestoreClick();
                                }, onMouseDown: function (e) { return e.stopPropagation(); }, tabIndex: -1, className: "w-7 h-7 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 shadow-sm", title: "Restore", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Maximize2, { className: "w-3.5 h-3.5" }) })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            onMinimize(card.id, card.type);
                                        }, onMouseDown: function (e) { return e.stopPropagation(); }, tabIndex: -1, className: "w-7 h-7 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 shadow-sm", title: "Minimize", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Minus, { className: "w-3.5 h-3.5" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            onExpand(card.id, card.type);
                                        }, onMouseDown: function (e) { return e.stopPropagation(); }, tabIndex: -1, className: "w-7 h-7 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 shadow-sm", title: "Expand", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Maximize2, { className: "w-3.5 h-3.5" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            window.dispatchEvent(new CustomEvent('halfScreenCard', {
                                                detail: { cardId: card.id, cardType: card.type }
                                            }));
                                        }, onMouseDown: function (e) { return e.stopPropagation(); }, tabIndex: -1, className: "w-7 h-7 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 shadow-sm", title: "Half-screen (side-by-side)", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Columns, { className: "w-3.5 h-3.5" }) })] })), (0, jsx_runtime_1.jsx)("div", { className: "w-px h-4 bg-gray-300" }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    onToggleLock(card.id);
                                }, onMouseDown: function (e) { return e.stopPropagation(); }, tabIndex: -1, className: "w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm ".concat(isLocked
                                    ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400'
                                    : 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-400'), title: isLocked ? 'Unlock card' : 'Lock card', children: isLocked ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Unlock, { className: "w-3.5 h-3.5" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Lock, { className: "w-3.5 h-3.5" })) }), (0, jsx_runtime_1.jsx)("div", { className: "w-px h-4 bg-gray-300" }), (0, jsx_runtime_1.jsx)("button", { onClick: function (e) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    onRemove(card.id);
                                }, onMouseDown: function (e) { return e.stopPropagation(); }, tabIndex: -1, className: "w-7 h-7 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 shadow-sm", title: "Delete card", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-3.5 h-3.5" }) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "p-3 h-full overflow-hidden", children: (0, renderHelpers_1.renderCardComponent)(card, cardTypes, kpiData, setShowTemplateLibrary) }), (isSelected || isResizing) && !isLocked && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0 pointer-events-none", style: { zIndex: 100 }, children: [(0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "nw", onResizeStart: function (handle, e) { return onResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "ne", onResizeStart: function (handle, e) { return onResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "sw", onResizeStart: function (handle, e) { return onResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "se", onResizeStart: function (handle, e) { return onResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "n", onResizeStart: function (handle, e) { return onResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "s", onResizeStart: function (handle, e) { return onResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "e", onResizeStart: function (handle, e) { return onResizeStart(card.id, handle, e); } }), (0, jsx_runtime_1.jsx)(ResizeHandle_1.default, { position: "w", onResizeStart: function (handle, e) { return onResizeStart(card.id, handle, e); } })] }))] }) }, card.id));
}, function (prevProps, nextProps) {
    // Custom comparison for React.memo
    // Returns true if props are equal (skip re-render), false if different (re-render)
    // Always re-render if card ID changes (new card added)
    if (prevProps.card.id !== nextProps.card.id) {
        return false; // Re-render
    }
    // Check if card type component availability changed
    var prevCardType = prevProps.cardTypes.find(function (t) { return t.id === prevProps.card.type; });
    var nextCardType = nextProps.cardTypes.find(function (t) { return t.id === nextProps.card.type; });
    // If component wasn't available before but is now, re-render
    if (!(prevCardType === null || prevCardType === void 0 ? void 0 : prevCardType.component) && (nextCardType === null || nextCardType === void 0 ? void 0 : nextCardType.component)) {
        return false; // Re-render - component is now available
    }
    // Standard prop comparison
    var propsEqual = (prevProps.card.x === nextProps.card.x &&
        prevProps.card.y === nextProps.card.y &&
        prevProps.card.width === nextProps.card.width &&
        prevProps.card.height === nextProps.card.height &&
        prevProps.card.type === nextProps.card.type &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.isDragging === nextProps.isDragging &&
        prevProps.isLocked === nextProps.isLocked &&
        prevProps.isResizing === nextProps.isResizing &&
        prevProps.isFocused === nextProps.isFocused &&
        prevProps.isInFilteredResults === nextProps.isInFilteredResults &&
        prevProps.cardTypes === nextProps.cardTypes &&
        prevProps.kpiData === nextProps.kpiData);
    return propsEqual; // true = skip re-render, false = re-render
});
exports.CardContainer.displayName = 'CardContainer';
