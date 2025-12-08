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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboardLayout = useDashboardLayout;
var react_1 = require("react");
var logger_1 = require("@/utils/logger");
var cardConstants_1 = require("../routes/dashboard/utils/cardConstants");
// Default card configurations optimized for productivity
var defaultCardSizes = {
    'dashboard-metrics': { width: 280, height: 180 },
    'smart-kpis': { width: 400, height: 280 },
    'smart-kpis-test': { width: 380, height: 260 },
    'smart-kpis-debug': { width: 360, height: 240 },
    'jobs-calendar': { width: 300, height: 220 },
    'recent-activity': { width: 260, height: 200 },
    'customer-search': { width: 260, height: 160 },
    'reports': { width: 280, height: 180 },
    'technician-dispatch': { width: 400, height: 500 },
    'invoices': { width: 400, height: 500 },
    'quick-actions': { width: 260, height: 160 },
    'kpi-builder': { width: 320, height: 240 },
    'predictive-analytics': { width: 300, height: 200 },
    'auto-layout': { width: 280, height: 180 },
    'routing': { width: 320, height: 240 },
    'team-overview': { width: 300, height: 200 },
    'financial-summary': { width: 280, height: 180 },
    'notifications': { width: 260, height: 160 },
    'kpi-display': { width: 320, height: 240 },
    'kpi-template': { width: 400, height: 300 },
    'customers-page': { width: 1200, height: 800 },
    'customers-page-minimized': { width: cardConstants_1.CARD_CONSTANTS.MINIMIZED.WIDTH, height: cardConstants_1.CARD_CONSTANTS.MINIMIZED.HEIGHT }
};
// Layout configuration optimized for FAB system integration
// Uses constants from CARD_CONSTANTS where applicable
var layoutConfig = {
    canvas: {
        minHeight: cardConstants_1.CARD_CONSTANTS.CANVAS.MIN_HEIGHT,
        padding: cardConstants_1.CARD_CONSTANTS.CANVAS.PADDING,
        autoExpandAmount: 150
    },
    cards: {
        minGap: cardConstants_1.CARD_CONSTANTS.DRAG.MIN_GAP,
        snapDistance: cardConstants_1.CARD_CONSTANTS.DRAG.SNAP_DISTANCE,
        headerOffset: 60, // Reduced for secondary nav bar
        sidebarOffset: 20, // Minimal since FAB system
        bottomOffset: cardConstants_1.CARD_CONSTANTS.CANVAS.BOTTOM_OFFSET // Space for FAB systems
    }
};
function useDashboardLayout() {
    var _a;
    var _b = (0, react_1.useState)(function () {
        // Load saved layout or create default
        var saved = localStorage.getItem('verocards-v2-layout');
        if (saved) {
            try {
                return JSON.parse(saved);
            }
            catch (_error) {
                logger_1.logger.warn('Failed to load saved layout, using default', undefined, 'DashboardLayout');
            }
        }
        // Default layout - empty canvas with grid layout
        return {
            cards: {},
            canvasHeight: cardConstants_1.CARD_CONSTANTS.CANVAS.MIN_HEIGHT,
            theme: 'light',
            currentLayout: 'grid'
        };
    }), layout = _b[0], setLayout = _b[1];
    // Save layout to localStorage
    var saveLayout = (0, react_1.useCallback)(function () {
        localStorage.setItem('verocards-v2-layout', JSON.stringify(layout));
    }, [layout]);
    // Undo/Redo system - simple implementation for DashboardLayout
    var _c = (0, react_1.useState)([]), history = _c[0], setHistory = _c[1];
    var _d = (0, react_1.useState)(-1), historyIndex = _d[0], setHistoryIndex = _d[1];
    var maxHistorySize = ((_a = cardConstants_1.CARD_CONSTANTS.UNDO_REDO) === null || _a === void 0 ? void 0 : _a.MAX_HISTORY_SIZE) || 50;
    // Simplified version using refs to avoid closure issues
    var historyRef = (0, react_1.useRef)([]);
    var historyIndexRef = (0, react_1.useRef)(-1);
    var pushLayoutToHistoryRef = (0, react_1.useCallback)(function (layoutState) {
        var clonedState = JSON.parse(JSON.stringify(layoutState));
        var newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
        newHistory.push(clonedState);
        if (newHistory.length > maxHistorySize) {
            newHistory.shift();
        }
        historyIndexRef.current = newHistory.length - 1;
        historyRef.current = newHistory;
        setHistory(newHistory);
        setHistoryIndex(historyIndexRef.current);
    }, [maxHistorySize]);
    // Use the ref-based version
    var pushLayoutToHistoryFinal = pushLayoutToHistoryRef;
    var undoLayout = (0, react_1.useCallback)(function () {
        if (historyIndexRef.current <= 0)
            return null;
        historyIndexRef.current = historyIndexRef.current - 1;
        var result = historyRef.current[historyIndexRef.current] || null;
        setHistoryIndex(historyIndexRef.current);
        return result;
    }, []);
    var redoLayout = (0, react_1.useCallback)(function () {
        if (historyIndexRef.current >= historyRef.current.length - 1)
            return null;
        historyIndexRef.current = historyIndexRef.current + 1;
        var result = historyRef.current[historyIndexRef.current] || null;
        setHistoryIndex(historyIndexRef.current);
        return result;
    }, []);
    // Sync refs with state
    (0, react_1.useEffect)(function () {
        historyRef.current = history;
        historyIndexRef.current = historyIndex;
    }, [history, historyIndex]);
    var canUndo = historyIndex > 0;
    var canRedo = historyIndex < history.length - 1;
    // Undo operation
    var handleUndo = (0, react_1.useCallback)(function () {
        var previousLayout = undoLayout();
        if (previousLayout) {
            setLayout(previousLayout);
            return true;
        }
        return false;
    }, [undoLayout]);
    // Redo operation
    var handleRedo = (0, react_1.useCallback)(function () {
        var nextLayout = redoLayout();
        if (nextLayout) {
            setLayout(nextLayout);
            return true;
        }
        return false;
    }, [redoLayout]);
    // Auto-save on layout changes
    (0, react_1.useEffect)(function () {
        var timeoutId = setTimeout(function () {
            saveLayout();
        }, 3000); // Debounced save to localStorage (not Redis)
        return function () { return clearTimeout(timeoutId); };
    }, [layout, saveLayout]);
    // Update card position (without auto-history for drag operations)
    var updateCardPosition = (0, react_1.useCallback)(function (cardId, x, y) {
        setLayout(function (prev) {
            var _a;
            var card = prev.cards[cardId];
            if (!card)
                return prev;
            var updatedCards = __assign(__assign({}, prev.cards), (_a = {}, _a[cardId] = __assign(__assign({}, card), { x: Math.max(layoutConfig.cards.minGap / 2, x), y: Math.max(layoutConfig.cards.minGap / 2, y) // Allow cards near edges
             }), _a));
            // Calculate if canvas needs to expand
            var maxBottom = Math.max.apply(Math, Object.values(updatedCards).map(function (card) { return card.y + card.height; }));
            var newCanvasHeight = Math.max(prev.canvasHeight, maxBottom + layoutConfig.cards.bottomOffset + layoutConfig.canvas.autoExpandAmount);
            return __assign(__assign({}, prev), { cards: updatedCards, canvasHeight: newCanvasHeight, currentLayout: 'custom' // Mark as custom when user moves cards
             });
        });
    }, []);
    // Save layout state to history (for meaningful actions)
    var saveToHistory = (0, react_1.useCallback)(function () {
        pushLayoutToHistoryFinal(layout);
    }, [layout, pushLayoutToHistoryFinal]);
    // Update multiple card positions (for multi-drag)
    var updateMultipleCardPositions = (0, react_1.useCallback)(function (updates) {
        setLayout(function (prev) {
            var updatedCards = __assign({}, prev.cards);
            updates.forEach(function (_a) {
                var cardId = _a.cardId, x = _a.x, y = _a.y;
                var card = updatedCards[cardId];
                if (card) {
                    updatedCards[cardId] = __assign(__assign({}, card), { x: Math.max(layoutConfig.cards.minGap / 2, x), y: Math.max(layoutConfig.cards.minGap / 2, y) // Allow cards near edges
                     });
                }
            });
            // Calculate if canvas needs to expand
            var maxBottom = Math.max.apply(Math, Object.values(updatedCards).map(function (card) { return card.y + card.height; }));
            var newCanvasHeight = Math.max(prev.canvasHeight, maxBottom + layoutConfig.cards.bottomOffset + layoutConfig.canvas.autoExpandAmount);
            return __assign(__assign({}, prev), { cards: updatedCards, canvasHeight: newCanvasHeight });
        });
    }, []);
    // Update card size
    var updateCardSize = (0, react_1.useCallback)(function (cardId, width, height) {
        setLayout(function (prev) {
            var _a;
            var card = prev.cards[cardId];
            if (!card)
                return prev;
            // Allow minimized size (200x140 or smaller) but enforce minimums for normal cards
            var isMinimizedSize = width <= 200 && height <= 140;
            var finalWidth = isMinimizedSize ? width : Math.max(200, width);
            var finalHeight = isMinimizedSize ? height : Math.max(120, height);
            return __assign(__assign({}, prev), { cards: __assign(__assign({}, prev.cards), (_a = {}, _a[cardId] = __assign(__assign({}, card), { width: finalWidth, height: finalHeight }), _a)) });
        });
    }, []);
    // Add new card
    var addCard = (0, react_1.useCallback)(function (type, position) {
        var cardId = "".concat(type, "-").concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
        var defaultSize = defaultCardSizes[type] || { width: 280, height: 180 }; // Fallback size if not found
        setLayout(function (prev) {
            var _a;
            // Smart positioning - find empty space using current state
            var defaultPosition = position || findEmptySpace(prev.cards, defaultSize);
            return __assign(__assign({}, prev), { cards: __assign(__assign({}, prev.cards), (_a = {}, _a[cardId] = {
                    id: cardId,
                    x: defaultPosition.x,
                    y: defaultPosition.y,
                    width: defaultSize.width,
                    height: defaultSize.height,
                    type: type,
                    visible: true
                }, _a)) });
        });
        // Save to history after adding card
        setTimeout(function () { return saveToHistory(); }, 100);
        return cardId;
    }, [saveToHistory]);
    // Remove card
    var removeCard = (0, react_1.useCallback)(function (cardId) {
        setLayout(function (prev) {
            var newCards = __assign({}, prev.cards);
            delete newCards[cardId];
            return __assign(__assign({}, prev), { cards: newCards });
        });
        // Save to history after removing card
        setTimeout(function () { return saveToHistory(); }, 100);
    }, [saveToHistory]);
    // Reset to default layout (empty canvas)
    var resetLayout = (0, react_1.useCallback)(function () {
        var resetLayout = {
            cards: {},
            canvasHeight: 600,
            theme: 'light',
            zoom: 1,
            pan: { x: 0, y: 0 },
            currentLayout: 'custom'
        };
        setLayout(resetLayout);
        // Save the reset layout to localStorage
        try {
            localStorage.setItem('verocards-v2-layout', JSON.stringify(resetLayout));
            if (process.env.NODE_ENV === 'development') {
                logger_1.logger.debug('Layout reset and saved to localStorage', {}, 'useDashboardLayout');
            }
        }
        catch (error) {
            logger_1.logger.error('Failed to save reset layout', error, 'useDashboardLayout');
        }
    }, []);
    // Auto-arrange cards
    var autoArrange = (0, react_1.useCallback)(function (mode) {
        var cards = Object.values(layout.cards);
        var newCards = {};
        switch (mode) {
            case 'grid':
                // Arrange in grid pattern
                cards.forEach(function (card, index) {
                    var col = index % 4;
                    var row = Math.floor(index / 4);
                    newCards[card.id] = __assign(__assign({}, card), { x: layoutConfig.cards.sidebarOffset + (col * 300), y: layoutConfig.cards.headerOffset + (row * 240) });
                });
                break;
            case 'list':
                // Arrange in vertical list
                cards.forEach(function (card, index) {
                    newCards[card.id] = __assign(__assign({}, card), { x: layoutConfig.cards.sidebarOffset, y: layoutConfig.cards.headerOffset + (index * 200) });
                });
                break;
            case 'compact':
                // Arrange compactly to fit more cards
                cards.forEach(function (card, index) {
                    var col = index % 5;
                    var row = Math.floor(index / 5);
                    newCards[card.id] = __assign(__assign({}, card), { x: layoutConfig.cards.sidebarOffset + (col * 260), y: layoutConfig.cards.headerOffset + (row * 180), width: Math.min(card.width, 250), height: Math.min(card.height, 160) });
                });
                break;
        }
        setLayout(function (prev) { return (__assign(__assign({}, prev), { cards: newCards })); });
    }, [layout.cards]);
    // Load layout from localStorage
    var loadLayout = (0, react_1.useCallback)(function () {
        var saved = localStorage.getItem('verocards-v2-layout');
        if (saved) {
            try {
                setLayout(JSON.parse(saved));
            }
            catch (error) {
                logger_1.logger.warn('Failed to load layout', { error: error }, 'useDashboardLayout');
            }
        }
    }, []);
    // Load layout from provided data (for saved layouts)
    var loadLayoutFromData = (0, react_1.useCallback)(function (layoutData) {
        setLayout(layoutData);
    }, []);
    // Set zoom and pan data in layout
    var setZoomAndPan = (0, react_1.useCallback)(function (zoom, pan) {
        setLayout(function (prev) { return (__assign(__assign({}, prev), { zoom: zoom, pan: pan })); });
    }, []);
    // Get zoom and pan data from layout
    var getZoomAndPan = (0, react_1.useCallback)(function () {
        return {
            zoom: layout.zoom || 1,
            pan: layout.pan || { x: 0, y: 0 }
        };
    }, [layout.zoom, layout.pan]);
    // Apply template layout
    var applyTemplate = (0, react_1.useCallback)(function (templateName) {
        var cardIds = Object.keys(layout.cards);
        if (cardIds.length === 0)
            return;
        var updatedCards = __assign({}, layout.cards);
        var layoutType = templateName;
        switch (templateName) {
            case 'dashboard':
                // Main metrics at top, supporting cards below
                cardIds.forEach(function (cardId, index) {
                    var card = updatedCards[cardId];
                    if (!card)
                        return;
                    if (index === 0) {
                        // Main dashboard metrics - large, centered
                        updatedCards[cardId] = __assign(__assign({}, card), { x: 40, y: 40, width: 320, height: 200 });
                    }
                    else {
                        // Supporting cards in a row below
                        var col = (index - 1) % 3;
                        updatedCards[cardId] = __assign(__assign({}, card), { x: 40 + col * 280, y: 260, width: 260, height: 160 });
                    }
                });
                break;
            case 'sidebar':
                // Vertical stack on the left
                cardIds.forEach(function (cardId, index) {
                    var card = updatedCards[cardId];
                    if (!card)
                        return;
                    updatedCards[cardId] = __assign(__assign({}, card), { x: 40, y: 40 + index * 200, width: 280, height: 180 });
                });
                break;
            case 'grid':
                // Even grid layout
                var cols_1 = 3;
                cardIds.forEach(function (cardId, index) {
                    var col = index % cols_1;
                    var row = Math.floor(index / cols_1);
                    var card = updatedCards[cardId];
                    if (!card)
                        return;
                    updatedCards[cardId] = __assign(__assign({}, card), { x: 40 + col * 300, y: 40 + row * 200, width: 280, height: 180 });
                });
                break;
        }
        // Update canvas height
        var maxBottom = Math.max.apply(Math, Object.values(updatedCards).map(function (card) { return card.y + card.height; }));
        var newCanvasHeight = Math.max(600, maxBottom + layoutConfig.cards.bottomOffset + layoutConfig.canvas.autoExpandAmount);
        setLayout(function (prev) { return (__assign(__assign({}, prev), { cards: updatedCards, canvasHeight: newCanvasHeight, currentLayout: layoutType })); });
        // Save to history after template application (meaningful action)
        setTimeout(function () { return saveToHistory(); }, 100);
    }, [layout.cards, saveToHistory]);
    // Auto-arrange cards using the last used layout
    var autoArrangeCards = (0, react_1.useCallback)(function () {
        var lastLayout = layout.currentLayout || 'grid';
        applyTemplate(lastLayout);
    }, [layout.currentLayout, applyTemplate]);
    // Set current layout
    var setCurrentLayout = (0, react_1.useCallback)(function (layoutType) {
        setLayout(function (prev) { return (__assign(__assign({}, prev), { currentLayout: layoutType })); });
    }, []);
    return {
        layout: layout,
        updateCardPosition: updateCardPosition,
        updateMultipleCardPositions: updateMultipleCardPositions,
        updateCardSize: updateCardSize,
        addCard: addCard,
        removeCard: removeCard,
        resetLayout: resetLayout,
        autoArrangeCards: autoArrangeCards,
        applyTemplate: applyTemplate,
        saveLayout: saveLayout,
        loadLayout: loadLayout,
        loadLayoutFromData: loadLayoutFromData,
        autoArrange: autoArrange,
        setZoomAndPan: setZoomAndPan,
        getZoomAndPan: getZoomAndPan,
        setCurrentLayout: setCurrentLayout,
        // Undo/Redo functionality
        undo: handleUndo,
        redo: handleRedo,
        canUndo: canUndo,
        canRedo: canRedo,
        saveToHistory: saveToHistory
    };
}
// Helper function to find empty space for new cards in grid pattern next to last card
function findEmptySpace(existingCards, cardSize, canvasWidth) {
    if (canvasWidth === void 0) { canvasWidth = 1200; }
    var cards = Object.values(existingCards);
    var margin = 20;
    var maxX = canvasWidth - cardSize.width - margin - 100; // Extra margin for FAB systems
    // If no existing cards, start at the top-left
    if (cards.length === 0) {
        return { x: margin, y: margin };
    }
    // Calculate grid dimensions
    var colWidth = cardSize.width + margin;
    var rowHeight = cardSize.height + margin;
    var maxCols = Math.floor(maxX / colWidth);
    // Sort cards by position to find the last card in grid order
    var sortedCards = cards.sort(function (a, b) {
        var aRow = Math.floor(a.y / rowHeight);
        var bRow = Math.floor(b.y / rowHeight);
        if (aRow !== bRow)
            return aRow - bRow;
        return Math.floor(a.x / colWidth) - Math.floor(b.x / colWidth);
    });
    // Find the last card's grid position
    var lastCard = sortedCards[sortedCards.length - 1];
    if (!lastCard) {
        return { x: margin, y: margin };
    }
    var lastRow = Math.floor(lastCard.y / rowHeight);
    var lastCol = Math.floor(lastCard.x / colWidth);
    // Try to place next to the last card
    var nextCol = lastCol + 1;
    var nextRow = lastRow;
    // If we've reached the end of the row, move to next row
    if (nextCol >= maxCols) {
        nextCol = 0;
        nextRow = lastRow + 1;
    }
    var x = margin + (nextCol * colWidth);
    var y = margin + (nextRow * rowHeight);
    // Check if this position is within bounds and doesn't overlap
    if (x + cardSize.width <= maxX) {
        var overlaps = cards.some(function (card) {
            return x < card.x + card.width + layoutConfig.cards.minGap &&
                x + cardSize.width + layoutConfig.cards.minGap > card.x &&
                y < card.y + card.height + layoutConfig.cards.minGap &&
                y + cardSize.height + layoutConfig.cards.minGap > card.y;
        });
        if (!overlaps) {
            return { x: x, y: y };
        }
    }
    // If the calculated position doesn't work, try the next available grid position
    for (var row = nextRow; row < nextRow + 5; row++) {
        var _loop_1 = function (col) {
            var gridX = margin + (col * colWidth);
            var gridY = margin + (row * rowHeight);
            if (gridX + cardSize.width > maxX)
                return "continue";
            var overlaps = cards.some(function (card) {
                return gridX < card.x + card.width + layoutConfig.cards.minGap &&
                    gridX + cardSize.width + layoutConfig.cards.minGap > card.x &&
                    gridY < card.y + card.height + layoutConfig.cards.minGap &&
                    gridY + cardSize.height + layoutConfig.cards.minGap > card.y;
            });
            if (!overlaps) {
                return { value: { x: gridX, y: gridY } };
            }
        };
        for (var col = 0; col < maxCols; col++) {
            var state_1 = _loop_1(col);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
    // Fallback to safe position within bounds
    var fallbackX = Math.min(margin, maxX);
    var fallbackY = margin;
    return { x: fallbackX, y: fallbackY };
}
