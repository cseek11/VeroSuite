"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCardFocusScroll = void 0;
var react_1 = require("react");
var useCardFocusScroll = function (_a) {
    var selectedCards = _a.selectedCards, containerRef = _a.containerRef, _b = _a.enableAutoScroll, enableAutoScroll = _b === void 0 ? true : _b, _c = _a.scrollDelay, scrollDelay = _c === void 0 ? 200 : _c;
    var lastSelectedCard = (0, react_1.useRef)(null);
    var scrollTimeoutRef = (0, react_1.useRef)(null);
    // Auto-scroll to selected card
    var scrollToSelectedCard = (0, react_1.useCallback)(function (cardId) {
        if (!enableAutoScroll || !containerRef.current)
            return;
        var cardElement = document.querySelector("[data-card-id=\"".concat(cardId, "\"]"));
        if (cardElement) {
            // Check if card is already in view
            var container = containerRef.current;
            var containerRect = container.getBoundingClientRect();
            var cardRect = cardElement.getBoundingClientRect();
            var isCardInView = cardRect.top >= containerRect.top - 50 &&
                cardRect.bottom <= containerRect.bottom + 50;
            // Only scroll if card is not in view
            if (!isCardInView) {
                cardElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }
        }
    }, [enableAutoScroll, containerRef]);
    // Handle selection changes
    (0, react_1.useEffect)(function () {
        if (selectedCards.size === 1) {
            var selectedCardId_1 = Array.from(selectedCards)[0];
            if (!selectedCardId_1)
                return;
            // Only scroll if it's a new selection (not the same card)
            if (selectedCardId_1 !== lastSelectedCard.current) {
                lastSelectedCard.current = selectedCardId_1;
                // Clear any existing timeout
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
                // Scroll to the selected card with delay
                scrollTimeoutRef.current = setTimeout(function () {
                    scrollToSelectedCard(selectedCardId_1);
                }, scrollDelay);
            }
        }
        else if (selectedCards.size === 0) {
            // Reset when no cards are selected
            lastSelectedCard.current = null;
        }
    }, [selectedCards, scrollToSelectedCard, scrollDelay]);
    // Cleanup timeout on unmount
    (0, react_1.useEffect)(function () {
        return function () {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);
    // Manual scroll function for external use
    var scrollToCard = (0, react_1.useCallback)(function (cardId) {
        scrollToSelectedCard(cardId);
    }, [scrollToSelectedCard]);
    return {
        scrollToCard: scrollToCard
    };
};
exports.useCardFocusScroll = useCardFocusScroll;
