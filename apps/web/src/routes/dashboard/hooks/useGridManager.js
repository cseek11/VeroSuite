"use strict";
/**
 * Grid management for minimized cards
 * Handles position allocation and tracking
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridManager = void 0;
var react_1 = require("react");
var cardConstants_1 = require("../utils/cardConstants");
var logger_1 = require("@/utils/logger");
var useGridManager = function () {
    var occupiedGridPositionsRef = (0, react_1.useRef)(new Map());
    var GRID = cardConstants_1.CARD_CONSTANTS.GRID, _MINIMIZED = cardConstants_1.CARD_CONSTANTS.MINIMIZED;
    /**
     * Find the next available grid position
     */
    var findNextAvailablePosition = (0, react_1.useCallback)(function () {
        var occupiedPositions = occupiedGridPositionsRef.current;
        var positions = Array.from(occupiedPositions.values());
        var _loop_1 = function (row) {
            var _loop_2 = function (col) {
                var isOccupied = positions.some(function (pos) { return pos.row === row && pos.col === col; });
                if (!isOccupied) {
                    return { value: { row: row, col: col } };
                }
            };
            for (var col = 0; col < GRID.CARDS_PER_ROW; col++) {
                var state_2 = _loop_2(col);
                if (typeof state_2 === "object")
                    return state_2;
            }
        };
        // Find first available position
        for (var row = 0; row < 100; row++) {
            var state_1 = _loop_1(row);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        logger_1.logger.warn('No available grid position found', { occupiedCount: occupiedPositions.size });
        return null;
    }, []);
    /**
     * Reserve a grid position for a card
     */
    var reservePosition = (0, react_1.useCallback)(function (cardId, row, col) {
        var occupiedPositions = occupiedGridPositionsRef.current;
        // Check if position is already taken
        var isTaken = Array.from(occupiedPositions.values()).some(function (pos) { return pos.row === row && pos.col === col; });
        if (isTaken) {
            logger_1.logger.warn('Position already taken', { cardId: cardId, row: row, col: col });
            return false;
        }
        occupiedPositions.set(cardId, { row: row, col: col });
        logger_1.logger.debug('Position reserved', { cardId: cardId, row: row, col: col, totalOccupied: occupiedPositions.size });
        return true;
    }, []);
    /**
     * Release a grid position
     */
    var releasePosition = (0, react_1.useCallback)(function (cardId) {
        var occupiedPositions = occupiedGridPositionsRef.current;
        var wasOccupied = occupiedPositions.delete(cardId);
        if (wasOccupied) {
            logger_1.logger.debug('Position released', { cardId: cardId, remainingOccupied: occupiedPositions.size });
        }
    }, []);
    /**
     * Get pixel coordinates for a grid position
     */
    var getPixelPosition = (0, react_1.useCallback)(function (row, col) {
        var x = GRID.START_X + (col * GRID.HORIZONTAL_SPACING);
        var y = GRID.START_Y + (row * GRID.VERTICAL_SPACING);
        return { x: x, y: y };
    }, []);
    /**
     * Check if a position is valid grid position
     */
    var isValidGridPosition = (0, react_1.useCallback)(function (x, y) {
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
    /**
     * Minimize a card to grid
     */
    var minimizeToGrid = (0, react_1.useCallback)(function (cardId) {
        var gridPos = findNextAvailablePosition();
        if (!gridPos) {
            return { position: null, gridPosition: null };
        }
        var pixelPos = getPixelPosition(gridPos.row, gridPos.col);
        var reserved = reservePosition(cardId, gridPos.row, gridPos.col);
        if (!reserved) {
            return { position: null, gridPosition: null };
        }
        return { position: pixelPos, gridPosition: gridPos };
    }, [findNextAvailablePosition, getPixelPosition, reservePosition]);
    return {
        occupiedGridPositionsRef: occupiedGridPositionsRef,
        findNextAvailablePosition: findNextAvailablePosition,
        reservePosition: reservePosition,
        releasePosition: releasePosition,
        getPixelPosition: getPixelPosition,
        isValidGridPosition: isValidGridPosition,
        minimizeToGrid: minimizeToGrid,
    };
};
exports.useGridManager = useGridManager;
