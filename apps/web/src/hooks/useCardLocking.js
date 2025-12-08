"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCardLocking = useCardLocking;
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
var LOCKED_CARDS_STORAGE_KEY = 'verocards-v2-locked-cards';
function useCardLocking() {
    var _a = (0, react_1.useState)(function () {
        var saved = localStorage.getItem(LOCKED_CARDS_STORAGE_KEY);
        if (saved) {
            try {
                return new Set(JSON.parse(saved));
            }
            catch (error) {
                logger_1.logger.warn('Failed to parse saved locked cards', { error: error }, 'useCardLocking');
            }
        }
        return new Set();
    }), lockedCards = _a[0], setLockedCards = _a[1];
    // Save locked cards to localStorage whenever it changes
    (0, react_1.useEffect)(function () {
        try {
            localStorage.setItem(LOCKED_CARDS_STORAGE_KEY, JSON.stringify(Array.from(lockedCards)));
        }
        catch (error) {
            logger_1.logger.error('Failed to save locked cards', error, 'useCardLocking');
        }
    }, [lockedCards]);
    // Toggle card lock status
    var toggleCardLock = (0, react_1.useCallback)(function (cardId) {
        setLockedCards(function (prev) {
            var newSet = new Set(prev);
            if (newSet.has(cardId)) {
                newSet.delete(cardId);
            }
            else {
                newSet.add(cardId);
            }
            return newSet;
        });
    }, []);
    // Lock multiple cards
    var lockCards = (0, react_1.useCallback)(function (cardIds) {
        setLockedCards(function (prev) {
            var newSet = new Set(prev);
            cardIds.forEach(function (id) { return newSet.add(id); });
            return newSet;
        });
    }, []);
    // Unlock multiple cards
    var unlockCards = (0, react_1.useCallback)(function (cardIds) {
        setLockedCards(function (prev) {
            var newSet = new Set(prev);
            cardIds.forEach(function (id) { return newSet.delete(id); });
            return newSet;
        });
    }, []);
    // Check if card is locked
    var isCardLocked = (0, react_1.useCallback)(function (cardId) {
        // Page cards can be locked/unlocked like regular cards
        return lockedCards.has(cardId);
    }, [lockedCards]);
    // Lock all cards
    var lockAllCards = (0, react_1.useCallback)(function (cardIds) {
        setLockedCards(new Set(cardIds));
    }, []);
    // Unlock all cards
    var unlockAllCards = (0, react_1.useCallback)(function () {
        setLockedCards(new Set());
    }, []);
    return {
        lockedCards: lockedCards,
        toggleCardLock: toggleCardLock,
        lockCards: lockCards,
        unlockCards: unlockCards,
        isCardLocked: isCardLocked,
        lockAllCards: lockAllCards,
        unlockAllCards: unlockAllCards
    };
}
