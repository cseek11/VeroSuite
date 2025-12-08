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
exports.useCardDragDrop = useCardDragDrop;
var react_1 = require("react");
// Throttle function for performance optimization
function throttle(func, delay) {
    var timeoutId = null;
    var lastExecTime = 0;
    return (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var currentTime = Date.now();
        if (currentTime - lastExecTime > delay) {
            func.apply(void 0, args);
            lastExecTime = currentTime;
        }
        else {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function () {
                func.apply(void 0, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    });
}
function useCardDragDrop(_a) {
    var onUpdatePosition = _a.onUpdatePosition, onUpdateMultiplePositions = _a.onUpdateMultiplePositions, cards = _a.cards, selectedCards = _a.selectedCards, isCardLocked = _a.isCardLocked, getCardGroup = _a.getCardGroup, onDragEnd = _a.onDragEnd, _b = _a.zoom, zoom = _b === void 0 ? 1 : _b, _c = _a.canvasHeight, canvasHeight = _c === void 0 ? 600 : _c, onAutoScroll = _a.onAutoScroll, onStopAutoScroll = _a.onStopAutoScroll;
    var _d = (0, react_1.useState)(null), draggingCard = _d[0], setDraggingCard = _d[1];
    var _e = (0, react_1.useState)(null), dragStartPosition = _e[0], setDragStartPosition = _e[1];
    var _f = (0, react_1.useState)({ x: 0, y: 0 }), dragOffset = _f[0], setDragOffset = _f[1];
    var _g = (0, react_1.useState)({ x: 0, y: 0 }), initialCardPosition = _g[0], setInitialCardPosition = _g[1];
    var _h = (0, react_1.useState)({}), initialMultiCardPositions = _h[0], setInitialMultiCardPositions = _h[1];
    var _j = (0, react_1.useState)(false), isDraggingMultiple = _j[0], setIsDraggingMultiple = _j[1];
    var animationFrameRef = (0, react_1.useRef)(null);
    // Start dragging
    var handleDragStart = (0, react_1.useCallback)(function (cardId, e) {
        // Check if card is locked
        if (isCardLocked && isCardLocked(cardId)) {
            return; // Don't allow dragging locked cards
        }
        // Check if card is in a locked group
        if (getCardGroup) {
            var cardGroup = getCardGroup(cardId);
            if (cardGroup && cardGroup.locked) {
                return; // Don't allow dragging cards in locked groups
            }
        }
        // Only allow dragging from the card header area (top ~60px of the card)
        var cardElement = e.currentTarget;
        var cardRect = cardElement.getBoundingClientRect();
        var clickY = e.clientY - cardRect.top;
        var headerHeight = 60; // Height of the header area
        if (clickY > headerHeight) {
            return; // Click is below the header area, don't start dragging
        }
        e.preventDefault();
        e.stopPropagation();
        // Calculate offset from where user clicked on the card
        var clickOffsetX = e.clientX - cardRect.left;
        var clickOffsetY = e.clientY - cardRect.top;
        var card = cards[cardId];
        if (!card)
            return;
        // Check if dragging multiple cards
        var isMultiDrag = selectedCards.has(cardId) && selectedCards.size > 1;
        setDraggingCard(cardId);
        setDragStartPosition({ x: e.clientX, y: e.clientY });
        setIsDraggingMultiple(isMultiDrag);
        if (isMultiDrag) {
            // Store initial positions for all selected cards (excluding locked ones)
            var multiPositions_1 = {};
            selectedCards.forEach(function (selectedCardId) {
                var selectedCard = cards[selectedCardId];
                if (selectedCard && (!isCardLocked || !isCardLocked(selectedCardId))) {
                    multiPositions_1[selectedCardId] = { x: selectedCard.x, y: selectedCard.y };
                }
            });
            setInitialMultiCardPositions(multiPositions_1);
        }
        else {
            setInitialCardPosition({ x: card.x, y: card.y });
        }
        // Store the click offset for accurate dragging
        setDragOffset({ x: clickOffsetX, y: clickOffsetY });
        // Add dragging styles with hardware acceleration
        cardElement.style.cursor = 'grabbing';
        cardElement.style.zIndex = '9999';
        cardElement.style.transition = 'none';
        cardElement.style.willChange = 'transform';
        // Set global styles
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
        // Immediately change header cursor to grabbing
        var headerElement = cardElement.querySelector('.card-header');
        if (headerElement) {
            headerElement.style.cursor = 'grabbing';
        }
    }, [cards, selectedCards, isCardLocked, getCardGroup]);
    // Calculate alignment guides for snap-to-align functionality
    var calculateAlignmentGuides = (0, react_1.useCallback)(function (draggedCardId, position, size) {
        var snapDistance = 10;
        var draggedCard = {
            left: position.x,
            right: position.x + size.width,
            top: position.y,
            bottom: position.y + size.height,
            centerX: position.x + size.width / 2,
            centerY: position.y + size.height / 2
        };
        var guides = [];
        Object.keys(cards).forEach(function (cardId) {
            if (cardId === draggedCardId)
                return;
            var card = cards[cardId];
            if (!card)
                return;
            var cardBounds = {
                left: card.x,
                right: card.x + card.width,
                top: card.y,
                bottom: card.y + card.height,
                centerX: card.x + card.width / 2,
                centerY: card.y + card.height / 2
            };
            // Horizontal alignment guides
            if (Math.abs(draggedCard.left - cardBounds.left) < snapDistance)
                guides.push({ x: cardBounds.left });
            if (Math.abs(draggedCard.right - cardBounds.right) < snapDistance)
                guides.push({ x: cardBounds.right });
            if (Math.abs(draggedCard.centerX - cardBounds.centerX) < snapDistance)
                guides.push({ x: cardBounds.centerX });
            // Vertical alignment guides
            if (Math.abs(draggedCard.top - cardBounds.top) < snapDistance)
                guides.push({ y: cardBounds.top });
            if (Math.abs(draggedCard.bottom - cardBounds.bottom) < snapDistance)
                guides.push({ y: cardBounds.bottom });
            if (Math.abs(draggedCard.centerY - cardBounds.centerY) < snapDistance)
                guides.push({ y: cardBounds.centerY });
        });
        return guides;
    }, [cards]);
    // Apply snap and alignment
    var applySnapAndAlignment = (0, react_1.useCallback)(function (position, draggedCardId, size) {
        var guides = calculateAlignmentGuides(draggedCardId, position, size);
        var snappedPosition = __assign({}, position);
        var snapDistance = 10;
        guides.forEach(function (guide) {
            if (guide.x !== undefined) {
                var draggedCard = {
                    left: position.x,
                    right: position.x + size.width,
                    centerX: position.x + size.width / 2
                };
                if (Math.abs(draggedCard.left - guide.x) < snapDistance) {
                    snappedPosition.x = guide.x;
                }
                else if (Math.abs(draggedCard.right - guide.x) < snapDistance) {
                    snappedPosition.x = guide.x - size.width;
                }
                else if (Math.abs(draggedCard.centerX - guide.x) < snapDistance) {
                    snappedPosition.x = guide.x - size.width / 2;
                }
            }
            if (guide.y !== undefined) {
                var draggedCard = {
                    top: position.y,
                    bottom: position.y + size.height,
                    centerY: position.y + size.height / 2
                };
                if (Math.abs(draggedCard.top - guide.y) < snapDistance) {
                    snappedPosition.y = guide.y;
                }
                else if (Math.abs(draggedCard.bottom - guide.y) < snapDistance) {
                    snappedPosition.y = guide.y - size.height;
                }
                else if (Math.abs(draggedCard.centerY - guide.y) < snapDistance) {
                    snappedPosition.y = guide.y - size.height / 2;
                }
            }
        });
        return snappedPosition;
    }, [calculateAlignmentGuides]);
    // Handle card drag move with perfect cursor tracking and throttling
    var handleCardDragMoveCore = (0, react_1.useCallback)(function (e) {
        if (!draggingCard || !dragStartPosition)
            return;
        // Get canvas bounds for boundary calculations
        var canvas = document.querySelector('.dashboard-canvas');
        if (!canvas)
            return;
        var canvasRect = canvas.getBoundingClientRect();
        // Calculate mouse position relative to canvas, accounting for zoom and pan
        var mouseX = (e.clientX - canvasRect.left) / zoom;
        var mouseY = (e.clientY - canvasRect.top) / zoom;
        // Trigger auto-scroll if enabled (use screen Y coordinate for edge detection)
        if (onAutoScroll) {
            onAutoScroll(draggingCard, e.clientY);
        }
        if (isDraggingMultiple) {
            // Handle multiple card dragging
            var updates_1 = [];
            Object.keys(initialMultiCardPositions).forEach(function (cardId) {
                var card = cards[cardId];
                var initialPos = initialMultiCardPositions[cardId];
                if (!card || !initialPos)
                    return;
                // Calculate the offset from where the user initially clicked on this card
                var cardOffset = cardId === draggingCard ? dragOffset : { x: 0, y: 0 };
                // Perfect cursor tracking: position card so the clicked point follows the mouse
                var rawPosition = {
                    x: mouseX - cardOffset.x,
                    y: mouseY - cardOffset.y
                };
                // Calculate dynamic canvas height based on current card positions
                // This allows the canvas to shrink naturally as cards move up
                var CANVAS_MIN_HEIGHT = 600;
                var CANVAS_PADDING = 20;
                var CANVAS_AUTO_EXPAND = 30;
                var allCardBottoms = Object.values(cards).map(function (c) {
                    if (c.id === cardId) {
                        // Use the new position for the card being dragged
                        return rawPosition.y + c.height;
                    }
                    return c.y + c.height;
                });
                var dynamicCanvasHeight = Math.max(Math.max.apply(Math, __spreadArray(__spreadArray([], allCardBottoms, false), [0], false)) + CANVAS_PADDING + CANVAS_AUTO_EXPAND, canvasRect.height / zoom, // Don't shrink below viewport
                CANVAS_MIN_HEIGHT // Minimum height
                );
                // Fast boundary constraints with group support
                var effectiveCanvasWidth = canvasRect.width / zoom;
                // Use dynamic height but allow upward movement (don't constrain to bottom too strictly)
                var effectiveCanvasHeight = Math.max(dynamicCanvasHeight, canvasRect.height / zoom);
                var minX = 8;
                var minY = 8;
                var maxX = effectiveCanvasWidth - card.width - 16;
                // Allow upward movement: only constrain bottom if card is moving down or at bottom
                // If moving up, allow it to move freely (canvas will shrink to follow)
                var isMovingUp = rawPosition.y < initialPos.y;
                var maxY = isMovingUp
                    ? Infinity // Allow free upward movement
                    : effectiveCanvasHeight - card.height - 8; // Constrain downward movement
                // Check if card is in a group and constrain to group boundaries
                // BUT preserve upward movement freedom - don't constrain if moving up
                if (getCardGroup && !isMovingUp) {
                    var cardGroup = getCardGroup(cardId);
                    if (cardGroup && !cardGroup.locked) {
                        // Only apply group constraints if the card is actually in a group
                        minX = Math.max(minX, cardGroup.x + 5);
                        minY = Math.max(minY, cardGroup.y + 5);
                        maxX = Math.min(maxX, cardGroup.x + cardGroup.width - card.width - 5);
                        // Only apply group maxY if it's more restrictive than current maxY
                        var groupMaxY = cardGroup.y + cardGroup.height - card.height - 5;
                        if (maxY !== Infinity && groupMaxY < maxY) {
                            maxY = groupMaxY;
                        }
                    }
                    // If cardGroup is null/undefined, card is not in a group - only canvas constraints apply
                }
                var constrainedX = Math.max(minX, Math.min(maxX, rawPosition.x));
                // Handle Infinity properly - if maxY is Infinity, just use rawPosition.y (clamped to minY)
                var constrainedY = maxY === Infinity
                    ? Math.max(minY, rawPosition.y)
                    : Math.max(minY, Math.min(maxY, rawPosition.y));
                updates_1.push({ cardId: cardId, x: constrainedX, y: constrainedY });
            });
            // Direct update for responsive tracking - RAF was causing flashing
            onUpdateMultiplePositions(updates_1);
        }
        else {
            // Handle single card dragging with perfect cursor tracking
            var card = cards[draggingCard];
            if (!card)
                return;
            // Perfect cursor tracking: position card so the clicked point follows the mouse exactly
            var rawPosition_1 = {
                x: mouseX - dragOffset.x,
                y: mouseY - dragOffset.y
            };
            // Calculate dynamic canvas height based on current card positions
            // This allows the canvas to shrink naturally as cards move up
            var allCardBottoms = Object.values(cards).map(function (c) {
                if (c.id === draggingCard) {
                    // Use the new position for the card being dragged
                    return rawPosition_1.y + c.height;
                }
                return c.y + c.height;
            });
            var dynamicCanvasHeight = Math.max(Math.max.apply(Math, __spreadArray(__spreadArray([], allCardBottoms, false), [0], false)) + 50, // Add padding
            canvasRect.height / zoom, // Don't shrink below viewport
            600 // Minimum height
            );
            // Fast boundary constraints with group support
            var effectiveCanvasWidth = canvasRect.width / zoom;
            // Use dynamic height but allow upward movement (don't constrain to bottom too strictly)
            var effectiveCanvasHeight = Math.max(dynamicCanvasHeight, canvasRect.height / zoom);
            var minX = 8;
            var minY = 8;
            var maxX = effectiveCanvasWidth - card.width - 16;
            // Allow upward movement: only constrain bottom if card is moving down or at bottom
            // If moving up, allow it to move freely (canvas will shrink to follow)
            var isMovingUp = rawPosition_1.y < card.y;
            var maxY = isMovingUp
                ? Infinity // Allow free upward movement
                : effectiveCanvasHeight - card.height - 8; // Constrain downward movement
            // Check if card is in a group and constrain to group boundaries
            // BUT preserve upward movement freedom - don't constrain if moving up
            if (getCardGroup && !isMovingUp) {
                var cardGroup = getCardGroup(draggingCard);
                if (cardGroup && !cardGroup.locked) {
                    // Only apply group constraints if the card is actually in a group
                    minX = Math.max(minX, cardGroup.x + 5);
                    minY = Math.max(minY, cardGroup.y + 5);
                    maxX = Math.min(maxX, cardGroup.x + cardGroup.width - card.width - 5);
                    // Only apply group maxY if it's more restrictive than current maxY
                    var groupMaxY = cardGroup.y + cardGroup.height - card.height - 5;
                    if (maxY !== Infinity && groupMaxY < maxY) {
                        maxY = groupMaxY;
                    }
                }
                // If cardGroup is null/undefined, card is not in a group - only canvas constraints apply
            }
            var constrainedX = Math.max(minX, Math.min(maxX, rawPosition_1.x));
            // Handle Infinity properly - if maxY is Infinity, just use rawPosition.y (clamped to minY)
            var constrainedY = maxY === Infinity
                ? Math.max(minY, rawPosition_1.y)
                : Math.max(minY, Math.min(maxY, rawPosition_1.y));
            // Direct update for responsive tracking - RAF was causing flashing
            onUpdatePosition(draggingCard, constrainedX, constrainedY);
        }
    }, [draggingCard, dragStartPosition, initialCardPosition, initialMultiCardPositions, isDraggingMultiple, cards, onUpdatePosition, onUpdateMultiplePositions, applySnapAndAlignment, zoom, canvasHeight, dragOffset, getCardGroup]);
    // Throttled drag move handler for better performance
    var handleCardDragMove = (0, react_1.useCallback)(throttle(handleCardDragMoveCore, 4), // 4ms throttle for ~240fps - smoother movement
    [handleCardDragMoveCore]);
    // Handle card drag end
    var handleCardDragEnd = (0, react_1.useCallback)(function () {
        if (draggingCard) {
            // Stop auto-scroll when drag ends
            if (onStopAutoScroll) {
                onStopAutoScroll();
            }
            // Reset all dragging styles
            var cardElement = document.querySelector("[data-card-id=\"".concat(draggingCard, "\"]"));
            if (cardElement) {
                cardElement.style.cursor = '';
                cardElement.style.zIndex = '';
                cardElement.style.transition = '';
                cardElement.style.willChange = '';
            }
            // Reset global styles
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            // Cancel any pending animation frame
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            // Reset dragging state
            setDraggingCard(null);
            setDragStartPosition(null);
            setDragOffset({ x: 0, y: 0 });
            setInitialCardPosition({ x: 0, y: 0 });
            setInitialMultiCardPositions({});
            setIsDraggingMultiple(false);
            // Save to history after drag ends (meaningful action)
            if (onDragEnd) {
                onDragEnd();
            }
        }
    }, [draggingCard, onDragEnd]);
    // Add global drag event listeners
    (0, react_1.useEffect)(function () {
        if (draggingCard) {
            document.addEventListener('mousemove', handleCardDragMove);
            document.addEventListener('mouseup', handleCardDragEnd);
            return function () {
                document.removeEventListener('mousemove', handleCardDragMove);
                document.removeEventListener('mouseup', handleCardDragEnd);
            };
        }
        return undefined; // Explicit return for when draggingCard is falsy
    }, [draggingCard, handleCardDragMove, handleCardDragEnd]);
    return {
        dragState: {
            isDragging: !!draggingCard,
            draggedCardId: draggingCard,
            dragOffset: dragOffset,
            startPosition: dragStartPosition || { x: 0, y: 0 }
        },
        handleDragStart: handleDragStart,
        isDragging: !!draggingCard,
        draggedCardId: draggingCard,
        isDraggingMultiple: isDraggingMultiple
    };
}
