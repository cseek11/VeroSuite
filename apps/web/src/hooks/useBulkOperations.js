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
exports.useBulkOperations = useBulkOperations;
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
function useBulkOperations(_a) {
    var cards = _a.cards, selectedCards = _a.selectedCards, onDeleteCards = _a.onDeleteCards, onGroupCards = _a.onGroupCards, onUngroupCards = _a.onUngroupCards, onMoveCards = _a.onMoveCards, onResizeCards = _a.onResizeCards, onLockCards = _a.onLockCards, onUnlockCards = _a.onUnlockCards, onDuplicateCards = _a.onDuplicateCards, onUpdateCardPosition = _a.onUpdateCardPosition, onUpdateCardSize = _a.onUpdateCardSize, _b = _a.maxHistorySize, maxHistorySize = _b === void 0 ? 50 : _b;
    var _c = (0, react_1.useState)([]), operationHistory = _c[0], setOperationHistory = _c[1];
    var _d = (0, react_1.useState)(false), isBulkMode = _d[0], setIsBulkMode = _d[1];
    var _e = (0, react_1.useState)({
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        isActive: false
    }), selectionBox = _e[0], setSelectionBox = _e[1];
    // Add operation to history
    var addToHistory = (0, react_1.useCallback)(function (operation) {
        setOperationHistory(function (prev) {
            var newHistory = __spreadArray([operation], prev, true).slice(0, maxHistorySize);
            return newHistory;
        });
    }, [maxHistorySize]);
    // Bulk delete cards
    var bulkDelete = (0, react_1.useCallback)(function (cardIds) {
        var targetCards = cardIds || Array.from(selectedCards);
        if (targetCards.length === 0)
            return;
        var operation = {
            id: "delete-".concat(Date.now()),
            type: 'delete',
            cardIds: targetCards,
            timestamp: new Date()
        };
        onDeleteCards(targetCards);
        addToHistory(operation);
    }, [selectedCards, onDeleteCards, addToHistory]);
    // Bulk group cards
    var bulkGroup = (0, react_1.useCallback)(function (cardIds, groupName) {
        var targetCards = cardIds || Array.from(selectedCards);
        if (targetCards.length < 2)
            return;
        var operation = {
            id: "group-".concat(Date.now()),
            type: 'group',
            cardIds: targetCards,
            data: { groupName: groupName || "Group ".concat(Date.now()) },
            timestamp: new Date()
        };
        onGroupCards(targetCards, groupName);
        addToHistory(operation);
    }, [selectedCards, onGroupCards, addToHistory]);
    // Bulk ungroup cards
    var bulkUngroup = (0, react_1.useCallback)(function (cardIds) {
        var targetCards = cardIds || Array.from(selectedCards);
        if (targetCards.length === 0)
            return;
        var operation = {
            id: "ungroup-".concat(Date.now()),
            type: 'group',
            cardIds: targetCards,
            data: { action: 'ungroup' },
            timestamp: new Date()
        };
        onUngroupCards(targetCards);
        addToHistory(operation);
    }, [selectedCards, onUngroupCards, addToHistory]);
    // Bulk move cards
    var bulkMove = (0, react_1.useCallback)(function (deltaX, deltaY, cardIds) {
        var targetCards = cardIds || Array.from(selectedCards);
        if (targetCards.length === 0)
            return;
        var operation = {
            id: "move-".concat(Date.now()),
            type: 'move',
            cardIds: targetCards,
            data: { deltaX: deltaX, deltaY: deltaY },
            timestamp: new Date()
        };
        onMoveCards(targetCards, deltaX, deltaY);
        addToHistory(operation);
    }, [selectedCards, onMoveCards, addToHistory]);
    // Bulk resize cards
    var bulkResize = (0, react_1.useCallback)(function (deltaWidth, deltaHeight, cardIds) {
        var targetCards = cardIds || Array.from(selectedCards);
        if (targetCards.length === 0)
            return;
        var operation = {
            id: "resize-".concat(Date.now()),
            type: 'resize',
            cardIds: targetCards,
            data: { deltaWidth: deltaWidth, deltaHeight: deltaHeight },
            timestamp: new Date()
        };
        onResizeCards(targetCards, deltaWidth, deltaHeight);
        addToHistory(operation);
    }, [selectedCards, onResizeCards, addToHistory]);
    // Bulk lock cards
    var bulkLock = (0, react_1.useCallback)(function (cardIds) {
        var targetCards = cardIds || Array.from(selectedCards);
        if (targetCards.length === 0)
            return;
        var operation = {
            id: "lock-".concat(Date.now()),
            type: 'lock',
            cardIds: targetCards,
            timestamp: new Date()
        };
        onLockCards(targetCards);
        addToHistory(operation);
    }, [selectedCards, onLockCards, addToHistory]);
    // Bulk unlock cards
    var bulkUnlock = (0, react_1.useCallback)(function (cardIds) {
        var targetCards = cardIds || Array.from(selectedCards);
        if (targetCards.length === 0)
            return;
        var operation = {
            id: "unlock-".concat(Date.now()),
            type: 'unlock',
            cardIds: targetCards,
            timestamp: new Date()
        };
        onUnlockCards(targetCards);
        addToHistory(operation);
    }, [selectedCards, onUnlockCards, addToHistory]);
    // Bulk duplicate cards
    var bulkDuplicate = (0, react_1.useCallback)(function (cardIds) {
        var targetCards = cardIds || Array.from(selectedCards);
        if (targetCards.length === 0)
            return;
        var operation = {
            id: "duplicate-".concat(Date.now()),
            type: 'duplicate',
            cardIds: targetCards,
            timestamp: new Date()
        };
        onDuplicateCards(targetCards);
        addToHistory(operation);
    }, [selectedCards, onDuplicateCards, addToHistory]);
    // Selection box operations
    var startSelectionBox = (0, react_1.useCallback)(function (startX, startY) {
        setSelectionBox({
            startX: startX,
            startY: startY,
            endX: startX,
            endY: startY,
            isActive: true
        });
    }, []);
    var updateSelectionBox = (0, react_1.useCallback)(function (endX, endY) {
        setSelectionBox(function (prev) { return (__assign(__assign({}, prev), { endX: endX, endY: endY })); });
    }, []);
    var endSelectionBox = (0, react_1.useCallback)(function () {
        setSelectionBox(function (prev) { return (__assign(__assign({}, prev), { isActive: false })); });
    }, []);
    // Get cards within selection box
    var getCardsInSelectionBox = (0, react_1.useCallback)(function () {
        if (!selectionBox.isActive)
            return [];
        var minX = Math.min(selectionBox.startX, selectionBox.endX);
        var maxX = Math.max(selectionBox.startX, selectionBox.endX);
        var minY = Math.min(selectionBox.startY, selectionBox.endY);
        var maxY = Math.max(selectionBox.startY, selectionBox.endY);
        return Object.entries(cards || {}).filter(function (_a) {
            var _ = _a[0], card = _a[1];
            var cardRight = card.x + card.width;
            var cardBottom = card.y + card.height;
            return (card.x < maxX &&
                cardRight > minX &&
                card.y < maxY &&
                cardBottom > minY);
        }).map(function (_a) {
            var cardId = _a[0];
            return cardId;
        });
    }, [selectionBox, cards]);
    // Smart selection based on card relationships
    var smartSelect = (0, react_1.useCallback)(function (cardId, selectionType) {
        var card = cards[cardId];
        if (!card)
            return [];
        var selectedCardIds = [];
        switch (selectionType) {
            case 'similar': {
                // Select cards with similar size and type
                selectedCardIds = Object.entries(cards || {})
                    .filter(function (_a) {
                    var id = _a[0], c = _a[1];
                    var sizeDiff = Math.abs(c.width - card.width) + Math.abs(c.height - card.height);
                    return id !== cardId && c.type === card.type && sizeDiff < 100;
                })
                    .map(function (_a) {
                    var id = _a[0];
                    return id;
                });
                break;
            }
            case 'nearby': {
                // Select cards within a certain radius
                var radius_1 = 200;
                selectedCardIds = Object.entries(cards || {})
                    .filter(function (_a) {
                    var id = _a[0], c = _a[1];
                    var distance = Math.sqrt(Math.pow(c.x - card.x, 2) + Math.pow(c.y - card.y, 2));
                    return id !== cardId && distance < radius_1;
                })
                    .map(function (_a) {
                    var id = _a[0];
                    return id;
                });
                break;
            }
            case 'same-type': {
                // Select all cards of the same type
                selectedCardIds = Object.entries(cards || {})
                    .filter(function (_a) {
                    var id = _a[0], c = _a[1];
                    return id !== cardId && c.type === card.type;
                })
                    .map(function (_a) {
                    var id = _a[0];
                    return id;
                });
                break;
            }
            case 'same-group': {
                // Select cards in the same group (if grouping is implemented)
                // This would need to be implemented based on your grouping system
                selectedCardIds = [];
                break;
            }
        }
        return selectedCardIds;
    }, [cards]);
    // Undo last operation
    var undoLastOperation = (0, react_1.useCallback)(function () {
        var _a;
        if (operationHistory.length === 0)
            return false;
        var lastOperation = operationHistory[0];
        if (!lastOperation)
            return false;
        switch (lastOperation.type) {
            case 'delete': {
                // This would require storing the deleted card data to restore
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Cannot undo delete operation without card data', {}, 'useBulkOperations');
                }
                break;
            }
            case 'group': {
                if (((_a = lastOperation.data) === null || _a === void 0 ? void 0 : _a.action) === 'ungroup') {
                    onGroupCards(lastOperation.cardIds, lastOperation.data.groupName);
                }
                else {
                    onUngroupCards(lastOperation.cardIds);
                }
                break;
            }
            case 'move': {
                var _b = lastOperation.data, deltaX_1 = _b.deltaX, deltaY_1 = _b.deltaY;
                lastOperation.cardIds.forEach(function (cardId) {
                    var card = cards[cardId];
                    if (card) {
                        onUpdateCardPosition(cardId, card.x - deltaX_1, card.y - deltaY_1);
                    }
                });
                break;
            }
            case 'resize': {
                var _c = lastOperation.data, deltaWidth_1 = _c.deltaWidth, deltaHeight_1 = _c.deltaHeight;
                lastOperation.cardIds.forEach(function (cardId) {
                    var card = cards[cardId];
                    if (card) {
                        onUpdateCardSize(cardId, card.width - deltaWidth_1, card.height - deltaHeight_1);
                    }
                });
                break;
            }
            case 'lock': {
                onUnlockCards(lastOperation.cardIds);
                break;
            }
            case 'unlock': {
                onLockCards(lastOperation.cardIds);
                break;
            }
            case 'duplicate': {
                // This would require tracking which cards were duplicated
                if (process.env.NODE_ENV === 'development') {
                    logger_1.logger.debug('Cannot undo duplicate operation', {}, 'useBulkOperations');
                }
                break;
            }
        }
        setOperationHistory(function (prev) { return prev.slice(1); });
        return true;
    }, [operationHistory, cards, onGroupCards, onUngroupCards, onUpdateCardPosition, onUpdateCardSize, onLockCards, onUnlockCards]);
    // Clear operation history
    var clearHistory = (0, react_1.useCallback)(function () {
        setOperationHistory([]);
    }, []);
    // Get operation statistics
    var getOperationStats = (0, react_1.useCallback)(function () {
        var stats = {
            totalOperations: operationHistory.length,
            operationsByType: {},
            lastOperation: operationHistory[0] || null,
            canUndo: operationHistory.length > 0
        };
        operationHistory.forEach(function (op) {
            stats.operationsByType[op.type] = (stats.operationsByType[op.type] || 0) + 1;
        });
        return stats;
    }, [operationHistory]);
    return {
        // State
        operationHistory: operationHistory,
        isBulkMode: isBulkMode,
        selectionBox: selectionBox,
        // Actions
        bulkDelete: bulkDelete,
        bulkGroup: bulkGroup,
        bulkUngroup: bulkUngroup,
        bulkMove: bulkMove,
        bulkResize: bulkResize,
        bulkLock: bulkLock,
        bulkUnlock: bulkUnlock,
        bulkDuplicate: bulkDuplicate,
        // Selection box
        startSelectionBox: startSelectionBox,
        updateSelectionBox: updateSelectionBox,
        endSelectionBox: endSelectionBox,
        getCardsInSelectionBox: getCardsInSelectionBox,
        // Smart selection
        smartSelect: smartSelect,
        // History management
        undoLastOperation: undoLastOperation,
        clearHistory: clearHistory,
        getOperationStats: getOperationStats,
        // Mode management
        setIsBulkMode: setIsBulkMode,
        // Utilities
        addToHistory: addToHistory
    };
}
