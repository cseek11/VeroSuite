"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKeyboardNavigation = useKeyboardNavigation;
var react_1 = require("react");
function useKeyboardNavigation(_a) {
    var cards = _a.cards, selectedCards = _a.selectedCards, onSelectCard = _a.onSelectCard, onDeselectAll = _a.onDeselectAll, onFocusCard = _a.onFocusCard, onActivateCard = _a.onActivateCard, onMoveCard = _a.onMoveCard, onResizeCard = _a.onResizeCard, _b = _a.gridSize, gridSize = _b === void 0 ? 20 : _b, _c = _a.enableScreenReader, enableScreenReader = _c === void 0 ? true : _c;
    var _d = (0, react_1.useState)(null), focusedCardId = _d[0], setFocusedCardId = _d[1];
    var _e = (0, react_1.useState)('select'), navigationMode = _e[0], setNavigationMode = _e[1];
    var _f = (0, react_1.useState)(false), isNavigating = _f[0], setIsNavigating = _f[1];
    var navigationTimeoutRef = (0, react_1.useRef)(null);
    // Convert cards to navigation-friendly format
    var navigationCards = Object.entries(cards || {}).map(function (_a) {
        var id = _a[0], card = _a[1];
        return ({
            id: id,
            x: card.x,
            y: card.y,
            width: card.width,
            height: card.height,
            type: card.type,
            element: document.querySelector("[data-card-id=\"".concat(id, "\"]"))
        });
    });
    // Sort cards by position for navigation order
    var sortedCards = navigationCards.sort(function (a, b) {
        // Sort by row first (y position), then by column (x position)
        var rowDiff = Math.floor(a.y / 100) - Math.floor(b.y / 100);
        if (rowDiff !== 0)
            return rowDiff;
        return a.x - b.x;
    });
    // Find the currently focused card index
    var focusedIndex = focusedCardId ? sortedCards.findIndex(function (card) { return card.id === focusedCardId; }) : -1;
    // Navigation helper functions
    var findNearestCard = (0, react_1.useCallback)(function (direction, fromCard) {
        var referenceCard = fromCard || (focusedCardId ? navigationCards.find(function (c) { return c.id === focusedCardId; }) : null);
        if (!referenceCard)
            return null;
        var threshold = 50; // Minimum distance to consider for navigation
        var nearestCard = null;
        var minDistance = Infinity;
        navigationCards.forEach(function (card) {
            if (card.id === referenceCard.id)
                return;
            var shouldConsider = false;
            var distance = 0;
            switch (direction) {
                case 'up':
                    shouldConsider = card.y < referenceCard.y - threshold;
                    distance = Math.abs(card.x - referenceCard.x) + (referenceCard.y - card.y);
                    break;
                case 'down':
                    shouldConsider = card.y > referenceCard.y + referenceCard.height + threshold;
                    distance = Math.abs(card.x - referenceCard.x) + (card.y - (referenceCard.y + referenceCard.height));
                    break;
                case 'left':
                    shouldConsider = card.x < referenceCard.x - threshold;
                    distance = Math.abs(card.y - referenceCard.y) + (referenceCard.x - card.x);
                    break;
                case 'right':
                    shouldConsider = card.x > referenceCard.x + referenceCard.width + threshold;
                    distance = Math.abs(card.y - referenceCard.y) + (card.x - (referenceCard.x + referenceCard.width));
                    break;
            }
            if (shouldConsider && distance < minDistance) {
                minDistance = distance;
                nearestCard = card;
            }
        });
        return nearestCard;
    }, [navigationCards, focusedCardId]);
    // Navigation actions
    var navigateToCard = (0, react_1.useCallback)(function (cardId, addToSelection) {
        if (addToSelection === void 0) { addToSelection = false; }
        setFocusedCardId(cardId);
        onFocusCard(cardId);
        if (addToSelection) {
            onSelectCard(cardId, true);
        }
        else {
            onSelectCard(cardId, false);
        }
        // Scroll card into view
        var cardElement = document.querySelector("[data-card-id=\"".concat(cardId, "\"]"));
        if (cardElement) {
            cardElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
        // Set focus for screen readers
        if (enableScreenReader) {
            cardElement === null || cardElement === void 0 ? void 0 : cardElement.setAttribute('tabindex', '0');
            cardElement === null || cardElement === void 0 ? void 0 : cardElement.focus();
        }
    }, [onFocusCard, onSelectCard, enableScreenReader]);
    var navigateInDirection = (0, react_1.useCallback)(function (direction) {
        var nearestCard = findNearestCard(direction);
        if (nearestCard && nearestCard.id) {
            navigateToCard(nearestCard.id);
        }
    }, [findNearestCard, navigateToCard]);
    var navigateSequentially = (0, react_1.useCallback)(function (direction) {
        if (sortedCards.length === 0)
            return;
        var newIndex;
        if (focusedIndex === -1) {
            newIndex = direction === 'next' ? 0 : sortedCards.length - 1;
        }
        else {
            newIndex = direction === 'next'
                ? (focusedIndex + 1) % sortedCards.length
                : (focusedIndex - 1 + sortedCards.length) % sortedCards.length;
        }
        var targetCard = sortedCards[newIndex];
        if (targetCard) {
            navigateToCard(targetCard.id);
        }
    }, [sortedCards, focusedIndex, navigateToCard]);
    // Move card with arrow keys
    var moveCard = (0, react_1.useCallback)(function (direction) {
        if (!focusedCardId || !onMoveCard)
            return;
        var delta = gridSize;
        var deltaX = 0;
        var deltaY = 0;
        switch (direction) {
            case 'up':
                deltaY = -delta;
                break;
            case 'down':
                deltaY = delta;
                break;
            case 'left':
                deltaX = -delta;
                break;
            case 'right':
                deltaX = delta;
                break;
        }
        onMoveCard(focusedCardId, deltaX, deltaY);
    }, [focusedCardId, onMoveCard, gridSize]);
    // Resize card with arrow keys
    var resizeCard = (0, react_1.useCallback)(function (direction) {
        if (!focusedCardId || !onResizeCard)
            return;
        var delta = gridSize;
        var deltaWidth = 0;
        var deltaHeight = 0;
        switch (direction) {
            case 'up':
                deltaHeight = -delta;
                break;
            case 'down':
                deltaHeight = delta;
                break;
            case 'left':
                deltaWidth = -delta;
                break;
            case 'right':
                deltaWidth = delta;
                break;
        }
        onResizeCard(focusedCardId, deltaWidth, deltaHeight);
    }, [focusedCardId, onResizeCard, gridSize]);
    // Handle keyboard events
    var handleKeyDown = (0, react_1.useCallback)(function (e) {
        // Don't trigger navigation when typing in input fields
        var target = e.target;
        var isInputField = target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.contentEditable === 'true' ||
            target.closest('[contenteditable="true"]');
        if (isInputField)
            return;
        // Clear any existing timeout
        if (navigationTimeoutRef.current) {
            clearTimeout(navigationTimeoutRef.current);
        }
        setIsNavigating(true);
        // Set timeout to reset navigation state
        navigationTimeoutRef.current = setTimeout(function () {
            setIsNavigating(false);
        }, 150);
        // Mode switching
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            setNavigationMode('select');
            navigateSequentially('next');
            return;
        }
        if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            setNavigationMode('select');
            navigateSequentially('prev');
            return;
        }
        // WASD navigation (replacing arrow keys)
        if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase()) && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            // Map WASD to directions
            var keyToDirection = {
                'w': 'up',
                's': 'down',
                'a': 'left',
                'd': 'right'
            };
            var direction = keyToDirection[e.key.toLowerCase()];
            if (!direction)
                return;
            // Hold Shift for multi-selection
            var addToSelection = e.shiftKey;
            // Default: navigate between cards
            setNavigationMode('select');
            navigateInDirection(direction);
            if (addToSelection && focusedCardId) {
                onSelectCard(focusedCardId, true);
            }
            return;
        }
        // Ctrl+Shift+WASD for card movement
        if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase()) && e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            var keyToDirection = {
                'w': 'up',
                's': 'down',
                'a': 'left',
                'd': 'right'
            };
            var direction = keyToDirection[e.key.toLowerCase()];
            if (!direction)
                return;
            setNavigationMode('move');
            moveCard(direction);
            return;
        }
        // Alt+WASD for card resizing
        if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase()) && e.altKey && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            var keyToDirection = {
                'w': 'up',
                's': 'down',
                'a': 'left',
                'd': 'right'
            };
            var direction = keyToDirection[e.key.toLowerCase()];
            if (!direction)
                return;
            setNavigationMode('resize');
            resizeCard(direction);
            return;
        }
        // Space/Enter for activation
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (focusedCardId) {
                onActivateCard(focusedCardId);
            }
            return;
        }
        // Escape to deselect and exit navigation
        if (e.key === 'Escape') {
            e.preventDefault();
            setFocusedCardId(null);
            onDeselectAll();
            setNavigationMode('select');
            // Remove focus from any focused card
            document.querySelectorAll('[data-card-id]').forEach(function (card) {
                card.removeAttribute('tabindex');
            });
            return;
        }
        // Home/End for first/last card
        if (e.key === 'Home') {
            e.preventDefault();
            if (sortedCards.length > 0) {
                var firstCard = sortedCards[0];
                if (firstCard) {
                    navigateToCard(firstCard.id);
                }
            }
            return;
        }
        if (e.key === 'End') {
            e.preventDefault();
            if (sortedCards.length > 0) {
                var lastCard = sortedCards[sortedCards.length - 1];
                if (lastCard) {
                    navigateToCard(lastCard.id);
                }
            }
            return;
        }
    }, [
        navigateSequentially,
        navigateInDirection,
        moveCard,
        resizeCard,
        focusedCardId,
        onSelectCard,
        onActivateCard,
        onDeselectAll,
        sortedCards,
        navigateToCard
    ]);
    // Set up keyboard event listeners
    (0, react_1.useEffect)(function () {
        document.addEventListener('keydown', handleKeyDown);
        return function () {
            document.removeEventListener('keydown', handleKeyDown);
            if (navigationTimeoutRef.current) {
                clearTimeout(navigationTimeoutRef.current);
            }
        };
    }, [handleKeyDown]);
    // Cleanup on unmount
    (0, react_1.useEffect)(function () {
        return function () {
            if (navigationTimeoutRef.current) {
                clearTimeout(navigationTimeoutRef.current);
            }
        };
    }, []);
    // Screen reader announcements
    (0, react_1.useEffect)(function () {
        if (enableScreenReader && focusedCardId) {
            var card = navigationCards.find(function (c) { return c.id === focusedCardId; });
            if (card) {
                var announcement = "Focused on ".concat(card.type, " card, ").concat(selectedCards.has(focusedCardId) ? 'selected' : 'not selected');
                // Create or update live region for screen reader announcements
                var liveRegion = document.getElementById('keyboard-navigation-announcements');
                if (!liveRegion) {
                    liveRegion = document.createElement('div');
                    liveRegion.id = 'keyboard-navigation-announcements';
                    liveRegion.setAttribute('aria-live', 'polite');
                    liveRegion.setAttribute('aria-atomic', 'true');
                    liveRegion.style.position = 'absolute';
                    liveRegion.style.left = '-10000px';
                    liveRegion.style.width = '1px';
                    liveRegion.style.height = '1px';
                    liveRegion.style.overflow = 'hidden';
                    document.body.appendChild(liveRegion);
                }
                liveRegion.textContent = announcement;
            }
        }
    }, [focusedCardId, enableScreenReader, navigationCards, selectedCards]);
    return {
        focusedCardId: focusedCardId,
        navigationMode: navigationMode,
        isNavigating: isNavigating,
        navigateToCard: navigateToCard,
        navigateInDirection: navigateInDirection,
        navigateSequentially: navigateSequentially,
        moveCard: moveCard,
        resizeCard: resizeCard,
        setFocusedCardId: setFocusedCardId,
        setNavigationMode: setNavigationMode
    };
}
