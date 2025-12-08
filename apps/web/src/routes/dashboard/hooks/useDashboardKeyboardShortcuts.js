"use strict";
/**
 * useDashboardKeyboardShortcuts Hook
 *
 * Configures keyboard shortcuts for the dashboard.
 * Extracted from VeroCardsV3.tsx to improve maintainability and reduce file size.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboardKeyboardShortcuts = useDashboardKeyboardShortcuts;
var react_1 = require("react");
var useKeyboardShortcuts_1 = require("@/hooks/useKeyboardShortcuts");
var cardHelpers_1 = require("../utils/cardHelpers");
function useDashboardKeyboardShortcuts(_a) {
    var serverPersistence = _a.serverPersistence, dashboardState = _a.dashboardState, layout = _a.layout, autoArrange = _a.autoArrange, undo = _a.undo, redo = _a.redo;
    return (0, useKeyboardShortcuts_1.useKeyboardShortcuts)({
        onAddCard: (0, react_1.useCallback)(function (type) {
            serverPersistence.addCard(type).then(function (cardId) {
                dashboardState.setSelectedCards(new Set([cardId]));
            });
        }, [serverPersistence, dashboardState]),
        onDuplicateCards: (0, react_1.useCallback)(function (cardIds) {
            cardIds.forEach(function (cardId) {
                var originalCard = layout.cards[cardId];
                if (originalCard) {
                    serverPersistence.addCard(originalCard.type, { x: originalCard.x + 20, y: originalCard.y + 20 });
                }
            });
        }, [layout.cards, serverPersistence]),
        onDeleteCards: (0, react_1.useCallback)(function (cardIds) {
            cardIds.forEach(serverPersistence.removeCard);
            dashboardState.setSelectedCards(new Set());
        }, [serverPersistence, dashboardState]),
        onAutoArrange: autoArrange,
        onResetCards: (0, react_1.useCallback)(function (cardIds) {
            cardIds.forEach(function (cardId) {
                var card = layout.cards[cardId];
                if (card) {
                    var defaultSize = (0, cardHelpers_1.getDefaultCardSize)(card.type);
                    serverPersistence.updateCardSize(cardId, defaultSize.width, defaultSize.height);
                }
            });
        }, [layout.cards, serverPersistence]),
        onSelectAll: function () {
            dashboardState.handleSelectAll(Object.keys(layout.cards));
            return true;
        },
        onDeselectAll: function () {
            dashboardState.handleDeselectAll();
            return true;
        },
        onShowHelp: function () {
            dashboardState.setShowKeyboardHelp(true);
            return true;
        },
        onUndo: function () {
            undo();
            return true;
        },
        onRedo: function () {
            redo();
            return true;
        },
        selectedCards: dashboardState.selectedCards,
        allCardIds: Object.keys(layout.cards)
    });
}
