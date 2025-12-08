"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGroupDragDrop = useGroupDragDrop;
var react_1 = require("react");
function useGroupDragDrop(_a) {
    var groups = _a.groups, onUpdateGroup = _a.onUpdateGroup, onUpdateMultipleCardPositions = _a.onUpdateMultipleCardPositions, cards = _a.cards, _b = _a.zoom, zoom = _b === void 0 ? 1 : _b, _c = _a.canvasHeight, canvasHeight = _c === void 0 ? 600 : _c;
    var _d = (0, react_1.useState)(null), draggingGroup = _d[0], setDraggingGroup = _d[1];
    var _e = (0, react_1.useState)(null), dragStartPosition = _e[0], setDragStartPosition = _e[1];
    var _f = (0, react_1.useState)(null), initialGroupPosition = _f[0], setInitialGroupPosition = _f[1];
    var _g = (0, react_1.useState)({}), initialCardPositions = _g[0], setInitialCardPositions = _g[1];
    // Start dragging group
    var handleGroupDragStart = (0, react_1.useCallback)(function (groupId, e) {
        var group = groups[groupId];
        if (!group || group.locked)
            return;
        // Only allow dragging from the group boundary (not the header)
        var groupElement = e.currentTarget;
        var groupRect = groupElement.getBoundingClientRect();
        var clickY = e.clientY - groupRect.top;
        var headerHeight = 30; // Height of the group header
        // Don't start drag if clicking on the header area
        if (clickY < headerHeight) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        // Store initial positions
        setDraggingGroup(groupId);
        setDragStartPosition({ x: e.clientX, y: e.clientY });
        setInitialGroupPosition({ x: group.x, y: group.y });
        // Store initial positions of all cards in the group
        var cardPositions = {};
        group.cardIds.forEach(function (cardId) {
            var card = cards[cardId];
            if (card) {
                cardPositions[cardId] = { x: card.x, y: card.y };
            }
        });
        setInitialCardPositions(cardPositions);
        // Set dragging styles
        groupElement.style.cursor = 'grabbing';
        groupElement.style.zIndex = '9999';
        groupElement.style.transition = 'none';
        groupElement.style.willChange = 'transform';
        // Set global styles
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    }, [groups, cards]);
    // Handle group drag move with smooth performance
    var handleGroupDragMove = (0, react_1.useCallback)(function (e) {
        if (!draggingGroup || !dragStartPosition || !initialGroupPosition)
            return;
        // Use requestAnimationFrame for smooth 60fps updates
        requestAnimationFrame(function () {
            var group = groups[draggingGroup];
            if (!group)
                return;
            var deltaX = e.clientX - dragStartPosition.x;
            var deltaY = e.clientY - dragStartPosition.y;
            // Calculate new group position
            var newGroupX = initialGroupPosition.x + deltaX;
            var newGroupY = initialGroupPosition.y + deltaY;
            // Get canvas bounds for boundary constraints
            var canvas = document.querySelector('.dashboard-canvas');
            if (!canvas)
                return;
            var canvasRect = canvas.getBoundingClientRect();
            var effectiveCanvasWidth = canvasRect.width / zoom;
            var effectiveCanvasHeight = Math.max(canvasHeight, canvasRect.height) / zoom;
            // Constrain group to canvas boundaries
            var constrainedGroupX = Math.max(8, Math.min(newGroupX, effectiveCanvasWidth - group.width - 16));
            var constrainedGroupY = Math.max(8, Math.min(newGroupY, effectiveCanvasHeight - group.height - 8));
            // Update group position
            onUpdateGroup(draggingGroup, {
                x: constrainedGroupX,
                y: constrainedGroupY
            });
            // Calculate delta for card positions using initial group position
            var groupDeltaX = constrainedGroupX - initialGroupPosition.x;
            var groupDeltaY = constrainedGroupY - initialGroupPosition.y;
            // Update all card positions relative to the group movement
            var cardUpdates = [];
            group.cardIds.forEach(function (cardId) {
                var initialCardPos = initialCardPositions[cardId];
                if (initialCardPos) {
                    var newCardX = initialCardPos.x + groupDeltaX;
                    var newCardY = initialCardPos.y + groupDeltaY;
                    // Constrain cards to group boundaries first, then canvas boundaries
                    var card = cards[cardId];
                    if (card) {
                        // Group boundary constraints (with padding)
                        var groupMinX = constrainedGroupX + 5;
                        var groupMinY = constrainedGroupY + 5;
                        var groupMaxX = constrainedGroupX + group.width - card.width - 5;
                        var groupMaxY = constrainedGroupY + group.height - card.height - 5;
                        // Canvas boundary constraints
                        var canvasMinX = 8;
                        var canvasMinY = 8;
                        var canvasMaxX = effectiveCanvasWidth - card.width - 16;
                        var canvasMaxY = effectiveCanvasHeight - card.height - 8;
                        // Use the most restrictive boundaries
                        var constrainedCardX = Math.max(Math.max(groupMinX, canvasMinX), Math.min(Math.min(groupMaxX, canvasMaxX), newCardX));
                        var constrainedCardY = Math.max(Math.max(groupMinY, canvasMinY), Math.min(Math.min(groupMaxY, canvasMaxY), newCardY));
                        cardUpdates.push({
                            cardId: cardId,
                            x: constrainedCardX,
                            y: constrainedCardY
                        });
                    }
                }
            });
            // Update all card positions at once
            if (cardUpdates.length > 0) {
                onUpdateMultipleCardPositions(cardUpdates);
            }
        });
    }, [draggingGroup, dragStartPosition, initialGroupPosition, initialCardPositions, groups, cards, onUpdateGroup, onUpdateMultipleCardPositions, zoom, canvasHeight]);
    // Handle group drag end
    var handleGroupDragEnd = (0, react_1.useCallback)(function () {
        if (draggingGroup) {
            // Reset all dragging styles
            var groupElement = document.querySelector("[data-group-id=\"".concat(draggingGroup, "\"]"));
            if (groupElement) {
                groupElement.style.cursor = '';
                groupElement.style.zIndex = '';
                groupElement.style.transition = '';
                groupElement.style.willChange = '';
            }
            // Reset global styles
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            // Reset dragging state
            setDraggingGroup(null);
            setDragStartPosition(null);
            setInitialGroupPosition(null);
            setInitialCardPositions({});
        }
    }, [draggingGroup]);
    // Add global drag event listeners
    (0, react_1.useEffect)(function () {
        if (draggingGroup) {
            document.addEventListener('mousemove', handleGroupDragMove);
            document.addEventListener('mouseup', handleGroupDragEnd);
            return function () {
                document.removeEventListener('mousemove', handleGroupDragMove);
                document.removeEventListener('mouseup', handleGroupDragEnd);
            };
        }
        return undefined;
    }, [draggingGroup, handleGroupDragMove, handleGroupDragEnd]);
    return {
        draggingGroup: draggingGroup,
        handleGroupDragStart: handleGroupDragStart,
        isDraggingGroup: !!draggingGroup
    };
}
