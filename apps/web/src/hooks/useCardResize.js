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
exports.useCardResize = useCardResize;
var react_1 = require("react");
var cardConstants_1 = require("../routes/dashboard/utils/cardConstants");
function useCardResize(_a) {
    var onUpdateSize = _a.onUpdateSize, cards = _a.cards, onResizeEnd = _a.onResizeEnd, getCardGroup = _a.getCardGroup, updateGroupBounds = _a.updateGroupBounds, getCardType = _a.getCardType, onUpdatePosition = _a.onUpdatePosition;
    var _b = (0, react_1.useState)({
        isResizing: false,
        resizingCardId: null,
        resizeHandle: null,
        startPosition: { x: 0, y: 0 },
        startSize: { width: 0, height: 0 },
        startCardPosition: { x: 0, y: 0 }
    }), resizeState = _b[0], setResizeState = _b[1];
    // Start resizing
    var handleResizeStart = (0, react_1.useCallback)(function (cardId, handle, e) {
        e.preventDefault();
        e.stopPropagation();
        var card = cards[cardId];
        if (!card)
            return;
        setResizeState({
            isResizing: true,
            resizingCardId: cardId,
            resizeHandle: handle,
            startPosition: { x: e.clientX, y: e.clientY },
            startSize: { width: card.width, height: card.height },
            startCardPosition: { x: card.x, y: card.y }
        });
        // Set global styles
        document.body.style.cursor = "".concat(handle, "-resize");
        document.body.style.userSelect = 'none';
    }, [cards]);
    // Use ref to store current resize state to avoid stale closures
    var resizeStateRef = (0, react_1.useRef)(resizeState);
    (0, react_1.useEffect)(function () {
        resizeStateRef.current = resizeState;
    }, [resizeState]);
    // Handle resize move with immediate DOM updates for smooth performance
    var handleResizeMove = (0, react_1.useCallback)(function (e) {
        var currentState = resizeStateRef.current;
        if (!currentState.isResizing || !currentState.resizingCardId)
            return;
        // Use requestAnimationFrame for smooth 60fps updates
        requestAnimationFrame(function () {
            var state = resizeStateRef.current;
            if (!state.isResizing || !state.resizingCardId)
                return;
            var deltaX = e.clientX - state.startPosition.x;
            var deltaY = e.clientY - state.startPosition.y;
            var newWidth = state.startSize.width;
            var newHeight = state.startSize.height;
            // Calculate new dimensions based on resize handle
            switch (state.resizeHandle) {
                case 'se': // Southeast (bottom-right)
                    newWidth = state.startSize.width + deltaX;
                    newHeight = state.startSize.height + deltaY;
                    break;
                case 'sw': // Southwest (bottom-left)
                    newWidth = state.startSize.width - deltaX;
                    newHeight = state.startSize.height + deltaY;
                    break;
                case 'ne': // Northeast (top-right)
                    newWidth = state.startSize.width + deltaX;
                    newHeight = state.startSize.height - deltaY;
                    break;
                case 'nw': // Northwest (top-left)
                    newWidth = state.startSize.width - deltaX;
                    newHeight = state.startSize.height - deltaY;
                    break;
                case 'e': // East (right edge)
                    newWidth = state.startSize.width + deltaX;
                    break;
                case 'w': // West (left edge)
                    newWidth = state.startSize.width - deltaX;
                    break;
                case 's': // South (bottom edge)
                    newHeight = state.startSize.height + deltaY;
                    break;
                case 'n': // North (top edge)
                    newHeight = state.startSize.height - deltaY;
                    break;
                default:
                    return;
            }
            // Apply constraints - larger limits for Smart KPIs cards
            var minWidth = cardConstants_1.CARD_CONSTANTS.RESIZE.MIN_WIDTH;
            var minHeight = cardConstants_1.CARD_CONSTANTS.RESIZE.MIN_HEIGHT;
            // Check card type for appropriate max dimensions
            var cardType = getCardType === null || getCardType === void 0 ? void 0 : getCardType(state.resizingCardId);
            var isSmartKPIsCard = cardType === 'smart-kpis' || cardType === 'smart-kpis-test' || cardType === 'smart-kpis-debug';
            var isPageCard = (cardType === null || cardType === void 0 ? void 0 : cardType.includes('-page')) || cardType === 'customers-page';
            var maxWidth, maxHeight;
            if (isPageCard) {
                maxWidth = cardConstants_1.CARD_CONSTANTS.RESIZE.MAX_WIDTH; // Allow larger size for page cards
                maxHeight = cardConstants_1.CARD_CONSTANTS.RESIZE.MAX_HEIGHT;
            }
            else if (isSmartKPIsCard) {
                maxWidth = cardConstants_1.CARD_CONSTANTS.RESIZE.MAX_WIDTH_SMART_KPI;
                maxHeight = cardConstants_1.CARD_CONSTANTS.RESIZE.MAX_HEIGHT_SMART_KPI;
            }
            else {
                maxWidth = cardConstants_1.CARD_CONSTANTS.RESIZE.MAX_WIDTH_STANDARD;
                maxHeight = cardConstants_1.CARD_CONSTANTS.RESIZE.MAX_HEIGHT_STANDARD;
            }
            newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
            newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
            // Calculate new position for left/top edge resizing
            var newX = state.startCardPosition.x;
            var newY = state.startCardPosition.y;
            if (state.resizeHandle === 'w' || state.resizeHandle === 'nw' || state.resizeHandle === 'sw') {
                // Resizing from left edge - adjust X position
                newX = state.startCardPosition.x + (state.startSize.width - newWidth);
            }
            if (state.resizeHandle === 'n' || state.resizeHandle === 'nw' || state.resizeHandle === 'ne') {
                // Resizing from top edge - adjust Y position
                newY = state.startCardPosition.y + (state.startSize.height - newHeight);
            }
            // Immediate DOM update for visual feedback
            var cardElement = document.querySelector("[data-card-id=\"".concat(state.resizingCardId, "\"]"));
            if (cardElement) {
                cardElement.style.width = "".concat(newWidth, "px");
                cardElement.style.height = "".concat(newHeight, "px");
                cardElement.style.left = "".concat(newX, "px");
                cardElement.style.top = "".concat(newY, "px");
                cardElement.style.transition = 'none'; // Disable transitions during resize
            }
        });
    }, [getCardType]);
    // End resizing
    var handleResizeEnd = (0, react_1.useCallback)(function () {
        var _a;
        if (resizeState.isResizing) {
            // Final state update with current visual size
            var cardElement = document.querySelector("[data-card-id=\"".concat(resizeState.resizingCardId, "\"]"));
            if (cardElement) {
                var finalWidth = parseInt(cardElement.style.width) || resizeState.startSize.width;
                var finalHeight = parseInt(cardElement.style.height) || resizeState.startSize.height;
                var finalX = parseInt(cardElement.style.left) || resizeState.startCardPosition.x;
                var finalY = parseInt(cardElement.style.top) || resizeState.startCardPosition.y;
                // Re-enable transitions
                cardElement.style.transition = '';
                // Final state update
                onUpdateSize(resizeState.resizingCardId, finalWidth, finalHeight);
                // Update position if it changed (for left/top edge resizing)
                if (onUpdatePosition && (finalX !== resizeState.startCardPosition.x || finalY !== resizeState.startCardPosition.y)) {
                    onUpdatePosition(resizeState.resizingCardId, finalX, finalY);
                }
                // Update group bounds if card is in a group
                if (getCardGroup && updateGroupBounds) {
                    var cardGroup = getCardGroup(resizeState.resizingCardId);
                    if (cardGroup) {
                        // Update the cards object with the new size for group bounds calculation
                        var updatedCards = __assign(__assign({}, cards), (_a = {}, _a[resizeState.resizingCardId] = __assign(__assign({}, cards[resizeState.resizingCardId]), { width: finalWidth, height: finalHeight, x: finalX, y: finalY }), _a));
                        updateGroupBounds(cardGroup.id, updatedCards);
                    }
                }
                // Save to history after resize (meaningful action)
                if (onResizeEnd) {
                    setTimeout(function () { return onResizeEnd(); }, 100);
                }
            }
            // Reset global styles
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            setResizeState({
                isResizing: false,
                resizingCardId: null,
                resizeHandle: null,
                startPosition: { x: 0, y: 0 },
                startSize: { width: 0, height: 0 },
                startCardPosition: { x: 0, y: 0 }
            });
        }
    }, [resizeState, onUpdateSize, onResizeEnd, onUpdatePosition, getCardGroup, updateGroupBounds, cards]);
    // Add global resize event listeners
    (0, react_1.useEffect)(function () {
        if (resizeState.isResizing) {
            document.addEventListener('mousemove', handleResizeMove);
            document.addEventListener('mouseup', handleResizeEnd);
            return function () {
                document.removeEventListener('mousemove', handleResizeMove);
                document.removeEventListener('mouseup', handleResizeEnd);
            };
        }
        return undefined;
    }, [resizeState.isResizing, handleResizeMove, handleResizeEnd]);
    return {
        resizeState: resizeState,
        handleResizeStart: handleResizeStart,
        isResizing: resizeState.isResizing,
        resizingCardId: resizeState.resizingCardId
    };
}
