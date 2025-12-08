"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCanvasHeight = void 0;
var react_1 = require("react");
var cardConstants_1 = require("../utils/cardConstants");
var useCanvasHeight = function (_a) {
    var cards = _a.cards, _b = _a.minHeight, minHeight = _b === void 0 ? cardConstants_1.CARD_CONSTANTS.CANVAS.MIN_HEIGHT : _b, _c = _a.padding, padding = _c === void 0 ? cardConstants_1.CARD_CONSTANTS.CANVAS.PADDING : _c, _d = _a.autoExpandThreshold, autoExpandThreshold = _d === void 0 ? cardConstants_1.CARD_CONSTANTS.CANVAS.AUTO_EXPAND_THRESHOLD : _d, containerRef = _a.containerRef, _e = _a.enableAutoScroll, enableAutoScroll = _e === void 0 ? true : _e, _f = _a.isDragging, isDragging = _f === void 0 ? false : _f;
    var _g = (0, react_1.useState)(minHeight), canvasHeight = _g[0], setCanvasHeight = _g[1];
    var _h = (0, react_1.useState)(minHeight), previousHeight = _h[0], setPreviousHeight = _h[1];
    var isExpanding = (0, react_1.useRef)(false);
    // Calculate the required canvas height based on card positions
    var calculateCanvasHeight = (0, react_1.useCallback)(function () {
        if (!cards || Object.keys(cards).length === 0) {
            return minHeight;
        }
        // Find the bottom-most position of all cards
        var maxBottom = Math.max.apply(Math, __spreadArray(__spreadArray([], Object.values(cards).map(function (card) {
            if (!card || typeof card.y !== 'number' || typeof card.height !== 'number') {
                return 0;
            }
            return card.y + card.height;
        }), false), [minHeight], false));
        // Add padding and threshold for comfortable viewing
        var newHeight = maxBottom + padding + autoExpandThreshold;
        return Math.max(newHeight, minHeight);
    }, [cards, minHeight, padding, autoExpandThreshold]);
    // Auto-scroll to keep cards in view when canvas expands
    var autoScrollToCard = (0, react_1.useCallback)(function (cardId) {
        if (!enableAutoScroll || !(containerRef === null || containerRef === void 0 ? void 0 : containerRef.current))
            return;
        var cardElement = document.querySelector("[data-card-id=\"".concat(cardId, "\"]"));
        if (cardElement) {
            cardElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    }, [enableAutoScroll, containerRef]);
    // Update canvas height when cards change (but skip during drag to prevent bouncing)
    (0, react_1.useEffect)(function () {
        // Skip canvas height updates during drag - will update after drag ends
        if (isDragging) {
            return;
        }
        var newHeight = calculateCanvasHeight();
        var heightDifference = newHeight - previousHeight;
        // Auto-scroll if there's any height increase (more than 50px)
        if (newHeight > previousHeight && heightDifference > 50) {
            isExpanding.current = true;
            // Find the card that caused the expansion (bottom-most card)
            var bottomMostCard_1 = Object.values(cards).reduce(function (bottomCard, card) {
                if (!card || typeof card.y !== 'number' || typeof card.height !== 'number') {
                    return bottomCard;
                }
                var cardBottom = card.y + card.height;
                var bottomCardBottom = bottomCard ? bottomCard.y + bottomCard.height : 0;
                return cardBottom > bottomCardBottom ? card : bottomCard;
            }, null);
            // Auto-scroll to the card that caused expansion only if it's significantly below current view
            if (bottomMostCard_1 && enableAutoScroll && (containerRef === null || containerRef === void 0 ? void 0 : containerRef.current)) {
                var container = containerRef.current;
                var containerRect = container.getBoundingClientRect();
                var cardElement = document.querySelector("[data-card-id=\"".concat(bottomMostCard_1.id, "\"]"));
                if (cardElement) {
                    var cardRect = cardElement.getBoundingClientRect();
                    var isCardBelowView = cardRect.top > containerRect.bottom - 50; // 50px buffer
                    // Only scroll if the card is actually below the visible area
                    if (isCardBelowView) {
                        setTimeout(function () {
                            autoScrollToCard(bottomMostCard_1.id);
                        }, 100); // Faster response for better UX
                    }
                }
            }
        }
        else {
            isExpanding.current = false;
        }
        setCanvasHeight(newHeight);
        setPreviousHeight(newHeight);
    }, [calculateCanvasHeight, previousHeight, cards, autoScrollToCard, enableAutoScroll, containerRef, isDragging]);
    // Function to manually update canvas height (useful for external triggers)
    var updateCanvasHeight = (0, react_1.useCallback)(function () {
        var newHeight = calculateCanvasHeight();
        setCanvasHeight(newHeight);
    }, [calculateCanvasHeight]);
    // Function to auto-scroll to a specific card (useful during drag operations)
    var scrollToCard = (0, react_1.useCallback)(function (cardId) {
        autoScrollToCard(cardId);
    }, [autoScrollToCard]);
    return {
        canvasHeight: canvasHeight,
        updateCanvasHeight: updateCanvasHeight,
        scrollToCard: scrollToCard
    };
};
exports.useCanvasHeight = useCanvasHeight;
