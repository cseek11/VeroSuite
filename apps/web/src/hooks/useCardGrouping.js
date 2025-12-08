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
exports.useCardGrouping = useCardGrouping;
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
var GROUP_COLORS = [
    { name: 'Purple', value: 'purple' },
    { name: 'Blue', value: 'blue' },
    { name: 'Green', value: 'green' },
    { name: 'Red', value: 'red' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Pink', value: 'pink' },
    { name: 'Indigo', value: 'indigo' },
    { name: 'Orange', value: 'orange' }
];
var GROUPS_STORAGE_KEY = 'verocards-v2-groups';
function useCardGrouping(onDeleteCards) {
    var _a = (0, react_1.useState)({}), groups = _a[0], setGroups = _a[1];
    var _b = (0, react_1.useState)(null), selectedGroupId = _b[0], setSelectedGroupId = _b[1];
    // Load groups from localStorage
    (0, react_1.useEffect)(function () {
        var saved = localStorage.getItem(GROUPS_STORAGE_KEY);
        if (saved) {
            try {
                var parsedGroups = JSON.parse(saved);
                // Convert cardIds arrays back to Sets
                var groupsWithSets_1 = {};
                Object.entries(parsedGroups).forEach(function (_a) {
                    var id = _a[0], group = _a[1];
                    groupsWithSets_1[id] = __assign(__assign({}, group), { cardIds: new Set(group.cardIds) });
                });
                setGroups(groupsWithSets_1);
            }
            catch (error) {
                logger_1.logger.warn('Failed to load card groups', { error: error }, 'useCardGrouping');
            }
        }
    }, []);
    // Save groups to localStorage
    var saveGroups = (0, react_1.useCallback)(function (groupsToSave) {
        try {
            // Convert Sets to arrays for JSON serialization
            var serializable_1 = {};
            Object.entries(groupsToSave).forEach(function (_a) {
                var id = _a[0], group = _a[1];
                serializable_1[id] = __assign(__assign({}, group), { cardIds: Array.from(group.cardIds) });
            });
            localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(serializable_1));
        }
        catch (error) {
            logger_1.logger.error('Failed to save card groups', error, 'useCardGrouping');
        }
    }, []);
    // Create new group
    var createGroup = (0, react_1.useCallback)(function (name, cardIds, cards, color) {
        var _a, _b, _c, _d;
        var groupId = "group-".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
        var colorIndex = Object.keys(groups).length % GROUP_COLORS.length;
        var selectedColor = color || ((_d = (_b = (_a = GROUP_COLORS[colorIndex]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : (_c = GROUP_COLORS[0]) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : '#3b82f6');
        // Calculate group bounds based on actual card positions
        var groupBounds = calculateGroupBounds(cardIds, cards);
        var newGroup = {
            id: groupId,
            name: name.trim(),
            color: selectedColor,
            cardIds: new Set(cardIds),
            x: groupBounds.x - 15,
            y: groupBounds.y - 15,
            width: groupBounds.width + 30,
            height: groupBounds.height + 30,
            visible: true,
            locked: false
        };
        setGroups(function (prev) {
            var _a;
            var updated = __assign(__assign({}, prev), (_a = {}, _a[groupId] = newGroup, _a));
            saveGroups(updated);
            return updated;
        });
        return groupId;
    }, [groups, saveGroups]);
    // Update group
    var updateGroup = (0, react_1.useCallback)(function (groupId, updates) {
        setGroups(function (prev) {
            var _a;
            if (!prev[groupId])
                return prev;
            var updated = __assign(__assign({}, prev), (_a = {}, _a[groupId] = __assign(__assign({}, prev[groupId]), updates), _a));
            saveGroups(updated);
            return updated;
        });
    }, [saveGroups]);
    // Delete group (and all cards inside it)
    var deleteGroup = (0, react_1.useCallback)(function (groupId) {
        setGroups(function (prev) {
            var group = prev[groupId];
            if (group && onDeleteCards) {
                // Delete all cards in the group
                onDeleteCards(Array.from(group.cardIds));
            }
            var updated = __assign({}, prev);
            delete updated[groupId];
            saveGroups(updated);
            return updated;
        });
    }, [saveGroups, onDeleteCards]);
    // Ungroup cards (delete group but keep cards)
    var ungroupCards = (0, react_1.useCallback)(function (groupId) {
        setGroups(function (prev) {
            var updated = __assign({}, prev);
            delete updated[groupId];
            saveGroups(updated);
            return updated;
        });
    }, [saveGroups]);
    // Clear all groups (emergency function)
    var clearAllGroups = (0, react_1.useCallback)(function () {
        setGroups({});
        saveGroups({});
    }, [saveGroups]);
    // Add cards to group
    var addCardsToGroup = (0, react_1.useCallback)(function (groupId, cardIds) {
        setGroups(function (prev) {
            var _a;
            if (!prev[groupId])
                return prev;
            var group = prev[groupId];
            var newCardIds = new Set(__spreadArray(__spreadArray([], group.cardIds, true), cardIds, true));
            var updated = __assign(__assign({}, prev), (_a = {}, _a[groupId] = __assign(__assign({}, group), { cardIds: newCardIds }), _a));
            saveGroups(updated);
            return updated;
        });
    }, [saveGroups]);
    // Remove cards from group
    var removeCardsFromGroup = (0, react_1.useCallback)(function (groupId, cardIds) {
        setGroups(function (prev) {
            var _a;
            if (!prev[groupId])
                return prev;
            var group = prev[groupId];
            var newCardIds = new Set(group.cardIds);
            cardIds.forEach(function (id) { return newCardIds.delete(id); });
            var updated = __assign(__assign({}, prev), (_a = {}, _a[groupId] = __assign(__assign({}, group), { cardIds: newCardIds }), _a));
            saveGroups(updated);
            return updated;
        });
    }, [saveGroups]);
    // Get group for card
    var getCardGroup = (0, react_1.useCallback)(function (cardId) {
        return Object.values(groups).find(function (group) { return group.cardIds.has(cardId); });
    }, [groups]);
    // Update group bounds based on card positions
    var updateGroupBounds = (0, react_1.useCallback)(function (groupId, cards) {
        var group = groups[groupId];
        if (!group)
            return;
        var cardPositions = Array.from(group.cardIds)
            .map(function (cardId) { return cards[cardId]; })
            .filter(Boolean);
        if (cardPositions.length === 0)
            return;
        var bounds = calculateGroupBounds(Array.from(group.cardIds), cards);
        updateGroup(groupId, {
            x: bounds.x - 10,
            y: bounds.y - 10,
            width: bounds.width + 20,
            height: bounds.height + 20
        });
    }, [groups, updateGroup]);
    return {
        groups: groups,
        selectedGroupId: selectedGroupId,
        setSelectedGroupId: setSelectedGroupId,
        createGroup: createGroup,
        updateGroup: updateGroup,
        deleteGroup: deleteGroup,
        ungroupCards: ungroupCards,
        addCardsToGroup: addCardsToGroup,
        removeCardsFromGroup: removeCardsFromGroup,
        getCardGroup: getCardGroup,
        updateGroupBounds: updateGroupBounds,
        clearAllGroups: clearAllGroups,
        availableColors: GROUP_COLORS
    };
}
// Helper function to calculate group bounds
function calculateGroupBounds(cardIds, cards) {
    var cardPositions = cardIds.map(function (id) { return cards[id]; }).filter(Boolean);
    if (cardPositions.length === 0) {
        return { x: 0, y: 0, width: 100, height: 100 };
    }
    var minX = Math.min.apply(Math, cardPositions.map(function (card) { return card.x; }));
    var minY = Math.min.apply(Math, cardPositions.map(function (card) { return card.y; }));
    var maxX = Math.max.apply(Math, cardPositions.map(function (card) { return card.x + card.width; }));
    var maxY = Math.max.apply(Math, cardPositions.map(function (card) { return card.y + card.height; }));
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}
