"use strict";
/**
 * Extracted card initialization logic
 * Handles grid positioning and initial card setup
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCardInitialization = void 0;
var react_1 = require("react");
var cardConstants_1 = require("../utils/cardConstants");
var logger_1 = require("@/utils/logger");
// Import cardsPerRow from constants
var cardsPerRow = cardConstants_1.CARD_CONSTANTS.GRID.CARDS_PER_ROW;
var useCardInitialization = function (_a) {
    var isLoadingLayout = _a.isLoadingLayout, cards = _a.cards, localUpdateCardSize = _a.localUpdateCardSize, localUpdateCardPosition = _a.localUpdateCardPosition, serverUpdateCardSize = _a.serverUpdateCardSize, serverUpdateCardPosition = _a.serverUpdateCardPosition;
    var occupiedGridPositionsRef = (0, react_1.useRef)(new Map());
    var hasInitialized = (0, react_1.useRef)(false);
    // Helper to check if a position is a valid grid position
    var isValidGridPosition = (0, react_1.useCallback)(function (x, y) {
        var GRID = cardConstants_1.CARD_CONSTANTS.GRID;
        var col = Math.round((x - GRID.START_X) / GRID.HORIZONTAL_SPACING);
        var row = Math.round((y - GRID.START_Y) / GRID.VERTICAL_SPACING);
        var expectedX = GRID.START_X + (col * GRID.HORIZONTAL_SPACING);
        var expectedY = GRID.START_Y + (row * GRID.VERTICAL_SPACING);
        if (Math.abs(x - expectedX) < GRID.TOLERANCE &&
            Math.abs(y - expectedY) < GRID.TOLERANCE &&
            col >= 0 &&
            row >= 0) {
            return { row: row, col: col };
        }
        return null;
    }, []);
    // Initialize grid positions for minimized cards
    (0, react_1.useEffect)(function () {
        if (hasInitialized.current)
            return;
        if (isLoadingLayout || Object.keys(cards).length === 0) {
            return;
        }
        // Small delay to ensure all cards are fully loaded
        var timeoutId = setTimeout(function () {
            if (hasInitialized.current)
                return;
            hasInitialized.current = true;
            logger_1.logger.debug('Initializing grid from existing cards', { cardCount: Object.keys(cards).length });
            var allCards = Object.values(cards);
            var occupiedPositions = occupiedGridPositionsRef.current;
            var GRID = cardConstants_1.CARD_CONSTANTS.GRID, MINIMIZED = cardConstants_1.CARD_CONSTANTS.MINIMIZED;
            // Collect all minimized cards
            var minimizedCards = allCards.filter(function (card) {
                return card.width <= MINIMIZED.WIDTH && card.height <= MINIMIZED.HEIGHT;
            });
            logger_1.logger.debug('Found minimized cards', { count: minimizedCards.length });
            // Sort by card ID for consistent order across refreshes
            minimizedCards.sort(function (a, b) { return a.id.localeCompare(b.id); });
            // Reassign ALL minimized cards to sequential grid positions
            minimizedCards.forEach(function (card, index) {
                var targetRow = Math.floor(index / cardsPerRow);
                var targetCol = index % cardsPerRow;
                var targetX = GRID.START_X + (targetCol * GRID.HORIZONTAL_SPACING);
                var targetY = GRID.START_Y + (targetRow * GRID.VERTICAL_SPACING);
                // Check if card is already in correct position
                var isCorrectSize = Math.abs(card.width - MINIMIZED.WIDTH) < GRID.TOLERANCE &&
                    Math.abs(card.height - MINIMIZED.HEIGHT) < GRID.TOLERANCE;
                var isCorrectPosition = Math.abs(card.x - targetX) < GRID.TOLERANCE &&
                    Math.abs(card.y - targetY) < GRID.TOLERANCE;
                // Check if card is in ANY valid grid position
                var currentGridPos = isValidGridPosition(card.x, card.y);
                var isInValidGridPos = currentGridPos !== null;
                if (isCorrectSize && isCorrectPosition) {
                    logger_1.logger.debug('Card already in correct position', { cardId: card.id, row: targetRow, col: targetCol });
                    occupiedPositions.set(card.id, { row: targetRow, col: targetCol });
                    return;
                }
                // If card is in a valid grid position but wrong one, check if that position is already taken
                if (isCorrectSize && isInValidGridPos && currentGridPos) {
                    var isPositionTaken = Array.from(occupiedPositions.values()).some(function (pos) { return pos.row === currentGridPos.row && pos.col === currentGridPos.col; });
                    if (!isPositionTaken) {
                        logger_1.logger.debug('Card in valid grid position, keeping it', {
                            cardId: card.id,
                            row: currentGridPos.row,
                            col: currentGridPos.col
                        });
                        occupiedPositions.set(card.id, currentGridPos);
                        return;
                    }
                }
                logger_1.logger.debug('Repositioning card', {
                    cardId: card.id,
                    from: { x: card.x, y: card.y, width: card.width, height: card.height },
                    to: { x: targetX, y: targetY, width: MINIMIZED.WIDTH, height: MINIMIZED.HEIGHT },
                    grid: { row: targetRow, col: targetCol }
                });
                // Update local state
                localUpdateCardSize(card.id, MINIMIZED.WIDTH, MINIMIZED.HEIGHT);
                localUpdateCardPosition(card.id, targetX, targetY);
                // Persist to server
                serverUpdateCardSize(card.id, MINIMIZED.WIDTH, MINIMIZED.HEIGHT, { x: targetX, y: targetY });
                serverUpdateCardPosition(card.id, targetX, targetY);
                // Add to Map
                occupiedPositions.set(card.id, { row: targetRow, col: targetCol });
            });
            logger_1.logger.info('Grid initialized', {
                minimizedCards: occupiedPositions.size,
                totalCards: allCards.length
            });
        }, 100);
        return function () { return clearTimeout(timeoutId); };
    }, [
        isLoadingLayout,
        cards,
        localUpdateCardSize,
        localUpdateCardPosition,
        serverUpdateCardSize,
        serverUpdateCardPosition,
        isValidGridPosition,
    ]);
    return {
        occupiedGridPositionsRef: occupiedGridPositionsRef,
        isValidGridPosition: isValidGridPosition,
    };
};
exports.useCardInitialization = useCardInitialization;
