"use strict";
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
exports.default = VeroCardsV3;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var auth_1 = require("@/stores/auth");
var useDashboardLayout_1 = require("@/hooks/useDashboardLayout");
var useCardDragDrop_1 = require("@/hooks/useCardDragDrop");
var useCardResize_1 = require("@/hooks/useCardResize");
var useCardLocking_1 = require("@/hooks/useCardLocking");
var useCardGrouping_1 = require("@/hooks/useCardGrouping");
var useGroupDragDrop_1 = require("@/hooks/useGroupDragDrop");
var useZoomPan_1 = require("@/hooks/useZoomPan");
var useRealtimeCollaboration_1 = require("@/hooks/useRealtimeCollaboration");
var useSmartKPIs_1 = require("@/hooks/useSmartKPIs");
var useKpiTemplates_1 = require("@/hooks/useKpiTemplates");
var useVirtualScrolling_1 = require("@/hooks/useVirtualScrolling");
var useKeyboardNavigation_1 = require("@/hooks/useKeyboardNavigation");
// Local components and hooks
var components_1 = require("./components");
var hooks_1 = require("./hooks");
var useCanvasHeight_1 = require("./hooks/useCanvasHeight");
var useAutoScroll_1 = require("./hooks/useAutoScroll");
var useCardFocusScroll_1 = require("./hooks/useCardFocusScroll");
// Utilities and constants
var cardTypes_1 = require("./utils/cardTypes");
var constants_1 = require("./utils/constants");
var useGridManager_1 = require("./hooks/useGridManager");
var useErrorHandling_1 = require("./hooks/useErrorHandling");
var useSyncStatus_1 = require("./hooks/useSyncStatus");
var useCardInitialization_1 = require("./hooks/useCardInitialization");
var VeroCardsV3Render_1 = require("./VeroCardsV3Render");
var TemplateErrorBoundary_1 = require("./components/TemplateErrorBoundary");
var LoadingSpinner_1 = require("@/components/LoadingSpinner");
function VeroCardsV3(_a) {
    var _b = _a.showHeader, showHeader = _b === void 0 ? true : _b;
    var user = (0, auth_1.useAuthStore)().user;
    // Early returns must come before any other hooks
    if (!user) {
        return (0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, {});
    }
    // Grid management and error handling
    var gridManager = (0, useGridManager_1.useGridManager)();
    var errorHandling = (0, useErrorHandling_1.useErrorHandling)();
    var syncStatus = (0, useSyncStatus_1.useSyncStatus)();
    // Custom hooks
    var dashboardState = (0, hooks_1.useDashboardState)();
    var modalManagement = (0, hooks_1.useModalManagement)();
    var _c = (0, hooks_1.useKpiManagement)(), kpiData = _c.kpiData, setKpiData = _c.setKpiData, processedKpisRef = _c.processedKpisRef, loadServerLayoutData = _c.loadServerLayoutData;
    // Template loading and diagnostics
    var templateLoading = (0, hooks_1.useTemplateLoading)();
    var _d = (0, useDashboardLayout_1.useDashboardLayout)(), layout = _d.layout, localUpdateCardPosition = _d.updateCardPosition, localUpdateMultipleCardPositions = _d.updateMultipleCardPositions, localUpdateCardSize = _d.updateCardSize, localAddCard = _d.addCard, localRemoveCard = _d.removeCard, resetLayout = _d.resetLayout, autoArrange = _d.autoArrange, autoArrangeCards = _d.autoArrangeCards, applyTemplate = _d.applyTemplate, loadLayoutFromData = _d.loadLayoutFromData, undo = _d.undo, redo = _d.redo, canUndo = _d.canUndo, canRedo = _d.canRedo, saveToHistory = _d.saveToHistory;
    var serverPersistence = (0, hooks_1.useServerPersistence)(localUpdateCardPosition, localUpdateCardSize, localAddCard, localRemoveCard, localUpdateMultipleCardPositions, loadLayoutFromData, layout, kpiData, setKpiData, constants_1.KPI_DATA_STORAGE_KEY);
    // Other hooks
    var smartKPIs = (0, useSmartKPIs_1.useSmartKPIs)();
    var _e = (0, useKpiTemplates_1.useUserKpis)(), _f = _e.data, userKpis = _f === void 0 ? [] : _f, isUserKpisLoading = _e.isLoading, isUserKpisError = _e.isError, userKpisStatus = _e.status;
    var cardTypes = (0, react_1.useMemo)(function () { return (0, cardTypes_1.getCardTypes)(function () { return dashboardState.setShowKPIBuilder(true); }); }, []);
    var virtualScrolling = (0, useVirtualScrolling_1.useVirtualScrolling)({
        itemHeight: 200,
        containerHeight: Math.max(600, layout.canvasHeight),
        overscan: 5,
        threshold: dashboardState.virtualScrollingThreshold
    });
    var keyboardNavigation = (0, useKeyboardNavigation_1.useKeyboardNavigation)({
        cards: layout.cards,
        selectedCards: dashboardState.selectedCards,
        onSelectCard: function (cardId, addToSelection) {
            if (addToSelection) {
                dashboardState.setSelectedCards(function (prev) { return new Set(__spreadArray(__spreadArray([], prev, true), [cardId], false)); });
            }
            else {
                dashboardState.setSelectedCards(new Set([cardId]));
            }
        },
        onDeselectAll: dashboardState.handleDeselectAll,
        onFocusCard: function () {
            // Don't auto-scroll when focusing cards to prevent unwanted movement
            // The card focus scroll hook will handle scrolling when needed
        },
        onActivateCard: function (cardId) {
            dashboardState.setSelectedCards(function (prev) {
                var newSelection = new Set(prev);
                if (newSelection.has(cardId)) {
                    newSelection.delete(cardId);
                }
                else {
                    newSelection.add(cardId);
                }
                return newSelection;
            });
        },
        onMoveCard: function (cardId, deltaX, deltaY) {
            var card = layout.cards[cardId];
            if (card) {
                serverPersistence.updateCardPosition(cardId, Math.max(0, card.x + deltaX), Math.max(0, card.y + deltaY));
            }
        },
        onResizeCard: function (cardId, deltaWidth, deltaHeight) {
            var card = layout.cards[cardId];
            if (card) {
                var newWidth = Math.max(100, Math.min(1600, card.width + deltaWidth));
                var newHeight = Math.max(100, Math.min(1000, card.height + deltaHeight));
                serverPersistence.updateCardSize(cardId, newWidth, newHeight);
            }
        },
        gridSize: 20,
        enableScreenReader: true
    });
    var _g = (0, useCardLocking_1.useCardLocking)(), toggleCardLock = _g.toggleCardLock, isCardLocked = _g.isCardLocked;
    var _h = (0, useZoomPan_1.useZoomPan)(), containerRef = _h.containerRef, zoom = _h.zoom, zoomIn = _h.zoomIn, zoomOut = _h.zoomOut, setZoom = _h.setZoom, setPan = _h.setPan, resetView = _h.resetView, handlePanStart = _h.handlePanStart, getTransformStyle = _h.getTransformStyle, canZoomIn = _h.canZoomIn, canZoomOut = _h.canZoomOut, pan = _h.pan;
    // Handle custom events for card operations (extracted to hook)
    (0, hooks_1.useCardEventHandlers)({
        serverPersistence: serverPersistence,
        localUpdateCardSize: localUpdateCardSize,
        localUpdateCardPosition: localUpdateCardPosition,
        localRemoveCard: localRemoveCard,
        layout: layout,
        gridManager: gridManager,
        errorHandling: errorHandling,
        syncStatus: syncStatus,
        toggleCardLock: toggleCardLock,
        containerRef: containerRef
    });
    // Separate ref for the scrollable container (dashboard-content)
    var scrollableContainerRef = (0, react_1.useRef)(null);
    // Track dragging state for canvas height updates (initialized before useCardDragDrop)
    var _j = (0, react_1.useState)(false), isDraggingForCanvas = _j[0], setIsDraggingForCanvas = _j[1];
    // Canvas height management (skip updates during drag to prevent bouncing)
    var _k = (0, useCanvasHeight_1.useCanvasHeight)({
        cards: layout.cards,
        minHeight: 600,
        padding: 20,
        autoExpandThreshold: 30,
        containerRef: containerRef,
        enableAutoScroll: true,
        isDragging: isDraggingForCanvas
    }), canvasHeight = _k.canvasHeight, updateCanvasHeight = _k.updateCanvasHeight, scrollToCard = _k.scrollToCard;
    // Auto-scroll during drag operations with boundary detection
    // Use the canvas container directly for more efficient scrolling
    var _l = (0, useAutoScroll_1.useAutoScroll)({
        containerRef: scrollableContainerRef, // Use scrollable container for proper auto-scroll
        scrollToCard: scrollToCard,
        enableAutoScroll: true,
        scrollSpeed: 20, // Increased speed for more responsive scrolling
        boundaryZone: 100 // Increased boundary zone for earlier detection and smoother experience
    }), handleAutoScroll = _l.handleAutoScroll, stopAutoScroll = _l.stopAutoScroll;
    // Auto-scroll to selected cards (independent of resizing)
    (0, useCardFocusScroll_1.useCardFocusScroll)({
        selectedCards: dashboardState.selectedCards,
        containerRef: scrollableContainerRef,
        enableAutoScroll: true,
        scrollDelay: 200
    });
    var _m = (0, useCardGrouping_1.useCardGrouping)(function (cardIds) {
        cardIds.forEach(function (cardId) { return serverPersistence.removeCard(cardId); });
    }), groups = _m.groups, selectedGroupId = _m.selectedGroupId, setSelectedGroupId = _m.setSelectedGroupId, updateGroup = _m.updateGroup, deleteGroup = _m.deleteGroup, getCardGroup = _m.getCardGroup, ungroupCards = _m.ungroupCards, clearAllGroups = _m.clearAllGroups, updateGroupBounds = _m.updateGroupBounds;
    var handleGroupDragStart = (0, useGroupDragDrop_1.useGroupDragDrop)({
        groups: groups,
        onUpdateGroup: updateGroup,
        onUpdateMultipleCardPositions: serverPersistence.updateMultipleCardPositions,
        cards: layout.cards,
        zoom: zoom,
        canvasHeight: layout.canvasHeight,
        getCardGroup: getCardGroup
    }).handleGroupDragStart;
    var _o = (0, useRealtimeCollaboration_1.useRealtimeCollaboration)('dashboard-main', user), isCollabConnected = _o.isConnected, connectionStatus = _o.connectionStatus, collaborators = _o.collaborators, connectCollab = _o.connect, disconnectCollab = _o.disconnect;
    var _p = (0, useCardDragDrop_1.useCardDragDrop)({
        onUpdatePosition: serverPersistence.updateCardPosition,
        onUpdateMultiplePositions: serverPersistence.updateMultipleCardPositions,
        cards: layout.cards,
        selectedCards: dashboardState.selectedCards,
        isCardLocked: isCardLocked,
        getCardGroup: getCardGroup,
        onDragEnd: function () {
            saveToHistory();
            // Disable drag mode for all cards after drag ends
            // Get all cards that were in drag mode or were being dragged
            var cardsToDisable = new Set(__spreadArray(__spreadArray([], Array.from(dashboardState.dragModeCards), true), Array.from(dashboardState.selectedCards), true));
            cardsToDisable.forEach(function (cardId) {
                dashboardState.setDragMode(cardId, false);
            });
        },
        zoom: zoom,
        canvasHeight: layout.canvasHeight,
        onAutoScroll: handleAutoScroll,
        onStopAutoScroll: stopAutoScroll
    }), handleDragStart = _p.handleDragStart, isDragging = _p.isDragging, draggedCardId = _p.draggedCardId, isDraggingMultiple = _p.isDraggingMultiple;
    // Update canvas dragging state when drag state changes
    (0, react_1.useEffect)(function () {
        setIsDraggingForCanvas(isDragging || isDraggingMultiple);
        // When drag ends, update canvas height immediately
        if (!isDragging && !isDraggingMultiple) {
            updateCanvasHeight();
        }
    }, [isDragging, isDraggingMultiple, updateCanvasHeight]);
    var _q = (0, useCardResize_1.useCardResize)({
        onUpdateSize: serverPersistence.updateCardSize,
        cards: layout.cards,
        onResizeEnd: saveToHistory,
        getCardGroup: getCardGroup,
        updateGroupBounds: updateGroupBounds,
        getCardType: (0, react_1.useCallback)(function (cardId) { var _a; return ((_a = layout.cards[cardId]) === null || _a === void 0 ? void 0 : _a.type) || 'unknown'; }, [layout.cards]),
        onUpdatePosition: serverPersistence.updateCardPosition
    }), handleResizeStart = _q.handleResizeStart, resizingCardId = _q.resizingCardId;
    // Initialize keyboard shortcuts (extracted to hook)
    var shortcuts = (0, hooks_1.useDashboardKeyboardShortcuts)({
        serverPersistence: serverPersistence,
        dashboardState: dashboardState,
        layout: layout,
        autoArrange: autoArrange,
        undo: undo,
        redo: redo
    }).shortcuts;
    // Load server layout on mount (extracted to hook)
    (0, hooks_1.useServerLayoutLoader)({
        serverPersistence: serverPersistence,
        loadServerLayoutData: loadServerLayoutData,
        loadLayoutFromData: loadLayoutFromData,
        setKpiData: setKpiData,
        processedKpisRef: processedKpisRef
    });
    // Initialize card positions using dedicated hook
    (0, useCardInitialization_1.useCardInitialization)({
        isLoadingLayout: serverPersistence.isLoadingLayout,
        cards: layout.cards,
        localUpdateCardSize: localUpdateCardSize,
        localUpdateCardPosition: localUpdateCardPosition,
        serverUpdateCardSize: serverPersistence.updateCardSize,
        serverUpdateCardPosition: serverPersistence.updateCardPosition,
    });
    // Update canvas height when cards change
    (0, react_1.useEffect)(function () {
        updateCanvasHeight();
    }, [layout.cards, updateCanvasHeight]);
    // Render logic and event handlers
    var renderProps = {
        layout: layout,
        dashboardState: dashboardState,
        modalManagement: modalManagement,
        serverPersistence: serverPersistence,
        kpiData: kpiData,
        setKpiData: setKpiData,
        processedKpisRef: processedKpisRef,
        userKpis: userKpis,
        userKpisStatus: userKpisStatus,
        isUserKpisLoading: isUserKpisLoading,
        isUserKpisError: isUserKpisError,
        localAddCard: localAddCard,
        cardTypes: cardTypes,
        isDragging: isDragging,
        isDraggingMultiple: isDraggingMultiple,
        draggedCardId: draggedCardId,
        isCardLocked: isCardLocked,
        getCardGroup: getCardGroup,
        handleDragStart: handleDragStart,
        toggleCardLock: toggleCardLock,
        resizingCardId: resizingCardId,
        handleResizeStart: handleResizeStart,
        keyboardNavigation: keyboardNavigation,
        clearAllGroups: clearAllGroups,
        resetLayout: resetLayout,
        groups: groups,
        deleteGroup: deleteGroup,
        loadLayoutFromData: loadLayoutFromData,
        setZoom: setZoom,
        setPan: setPan
    };
    var _r = (0, VeroCardsV3Render_1.useVeroCardsRender)(renderProps), handleResetAll = _r.handleResetAll, handleGroupDeleteRequest = _r.handleGroupDeleteRequest, handleGroupDeleteConfirm = _r.handleGroupDeleteConfirm, handleFullscreenToggle = _r.handleFullscreenToggle, handleMobileNavigate = _r.handleMobileNavigate, handleMobileSearch = _r.handleMobileSearch, handleToggleMobileView = _r.handleToggleMobileView, handleLoadPreset = _r.handleLoadPreset, filteredCards = _r.filteredCards, renderVirtualCard = _r.renderVirtualCard, availableKpiFields = _r.availableKpiFields;
    if (serverPersistence.isLoadingLayout) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "w-full h-full flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)(LoadingSpinner_1.LoadingSpinner, {}), (0, jsx_runtime_1.jsx)("div", { className: "mt-4 text-gray-600", children: "Loading dashboard..." })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)(TemplateErrorBoundary_1.TemplateErrorBoundary, { children: (0, jsx_runtime_1.jsx)(components_1.DashboardContent, { showHeader: showHeader, user: user, scrollableContainerRef: scrollableContainerRef, containerRef: containerRef, dashboardState: dashboardState, modalManagement: modalManagement, errorHandling: errorHandling, syncStatus: syncStatus, smartKPIs: smartKPIs, templateLoading: templateLoading, layout: layout, canvasHeight: canvasHeight, isCollabConnected: isCollabConnected, connectionStatus: connectionStatus, collaborators: Object.values(collaborators), onToggleConnection: function () { return isCollabConnected ? disconnectCollab() : connectCollab(); }, autoArrange: autoArrange, applyTemplate: applyTemplate, autoArrangeCards: autoArrangeCards, undo: undo, redo: redo, canUndo: canUndo, canRedo: canRedo, zoom: zoom, pan: pan, zoomIn: zoomIn, zoomOut: zoomOut, canZoomIn: canZoomIn, canZoomOut: canZoomOut, resetView: resetView, handleResetAll: handleResetAll, handleFullscreenToggle: handleFullscreenToggle, handleMobileNavigate: handleMobileNavigate, handleMobileSearch: handleMobileSearch, handleToggleMobileView: handleToggleMobileView, handleLoadPreset: handleLoadPreset, handleGroupDeleteConfirm: handleGroupDeleteConfirm, handlePanStart: handlePanStart, getTransformStyle: getTransformStyle, groups: groups, selectedGroupId: selectedGroupId, setSelectedGroupId: setSelectedGroupId, updateGroup: updateGroup, deleteGroup: deleteGroup, ungroupCards: ungroupCards, handleGroupDragStart: handleGroupDragStart, handleGroupDeleteRequest: handleGroupDeleteRequest, virtualScrolling: virtualScrolling, renderVirtualCard: renderVirtualCard, filteredCards: filteredCards, cardTypes: cardTypes, kpiData: kpiData, setKpiData: setKpiData, availableKpiFields: availableKpiFields, serverPersistence: serverPersistence, localAddCard: localAddCard, shortcuts: shortcuts }) }));
}
